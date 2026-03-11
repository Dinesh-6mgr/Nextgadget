import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },

        // E-commerce specific fields
        isAdmin: { type: Boolean, default: false }, // admin privileges
        phone: { type: String },                     // optional phone number
        address: {
            street: { type: String },
            city: { type: String },
            state: { type: String },
            postalCode: { type: String },
            country: { type: String },
        },
        cart: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                quantity: { type: Number, default: 1 },
            },
        ],
        wishlist: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            },
        ],
    },
    { timestamps: true }
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
     return next(); // add return
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;