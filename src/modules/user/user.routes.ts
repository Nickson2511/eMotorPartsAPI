import { Router } from "express";
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getMyProfile,
    createAdmin
} from "./user.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

// Logged in user
router.get("/me", protect, getMyProfile);

// Admin / superadmin management
router.get("/", protect, authorize("admin", "superadmin"), getAllUsers);
router.get("/:id", protect, authorize("admin", "superadmin"), getUserById);
router.put("/:id", protect, authorize("admin", "superadmin"), updateUser);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteUser);

// Create new admin (superadmin only)
router.post("/create-admin", protect, authorize("admin", "superadmin"), createAdmin);

export default router;
