const express = require("express");

const {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

const {
    protect,
    requireAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// User routes
// ========================================

// Create a new order
router.post(
    "/",
    protect,
    createOrder
);

// Get logged-in user's orders
router.get(
    "/my-orders",
    protect,
    getMyOrders
);

// Get one order
router.get(
    "/:id",
    protect,
    getOrderById
);

// ========================================
// Admin routes
// ========================================

// Get all orders
router.get(
    "/",
    protect,
    requireAdmin,
    getAllOrders
);

// Update order status
router.put(
    "/:id/status",
    protect,
    requireAdmin,
    updateOrderStatus
);

module.exports = router;