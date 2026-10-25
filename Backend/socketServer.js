import { Server } from "socket.io";

let io;

export const emitOrderStatusUpdate = (orderId, status) => {
  if (!io) throw new Error("Socket server has not been initialized");
  io.to(orderId.toString()).emit("orderStatusUpdate", {
    orderId: orderId.toString(),
    status,
  });
  if (status === "Delivered") {
    io.to(orderId.toString()).emit("trackingStopped", {
      orderId: orderId.toString(),
    });
  }
};

export const setupSocket = (server) => {
  const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  io = new Server(server, {
    cors: {
      origin: corsOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    // Join order room
    socket.on("joinOrderRoom", (orderId) => {
      if (!orderId) return;

      socket.join(orderId);

      console.log(`📦 Socket ${socket.id} joined room ${orderId}`);
    });

    // Receive delivery boy live GPS
    socket.on("deliveryLocation", ({ orderId, lat, lng } = {}) => {
      if (
        !orderId ||
        !Number.isFinite(lat) ||
        !Number.isFinite(lng) ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
      ) return;

      io.to(orderId).emit("locationUpdate", { orderId, lat, lng });
    });

    // Leave a tracking room without ending tracking for other clients.
    socket.on("leaveOrderRoom", (orderId) => {
      if (!orderId) return;
      socket.leave(orderId);
    });

    // Cleanup on disconnect
    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected:", socket.id);
    });
  });
};
