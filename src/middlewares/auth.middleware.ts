import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const protect = (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token invalid or expired" });
    }
};



// auth.middleware.ts
export const optionalProtect = (req: any, res: Response, next: NextFunction) => {
    try {
        // Try to get token, but don’t throw if missing
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            req.user = null; // guest
            return next();
        }

        // Verify token as usual
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded;
        next();
    } catch (err) {
        req.user = null; // guest
        next();
    }
};

