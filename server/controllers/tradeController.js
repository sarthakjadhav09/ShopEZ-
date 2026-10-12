const mongoose = require("mongoose");

const Stock = require("../models/Stock");
const Transaction = require("../models/Transaction");
const Portfolio = require("../models/Portfolio");

// Get or Create User Portfolio
const getOrCreatePortfolio = async (userId) => {
    let portfolio = await Portfolio.findOne({
        userId
    });

    if (!portfolio) {
        portfolio = await Portfolio.create({
            userId,
            balance: 100000,
            holdings: [],
            totalInvested: 0,
            totalPortfolioValue: 0,
            realizedProfitLoss: 0,
            profitLoss: 0
        });
    }

    return portfolio;
};

// Recalculate current portfolio values
const refreshPortfolioTotals = async (portfolio) => {
    let totalPortfolioValue = 0;

    for (const holding of portfolio.holdings) {
        const stock = await Stock.findById(
            holding.stockId
        );

        if (!stock) {
            continue;
        }

        totalPortfolioValue +=
            holding.quantity * stock.price;
    }

    portfolio.totalPortfolioValue =
        Number(
            totalPortfolioValue.toFixed(2)
        );

    const unrealizedProfitLoss =
        portfolio.totalPortfolioValue -
        portfolio.totalInvested;

    portfolio.profitLoss =
        Number(
            (
                unrealizedProfitLoss +
                portfolio.realizedProfitLoss
            ).toFixed(2)
        );

    return portfolio;
};

// BUY STOCK
const buyStock = async (req, res, next) => {
    try {
        const {
            stockId,
            quantity
        } = req.body;

        if (
            !stockId ||
            quantity === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Stock ID and quantity are required"
            });
        }

        if (
            !mongoose.Types.ObjectId.isValid(
                stockId
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid stock ID"
            });
        }

        const numericQuantity =
            Number(quantity);

        if (
            !Number.isInteger(
                numericQuantity
            ) ||
            numericQuantity <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Quantity must be a positive whole number"
            });
        }

        const stock =
            await Stock.findById(stockId);

        if (!stock) {
            return res.status(404).json({
                success: false,
                message: "Stock not found"
            });
        }

        const tradeValue =
            stock.price *
            numericQuantity;

        const portfolio =
            await getOrCreatePortfolio(
                req.user.id
            );

        if (
            portfolio.balance <
            tradeValue
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `Insufficient virtual balance. Required: ${tradeValue.toFixed(
                        2
                    )}, Available: ${portfolio.balance.toFixed(
                        2
                    )}`
            });
        }

        const existingHoldingIndex =
            portfolio.holdings.findIndex(
                (holding) =>
                    holding.stockId.toString() ===
                    stock._id.toString()
            );

        if (
            existingHoldingIndex !== -1
        ) {
            const holding =
                portfolio.holdings[
                    existingHoldingIndex
                ];

            const oldQuantity =
                holding.quantity;

            const oldInvestment =
                oldQuantity *
                holding.averageBuyPrice;

            const newQuantity =
                oldQuantity +
                numericQuantity;

            const newInvestment =
                oldInvestment +
                tradeValue;

            holding.quantity =
                newQuantity;

            holding.averageBuyPrice =
                newInvestment /
                newQuantity;
        } else {
            portfolio.holdings.push({
                stockId: stock._id,
                symbol: stock.symbol,
                quantity: numericQuantity,
                averageBuyPrice:
                    stock.price
            });
        }

        portfolio.balance -=
            tradeValue;

        portfolio.totalInvested +=
            tradeValue;

        await refreshPortfolioTotals(
            portfolio
        );

        await portfolio.save();

        const transaction =
            await Transaction.create({
                userId: req.user.id,
                stockId: stock._id,
                type: "BUY",
                quantity: numericQuantity,
                price: stock.price,
                total: tradeValue
            });

        res.status(201).json({
            success: true,
            message:
                "Stock purchased successfully",
            transaction,
            portfolio
        });
    } catch (error) {
        next(error);
    }
};

// SELL STOCK
const sellStock = async (req, res, next) => {
    try {
        const {
            stockId,
            quantity
        } = req.body;

        if (
            !stockId ||
            quantity === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Stock ID and quantity are required"
            });
        }

        if (
            !mongoose.Types.ObjectId.isValid(
                stockId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid stock ID"
            });
        }

        const numericQuantity =
            Number(quantity);

        if (
            !Number.isInteger(
                numericQuantity
            ) ||
            numericQuantity <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Quantity must be a positive whole number"
            });
        }

        const stock =
            await Stock.findById(stockId);

        if (!stock) {
            return res.status(404).json({
                success: false,
                message:
                    "Stock not found"
            });
        }

        const portfolio =
            await Portfolio.findOne({
                userId: req.user.id
            });

        if (!portfolio) {
            return res.status(404).json({
                success: false,
                message:
                    "Portfolio not found"
            });
        }

        const holdingIndex =
            portfolio.holdings.findIndex(
                (holding) =>
                    holding.stockId.toString() ===
                    stock._id.toString()
            );

        if (holdingIndex === -1) {
            return res.status(400).json({
                success: false,
                message:
                    `You do not own any shares of ${stock.symbol}`
            });
        }

        const holding =
            portfolio.holdings[
                holdingIndex
            ];

        if (
            holding.quantity <
            numericQuantity
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `Insufficient shares. You own ${holding.quantity} shares`
            });
        }

        const saleValue =
            stock.price *
            numericQuantity;

        const costBasis =
            holding.averageBuyPrice *
            numericQuantity;

        const realizedProfitLoss =
            saleValue -
            costBasis;

        holding.quantity -=
            numericQuantity;

        if (
            holding.quantity === 0
        ) {
            portfolio.holdings.splice(
                holdingIndex,
                1
            );
        }

        portfolio.balance +=
            saleValue;

        portfolio.totalInvested -=
            costBasis;

        if (
            portfolio.totalInvested < 0
        ) {
            portfolio.totalInvested = 0;
        }

        portfolio.realizedProfitLoss +=
            realizedProfitLoss;

        await refreshPortfolioTotals(
            portfolio
        );

        await portfolio.save();

        const transaction =
            await Transaction.create({
                userId: req.user.id,
                stockId: stock._id,
                type: "SELL",
                quantity: numericQuantity,
                price: stock.price,
                total: saleValue
            });

        res.status(201).json({
            success: true,
            message:
                "Stock sold successfully",
            transaction,
            portfolio,
            realizedProfitLoss
        });
    } catch (error) {
        next(error);
    }
};

// Get My Transactions
const getMyTransactions = async (
    req,
    res,
    next
) => {
    try {
        const transactions =
            await Transaction.find({
                userId: req.user.id
            })
                .populate(
                    "stockId",
                    "symbol name price"
                )
                .sort({
                    timestamp: -1
                });

        res.status(200).json({
            success: true,
            count: transactions.length,
            transactions
        });
    } catch (error) {
        next(error);
    }
};

// Get All Transactions - Admin
const getAllTransactions = async (
    req,
    res,
    next
) => {
    try {
        const transactions =
            await Transaction.find()
                .populate(
                    "userId",
                    "name email"
                )
                .populate(
                    "stockId",
                    "symbol name price"
                )
                .sort({
                    timestamp: -1
                });

        res.status(200).json({
            success: true,
            count: transactions.length,
            transactions
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    buyStock,
    sellStock,
    getMyTransactions,
    getAllTransactions
};