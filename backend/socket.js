const socketIo = (io) => {
  const connectedUsers = new Map();
  const usersPerRoom = new Map(); 
  const privateUsersPerChat = new Map(); 
  const getOnlineUsers = (groupId) => {
    const usersMap = usersPerRoom.get(groupId);
    return usersMap ? Array.from(usersMap.values()) : [];
  };
  const getPrivateOnlineUsers = (chatId) => {
    const usersMap = privateUsersPerChat.get(chatId);
    return usersMap ? Array.from(usersMap.values()) : [];
  };

  io.on("connection", (socket) => {
    const user = socket.handshake.auth.user;
    if (!user?._id) return;
    console.log("User connected", user.username);
    //----------------------------Group Room Handler---------------------------------------------------
    socket.on("join room", (groupId) => {
      try {
        socket.join(groupId);
        console.log(`${user.username} joined room: ${groupId}`);
        connectedUsers.set(socket.id, { user, room: groupId, roomType: 'group' });
        if (!usersPerRoom.has(groupId)) {
          usersPerRoom.set(groupId, new Map());
        }
        const roomUsers = usersPerRoom.get(groupId);
        const alreadyInRoom = roomUsers.has(user._id);
        roomUsers.set(user._id, user);
        const usersInRoom = getOnlineUsers(groupId);
        console.log(`Current users in room ${groupId}:`, usersInRoom.map(u => u.username));
        io.to(groupId).emit("users in room", usersInRoom);
        if (!alreadyInRoom) {
          socket.to(groupId).emit("notification", {
            type: "USER_JOINED",
            message: `${user.username} has joined`,
            user,
          });
        }
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    socket.on("leave room", (groupId) => {
      try {
        console.log(`${user.username} leaving room: ${groupId}`);
        socket.leave(groupId);
        connectedUsers.delete(socket.id);

        const roomUsers = usersPerRoom.get(groupId);
        if (roomUsers) {
          roomUsers.delete(user._id);

          if (roomUsers.size === 0) {
            usersPerRoom.delete(groupId);
          }

          io.to(groupId).emit("user left", user._id);
          io.to(groupId).emit("users in room", getOnlineUsers(groupId));
        }
      } catch (error) {
        console.error("Error leaving room:", error);
      }
    });
    //--------------------Private Chat Handlers----------------------------------------
    socket.on("join private chat", (chatId) => {
      try {
        socket.join(chatId);
        console.log(`${user.username} joined private chat: ${chatId}`); 
        connectedUsers.set(socket.id, { user, room: chatId, roomType: 'private' });
        if (!privateUsersPerChat.has(chatId)) {
          privateUsersPerChat.set(chatId, new Map());
        }
        const chatUsers = privateUsersPerChat.get(chatId);
        const alreadyInChat = chatUsers.has(user._id);
        chatUsers.set(user._id, user);
        const usersInChat = getPrivateOnlineUsers(chatId);
        console.log(`Current users in private chat ${chatId}:`, usersInChat.map(u => u.username));
        io.to(chatId).emit("private users in chat", usersInChat);
        if (!alreadyInChat) {
          socket.to(chatId).emit("private notification", {
            type: "USER_JOINED_PRIVATE",
            message: `${user.username} has joined the chat`,
            user,
          });
        }
      } catch (error) {
        console.error("Error joining private chat:", error);
        socket.emit("error", { message: "Failed to join private chat" });
      }
    });

    socket.on("leave private chat", (chatId) => {
      try {
        console.log(`${user.username} leaving private chat: ${chatId}`);
        socket.leave(chatId);
        connectedUsers.delete(socket.id);

        const chatUsers = privateUsersPerChat.get(chatId);
        if (chatUsers) {
          chatUsers.delete(user._id);

          if (chatUsers.size === 0) {
            privateUsersPerChat.delete(chatId);
          }

          io.to(chatId).emit("private user left", user._id);
          io.to(chatId).emit("private users in chat", getPrivateOnlineUsers(chatId));
        }
      } catch (error) {
        console.error("Error leaving private chat:", error);
      }
    });

    //---------------------------------------Message Handlers--------------------------------------
    socket.on("new message", (message) => {
      try {
        console.log("Server received new message:", message);
        const roomId = message.group;
        if (roomId) {
          socket.to(roomId).emit("message received", message);
          console.log("Emitted to room:", roomId);
        }
      } catch (error) {
        console.error("Error handling new message:", error);
      }
    });
  
    socket.on("new private message", (message) => {
      try {
        console.log("Server received new private message:", message);
        const chatId = message.chatId;
        if (chatId) {
          socket.to(chatId).emit("private message received", message);
          console.log("Emitted to private chat:", chatId);
        }
      } catch (error) {
        console.error("Error handling private message:", error);
      }
    });
    
    //--------------------------------Typing Indicators-----------------------------------------
    socket.on("typing", ({ groupId, username }) => {
      socket.to(groupId).emit("user typing", { username });
    });

    socket.on("stop typing", ({ groupId }) => {
      socket.to(groupId).emit("user stop typing", { username: user.username });
    });
    
    socket.on("private typing", ({ chatId }) => {
      socket.to(chatId).emit("private user typing", { username: user.username });
    });
    
    socket.on("private stop typing", ({ chatId }) => {
      socket.to(chatId).emit("private user stop typing", { username: user.username });
    });

    //----------------------------------------Disconnect Handler-----------------------
    socket.on("disconnect", () => {
      try {
        console.log(`${user.username} disconnected`);
        const connectionData = connectedUsers.get(socket.id);
        if (!connectionData) return;

        const { user, room, roomType } = connectionData;
        connectedUsers.delete(socket.id);

        if (roomType === 'private') {
          const chatUsers = privateUsersPerChat.get(room);
          if (chatUsers) {
            chatUsers.delete(user._id);
            if (chatUsers.size === 0) {
              privateUsersPerChat.delete(room);
            }
            io.to(room).emit("private user left", user._id);
            io.to(room).emit("private users in chat", getPrivateOnlineUsers(room));
          }
        } else if (roomType === 'group') {
          const roomUsers = usersPerRoom.get(room);
          if (roomUsers) {
            roomUsers.delete(user._id);
            if (roomUsers.size === 0) {
              usersPerRoom.delete(room);
            }
            io.to(room).emit("user left", user._id);
            io.to(room).emit("users in room", getOnlineUsers(room));
          }
        }
      } catch (error) {
        console.error("Error during disconnect:", error);
      }
    });
  });
};

module.exports = socketIo;