const mongoose = require("mongoose");

const historicalDataSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true
        },

        open: {
            type: Number,
            required: true,
            min: 0
        },

        high: {
            type: Number,
            required: true,
            min: 0
        },

        low: {
            type: Number,
            required: true,
            min: 0
        },

        close: {
            type: Number,
            required: true,
            min: 0
        },

        volume: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        _id: false
    }
);

const stockSchema = new mongoose.Schema(
    {
        symbol: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
            index: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true
        },

        dailyStats: {
            change: {
                type: Number,
                default: 0
            },

            changePercent: {
                type: Number,
                default: 0
            },

            high: {
                type: Number,
                default: 0,
                min: 0
            },

            low: {
                type: Number,
                default: 0,
                min: 0
            },

            volume: {
                type: Number,
                default: 0,
                min: 0
            }
        },

        historicalData: {
            type: [historicalDataSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Stock", stockSchema);