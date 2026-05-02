const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const socketHandler = require("./socket/handler");

console.log("DEBUG:", socketHandler);
console.log("TYPE:", typeof socketHandler);

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Attach socket logic
socketHandler(io);

app.get("/", (req, res) => {
  res.send("Secure Chat Backend Running 🚀");
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});