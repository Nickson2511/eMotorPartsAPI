import { Router } from "express";
import {
    createReview,
    getReviewsByProduct,
    updateReview,
    deleteReview,
    getAllReviews,
} from "./review.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

/* CUSTOMER */
router.post("/", protect, createReview);
router.get("/product/:productId", getReviewsByProduct);
router.patch("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

/* ADMIN */
router.get("/admin/all", protect, authorize("admin"), getAllReviews);

export default router;
