import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    stock: number;
    images: string[];
    category: string;
    brand: string;
    condition: "new" | "used";
    isActive: boolean;
    rating: number;
    numReviews: number;
    sku: string;
    createdBy: mongoose.Types.ObjectId;
}

const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },

        price: { type: Number, required: true },
        discountPrice: { type: Number },

        stock: { type: Number, required: true },

        images: { type: [String], required: true },

        category: { type: String, required: true }, // e.g Engine Parts
        brand: { type: String, required: true }, // Honda, Yamaha

        condition: {
            type: String,
            enum: ["new", "used"],
            default: "new",
        },

        isActive: { type: Boolean, default: true },

        rating: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },

        sku: { type: String, unique: true },

        createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
