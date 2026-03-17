import express from "express";
import cors from "cors";
import userRoute from "./route/user.route.js";
import productRoutes from "./route/productRoutes.js";
import orderRoutes from "./route/orderRoutes.js";
import cartRoutes from "./route/addToCartRoute.js";
import adminRoutes from "./route/adminRoutes.js";
import { authLimiter, apiLimiter, cartLimiter, orderLimiter } from "./middleware/rateLimiter.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", authLimiter, userRoute);
app.use("/api/products", apiLimiter, productRoutes);
app.use("/api/orders", orderLimiter, orderRoutes);
app.use("/api/cart", cartLimiter, cartRoutes);
app.use("/api/admin", apiLimiter, adminRoutes);

export default app;
