import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Private

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id;

        // check if product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // find user's cart
        let cart = await Cart.findOne({ user: userId });

        // if cart does not exist create one
        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [],
            });
        }

        // check if product already in cart
        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            // product exists -> increase quantity
            cart.items[itemIndex].quantity += quantity;
        } else {
            // add new product
            cart.items.push({
                product: productId,
                quantity: quantity || 1,
            });
        }

        await cart.save();

        res.status(200).json({
            message: "Product added to cart",
            cart,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};