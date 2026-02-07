import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;

    price: number;
    oldPrice?: number;

    stock: number;
    images: string[];
    category: mongoose.Types.ObjectId;
    subCategory: mongoose.Types.ObjectId;
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

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        oldPrice: {
            type: Number,
            min: 0,
            validate: {
                validator: function (value: number) {
                    const price = this.get("price");
                    return value > price;
                },
                message: "Old price must be greater than current price",
            },
        },

        stock: { type: Number, required: true },

        images: { type: [String], required: true },

        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        subCategory: {
            type: Schema.Types.ObjectId,
            ref: "SubCategory",
            required: true,
        },

        brand: { type: String, required: true },

        condition: {
            type: String,
            enum: ["new", "used"],
            default: "new",
        },

        isActive: { type: Boolean, default: true },

        rating: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },

        sku: { type: String, unique: true, required: true },

        createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
