const mongoose = require("mongoose");

const Product = require("../models/Product");

const isValidObjectId = (value) => {
    return mongoose.Types.ObjectId.isValid(value);
};

const isValidNonNegativeNumber = (value) => {
    return (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0
    );
};

const isValidDiscount = (value) => {
    return (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0 &&
        value <= 100
    );
};

const isNonEmptyString = (value) => {
    return (
        typeof value === "string" &&
        value.trim().length > 0
    );
};


// Get all products
const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({
            isActive: true
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        next(error);
    }
};


// Get one product
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findOne({
            _id: id,
            isActive: true
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        next(error);
    }
};


// Create product
const createProduct = async (req, res, next) => {
    try {
        const {
            title,
            description,
            images,
            category,
            price,
            discount,
            stock
        } = req.body;

        if (
            !isNonEmptyString(title) ||
            !isNonEmptyString(description) ||
            !isNonEmptyString(category) ||
            price === undefined ||
            stock === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Title, description, category, price and stock are required"
            });
        }

        if (
            !isValidNonNegativeNumber(price) ||
            !isValidNonNegativeNumber(stock)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Price and stock must be valid non-negative numbers"
            });
        }

        if (
            discount !== undefined &&
            !isValidDiscount(discount)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Discount must be a number between 0 and 100"
            });
        }

        if (
            images !== undefined &&
            !Array.isArray(images)
        ) {
            return res.status(400).json({
                success: false,
                message: "Images must be an array"
            });
        }

        const product = await Product.create({
            title: title.trim(),
            description: description.trim(),
            images: images || [],
            category: category.trim(),
            price,
            discount:
                discount === undefined
                    ? 0
                    : discount,
            stock
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });
    } catch (error) {
        next(error);
    }
};


// Update product
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const {
            title,
            description,
            images,
            category,
            price,
            discount,
            stock,
            isActive
        } = req.body;

        if (
            title !== undefined &&
            !isNonEmptyString(title)
        ) {
            return res.status(400).json({
                success: false,
                message: "Title must be a non-empty string"
            });
        }

        if (
            description !== undefined &&
            !isNonEmptyString(description)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Description must be a non-empty string"
            });
        }

        if (
            category !== undefined &&
            !isNonEmptyString(category)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Category must be a non-empty string"
            });
        }

        if (
            images !== undefined &&
            !Array.isArray(images)
        ) {
            return res.status(400).json({
                success: false,
                message: "Images must be an array"
            });
        }

        if (
            price !== undefined &&
            !isValidNonNegativeNumber(price)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Price must be a valid non-negative number"
            });
        }

        if (
            discount !== undefined &&
            !isValidDiscount(discount)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Discount must be a number between 0 and 100"
            });
        }

        if (
            stock !== undefined &&
            !isValidNonNegativeNumber(stock)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Stock must be a valid non-negative number"
            });
        }

        if (
            isActive !== undefined &&
            typeof isActive !== "boolean"
        ) {
            return res.status(400).json({
                success: false,
                message: "isActive must be a boolean"
            });
        }

        if (title !== undefined) {
            product.title = title.trim();
        }

        if (description !== undefined) {
            product.description =
                description.trim();
        }

        if (images !== undefined) {
            product.images = images;
        }

        if (category !== undefined) {
            product.category =
                category.trim();
        }

        if (price !== undefined) {
            product.price = price;
        }

        if (discount !== undefined) {
            product.discount = discount;
        }

        if (stock !== undefined) {
            product.stock = stock;
        }

        if (isActive !== undefined) {
            product.isActive = isActive;
        }

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        next(error);
    }
};


// Delete product
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Soft delete instead of permanently removing the product.
        product.isActive = false;

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};