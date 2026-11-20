require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

(async () => {
    const [email, password] = process.argv.slice(2);
    if (!email || !password) {
        console.log("Use: node scripts/createAdmin.js email password");
        process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    if (await User.findOne({ email })) {
        console.log("Ye email pehle se hai");
        process.exit(1);
    }
    await User.create({
        name: "Baant Admin",
        email,
        password,
        phone: "9999999999",
        role: "admin",
        isVerified: true,
    });
    console.log("Admin ban gaya:", email);
    process.exit(0);
})();