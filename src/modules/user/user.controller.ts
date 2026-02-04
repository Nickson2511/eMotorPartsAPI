import { Request, Response } from "express";
import User from "./user.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";

// GET ALL USERS (admin use)
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
