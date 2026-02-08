import { Request, Response } from "express";
import { registerUser, loginUser, logoutUser } from "./auth.service";
import { googleLogin } from "./auth.service";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import User from "../user/user.model";
import jwt from "jsonwebtoken";



export const register = async (req: Request, res: Response) => {
    const user = await registerUser(req.body);

    res.status(201).json(
        new ApiResponse(true, "User registered successfully", user)
    );
};

export const login = async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await loginUser(
        req.body.email,
        req.body.password
    );

    res.json(
        new ApiResponse(true, "Login successful", {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        })
    );
};

export const googleAuth = async (req: Request, res: Response) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ message: "idToken is required" });
    }

    const { user, accessToken, refreshToken } = await googleLogin(idToken);

    res.json({
        success: true,
        message: "Google login successful",
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        },
    });
};

export const logout = async (req: any, res: Response) => {
    await logoutUser(req.user.id);

    res.json(new ApiResponse(true, "Logout successful"));
};

export const refreshToken = async (req: Request, res: Response) => {
    const { token } = req.body;
    if (!token) throw new ApiError(400, "Refresh token is required");

    // Find user by refresh token
    const user = await User.findOne({ refreshToken: token });
    if (!user) throw new ApiError(401, "Invalid refresh token");

    try {
        // Verify the refresh token
        jwt.verify(token, process.env.JWT_REFRESH_SECRET!);

        // Generate new access token
        const accessToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "15m" }
        );

        res.json(new ApiResponse(true, "Access token refreshed", { accessToken }));
    } catch (err) {
        throw new ApiError(401, "Refresh token expired or invalid");
    }
};
