require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("./config/db");
const Product = require("./models/Product");

const products = [
    {
        title: "Wireless Bluetooth Headphones",

        description:
            "Comfortable wireless Bluetooth headphones with clear sound, deep bass, and long battery life.",

        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
        ],

        category: "Electronics",

        price: 2999,

        discount: 10,

        stock: 25,

        isActive: true
    },

    {
        title: "Smart Watch",

        description:
            "A modern smart watch with activity tracking, notifications, heart-rate monitoring, and multiple watch faces.",

        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
        ],

        category: "Electronics",

        price: 4499,

        discount: 15,

        stock: 18,

        isActive: true
    },

    {
        title: "Running Shoes",

        description:
            "Lightweight running shoes designed for everyday workouts, walking, and comfortable running.",

        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
        ],

        category: "Fashion",

        price: 3499,

        discount: 20,

        stock: 30,

        isActive: true
    },

    {
        title: "Classic Backpack",

        description:
            "Durable everyday backpack with multiple compartments for books, laptops, accessories, and personal items.",

        images: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62"
        ],

        category: "Accessories",

        price: 1999,

        discount: 10,

        stock: 20,

        isActive: true
    },

    {
        title: "Mechanical Keyboard",

        description:
            "Compact mechanical keyboard with tactile keys, durable construction, and a comfortable typing experience.",

        images: [
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3"
        ],

        category: "Electronics",

        price: 5999,

        discount: 12,

        stock: 15,

        isActive: true
    },

    {
        title: "Cotton Casual T-Shirt",

        description:
            "Soft cotton casual T-shirt suitable for everyday wear and available in a comfortable regular fit.",

        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
        ],

        category: "Fashion",

        price: 999,

        discount: 10,

        stock: 40,

        isActive: true
    }
];

const seedProducts = async () => {
    try {
        await connectDB();

        await Product.deleteMany({});

        await Product.insertMany(products);

        console.log(
            "Sample products inserted successfully."
        );

        console.log(
            `Total products: ${products.length}`
        );

        await mongoose.connection.close();

        process.exit(0);
    } catch (error) {
        console.error(
            "Failed to seed products:",
            error
        );

        await mongoose.connection.close();

        process.exit(1);
    }
};

seedProducts();