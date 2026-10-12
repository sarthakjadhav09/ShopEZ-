const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const {
    startMarketSimulator
} = require("./services/marketSimulator");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const stockRoutes = require("./routes/stockRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const {
    notFound,
    errorHandler
} = require("./middleware/errorMiddleware");

const app = express();

// ================================
// Middleware
// ================================

app.use(cors());
app.use(express.json());

// ================================
// API Routes
// ================================

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);
// ================================
// Health Check
// ================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ShopEZ API is running"
    });
});

// ================================
// 404 Handler
// ================================

app.use(notFound);

// ================================
// Centralized Error Handler
// ================================

app.use(errorHandler);

// ================================
// Server Configuration
// ================================

const PORT = process.env.PORT || 8000;

// ================================
// Start Server
// ================================

const startServer = async () => {
    try {
        await connectDB();

        startMarketSimulator();

        app.listen(PORT, () => {
            console.log(
                `ShopEZ server running on http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error(
            "Failed to start ShopEZ server:",
            error.message
        );

        process.exit(1);
    }
};

startServer();