import { Router } from "express";
import {
    createSubCategory,
    getSubCategoriesByCategory,
} from "./subcategory.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

router.get("/:categoryId", getSubCategoriesByCategory);

router.post(
    "/",
    protect,
    authorize("admin"),
    createSubCategory
);

export default router;
