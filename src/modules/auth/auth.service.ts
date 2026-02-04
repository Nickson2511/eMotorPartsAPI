import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../user/user.model";
import { OAuth2Client } from "google-auth-library";
import { ApiError } from "../../utils/ApiError";


dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateAccessToken = (user: any) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "15m" }
    );
};

const generateRefreshToken = (user: any) => {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "7d" }
    );
};

export const registerUser = async (data: any) => {
    const hashed = await bcrypt.hash(data.password, 10);
    return User.create({ ...data, password: hashed });
};

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(400, "Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new ApiError(400, "Invalid credentials");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
};

export const logoutUser = async (userId: string) => {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
};


export const googleLogin = async (idToken: string) => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new ApiError(400, "Invalid Google token");

    const { email, name, sub } = payload;

    if (!email) throw new ApiError(400, "Google account has no email");

    // Find existing user
    let user = await User.findOne({ email });

    // If not exists → create user
    if (!user) {
        user = await User.create({
            name: name || "Google User",
            email,
            password: sub, // dummy (not used)
            role: "user",
            provider: "google",
        });
    }

    // Generate tokens (reuse your logic)
    const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
};
