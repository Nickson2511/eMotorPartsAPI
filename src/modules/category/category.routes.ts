import { Router } from "express";
import { createCategory, getCategories } from "./category.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

router.get("/", getCategories);

router.post(
    "/",
    protect,
    authorize("admin"),
    createCategory
);

export default router;
