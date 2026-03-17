import User from "../models/User.js";

// @desc    Get all users' carts (admin view)
// @route   GET /api/admin/carts
// @access  Private/Admin
export const getAllCarts = async (req, res) => {
    try {
        const users = await User.find({ isAdmin: false })
            .select("name email cart")
            .populate("cart.product", "name images price");
        // Filter only users who have items in cart
        const cartsData = users
            .filter((u) => u.cart.length > 0)
            .map((u) => ({
                userId: u._id,
                userName: u.name,
                userEmail: u.email,
                cart: u.cart,
                total: u.cart.reduce((acc, item) => acc + item.price * item.qty, 0),
            }));
        res.json(cartsData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
