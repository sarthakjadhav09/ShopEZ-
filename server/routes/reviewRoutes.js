const express = require("express");

const {
    getProductReviews,
    createReview,
    updateReview,
    deleteReview
} = require("../controllers/reviewController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public: get reviews for a product
router.get(
    "/product/:productId",
    getProductReviews
);

// Protected: create review
router.post(
    "/product/:productId",
    protect,
    createReview
);

// Protected: update own review
router.put(
    "/:reviewId",
    protect,
    updateReview
);

// Protected: delete own review
router.delete(
    "/:reviewId",
    protect,
    deleteReview
);

module.exports = router;