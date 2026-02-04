import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
}

export interface ICart extends Document {
    cartId: string;              // guest cart id
    user?: mongoose.Types.ObjectId; // optional (when logged in)
    items: ICartItem[];
}

const cartItemSchema = new Schema<ICartItem>({
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
});

const cartSchema = new Schema<ICart>({
    cartId: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User" }, // optional
    items: [cartItemSchema],
}, { timestamps: true });

export default mongoose.model<ICart>("Cart", cartSchema);
