import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes (require authentication)
export const protect = async (req, res, next) => {
    let token;

    // 1. Check Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } 
    // 2. Check cookies (if available)
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    // 3. Check request body (if provided)
    else if (req.body && req.body.token) {
        token = req.body.token;
    }
    // 4. Check query parameters (for easy testing)
    else if (req.query && req.query.token) {
        token = req.query.token;
    }

    if (token) {
        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                console.warn("User from token not found in DB:", decoded.id);
                return res.status(401).json({ message: "User not found" });
            }

            return next();
        } catch (error) {
            console.error("Auth Token Failed:", error.message);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        // Detailed console log for debugging why it's failing
        console.warn("--- AUTH FAILURE ---");
        console.warn("URL:", req.originalUrl);
        console.warn("Method:", req.method);
        console.warn("Headers:", JSON.stringify(req.headers, null, 2));
        console.warn("Query:", JSON.stringify(req.query, null, 2));
        console.warn("Body Keys:", Object.keys(req.body || {}));
        console.warn("--------------------");
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

// Middleware to check if user is admin
export const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({ message: "Not authorized as an admin" });
    }
};