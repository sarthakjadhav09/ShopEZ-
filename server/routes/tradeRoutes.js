const express = require("express");

const {
    buyStock,
    sellStock,
    getMyTransactions,
    getAllTransactions
} = require("../controllers/tradeController");

const {
    protect,
    requireAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// Trading Routes
// ========================================

// Buy stock
router.post(
    "/buy",
    protect,
    buyStock
);

// Sell stock
router.post(
    "/sell",
    protect,
    sellStock
);

// Get logged-in user's transactions
router.get(
    "/transactions",
    protect,
    getMyTransactions
);

// Admin: get all transactions
router.get(
    "/admin/transactions",
    protect,
    requireAdmin,
    getAllTransactions
);

module.exports = router;