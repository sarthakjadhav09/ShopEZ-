const mongoose = require("mongoose");

const Review = require("../models/Review");
const Product = require("../models/Product");

// Get reviews for one product
const getProductReviews = async (
    req,
    res,
    next
) => {
    try {
        const { productId } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                productId
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findOne({
            _id: productId,
            isActive: true
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const reviews = await Review.find({
            productId
        })
            .populate(
                "userId",
                "name"
            )
            .sort({
                createdAt: -1
            });

        const reviewCount =
            reviews.length;

        const averageRating =
            reviewCount > 0
                ? reviews.reduce(
                      (
                          total,
                          review
                      ) =>
                          total +
                          review.rating,
                      0
                  ) /
                  reviewCount
                : 0;

        res.status(200).json({
            success: true,
            count: reviewCount,
            averageRating: Number(
                averageRating.toFixed(1)
            ),
            reviews
        });
    } catch (error) {
        next(error);
    }
};

// Create a review
const createReview = async (
    req,
    res,
    next
) => {
    try {
        const { productId } =
            req.params;

        const {
            rating,
            comment
        } = req.body;

        if (
            !mongoose.Types.ObjectId.isValid(
                productId
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        if (
            rating === undefined ||
            !comment
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Rating and comment are required"
            });
        }

        const numericRating =
            Number(rating);

        if (
            !Number.isInteger(
                numericRating
            ) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Rating must be a whole number between 1 and 5"
            });
        }

        const trimmedComment =
            comment.trim();

        if (
            trimmedComment.length < 3
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Review comment must contain at least 3 characters"
            });
        }

        if (
            trimmedComment.length > 1000
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Review comment cannot exceed 1000 characters"
            });
        }

        const product =
            await Product.findOne({
                _id: productId,
                isActive: true
            });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const existingReview =
            await Review.findOne({
                productId,
                userId: req.user.id
            });

        if (existingReview) {
            return res.status(409).json({
                success: false,
                message:
                    "You have already reviewed this product"
            });
        }

        const review =
            await Review.create({
                productId,
                userId: req.user.id,
                rating: numericRating,
                comment: trimmedComment
            });

        const populatedReview =
            await Review.findById(
                review._id
            ).populate(
                "userId",
                "name"
            );

        res.status(201).json({
            success: true,
            message:
                "Review submitted successfully",
            review: populatedReview
        });
    } catch (error) {
        next(error);
    }
};

// Update own review
const updateReview = async (
    req,
    res,
    next
) => {
    try {
        const { reviewId } =
            req.params;

        const {
            rating,
            comment
        } = req.body;

        if (
            !mongoose.Types.ObjectId.isValid(
                reviewId
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid review ID"
            });
        }

        const review =
            await Review.findById(
                reviewId
            );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        if (
            review.userId.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only update your own review"
            });
        }

        if (rating !== undefined) {
            const numericRating =
                Number(rating);

            if (
                !Number.isInteger(
                    numericRating
                ) ||
                numericRating < 1 ||
                numericRating > 5
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Rating must be a whole number between 1 and 5"
                });
            }

            review.rating =
                numericRating;
        }

        if (comment !== undefined) {
            const trimmedComment =
                comment.trim();

            if (
                trimmedComment.length < 3
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Review comment must contain at least 3 characters"
                });
            }

            if (
                trimmedComment.length >
                1000
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Review comment cannot exceed 1000 characters"
                });
            }

            review.comment =
                trimmedComment;
        }

        await review.save();

        const updatedReview =
            await Review.findById(
                review._id
            ).populate(
                "userId",
                "name"
            );

        res.status(200).json({
            success: true,
            message:
                "Review updated successfully",
            review: updatedReview
        });
    } catch (error) {
        next(error);
    }
};

// Delete own review
const deleteReview = async (
    req,
    res,
    next
) => {
    try {
        const { reviewId } =
            req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                reviewId
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid review ID"
            });
        }

        const review =
            await Review.findById(
                reviewId
            );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        if (
            review.userId.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only delete your own review"
            });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            message:
                "Review deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProductReviews,
    createReview,
    updateReview,
    deleteReview
};