const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        permissions: {
            manageUsers: {
                type: Boolean,
                default: true
            },

            manageProducts: {
                type: Boolean,
                default: true
            },

            manageOrders: {
                type: Boolean,
                default: true
            },

            manageStocks: {
                type: Boolean,
                default: true
            },

            manageTransactions: {
                type: Boolean,
                default: true
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Admin", adminSchema);