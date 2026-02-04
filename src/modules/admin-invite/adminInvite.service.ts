import crypto from "crypto";
import AdminInvite from "./adminInvite.model";
import User from "../user/user.model";
import {
    sendInviteEmail,
    sendAdminApprovalRequest,
    sendUserApprovedEmail,
} from "../notification/mail.service";
import { ApiError } from "../../utils/ApiError";

export const createInvite = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User with this email not found");

    const token = crypto.randomBytes(32).toString("hex");

    const invite = await AdminInvite.create({
        email,
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    const link = `${process.env.APP_URL}/api/admin-invites/verify/${token}`;

    await sendInviteEmail(email, link);

    return invite;
};

export const verifyInvite = async (token: string) => {
    const invite = await AdminInvite.findOne({ token, status: "PENDING" });
    if (!invite) throw new ApiError(400, "Invalid token");

    if (invite.expiresAt < new Date())
        throw new ApiError(400, "Token expired");

    invite.status = "ACCEPTED";
    await invite.save();

    const admins = await User.find({ role: "admin" });

    for (const admin of admins) {
        await sendAdminApprovalRequest(admin.email, invite.email);
    }

    return invite;
};

export const approveInvite = async (inviteId: string) => {
    const invite = await AdminInvite.findById(inviteId);
    if (!invite) throw new ApiError(404, "Invite not found");

    const user = await User.findOne({ email: invite.email });
    if (!user) throw new ApiError(404, "User not found");

    user.role = "admin";
    await user.save();

    invite.status = "APPROVED";
    await invite.save();

    await sendUserApprovedEmail(user.email);

    return user;
};






// import crypto from "crypto";
// import AdminInvite from "./adminInvite.model";
// import User from "../user/user.model";
// import {
//     sendInviteEmail,
//     sendAdminApprovalRequest,
//     sendUserApprovedEmail,
// } from "../notification/novu.service";
// import { ApiError } from "../../utils/ApiError";

// export const createInvite = async (email: string) => {
//     const user = await User.findOne({ email });
//     if (!user) throw new ApiError(404, "User with this email not found");

//     const token = crypto.randomBytes(32).toString("hex");

//     const invite = await AdminInvite.create({
//         email,
//         token,
//         expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
//     });

//     const link = `http://localhost:5000/api/admin-invites/verify/${token}`;

//     await sendInviteEmail(email, link);

//     return invite;
// };

// export const verifyInvite = async (token: string) => {
//     const invite = await AdminInvite.findOne({ token, status: "PENDING" });
//     if (!invite) throw new ApiError(400, "Invalid token");

//     if (invite.expiresAt < new Date())
//         throw new ApiError(400, "Token expired");

//     invite.status = "ACCEPTED";
//     await invite.save();

//     const admins = await User.find({ role: "admin" });

//     for (const admin of admins) {
//         await sendAdminApprovalRequest(admin.email, invite.email);
//     }

//     return invite;
// };

// export const approveInvite = async (inviteId: string) => {
//     const invite = await AdminInvite.findById(inviteId);
//     if (!invite) throw new ApiError(404, "Invite not found");

//     const user = await User.findOne({ email: invite.email });
//     if (!user) throw new ApiError(404, "User not found");

//     user.role = "admin";
//     await user.save();

//     invite.status = "APPROVED";
//     await invite.save();

//     await sendUserApprovedEmail(user.email);

//     return user;
// };
