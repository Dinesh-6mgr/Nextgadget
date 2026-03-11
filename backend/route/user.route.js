import express from "express";
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
} from "../controller/user.controller.js";
import { protect } from "../middleware/authMiddleware.js"; // JWT auth middleware

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (user must be logged in)
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

export default router;