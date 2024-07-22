require("dotenv").config(); // Load environment variables from the .env file
const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const cors = require('cors');
const app = express();

app.use(cors({ origin: process.env.SPECIALEVENTSORIGIN})); 

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.SPECIALEVENTSORIGIN,
    },
});

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);
    console.log(`Available clients: ${io.engine.clientsCount}`);
    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`);
        console.log(`Available clients: ${io.engine.clientsCount}`);
    });

    socket.on("images-available", (data) => {
        //when the special-events-server is telling us there is data availabe,
        // we will broadcast all clients to refresh
        io.emit("images-available", "refresh");
    });

    socket.on("message", (data) => {
        //custom debug for safari :(
        console.log(`Received message from ${socket.id}:`, data);
    });
});

server.listen(80, () => {
    console.log("server running");
});
