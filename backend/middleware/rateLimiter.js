import rateLimit from "express-rate-limit";

const handler = (req, res) => {
    res.status(429).json({
        message: "Too many requests, please try again later.",
    });
};

// Auth routes — strict (login/register brute force protection)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
    message: handler,
    handler,
    standardHeaders: true,
    legacyHeaders: false,
});

// General API — relaxed
export const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 200,
    handler,
    standardHeaders: true,
    legacyHeaders: false,
});

// Cart — moderate
export const cartLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 60,
    handler,
    standardHeaders: true,
    legacyHeaders: false,
});

// Order creation — strict
export const orderLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 20,
    handler,
    standardHeaders: true,
    legacyHeaders: false,
});
