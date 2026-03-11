import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./route/user.route.js";
import productRoutes from "./route/productRoutes.js";
import orderRoutes from "./route/orderRoutes.js";

const app = express();

app.use(cors());
app.use(express.json())
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/user", userRoute);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

export default app;