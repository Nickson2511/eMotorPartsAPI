import Order from "./order.model";
import Cart from "../cart/cart.model";
import Product from "../product/product.model";
import { ApiError } from "../../utils/ApiError";

/**
 * CREATE ORDER (guest or logged-in user)
 */
export const createOrder = async (req: any, res: any) => {
    try {
        const { cartId, shippingAddress, paymentMethod } = req.body;
        if (!cartId) throw new ApiError(400, "cartId is required");

        // Find the cart
        const cart = await Cart.findOne({ cartId }).populate("items.product");
        if (!cart || cart.items.length === 0) throw new ApiError(400, "Cart is empty");

        // Calculate total amount
        let totalAmount = 0;
        cart.items.forEach(item => {
            totalAmount += item.quantity * item.price;
        });

        // Create the order
        const order = await Order.create({
            user: req.user?.id,  // optional for guests
            cartId,
            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount,
            shippingAddress,
            paymentMethod,
        });

        // Optional: clear cart after checkout
        await Cart.findOneAndDelete({ cartId });

        res.status(201).json(order);
    } catch (error: any) {
        console.error("CREATE ORDER ERROR:", error);
        res.status(500).json({ message: "Order creation failed", error: error.message || error });
    }
};

/**
 * GET MY ORDERS (logged-in users)
 */
export const getMyOrders = async (req: any, res: any) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, "Login required to view orders");

    const orders = await Order.find({ user: userId }).populate("items.product");
    res.json(orders);
};

/**
 * GET ORDER BY ID (customer)
 */
export const getOrderById = async (req: any, res: any) => {
    const order = await Order.findById(req.params.id).populate("items.product");

    if (!order) throw new ApiError(404, "Order not found");

    // If customer, ensure they own the order
    if (req.user?.role !== "admin" && order.user?.toString() !== req.user?.id) {
        throw new ApiError(403, "Forbidden");
    }

    res.json(order);
};

/**
 * ADMIN: GET ALL ORDERS
 */
export const getAllOrders = async (req: any, res: any) => {
    const orders = await Order.find().populate("items.product").populate("user");
    res.json(orders);
};

/**
 * ADMIN: UPDATE ORDER STATUS
 */
export const updateOrderStatus = async (req: any, res: any) => {
    const { status } = req.body;
    const validStatuses = ["pending","paid","shipped","delivered","cancelled"];
    if (!validStatuses.includes(status)) throw new ApiError(400, "Invalid status");

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) throw new ApiError(404, "Order not found");

    res.json(order);
};

/**
 * CANCEL ORDER (customer before shipped)
 */
export const cancelOrder = async (req: any, res: any) => {
    const order = await Order.findById(req.params.id);
    if (!order) throw new ApiError(404, "Order not found");

    // Only allow customer to cancel if order not shipped
    if (req.user?.role !== "admin" && order.user?.toString() !== req.user?.id) {
        throw new ApiError(403, "Forbidden");
    }
    if (order.status === "shipped" || order.status === "delivered") {
        throw new ApiError(400, "Cannot cancel order after it has been shipped");
    }

    order.status = "cancelled";
    await order.save();

    res.json(order);
};
