import {Server} from 'socket.io';
import http from 'http';
import express from 'express';
import {ENV} from "./env.js";
import { socketAuthMiddleware } from '../middleware/socket.auth.middleware.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      ENV.CLIENT_URL
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

// userSocketMap stores an array of socketIds per userId to support multi-tab usage
// e.g. { "userId123": ["socketId1", "socketId2"] }
const userSocketMap = {};

export function getReceiverSocketIds(userId) {
    return userSocketMap[userId] || [];
}

io.on("connection", (socket) => {
    console.log("A user connected", socket.user.fullName);

    const userId = socket.userId;

    // Add this socket to the user's socket list
    if (!userSocketMap[userId]) {
        userSocketMap[userId] = [];
    }
    userSocketMap[userId].push(socket.id);

    // Emit the updated list of online users (unique user IDs)
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.user.fullName);

        // Remove this specific socket from the user's list
        if (userSocketMap[userId]) {
            userSocketMap[userId] = userSocketMap[userId].filter(id => id !== socket.id);
            // If the user has no more sockets, remove their entry entirely
            if (userSocketMap[userId].length === 0) {
                delete userSocketMap[userId];
            }
        }

        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export {io, app, server};