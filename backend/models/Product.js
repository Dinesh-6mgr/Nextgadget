import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

const productSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        name: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true }, // e.g., laptop, mobile, camera
        brand: { type: String },
        price: { type: Number, required: true },
        countInStock: { type: Number, required: true, default: 0 },
        rating: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
        reviews: [reviewSchema],
        images: [{ type: String }], // array of image URLs
        featured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;