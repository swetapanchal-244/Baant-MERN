require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const { initSocket } = require("./socket");
const startExpireJob = require("./jobs/expireFood");

const app = express();
const server = http.createServer(app);
connectDB();
startExpireJob();
initSocket(server);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(
    "/api/auth",
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: { message: "Bahut zyada koshish ho gayi, 15 minute baad dobara try karo" },
    })
);
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => res.send("Baant API running"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/food", require("./routes/foodRoutes"));
app.use("/api/stats", require("./routes/statsRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server on port ${PORT}`));