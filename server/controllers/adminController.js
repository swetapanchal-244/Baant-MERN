const User = require("../models/User");
const Food = require("../models/Food");

exports.overview = async (req, res) => {
    const [donors, ngos, verifiedNgos, delivered, foods] = await Promise.all([
        User.countDocuments({ role: "donor" }),
        User.countDocuments({ role: "ngo" }),
        User.countDocuments({ role: "ngo", isVerified: true }),
        Food.aggregate([
            { $match: { status: "delivered" } },
            { $group: { _id: null, meals: { $sum: "$quantity" } } },
        ]),
        Food.countDocuments(),
    ]);
    res.json({
        donors,
        ngos,
        verifiedNgos,
        pendingNgos: ngos - verifiedNgos,
        foods,
        meals: delivered[0]?.meals || 0,
    });
};

exports.listUsers = async (req, res) => {
    const { role } = req.query;
    const filter = ["donor", "ngo"].includes(role) ? { role } : { role: { $in: ["donor", "ngo"] } };
    const users = await User.find(filter).sort("-createdAt");
    res.json(users);
};

exports.setVerified = async (req, res) => {
    const user = await User.findOneAndUpdate(
        { _id: req.params.id, role: "ngo" },
        { isVerified: !!req.body.isVerified },
        { new: true }
    );
    if (!user) return res.status(404).json({ message: "NGO nahi mila" });
    res.json(user);
};