import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);

app.use(express.json());

const onlineUsers = {};

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {

  console.log(
    "CONNECTED:",
    socket.id
  );

  // PUT REGISTER USER HERE
  socket.on(
    "register-user",
    (userId) => {

      onlineUsers[userId] =
        socket.id;

      socket.userId =
        userId;

      console.log(
        "REGISTERED USER"
      );

      console.log(
        userId
      );

      console.log(
        "SOCKET"
      );

      console.log(
        socket.id
      );

      console.log(
        "ONLINE USERS"
      );

      console.log(
        onlineUsers
      );

    }
  );

  // PUT DISCONNECT HERE
  socket.on(
    "disconnect",
    () => {

      if (
        socket.userId
      ) {

        delete onlineUsers[
          socket.userId
        ];

      }

      console.log(
        "DISCONNECTED"
      );

      console.log(
        onlineUsers
      );

    }
  );

});

app.post(
  "/send-assignment",
  (req, res) => {

    console.log(
      "SEND ASSIGNMENT API HIT"
    );

    const {
      deliveryBoyId,
      assignment,
    } = req.body;

    const socketId =
      onlineUsers[
        deliveryBoyId
      ];

    console.log(
      "ONLINE USERS:",
      onlineUsers
    );

    console.log(
      "SOCKET ID:",
      socketId
    );

    if (!socketId) {

      return res.status(404).json({
        success: false,
        message:
          "Delivery boy offline",
      });

    }

    io.to(socketId).emit(
      "new-assignment",
      assignment
    );

    console.log(
      "ASSIGNMENT SENT"
    );

    return res.json({
      success: true,
    });

  }
);
app.post("/new-order", (req, res) => {
  const { order } = req.body;

  console.log("NEW ORDER RECEIVED");

  io.emit("new-order", order);
  return res.json({
    success: true,
  });
});

app.post("/update-location", (req, res) => {
  const { userId, latitude, longitude } = req.body;
  io.emit("rider-location-update", { userId, latitude, longitude });
  res.json({
    success: true,
  });
});

app.get("/", (req, res) => {
  res.send("MyGreenDelight Socket Server is healthy and running!");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Socket running on port ${PORT}`);
});