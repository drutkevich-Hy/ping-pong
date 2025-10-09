const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Statische Dateien servieren
app.use(express.static(path.join(__dirname, "public")));

// WebSocket Verbindungen
io.on("connection", (socket) => {
  console.log("Client verbunden:", socket.id);

  // Spielstatus vom Spieler empfangen und an Display weiterleiten
  socket.on("gameState", (data) => {
    socket.broadcast.emit("gameState", data);
  });

  socket.on("disconnect", () => {
    console.log("Client getrennt:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
  console.log(`Spieler: http://localhost:${PORT}/spieler.html`);
  console.log(`Display: http://localhost:${PORT}/display.html`);
});