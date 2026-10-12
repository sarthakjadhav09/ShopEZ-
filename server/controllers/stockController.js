const mongoose = require("mongoose");

const Stock = require("../models/Stock");

// ========================================
// Get All Stocks
// ========================================

const getStocks = async (req, res, next) => {
    try {
        const stocks = await Stock.find({
            isActive: true
        }).sort({
            symbol: 1
        });

        res.status(200).json({
            success: true,
            count: stocks.length,
            stocks
        });
    } catch (error) {
        next(error);
    }
};

// ========================================
// Get Stock By Symbol
// ========================================

const getStockBySymbol = async (req, res, next) => {
    try {
        const symbol = req.params.symbol.toUpperCase();

        const stock = await Stock.findOne({
            symbol,
            isActive: true
        });

        if (!stock) {
            return res.status(404).json({
                success: false,
                message: "Stock not found"
            });
        }

        res.status(200).json({
            success: true,
            stock
        });
    } catch (error) {
        next(error);
    }
};

// ========================================
// Create Stock - Admin
// ========================================

const createStock = async (req, res, next) => {
    try {
        const {
            symbol,
            name,
            price,
            dailyStats,
            historicalData
        } = req.body;

        // Required fields
        if (
            !symbol ||
            !name ||
            price === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Symbol, name and price are required"
            });
        }

        const normalizedSymbol = symbol
            .trim()
            .toUpperCase();

        // Check duplicate symbol
        const existingStock = await Stock.findOne({
            symbol: normalizedSymbol
        });

        if (existingStock) {
            return res.status(409).json({
                success: false,
                message: "A stock with this symbol already exists"
            });
        }

        // Validate price
        if (Number(price) < 0) {
            return res.status(400).json({
                success: false,
                message: "Stock price cannot be negative"
            });
        }

        const stock = await Stock.create({
            symbol: normalizedSymbol,
            name: name.trim(),
            price: Number(price),
            
            isActive: true,
            dailyStats: dailyStats || {},
            historicalData:
            
                Array.isArray(historicalData)
                    ? historicalData
                        : []
        });

        res.status(201).json({
            success: true,
            message: "Stock created successfully",
            stock
        });
    } catch (error) {
        next(error);
    }
};

// ========================================
// Update Stock - Admin
// ========================================

const updateStock = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid stock ID"
            });
        }

        const stock = await Stock.findById(req.params.id);

        if (!stock) {
            return res.status(404).json({
                success: false,
                message: "Stock not found"
            });
        }

        const {
            symbol,
            name,
            price,
            dailyStats,
            historicalData
        } = req.body;

        // Update symbol
        if (symbol !== undefined) {
            const normalizedSymbol = symbol
                .trim()
                .toUpperCase();

            const duplicateStock = await Stock.findOne({
                symbol: normalizedSymbol,
                _id: {
                    $ne: stock._id
                }
            });

            if (duplicateStock) {
                return res.status(409).json({
                    success: false,
                    message:
                        "Another stock already uses this symbol"
                });
            }

            stock.symbol = normalizedSymbol;
        }

        // Update name
        if (name !== undefined) {
            stock.name = name.trim();
        }

        // Update price
        if (price !== undefined) {
            if (Number(price) < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Stock price cannot be negative"
                });
            }

            stock.price = Number(price);
        }

        // Update daily statistics
        if (dailyStats !== undefined) {
            stock.dailyStats = {
                ...stock.dailyStats.toObject(),
                ...dailyStats
            };
        }

        // Update historical data
        if (historicalData !== undefined) {
            if (!Array.isArray(historicalData)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Historical data must be an array"
                });
            }

            stock.historicalData = historicalData;
        }

        await stock.save();

        res.status(200).json({
            success: true,
            message: "Stock updated successfully",
            stock
        });
    } catch (error) {
        next(error);
    }
};

// Deactivate Stock - Admin
const deleteStock = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid stock ID"
            });
        }

        const stock = await Stock.findById(
            req.params.id
        );

        if (!stock) {
            return res.status(404).json({
                success: false,
                message: "Stock not found"
            });
        }

        stock.isActive = false;

        await stock.save();

        res.status(200).json({
            success: true,
            message: "Stock deactivated successfully",
            stock
        });
    } catch (error) {
        next(error);
    }
};

// Reactivate Stock - Admin
const reactivateStock = async (
    req,
    res,
    next
) => {
    try {
        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid stock ID"
            });
        }

        const stock =
            await Stock.findById(
                req.params.id
            );

        if (!stock) {
            return res.status(404).json({
                success: false,
                message: "Stock not found"
            });
        }

        stock.isActive = true;

        await stock.save();

        res.status(200).json({
            success: true,
            message:
                "Stock reactivated successfully",
            stock
        });
    } catch (error) {
        next(error);
    }
};
// Get All Stocks - Admin
const getAllStocksAdmin = async (
    req,
    res,
    next
) => {
    try {
        const stocks = await Stock.find()
            .sort({
                symbol: 1
            });

        res.status(200).json({
            success: true,
            count: stocks.length,
            stocks
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    getStocks,
    getStockBySymbol,
    getAllStocksAdmin,
    createStock,
    updateStock,
    deleteStock,
    reactivateStock
};