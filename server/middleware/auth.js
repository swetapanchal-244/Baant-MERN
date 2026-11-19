const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Login karna zaroori hai" });
    }
    try {
        const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: "User nahi mila" });
        req.user = user;
        next();
    } catch {
        res.status(401).json({ message: "Token invalid ya expire ho gaya" });
    }
};

exports.authorize =
    (...roles) =>
        (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: "Aapko is kaam ki permission nahi hai" });
            }
            next();
        };