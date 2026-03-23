import express from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
} from "../controller/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js"; // JWT & admin check
import { authLimiter } from "../middleware/rateLimiter.js";
const router = express.Router();

// Public routes
router.get("/",authLimiter, getProducts);
router.get("/:id", getProductById);

// Protected routes
router.post("/:id/reviews", protect, createProductReview);

// Admin routes
router.post("/", protect,authLimiter, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;