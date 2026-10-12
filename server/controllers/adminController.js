const User = require("../models/User");
const Product = require("../models/Product");
const Stock = require("../models/Stock");
const Order = require("../models/Order");
const Transaction = require("../models/Transaction");

const getAdminOverview = async (
    req,
    res,
    next
) => {
    try {
        const [
            users,
            products,
            stocks,
            orders,
            transactions
        ] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments({
                isActive: true
            }),
            Stock.countDocuments(),
            Order.countDocuments(),
            Transaction.countDocuments()
        ]);

        res.status(200).json({
            success: true,

            overview: {
                users,
                products,
                stocks,
                orders,
                transactions
            }
        });
    } catch (error) {
        next(error);
    }
};

const getUsers = async (
    req,
    res,
    next
) => {
    try {
        const users = await User.find()
            .select(
                "-passwordHash"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        next(error);
    }
};

const getAdminOrders = async (
    req,
    res,
    next
) => {
    try {
        const orders = await Order.find()
            .populate(
                "userId",
                "name email"
            )
            .populate(
                "items.productId",
                "title price"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        next(error);
    }
};

const getAdminTransactions = async (
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
    getAdminOverview,
    getUsers,
    getAdminOrders,
    getAdminTransactions
};