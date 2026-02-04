import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export const sendInviteEmail = async (email: string, link: string) => {
    await transporter.sendMail({
        from: `"eMotoParts" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Admin Invitation",
        html: `
            <h2>You are invited to become an admin</h2>
            <p>Click the link below to accept the invitation:</p>
            <a href="${link}">${link}</a>
            <p>This link expires in 1 hour.</p>
        `,
    });
};

export const sendAdminApprovalRequest = async (
    adminEmail: string,
    userEmail: string
) => {
    await transporter.sendMail({
        from: `"eMotoParts" <${process.env.MAIL_USER}>`,
        to: adminEmail,
        subject: "Admin Approval Required",
        html: `
            <p>User <b>${userEmail}</b> accepted admin invite.</p>
            <p>Please login and approve this user.</p>
        `,
    });
};

export const sendUserApprovedEmail = async (email: string) => {
    await transporter.sendMail({
        from: `"eMotoParts" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Admin Access Approved",
        html: `
            <h2>Congratulations 🎉</h2>
            <p>Your admin access has been approved.</p>
            <p>You can now login and access the admin dashboard.</p>
        `,
    });
};
