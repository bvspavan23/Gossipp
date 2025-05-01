const socketIo = (io) => {
  const connectedUsers = new Map();
  const usersPerRoom = new Map(); 

  const getOnlineUsers = (groupId) => {
    const usersMap = usersPerRoom.get(groupId);
    return usersMap ? Array.from(usersMap.values()) : [];
  };

  io.on("connection", (socket) => {
    const user = socket.handshake.auth.user;
    if (!user?._id) return;

    console.log("User connected", user.username);

    socket.on("join room", (groupId) => {
      socket.join(groupId);
      console.log(`${user.username} joined room: ${groupId}`);
      console.log("Raw groupId type:", typeof groupId);
    
      connectedUsers.set(socket.id, { user, room: groupId });
    
      if (!usersPerRoom.has(groupId)) {
        usersPerRoom.set(groupId, new Map());
      }
    
      const roomUsers = usersPerRoom.get(groupId);
      const alreadyInRoom = roomUsers.has(user._id);
      roomUsers.set(user._id, user);
    
      const usersInRoom = getOnlineUsers(groupId);
      console.log(`Current users in room ${groupId}:`, usersInRoom.map(u => u.username)); // ADD THIS
    
      io.to(groupId).emit("users in room", usersInRoom);
    
      if (!alreadyInRoom) {
        socket.to(groupId).emit("notification", {
          type: "USER_JOINED",
          message: `${user.username} has joined`,
          user,
        });
      }
    });
    
    socket.on("leave room", (groupId) => {
      console.log(`${user.username} leaving room: ${groupId}`);
      socket.leave(groupId);

      connectedUsers.delete(socket.id);

      const roomUsers = usersPerRoom.get(groupId);
      if (roomUsers) {
        roomUsers.delete(user._id);

        // If no users left in room, delete the room map
        if (roomUsers.size === 0) {
          usersPerRoom.delete(groupId);
        }

        io.to(groupId).emit("user left", user._id);
      }
    });

    socket.on("new message", (message) => {
      console.log("Server received new message:", message);
      const roomId = message.group;
      if (roomId) {
        socket.to(roomId).emit("message received", message);
        console.log("Emitted to room:", roomId);
      }
    });
  
    socket.on("private message", ({ toUserId, message }) => {
      for (const [socketId, { user: targetUser }] of connectedUsers.entries()) {
        if (targetUser._id === toUserId) {
          io.to(socketId).emit("private message received", message);
          break;
        }
      }
    });

    socket.on("typing", ({ groupId, username }) => {
      socket.to(groupId).emit("user typing", { username });
    });

    socket.on("stop typing", ({ groupId }) => {
      socket.to(groupId).emit("user stop typing", { username: user.username });
    });

    socket.on("disconnect", () => {
      console.log(`${user.username} disconnected`);
      const data = connectedUsers.get(socket.id);
      connectedUsers.delete(socket.id);

      if (data?.room) {
        const roomUsers = usersPerRoom.get(data.room);
        if (roomUsers) {
          roomUsers.delete(user._id);

          if (roomUsers.size === 0) {
            usersPerRoom.delete(data.room);
          }

          io.to(data.room).emit("user left", user._id);
        }
      }
    });
  });
};

module.exports = socketIo;
