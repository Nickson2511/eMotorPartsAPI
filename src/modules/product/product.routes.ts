import { Router } from "express";
import { createProduct, getProducts } from "./product.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { upload } from "../../middlewares/upload.middleware";

const router = Router();

router.post("/create", protect, authorize("admin"), upload.array("images", 5), createProduct);
router.get("/receive", getProducts);

export default router;
