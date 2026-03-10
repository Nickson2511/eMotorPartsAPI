import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
}

export interface IOrder extends Document {
    user?: mongoose.Types.ObjectId;
    cartId?: string;
    items: IOrderItem[];
    totalAmount: number;
    status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";


    shippingAddress: mongoose.Types.ObjectId;

    paymentMethod: "cash" | "card" | "mpesa";
}

const orderItemSchema = new Schema<IOrderItem>({
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
});


const orderSchema = new Schema<IOrder>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        cartId: { type: String },
        items: [orderItemSchema],
        totalAmount: { type: Number, required: true },

        status: {
            type: String,
            enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
            default: "pending",
        },

        shippingAddress: {
            type: Schema.Types.ObjectId,
            ref: "Address",
            required: true,
        },

        paymentMethod: {
            type: String,
            enum: ["cash", "card", "mpesa"],
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model<IOrder>("Order", orderSchema);