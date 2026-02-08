import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "user" | "admin" | "superadmin";
    refreshToken?: string;
    provider: string;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["user", "admin", "superadmin"], default: "user" },
        refreshToken: { type: String },
        provider: { type: String, enum: ["local", "google"], default: "local" },

    },
    { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
