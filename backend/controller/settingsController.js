import Settings from "../models/Settings.js";
import fs from "fs";
import path from "path";

// Get or create the singleton settings doc
const getOrCreate = async () => {
  let s = await Settings.findOne({ singleton: true });
  if (!s) s = await Settings.create({ singleton: true });
  return s;
};

// @route GET /api/admin/settings
export const getSettings = async (req, res) => {
  try {
    res.json(await getOrCreate());
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// @route PUT /api/admin/settings
export const updateSettings = async (req, res) => {
  try {
    const s = await getOrCreate();
    const allowed = [
      "storeName", "tagline", "logoUrl", "faviconUrl",
      "supportEmail", "supportPhone", "address",
      "instagram", "twitter", "facebook", "whatsapp",
      "currencySymbol", "taxRate", "freeShippingThreshold",
      "maintenanceMode", "maintenanceMessage",
    ];
    allowed.forEach((k) => { if (req.body[k] !== undefined) s[k] = req.body[k]; });
    await s.save();
    res.json(s);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// @route POST /api/admin/settings/upload/:field  (field = "logoUrl" | "faviconUrl")
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const field = req.params.field;
    if (!["logoUrl", "faviconUrl"].includes(field))
      return res.status(400).json({ message: "Invalid field" });

    const s = await getOrCreate();

    // Delete old file if it was a local upload
    if (s[field] && s[field].startsWith("/uploads/")) {
      const oldPath = path.join("uploads", path.basename(s[field]));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    s[field] = `/uploads/${req.file.filename}`;
    await s.save();
    res.json({ url: s[field] });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// @route DELETE /api/admin/settings/upload/:field
export const deleteImage = async (req, res) => {
  try {
    const field = req.params.field;
    if (!["logoUrl", "faviconUrl"].includes(field))
      return res.status(400).json({ message: "Invalid field" });

    const s = await getOrCreate();
    if (s[field] && s[field].startsWith("/uploads/")) {
      const oldPath = path.join("uploads", path.basename(s[field]));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    s[field] = "";
    await s.save();
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
