import Payment from "./payment.model";
import Order, { IOrder } from "../order/order.model";
import axios from "axios";
import { normalizeKenyanPhone } from "../../utils/normalizeKenyanPhone";
import { ApiError } from "../../utils/ApiError";
import dotenv from "dotenv";

dotenv.config();

// M-PESA Config
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || "174379";
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY!;
const MPESA_ENV = "sandbox"; // or "production"
const MPESA_BASE_URL =
    MPESA_ENV === "sandbox"
        ? "https://sandbox.safaricom.co.ke"
        : "https://api.safaricom.co.ke";

// Helper to get OAuth token
const getMpesaToken = async () => {
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64");
    const response = await axios.get(
        `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
        { headers: { Authorization: `Basic ${auth}` } }
    );
    return response.data.access_token;
};

// Generate Timestamp in format YYYYMMDDHHMMSS
const generateTimestamp = () => {
    const now = new Date();
    const yyyy = now.getFullYear().toString();
    const mm = (now.getMonth() + 1).toString().padStart(2, "0");
    const dd = now.getDate().toString().padStart(2, "0");
    const hh = now.getHours().toString().padStart(2, "0");
    const min = now.getMinutes().toString().padStart(2, "0");
    const ss = now.getSeconds().toString().padStart(2, "0");
    return `${yyyy}${mm}${dd}${hh}${min}${ss}`;
};

// Initiate M-Pesa STK Push
export const payWithMpesa = async (req: any, res: any) => {
    try {

        const { orderId, phoneNumber } = req.body;

        if (!orderId) throw new ApiError(400, "orderId is required");
        if (!phoneNumber) throw new ApiError(400, "Phone number is required");
        if (!req.user) {
            throw new ApiError(401, "Login required to make payment");
            }
            

        const normalizedPhone = normalizeKenyanPhone(phoneNumber);

        //let order: IOrder | null = null;
        const order = await Order.findById(orderId);
        if (!order) throw new ApiError(404, "Order not found");
        if (order.user?.toString() !== req.user.id) {
            throw new ApiError(403, "You are not allowed to pay for this order");
            }
            
        if (order.status === "paid") {
            throw new ApiError(404, "Order already paid");
        }


        // M-Pesa STK Push payload
        const amount = order.totalAmount;
        const timestamp = generateTimestamp();
        const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString("base64");
        const token = await getMpesaToken();

        const stkResponse = await axios.post(
            `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
            {
                BusinessShortCode: MPESA_SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: "CustomerPayBillOnline",
                Amount: amount,
                PartyA: normalizedPhone,
                PartyB: MPESA_SHORTCODE,
                PhoneNumber: normalizedPhone,
                CallBackURL: `${process.env.APP_URL_Saf}/api/payments/callback`,
                AccountReference: orderId,
                TransactionDesc: "Payment for order",
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // Save payment record
        const payment = await Payment.create({
            order: order._id,
            user: req.user?.id,
            amount,
            paymentMethod: "mpesa",
            status: "pending",
        });

        res.json({ message: "STK Push initiated", response: stkResponse.data, paymentId: payment._id });
    } catch (error: any) {
        console.error("PAYMENT ERROR:", error);
        res.status(500).json({ message: "Payment initiation failed", error: error.message || error });
    }
};

// M-Pesa Callback
export const mpesaCallback = async (req: any, res: any) => {
    try {
        const data = req.body;

        const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = data.Body.stkCallback;

        const payment = await Payment.findOne({ transactionId: CheckoutRequestID });
        if (!payment) return res.status(404).send("Payment not found");

        if (ResultCode === 0) {
            payment.status = "success";
            const mpesaTrans = CallbackMetadata?.Item?.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value;
            payment.transactionId = mpesaTrans;
            await payment.save();

            await Order.findByIdAndUpdate(payment.order, { status: "paid" });
        } else {
            payment.status = "failed";
            await payment.save();
            await Order.findByIdAndUpdate(payment.order, { status: "failed" });
        }

        res.json({ message: "Callback received" });
    } catch (error) {
        console.error("MPESA CALLBACK ERROR:", error);
        res.status(500).send("Error processing callback");
    }
};
