const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");

// Create Order
const createOrder = async (req, res, next) => {
    const session =
        await mongoose.startSession();

    try {
        const {
            items,
            address
        } = req.body;

        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Order must contain at least one item"
            });
        }

        if (
            !address ||
            !address.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Delivery address is required"
            });
        }

        session.startTransaction();

        const orderItems = [];
        let total = 0;

        for (const item of items) {
            if (
                !item.productId ||
                item.quantity === undefined
            ) {
                throw new Error(
                    "Each order item must contain productId and quantity"
                );
            }

            if (
                !mongoose.Types.ObjectId.isValid(
                    item.productId
                )
            ) {
                throw new Error(
                    `Invalid product ID: ${item.productId}`
                );
            }

            const quantity =
                Number(item.quantity);

            if (
                !Number.isInteger(quantity) ||
                quantity <= 0
            ) {
                throw new Error(
                    "Quantity must be a positive whole number"
                );
            }

            const product =
                await Product.findOne({
                    _id: item.productId,
                    isActive: true
                }).session(session);

            if (!product) {
                throw new Error(
                    "Product not found or inactive"
                );
            }

            if (
                product.stock < quantity
            ) {
                throw new Error(
                    `Not enough stock for ${product.title}. Available stock: ${product.stock}`
                );
            }

            const discountedPrice =
                product.price -
                (
                    product.price *
                    product.discount
                ) /
                    100;

            const itemTotal =
                discountedPrice *
                quantity;

            total += itemTotal;

            orderItems.push({
                productId:
                    product._id,

                title:
                    product.title,

                quantity,

                price:
                    Number(
                        discountedPrice.toFixed(2)
                    )
            });

            product.stock -=
                quantity;

            await product.save({
                session
            });
        }

        const order =
            await Order.create(
                [
                    {
                        userId:
                            req.user.id,

                        items:
                            orderItems,

                        total:
                            Number(
                                total.toFixed(2)
                            ),

                        address:
                            address.trim(),

                        status:
                            "CONFIRMED",

                        paymentStatus:
                            "PENDING"
                    }
                ],
                {
                    session
                }
            );

        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message:
                "Order created successfully",
            order: order[0]
        });
    } catch (error) {
        if (
            session.inTransaction()
        ) {
            await session.abortTransaction();
        }

        next(error);
    } finally {
        await session.endSession();
    }
};


// Get My Orders
const getMyOrders = async (
    req,
    res,
    next
) => {
    try {
        const orders =
            await Order.find({
                userId: req.user.id
            })
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


// Get One Order
const getOrderById = async (
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
                message:
                    "Invalid order ID"
            });
        }

        const order =
            await Order.findById(
                req.params.id
            )
                .populate(
                    "items.productId",
                    "title price"
                );

        if (!order) {
            return res.status(404).json({
                success: false,
                message:
                    "Order not found"
            });
        }

        if (
            order.userId.toString() !==
                req.user.id &&
            req.user.role !== "ADMIN"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not allowed to view this order"
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        next(error);
    }
};


// Get All Orders - Admin
const getAllOrders = async (
    req,
    res,
    next
) => {
    try {
        const orders =
            await Order.find()
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


// Update Order Status - Admin
const updateOrderStatus = async (
    req,
    res,
    next
) => {
    try {
        const {
            status
        } = req.body;

        const allowedStatuses = [
            "PENDING",
            "CONFIRMED",
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED"
        ];

        if (
            !allowedStatuses.includes(
                status
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid order status"
            });
        }

        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid order ID"
            });
        }

        const order =
            await Order.findById(
                req.params.id
            );

        if (!order) {
            return res.status(404).json({
                success: false,
                message:
                    "Order not found"
            });
        }

        order.status = status;

        if (
            status === "DELIVERED"
        ) {
            order.paymentStatus =
                "PAID";
        }

        await order.save();

        res.status(200).json({
            success: true,
            message:
                "Order status updated successfully",
            order
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
};