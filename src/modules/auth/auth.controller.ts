import { Request, Response } from "express";
import { registerUser, loginUser, logoutUser } from "./auth.service";
import { googleLogin } from "./auth.service";
import { ApiResponse } from "../../utils/ApiResponse";

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
