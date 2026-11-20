const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const publicUser = (u) => ({
    id: u._id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    orgName: u.orgName,
    isVerified: u.isVerified,
    createdAt: u.createdAt,
});

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

exports.me = (req, res) => res.json(publicUser(req.user));

exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, orgName } = req.body;
        const update = {};
        if (name) update.name = name;
        if (phone) update.phone = phone;
        if (req.user.role === "ngo" && orgName) update.orgName = orgName;

        const user = await User.findByIdAndUpdate(req.user._id, update, {
            new: true,
            runValidators: true,
        });
        res.json(publicUser(user));
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: "Naya password kam se kam 6 characters ka ho" });
        }
        const user = await User.findById(req.user._id).select("+password");
        if (!(await user.matchPassword(currentPassword))) {
            return res.status(400).json({ message: "Purana password galat hai" });
        }
        user.password = newPassword; 
        await user.save();
        res.json({ message: "Password badal gaya" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};