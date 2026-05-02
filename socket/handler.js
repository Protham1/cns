const { addUser, removeUser, getUsersInRoom } = require("../utils/rooms");

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // 🟢 JOIN ROOM
    socket.on("join_room", ({ username, room }) => {
      socket.join(room);

      addUser(socket.id, username, room);

      console.log(`${username} joined ${room}`);

      // Notify others in room
      socket.to(room).emit("user_joined", {
        username
      });

      // Send updated user list to everyone
      io.to(room).emit("room_users", getUsersInRoom(room));
    });

    // 💬 SEND MESSAGE (ENCRYPTED PAYLOAD)
    socket.on("send_message", ({ room, payload }) => {
  console.log("\n📡 BACKEND RECEIVED MESSAGE:");
  console.log(JSON.stringify(payload, null, 2));

  socket.to(room).emit("receive_message", payload);
});

    // 📁 FILE TRANSFER (ENCRYPTED)
    socket.on("send_file", ({ room, file }) => {
      console.log("File received:", file?.name);

      socket.to(room).emit("receive_file", file);
    });

    // 🔑 PUBLIC KEY EXCHANGE
    socket.on("send_public_key", ({ room, publicKey }) => {
      socket.to(room).emit("receive_public_key", {
        sender: socket.id,
        publicKey
      });
    });

    // 🔄 RATCHET SYNC (optional)
    socket.on("ratchet_update", ({ room, info }) => {
      socket.to(room).emit("ratchet_update", info);
    });

    // ❌ DISCONNECT
    socket.on("disconnect", () => {
      const user = removeUser(socket.id);

      if (user) {
        io.to(user.room).emit("user_left", {
          username: user.username
        });

        io.to(user.room).emit("room_users", getUsersInRoom(user.room));
      }

      console.log("User disconnected:", socket.id);
    });
  });
}

module.exports = socketHandler;