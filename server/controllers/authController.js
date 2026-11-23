const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const cleanEmail = (email) => (typeof email === "string" ? email.trim().toLowerCase() : "");

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
    isGoogleUser: !!u.googleId,
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

exports.googleAuth = async (req, res) => {
    try {
        const { credential, role, orgName } = req.body;

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { email, name, sub, email_verified } = ticket.getPayload();
        if (!email_verified) {
            return res.status(400).json({ message: "Google email verify nahi hai" });
        }

        let user = await User.findOne({ email: cleanEmail(email) });

        if (!user) {
            if (!["donor", "ngo"].includes(role)) {
                return res.status(404).json({ message: "Account nahi mila. Pehle Register karo." });
            }
            if (role === "ngo" && !orgName) {
                return res.status(400).json({ message: "NGO ka naam zaroori hai" });
            }
            user = await User.create({
                name,
                email: cleanEmail(email),
                googleId: sub,
                role,
                orgName: role === "ngo" ? orgName : undefined,
            });
            return sendAuth(res, user, 201);
        }

        if (!user.googleId) {
            user.googleId = sub;
            await user.save();
        }
        sendAuth(res, user);
    } catch (err) {
        console.log("GOOGLE AUTH ERROR:", err.message);
        res.status(401).json({ message: "Google login fail ho gaya" });
    }
};

exports.register = async (req, res) => {
    try {
        const { name, password, phone, role, orgName } = req.body;
        const email = cleanEmail(req.body.email);

        if (!["donor", "ngo"].includes(role)) {
            return res.status(400).json({ message: "Role donor ya ngo hona chahiye" });
        }
        if (role === "ngo" && !orgName) {
            return res.status(400).json({ message: "NGO ka naam zaroori hai" });
        }
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: "Ye email pehle se registered hai" });
        }

        const user = await User.create({ name, email, password, phone, role, orgName });

        // TEMP DEBUG (baad me hata dena)
        console.log("REGISTER OK:", email, "| password length:", password?.length);

        sendAuth(res, user, 201);
    } catch (err) {
        console.log("REGISTER ERROR:", err.message);
        res.status(400).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { password } = req.body;
        const email = cleanEmail(req.body.email);

        const user = await User.findOne({ email }).select("+password");

        // TEMP DEBUG (baad me hata dena)
        console.log("LOGIN TRY:", email, "| user mila:", !!user, "| password saved:", !!user?.password, "| password length:", password?.length);

        if (!user) {
            return res.status(401).json({ message: "Email ya password galat hai" });
        }
        if (!user.password && user.googleId) {
            return res.status(401).json({ message: "Ye account Google se bana hai. Google se login karo." });
        }

        const ok = await user.matchPassword(password);
        console.log("LOGIN password match:", ok); // TEMP DEBUG

        if (!ok) {
            return res.status(401).json({ message: "Email ya password galat hai" });
        }
        sendAuth(res, user);
    } catch (err) {
        console.log("LOGIN ERROR:", err.message);
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