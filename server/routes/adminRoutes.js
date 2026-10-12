const express = require("express");

const {
    getAdminOverview,
    getUsers,
    getAdminOrders,
    getAdminTransactions
} = require("../controllers/adminController");

const {
    protect,
    requireAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/overview",
    protect,
    requireAdmin,
    getAdminOverview
);

router.get(
    "/users",
    protect,
    requireAdmin,
    getUsers
);

router.get(
    "/orders",
    protect,
    requireAdmin,
    getAdminOrders
);

router.get(
    "/transactions",
    protect,
    requireAdmin,
    getAdminTransactions
);

module.exports = router;