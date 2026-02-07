import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes";
import adminInviteRoute from "./modules/admin-invite/adminInvite.routes";
import productRoutes from "./modules/product/product.routes";
import cartRoutes from "./modules/cart/cart.routes";
import orderRoutes from "./modules/order/order.routes";
import checkOutRoutes from "./modules/checkout/payment.routes";
import reviewRoutes from "./modules/review/review.routes";
import wishListRoutes from "./modules/wishlist/wishlist.routes";
import categoryRoutes from "./modules/category/category.routes";
import subcategoryRoutes from "./modules/subcategory/subcategory.routes";

const app = express();

// ---------- CORS CONFIGURATION ----------
const allowedOrigins = [
    "http://localhost:5173", // local dev
    "https://emoto-frontend.vercel.app" // hosted frontend
];

app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (like Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // allow cookies and authentication headers
}));

// ---------- JSON PARSER ----------
app.use(express.json());

// ---------- ROUTES ----------
app.use("/api/auth", authRoutes);
app.use("/api/admin-invites", adminInviteRoute);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", checkOutRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlists", wishListRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);

export default app;
