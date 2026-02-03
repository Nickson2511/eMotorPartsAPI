import mongoose, { Schema } from "mongoose";

export interface IAdminInvite {
    email: string;
    token: string;
    expiresAt: Date;
    status: "PENDING" | "ACCEPTED" | "APPROVED";
}

const schema = new Schema<IAdminInvite>({
    email: { type: String, required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    status: {
        type: String,
        enum: ["PENDING", "ACCEPTED", "APPROVED"],
        default: "PENDING",
    },
}, { timestamps: true });

export default mongoose.model<IAdminInvite>("AdminInvite", schema);
