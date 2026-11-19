const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

let io;

exports.initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: { origin: process.env.CLIENT_URL },
    });

    // Connect hone se pehle token verify
    io.use(async (socket, next) => {
        try {
            const decoded = jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if (!user) return next(new Error("User nahi mila"));
            socket.user = user;
            next();
        } catch {
            next(new Error("Unauthorized"));
        }
    });

    io.on("connection", (socket) => {
        socket.join(`user:${socket.user._id}`);
        socket.join(`role:${socket.user.role}`);
    });

    return io;
};

exports.getIO = () => io;