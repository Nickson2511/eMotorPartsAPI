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



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin-invites", adminInviteRoute);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", checkOutRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlists", wishListRoutes);

export default app;
