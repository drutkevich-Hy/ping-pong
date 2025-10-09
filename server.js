const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// CORS für Vercel Frontend
app.use(cors());

const io = socketIO(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://*.vercel.app",
      "https://your-domain.com", // Ersetze mit deiner Domain
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Health check für Railway
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", clients: io.engine.clientsCount });
});

// API endpoint für Frontend
app.get("/", (req, res) => {
  res.json({
    message: "Pong Streaming WebSocket Server",
    clients: io.engine.clientsCount,
  });
});

// WebSocket Logic
io.on("connection", (socket) => {
  console.log("Client verbunden:", socket.id);
  console.log("Aktive Verbindungen:", io.engine.clientsCount);

  socket.on("gameState", (data) => {
    socket.broadcast.emit("gameState", data);
  });

  socket.on("disconnect", () => {
    console.log("Client getrennt:", socket.id);
    console.log("Aktive Verbindungen:", io.engine.clientsCount);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`WebSocket Server läuft auf Port ${PORT}`);
});