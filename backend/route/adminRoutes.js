import express from "express";
import { getAllCarts } from "../controller/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/carts", protect, admin, getAllCarts);

export default router;
