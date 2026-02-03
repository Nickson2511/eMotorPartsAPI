import { Router } from "express";
import { inviteUser, verifyInviteLink, approveUser } from "./adminInvite.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

router.post("/invite", protect, authorize("admin"), inviteUser);
router.get("/verify/:token", verifyInviteLink);
router.post("/approve/:inviteId", protect, authorize("admin"), approveUser);

export default router;
