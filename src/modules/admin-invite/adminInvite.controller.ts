import { Request, Response } from "express";
import { createInvite, verifyInvite, approveInvite } from "./adminInvite.service";
import { ApiResponse } from "../../utils/ApiResponse";

export const inviteUser = async (
    req: Request<{}, {}, { email: string }>,
    res: Response
) => {
    const invite = await createInvite(req.body.email);
    res.json(new ApiResponse(true, "Invite sent", invite));
};

export const verifyInviteLink = async (req: Request<{ token: string }>, res: Response) => {
    const invite = await verifyInvite(req.params.token);
    res.json(new ApiResponse(true, "Invite accepted", invite));
};

export const approveUser = async (req: Request<{ inviteId: string }>, res: Response) => {
    const user = await approveInvite(req.params.inviteId);
    res.json(new ApiResponse(true, "User promoted to admin", user));
};
