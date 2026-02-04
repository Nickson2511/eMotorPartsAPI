import { Router } from "express";
import {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
} from "./order.controller";
import { protect, optionalProtect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

/* CUSTOMER / GUEST */
router.post("/create", optionalProtect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/:id", optionalProtect, getOrderById);
router.patch("/cancel/:id", protect, cancelOrder);

/* ADMIN */
router.get("/admin/all", protect, authorize("admin"), getAllOrders);
router.patch("/admin/status/:id", protect, authorize("admin"), updateOrderStatus);

export default router;
