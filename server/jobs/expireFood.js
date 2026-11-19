const cron = require("node-cron");
const Food = require("../models/Food");
const { getIO } = require("../socket");

module.exports = function startExpireJob() {
    
    cron.schedule("* * * * *", async () => {
        try {
            const stale = await Food.find({
                status: "available",
                expiryTime: { $lte: new Date() },
            });
            if (stale.length === 0) return;

            await Food.updateMany(
                { _id: { $in: stale.map((f) => f._id) } },
                { status: "expired" }
            );

            stale.forEach((f) => {
                getIO()
                    .to("role:ngo")
                    .to(`user:${f.donor}`)
                    .emit("food:updated", { ...f.toObject(), status: "expired" });
            });
            console.log(`Expired ${stale.length} food post(s)`);
        } catch (err) {
            console.error("Expire job error:", err.message);
        }
    });
};