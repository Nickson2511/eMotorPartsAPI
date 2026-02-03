import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../user/user.model";
import { ApiError } from "../../utils/ApiError";

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
