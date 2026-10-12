const express = require("express");

const {
    getStocks,
    getStockBySymbol,
    getAllStocksAdmin,
    createStock,
    updateStock,
    deleteStock,
    reactivateStock
} = require("../controllers/stockController");

const {
    protect,
    requireAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// Public Stock Routes
// ========================================

// Get all stocks
router.get("/", getStocks);

// Get all stocks for admin
router.get(
    "/admin/all",
    protect,
    requireAdmin,
    getAllStocksAdmin
);

// Get one stock by symbol
router.get("/:symbol", getStockBySymbol);

// ========================================
// Admin Stock Routes
// ========================================

// Create stock
router.post(
    "/",
    protect,
    requireAdmin,
    createStock
);

// Update stock
router.put(
    "/:id",
    protect,
    requireAdmin,
    updateStock
);

// Delete stock
router.delete(
    "/:id",
    protect,
    requireAdmin,
    deleteStock
);

router.put(
    "/:id/reactivate",
    protect,
    requireAdmin,
    reactivateStock
);

module.exports = router;