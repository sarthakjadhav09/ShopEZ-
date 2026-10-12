require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("./config/db");
const User = require("./models/User");

const makeAdmin = async () => {
    try {
        const email = process.argv[2];

        if (!email) {
            console.error(
                "Please provide an email address."
            );

            console.error(
                "Example: node makeAdmin.js user@example.com"
            );

            process.exit(1);
        }

        await connectDB();

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            console.error(
                `No user found with email: ${email}`
            );

            await mongoose.connection.close();

            process.exit(1);
        }

        user.role = "ADMIN";

        await user.save();

        console.log(
            `Admin role assigned to ${user.email}`
        );

        await mongoose.connection.close();

        process.exit(0);
    } catch (error) {
        console.error(
            "Failed to make user admin:",
            error
        );

        await mongoose.connection.close();

        process.exit(1);
    }
};

makeAdmin();