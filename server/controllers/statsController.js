const Food = require("../models/Food");
const User = require("../models/User");

const lastDays = (n) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (n - 1));
    return d;
};

const fillDays = (rows, n = 7) => {
    const map = Object.fromEntries(rows.map((r) => [r._id, r.meals]));
    return Array.from({ length: n }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (n - 1 - i));
        const key = d.toISOString().slice(0, 10);
        return {
            day: d.toLocaleDateString("en-IN", { weekday: "short" }),
            meals: map[key] || 0,
        };
    });
};

const dailyMeals = (match) =>
    Food.aggregate([
        { $match: { ...match, createdAt: { $gte: lastDays(7) } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                meals: { $sum: "$quantity" },
            },
        },
    ]);

exports.publicStats = async (req, res) => {
    const [delivered, donors, ngos, areas] = await Promise.all([
        Food.aggregate([
            { $match: { status: "delivered" } },
            { $group: { _id: null, meals: { $sum: "$quantity" }, count: { $sum: 1 } } },
        ]),
        User.countDocuments({ role: "donor" }),
        User.countDocuments({ role: "ngo" }),
        Food.distinct("address", { status: "delivered" }),
    ]);

    res.json({
        meals: delivered[0]?.meals || 0,
        donations: delivered[0]?.count || 0,
        donors,
        ngos,
        areas: areas.length,
    });
};

exports.donorStats = async (req, res) => {
    const rows = await dailyMeals({ donor: req.user._id });
    res.json({ weekly: fillDays(rows) });
};

exports.ngoStats = async (req, res) => {
    const [rows, total] = await Promise.all([
        dailyMeals({ acceptedBy: req.user._id, status: "delivered" }),
        Food.aggregate([
            { $match: { acceptedBy: req.user._id, status: "delivered" } },
            { $group: { _id: null, meals: { $sum: "$quantity" }, count: { $sum: 1 } } },
        ]),
    ]);
    res.json({
        weekly: fillDays(rows),
        meals: total[0]?.meals || 0,
        pickups: total[0]?.count || 0,
    });
};