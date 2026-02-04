import { Router } from "express";
import {
    getMyWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
} from "./wishlist.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

/* CUSTOMER */
router.get("/", protect, getMyWishlist);
router.post("/", protect, addToWishlist);
router.delete("/:productId", protect, removeFromWishlist);
router.delete("/", protect, clearWishlist);

export default router;
