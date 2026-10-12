const express = require("express");

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const {
    protect,
    requireAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public product routes
router.get("/", getProducts);

router.get("/:id", getProductById);

// Admin product routes
router.post(
    "/",
    protect,
    requireAdmin,
    createProduct
);

router.put(
    "/:id",
    protect,
    requireAdmin,
    updateProduct
);

router.delete(
    "/:id",
    protect,
    requireAdmin,
    deleteProduct
);

module.exports = router;