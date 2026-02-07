import mongoose, { Schema, Document } from "mongoose";

export interface ISubCategory extends Document {
    name: string;
    category: mongoose.Types.ObjectId;
    isActive: boolean;
}

const subCategorySchema = new Schema<ISubCategory>(
    {
        name: { type: String, required: true },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// prevent duplicate subcategories under same category
subCategorySchema.index({ name: 1, category: 1 }, { unique: true });

export default mongoose.model<ISubCategory>("SubCategory", subCategorySchema);
