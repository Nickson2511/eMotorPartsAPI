import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { getMyAccount } from "./account.controller";

const router = Router();

router.get("/", protect, getMyAccount);

export default router;