import mongoose, { Schema, Document } from "mongoose";

export interface IAddress extends Document {
    user: mongoose.Types.ObjectId;
    fullName: string;
    phoneNumber: string;
    county: string;
    city: string;
    area: string;
    building?: string;
    landmark?: string;
    isDefault: boolean;
}

const addressSchema = new Schema<IAddress>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },

        fullName: { type: String, required: true },
        phoneNumber: { type: String, required: true },

        county: { type: String, required: true },
        city: { type: String, required: true },
        area: { type: String, required: true },

        building: { type: String },
        landmark: { type: String },

        isDefault: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export default mongoose.model<IAddress>("Address", addressSchema);