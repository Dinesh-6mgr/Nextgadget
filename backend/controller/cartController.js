import User from "../models/User.js";

// Block admins from using cart
const denyAdmin = (req, res) => {
    if (req.user.isAdmin) {
        res.status(403).json({ message: "Admins cannot use the cart" });
        return true;
    }
    return false;
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private (user only)
export const getCart = async (req, res) => {
    if (denyAdmin(req, res)) return;
    try {
        const user = await User.findById(req.user._id).populate("cart.product", "name images countInStock price");
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart (or update qty if exists)
// @route   POST /api/cart
// @access  Private (user only)
export const addToCart = async (req, res) => {
    if (denyAdmin(req, res)) return;
    try {
        const { productId, name, image, price, countInStock, qty } = req.body;

        if (!productId || !name || price === undefined || countInStock === undefined || !qty) {
            return res.status(400).json({ message: "Missing required cart item fields" });
        }

        const user = await User.findById(req.user._id);
        const existIndex = user.cart.findIndex(
            (x) => x.product.toString() === productId
        );

        if (existIndex >= 0) {
            user.cart[existIndex].qty = qty;
        } else {
            user.cart.push({ product: productId, name, image, price, countInStock, qty });
        }

        await user.save();
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private (user only)
export const removeFromCart = async (req, res) => {
    if (denyAdmin(req, res)) return;
    try {
        const user = await User.findById(req.user._id);
        user.cart = user.cart.filter(
            (x) => x.product.toString() !== req.params.productId
        );
        await user.save();
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private (user only)
export const clearCart = async (req, res) => {
    if (denyAdmin(req, res)) return;
    try {
        const user = await User.findById(req.user._id);
        user.cart = [];
        await user.save();
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
