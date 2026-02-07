import { Router } from "express";
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllProductsAdmin,
} from "./product.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { upload } from "../../middlewares/upload.middleware";

const router = Router();

/* CUSTOMER */
router.get("/", getProducts);               // search/filter/sort
router.get("/:id", getProductById);         // product detail

/* ADMIN */
router.post(
    "/manage",
    protect,
    authorize("admin"),
    upload.array("images", 5),
    createProduct
);

router.get(
    "/admin/all",
    protect,
    authorize("admin"),
    getAllProductsAdmin
);

router.patch(
    "/:id",
    protect,
    authorize("admin"),
    upload.array("images", 5),
    updateProduct
);

router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteProduct
);

export default router;
