const mongoose = require("mongoose");

const holdingSchema = new mongoose.Schema(
    {
        stockId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Stock",
            required: true
        },

        symbol: {
            type: String,
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 0
        },

        averageBuyPrice: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        _id: false
    }
);

const portfolioSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        balance: {
            type: Number,
            default: 100000,
            min: 0
        },

        holdings: {
            type: [holdingSchema],
            default: []
        },

        totalInvested: {
            type: Number,
            default: 0,
            min: 0
        },

        totalPortfolioValue: {
            type: Number,
            default: 0,
            min: 0
        },

        realizedProfitLoss: {
            type: Number,
            default: 0
        },

        profitLoss: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Portfolio",
    portfolioSchema
);