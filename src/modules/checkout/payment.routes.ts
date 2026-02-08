import { Router } from "express";
import { payWithMpesa, mpesaCallback } from "./payment.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

// Initiate payment (guest or logged-in)
router.post("/mpesa", protect, payWithMpesa);

// M-Pesa callback URL (called by Safaricom)
router.post("/callback", mpesaCallback);

export default router;
