const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const sendAuth = (res, user, status = 200) => {
    res.status(status).json({
        token: signToken(user._id),
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            orgName: user.orgName,
            isVerified: user.isVerified,
        },
    });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, role, orgName } = req.body;

        if (!["donor", "ngo"].includes(role)) {
            return res.status(400).json({ message: "Role donor ya ngo hona chahiye" });
        }
        if (role === "ngo" && !orgName) {
            return res.status(400).json({ message: "NGO ka naam zaroori hai" });
        }
        if (await User.findOne({ email: email?.toLowerCase() })) {
            return res.status(400).json({ message: "Ye email pehle se registered hai" });
        }

        const user = await User.create({ name, email, password, phone, role, orgName });
        sendAuth(res, user, 201);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email?.toLowerCase() }).select("+password");
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Email ya password galat hai" });
        }
        sendAuth(res, user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.me = (req, res) => {
    const u = req.user;
    res.json({ id: u._id, name: u.name, email: u.email, phone: u.phone, role: u.role, orgName: u.orgName });
};