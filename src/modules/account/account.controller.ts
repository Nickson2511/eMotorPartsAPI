import { Request, Response } from "express";
import { getAccountDashboard } from "./account.service";
import { ApiResponse } from "../../utils/ApiResponse";

export const getMyAccount = async (req: any, res: Response) => {

    const data = await getAccountDashboard(req.user.id);

    res.json(
        new ApiResponse(true, "Account dashboard fetched", data)
    );
};