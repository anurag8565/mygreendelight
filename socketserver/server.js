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
      if (!userId) return;
      const cleanId = String(userId);
      onlineUsers[cleanId] = socket.id;
      socket.userId = cleanId;

      // Join personal user room so all devices (mobile, laptop, tablet) of this user receive broadcasts
      socket.join(`user:${cleanId}`);

      console.log(`[SOCKET] User ${cleanId} registered and joined room user:${cleanId} on socket ${socket.id}`);
    }
  );

  // Real-time live cart sync across devices of the same user
  socket.on("cart-changed", (data) => {
    try {
      const { userId, cart, timestamp } = data || {};
      const targetUserId = userId || socket.userId;
      if (!targetUserId) return;
      const cleanId = String(targetUserId);

      // Broadcast to all other devices/windows of this user (excluding the sender)
      socket.to(`user:${cleanId}`).emit("cart-updated", {
        cart,
        timestamp: timestamp || Date.now(),
        fromSocketId: socket.id,
      });
      console.log(`[SOCKET] Cart sync broadcasted to user:${cleanId}`);
    } catch (err) {
      console.error("[SOCKET] cart-changed error:", err);
    }
  });

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

// HTTP Webhook for Next.js server to push live cart updates via Socket.io
app.post("/cart-sync", (req, res) => {
  try {
    const { userId, cart, timestamp } = req.body || {};
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId required" });
    }
    const cleanId = String(userId);
    io.to(`user:${cleanId}`).emit("cart-updated", {
      cart,
      timestamp: timestamp || Date.now(),
    });
    console.log(`[SOCKET HTTP] Pushed cart-updated to room user:${cleanId}`);
    return res.json({ success: true });
  } catch (err) {
    console.error("[SOCKET HTTP] /cart-sync error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
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

app.post("/order-status-updated", (req, res) => {
  const { orderId, status, ispaid } = req.body;
  console.log(`ORDER STATUS UPDATED: ${orderId} -> ${status}`);
  io.emit("order-status-updated", { orderId, status, ispaid });
  return res.json({
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