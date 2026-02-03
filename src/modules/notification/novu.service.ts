import { Novu } from "@novu/node";
import e from "express";


const novuSecretKey = "8eb09370edc0f3925093fea11e8635ca";

const novu = new Novu(novuSecretKey);

export const sendInviteEmail = async (email: string, link: string) => {
    const res = await novu.trigger("admin-invite-controller", {
        to: {
            subscriberId: email,
            email,
        },
        payload: { link },
    });

    console.log("NOVU RESPONSE:", res);
};


export const sendAdminApprovalRequest = async (
    adminEmail: string,
    userEmail: string
) => {
    await novu.trigger("admin-approval-request", {
        to: {
            subscriberId: adminEmail,
            email: adminEmail,

        },
        payload: { userEmail },
    });
};

export const sendUserApprovedEmail = async (email: string) => {
    await novu.trigger("admin-approved", {
        to: {
            subscriberId: email,
            email,
        },
    });
};
