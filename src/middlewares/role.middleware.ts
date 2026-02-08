import { Request, Response, NextFunction } from "express";

export const authorize =
    (...roles: ("user" | "admin" | "superadmin")[]) =>
    (req: any, res: Response, next: NextFunction) => {
        if (!req.user) return res.status(401).json({ message: "Not authorized" });
        if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
        next();
    };



// export const authorize =
//     (...roles: string[]) =>
//         (req: any, res: any, next: any) => {
//             if (!roles.includes(req.user.role)) {
//                 return res.status(403).json({ message: "Forbidden" });
//             }
//             next();
//         };
