import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../modules/user/user.model"

dotenv.config();

const MONGO_URI = process.env.MONGO_URI!;

const createSuperAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected for seeding super admin");

        const existing = await User.findOne({ role: "superadmin" });
        if (existing) return console.log("Super admin already exists");

        const hashedPassword = await bcrypt.hash("SuperSecurePassword123!", 10);

        const admin = await User.create({
            name: "Nickson Okwemba",
            email: "okwembanickson8@gmail.com",
            password: hashedPassword,
            role: "superadmin",
            provider: "local",
        });

        console.log("Super Admin created:", admin.email);
        process.exit(0);
    } catch (err) {
        console.error("Error creating super admin:", err);
        process.exit(1);
    }
};

createSuperAdmin();
