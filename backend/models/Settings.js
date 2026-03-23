import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  // only one settings doc ever exists
  singleton: { type: Boolean, default: true, unique: true },

  // Branding
  storeName: { type: String, default: "NextGadget" },
  tagline: { type: String, default: "Future Tech, Right Now." },
  logoUrl: { type: String, default: "" },
  faviconUrl: { type: String, default: "" },

  // Contact
  supportEmail: { type: String, default: "" },
  supportPhone: { type: String, default: "" },
  address: { type: String, default: "" },

  // Social
  instagram: { type: String, default: "" },
  twitter: { type: String, default: "" },
  facebook: { type: String, default: "" },
  whatsapp: { type: String, default: "" },

  // Store policies
  currencySymbol: { type: String, default: "$" },
  taxRate: { type: Number, default: 0 },
  freeShippingThreshold: { type: Number, default: 0 },

  // Maintenance
  maintenanceMode: { type: Boolean, default: false },
  maintenanceMessage: { type: String, default: "We'll be back soon!" },
}, { timestamps: true });

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
