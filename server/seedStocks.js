require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("./config/db");
const Stock = require("./models/Stock");

const stocks = [
    {
        symbol: "AAPL",
        name: "Apple Inc.",
        price: 225.00,
        dailyStats: {
            change: 2.50,
            changePercent: 1.12,
            high: 228.00,
            low: 221.50,
            volume: 50000000
        },
        historicalData: [
            {
                date: new Date("2026-09-18"),
                open: 220,
                high: 224,
                low: 218,
                close: 222,
                volume: 48000000
            },
            {
                date: new Date("2026-09-19"),
                open: 222,
                high: 227,
                low: 220,
                close: 225,
                volume: 50000000
            }
        ]
    },
    {
        symbol: "MSFT",
        name: "Microsoft Corporation",
        price: 510.00,
        dailyStats: {
            change: 4.20,
            changePercent: 0.83,
            high: 515.00,
            low: 505.00,
            volume: 28000000
        },
        historicalData: [
            {
                date: new Date("2026-09-18"),
                open: 500,
                high: 507,
                low: 498,
                close: 505,
                volume: 27000000
            },
            {
                date: new Date("2026-09-19"),
                open: 505,
                high: 513,
                low: 502,
                close: 510,
                volume: 28000000
            }
        ]
    },
    {
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        price: 250.00,
        dailyStats: {
            change: -1.80,
            changePercent: -0.72,
            high: 253.00,
            low: 247.00,
            volume: 22000000
        },
        historicalData: [
            {
                date: new Date("2026-09-18"),
                open: 248,
                high: 252,
                low: 245,
                close: 251,
                volume: 21000000
            },
            {
                date: new Date("2026-09-19"),
                open: 251,
                high: 254,
                low: 248,
                close: 250,
                volume: 22000000
            }
        ]
    }
];

const seedStocks = async () => {
    try {
        await connectDB();

        await Stock.deleteMany({});

        await Stock.insertMany(stocks);

        console.log("Sample stocks inserted successfully.");
        console.log(`Total stocks: ${stocks.length}`);

        await mongoose.connection.close();

        process.exit(0);
    } catch (error) {
        console.error("Failed to seed stocks:", error);

        await mongoose.connection.close();

        process.exit(1);
    }
};

seedStocks();