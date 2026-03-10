import { Router } from "express";
import {
    createAddress,
    getMyAddresses,
    updateAddress,
    deleteAddress
} from "./address.controller";

import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, createAddress);
router.get("/", protect, getMyAddresses);
router.patch("/:id", protect, updateAddress);
router.delete("/:id", protect, deleteAddress);

export default router;