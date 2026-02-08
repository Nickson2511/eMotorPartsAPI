import { Request, Response } from "express";
import User from "./user.model";
import bcrypt from "bcrypt";
import { ApiResponse } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";

// GET ALL USERS
export const getAllUsers = async (req: Request, res: Response) => {
    const users = await User.find().select("-password -refreshToken");
    res.json(new ApiResponse(true, "Users fetched successfully", users));
};

// GET USER BY ID
export const getUserById = async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id).select("-password -refreshToken");
    if (!user) throw new ApiError(404, "User not found");
    res.json(new ApiResponse(true, "User fetched successfully", user));
};

// GET MY PROFILE
export const getMyProfile = async (req: any, res: Response) => {
    const user = await User.findById(req.user.id).select("-password -refreshToken");
    if (!user) throw new ApiError(404, "User not found");
    res.json(new ApiResponse(true, "Profile fetched successfully", user));
};

// UPDATE USER
export const updateUser = async (req: Request, res: Response) => {
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    ).select("-password -refreshToken");
    if (!updatedUser) throw new ApiError(404, "User not found");
    res.json(new ApiResponse(true, "User updated successfully", updatedUser));
};

// DELETE USER
export const deleteUser = async (req: Request, res: Response) => {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) throw new ApiError(404, "User not found");
    res.json(new ApiResponse(true, "User deleted successfully"));
};

// CREATE ADMIN (superadmin only)
export const createAdmin = async (req: any, res: Response) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = await User.create({ name, email, password: hashed, role: "admin" });

    res.status(201).json(new ApiResponse(true, "Admin created successfully", admin));
};
