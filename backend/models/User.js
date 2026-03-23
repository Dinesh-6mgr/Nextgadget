import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: { type: String, default: '' },

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
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                name: { type: String, required: true },
                image: { type: String },
                price: { type: Number, required: true },
                countInStock: { type: Number, required: true },
                qty: { type: Number, required: true, default: 1 },
            },
        ],

    },
    { timestamps: true }
);

// Encrypt password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;