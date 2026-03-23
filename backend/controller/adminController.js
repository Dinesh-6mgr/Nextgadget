import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
    try {
        const [totalUsers, totalOrders, totalProducts, orders] = await Promise.all([
            User.countDocuments({ isAdmin: false }),
            Order.countDocuments(),
            Product.countDocuments(),
            Order.find().select("totalPrice isPaid isDelivered createdAt"),
        ]);

        const totalRevenue = orders
            .filter((o) => o.isPaid)
            .reduce((acc, o) => acc + o.totalPrice, 0);

        const pendingOrders = orders.filter((o) => !o.isDelivered).length;

        res.json({ totalUsers, totalOrders, totalProducts, totalRevenue, pendingOrders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users' carts (admin view)
// @route   GET /api/admin/carts
// @access  Private/Admin
export const getAllCarts = async (req, res) => {
    try {
        const users = await User.find({ isAdmin: false })
            .select("name email cart")
            .populate("cart.product", "name images price");
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

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ isAdmin: false }).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.isAdmin) return res.status(400).json({ message: "Cannot delete admin user" });
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
