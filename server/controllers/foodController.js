const Food = require("../models/Food");
const { getIO } = require("../socket");

exports.createFood = async (req, res) => {
    try {
        const { title, description, image, quantity, expiryTime, address, lat, lng } = req.body;

        if (!lat || !lng) return res.status(400).json({ message: "Location zaroori hai" });
        if (new Date(expiryTime) <= new Date()) {
            return res.status(400).json({ message: "Expiry time future ka hona chahiye" });
        }

        const food = await Food.create({
            donor: req.user._id,
            title,
            description,
            image,
            quantity,
            expiryTime,
            address,
            location: { type: "Point", coordinates: [Number(lng), Number(lat)] },
        });
        const populated = await food.populate("donor", "name");
        getIO().to("role:ngo").emit("food:new", populated);
        res.status(201).json(food);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.myFood = async (req, res) => {
    const foods = await Food.find({ donor: req.user._id })
        .populate("acceptedBy", "orgName name phone")
        .sort("-createdAt");
    res.json(foods);
};

exports.nearbyFood = async (req, res) => {
    const { lat, lng, radius = 5 } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: "lat aur lng do" });

    const foods = await Food.find({
        status: "available",
        expiryTime: { $gt: new Date() },
        location: {
            $near: {
                $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
                $maxDistance: Number(radius) * 1000,
            },
        },
    }).populate("donor", "name");

    res.json(foods);
};

exports.myPickups = async (req, res) => {
    const foods = await Food.find({ acceptedBy: req.user._id })
        .populate("donor", "name phone")
        .sort("-updatedAt");
    res.json(foods);
};

exports.acceptFood = async (req, res) => {
    const food = await Food.findOneAndUpdate(
        { _id: req.params.id, status: "available", expiryTime: { $gt: new Date() } },
        { status: "accepted", acceptedBy: req.user._id },
        { new: true }
    );
    if (!food) {
        return res.status(409).json({ message: "Ye khana ab available nahi hai (kisi aur NGO ne le liya ya expire ho gaya)" });
    }
    const full = await food.populate([
        { path: "donor", select: "name phone" },
        { path: "acceptedBy", select: "orgName name" },
    ]);
    getIO().to("role:ngo").to(`user:${food.donor._id}`).emit("food:updated", full);
    res.json(food);
};

exports.updateStatus = async (req, res) => {
    const { status } = req.body;
    const allowed = { accepted: "picked", picked: "delivered" };

    const food = await Food.findOne({ _id: req.params.id, acceptedBy: req.user._id });
    if (!food) return res.status(404).json({ message: "Pickup nahi mili" });
    if (allowed[food.status] !== status) {
        return res.status(400).json({ message: `${food.status} ke baad ${allowed[food.status] || "koi step"} hi ho sakta hai` });
    }

    food.status = status;
    await food.save();
    const full = await food.populate([
        { path: "donor", select: "name phone" },
        { path: "acceptedBy", select: "orgName name" },
    ]);
    getIO().to("role:ngo").to(`user:${food.donor._id}`).emit("food:updated", full);
    res.json(food);
};