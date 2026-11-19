const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
    {
        donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true, trim: true },
        description: String,
        image: String,
        quantity: { type: Number, required: true, min: 1 },
        expiryTime: { type: Date, required: true },
        address: { type: String, required: true },
        location: {
            type: { type: String, enum: ["Point"], default: "Point" },
            coordinates: { type: [Number], required: true }, // [lng, lat]
        },
        status: {
            type: String,
            enum: ["available", "accepted", "picked", "delivered", "expired"],
            default: "available",
        },
        acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

foodSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Food", foodSchema);