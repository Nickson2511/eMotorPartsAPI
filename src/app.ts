import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.routes";
import adminInviteRoute from "./modules/admin-invite/adminInvite.routes";
import productRoutes from "./modules/product/product.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin-invites", adminInviteRoute);
app.use("/api/products", productRoutes);

export default app;
