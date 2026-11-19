require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { initSocket } = require("./socket");

const app = express();
const server = http.createServer(app);
connectDB();
initSocket(server);

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => res.send("Baant API running"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/food", require("./routes/foodRoutes"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server on port ${PORT}`));