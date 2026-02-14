import { Router } from "express";
import { register, login, logout, googleAuth } from "./auth.controller";
import { protect } from "../../middlewares/auth.middleware";
import { refreshToken } from "./auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/refresh-token", refreshToken);
router.post("/logout", protect, logout);

export default router;
