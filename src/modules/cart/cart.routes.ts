import { Router } from "express";
import {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} from "./cart.controller";

const router = Router();

router.post("/add", addToCart);
router.get("/", getCart);
router.patch("/update", updateCartItem);
router.delete("/remove", removeFromCart);
router.delete("/clear", clearCart);

export default router;
