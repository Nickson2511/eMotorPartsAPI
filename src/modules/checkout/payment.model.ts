import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
    order: mongoose.Types.ObjectId;        // linked order
    cartId?: string;                        // for guest checkout
    user?: mongoose.Types.ObjectId;         // optional for logged-in user
    amount: number;
    paymentMethod: "mpesa" | "card" | "cod";
    status: "pending" | "success" | "failed";
    transactionId?: string;
}

const paymentSchema = new Schema<IPayment>(
    {
        order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
        cartId: { type: String },                // guest cartId
        user: { type: Schema.Types.ObjectId, ref: "User" },
        amount: { type: Number, required: true },
        paymentMethod: { type: String, required: true, enum: ["mpesa", "card", "cod"] },
        status: { type: String, default: "pending", enum: ["pending", "success", "failed"] },
        transactionId: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<IPayment>("Payment", paymentSchema);
