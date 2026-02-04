// src/utils/normalizeKenyanPhone.ts
import { ApiError } from "./ApiError";

/**
 * Normalize Kenyan phone numbers to format: 2547XXXXXXXX
 * Accepts:
 *  - 0712345678
 *  - 712345678
 *  - +254712345678
 *  - 254712345678
 */
export const normalizeKenyanPhone = (phone: string): string => {
    if (!phone) {
        throw new ApiError(400, "Phone number is required");
    }

    // Remove spaces, dashes, and plus sign
    let cleaned = phone.replace(/[\s\-+]/g, "");

    // If starts with 0 -> replace with 254
    if (cleaned.startsWith("0")) {
        cleaned = "254" + cleaned.substring(1);
    }

    // If starts with 7 or 1 (e.g. 712345678)
    if (cleaned.startsWith("7") || cleaned.startsWith("1")) {
        cleaned = "254" + cleaned;
    }

    // Must now start with 254
    if (!cleaned.startsWith("254")) {
        throw new ApiError(400, "Invalid Kenyan phone number format");
    }

    // Must be exactly 12 digits: 2547XXXXXXXX
    if (!/^2547\d{8}$/.test(cleaned) && !/^2541\d{8}$/.test(cleaned)) {
        throw new ApiError(400, "Invalid Kenyan phone number");
    }

    return cleaned;
};
