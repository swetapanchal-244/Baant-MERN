const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, minlength: 6, select: false },
        phone: { type: String },
        googleId: { type: String },
        role: { type: String, enum: ["donor", "ngo", "admin"], default: "donor" },
        orgName: { type: String, trim: true },
        isVerified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = function (plain) {
    if (!this.password) return false;
    return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model("User", userSchema);