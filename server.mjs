import express from 'express';
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // u can replace with the URL of your frontend
    methods: ["GET", "POST"],
    credentials: true
  },
  path: '/test'
});

io.on("connection", (socket) => {
    console.log("A user connected");
    
    socket.on("join_room", (roomId) => {
      console.log('join room event')
      socket.join(roomId);
      console.log(`user with id-${socket.id} joined room - ${roomId}`);
    });
  
    socket.on("send_msg", (data) => {
      console.log(data, "DATA");
      //This will send a message to a specific room ID
      io.to(data.roomId).emit("receive_msg", data);
      //io.emit("receive_msg", data)
    });
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

server.listen(3001, '0.0.0.0');