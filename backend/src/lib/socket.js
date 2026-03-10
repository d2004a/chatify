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
      "https://chatify-eta-two.vercel.app"
    ],
    credentials: true
  }
});

//apply authentication middleware to all socket connections

io.use(socketAuthMiddleware);

// we will use this function to check if a user is online or not by checking if the userId is present in the userSocketMap or not
export function getReceiverSocketId(userId){
    return userSocketMap[userId]
}

// this is for storing online users 
const userSocketMap = {}; //{userId : SocketId}

io.on("connection",(socket) =>{
    console.log("A user connected ",socket.user.fullName);

    const userId = socket.userId
    userSocketMap[userId] = socket.id 

    //io.emit is used to send events to all connected clients 
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () =>{
        console.log("A user disconnected",socket.user.fullName);
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

    });

});

export {io, app , server};