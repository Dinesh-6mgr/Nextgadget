import express from "express";
import { getStats, getAllCarts, getAllUsers, deleteUser } from "../controller/adminController.js";
import { getSettings, updateSettings, uploadImage, deleteImage } from "../controller/settingsController.js";
import { upload } from "../middleware/upload.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, admin, getStats);
router.get("/carts", protect, admin, getAllCarts);
router.get("/users", protect, admin, getAllUsers);
router.delete("/users/:id", protect, admin, deleteUser);
router.route("/settings").get(getSettings).put(protect, admin, updateSettings);
router.post("/settings/upload/:field", protect, admin, upload.single("image"), uploadImage);
router.delete("/settings/upload/:field", protect, admin, deleteImage);

export default router;
