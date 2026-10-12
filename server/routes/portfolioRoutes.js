const express = require("express");

const {
    getMyPortfolio,
    getPortfolioSummary
} = require("../controllers/portfolioController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// Portfolio Routes
// ========================================

// Complete portfolio
router.get(
    "/",
    protect,
    getMyPortfolio
);

// Portfolio summary
router.get(
    "/summary",
    protect,
    getPortfolioSummary
);

module.exports = router;