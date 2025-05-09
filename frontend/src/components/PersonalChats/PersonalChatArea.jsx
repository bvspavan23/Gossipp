import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle } from "react-icons/fi";
import { getPersonalMsgAPI, sendPersonalMsgAPI } from "../../services/connections/connectionServices";
import { useDispatch } from "react-redux";
import { addMessage } from "../../redux/slice/chatSlice";
import PersonalChatHeader from "./PersonalChatHeader";
import PersonalChatInfo from "./PersonalChatInfo";
import PersonalChatMessages from "./PersonalChatMessages";
import PersonalMessageInput from "./PersonalMessageInput";
import { useNavigate } from "react-router-dom";

const PersonalChatArea = ({ userId, chatId, onlineUsers, description, userName, profilePic, socket }) => {
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsersInRoom, setOnlineUsersInRoom] = useState([]);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const currentUserId = userInfo?.user?._id;
  const currentUsername = userInfo?.user?.username;

  useEffect(() => {
    scrollToBottom();
  }, [messages, showUserInfo]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!socket || !chatId || !currentUserId) return;
    
    socket.emit("join private chat", chatId);
    
    socket.on("private users in chat", (users) => {
      setOnlineUsersInRoom(users.map(user => user._id));
    });

    socket.on("private user left", (userId) => {
      setOnlineUsersInRoom(prev => prev.filter(id => id !== userId));
    });

    return () => {
      socket.emit("leave private chat", chatId);
      socket.off("private users in chat");
      socket.off("private user left");
    };
  }, [socket, chatId, currentUserId]);

  const toggleUserInfo = () => {
    setShowUserInfo(!showUserInfo);
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const chats = await getPersonalMsgAPI(chatId);
      const formattedMessages = chats.map((message) => ({
        id: message._id,
        content: message.content,
        sender: {
          username: message.sender.username,
          _id: message.sender._id,
          profilePic: message.sender.profilePic
        },
        isCurrentUser: message.sender._id.toString() === currentUserId.toString(),
        createdAt: new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  const handleSendMessage = async (messageContent) => {
    if (!messageContent.trim()) return;
  
    const messageData = {
      content: messageContent,
      chatid: chatId,
    };
  
    try {
      const response = await sendPersonalMsgAPI(messageData);
      
      // Format the response message
      const formattedMessage = {
        id: response._id,
        content: response.content,
        sender: {
          _id: response.sender._id,
          username: response.sender.username,
          profilePic: response.sender.profilePic
        },
        isCurrentUser: true,
        createdAt: new Date(response.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
  
      // Update local state
      setMessages(prev => [...prev, formattedMessage]);
      scrollToBottom();
      
      // Dispatch to Redux if needed
      dispatch(addMessage(formattedMessage));
      
      // Emit socket event
      socket.emit("new private message", {
        ...response,
        chatId: chatId,  // Ensure chatId is included
        sender: {
          _id: response.sender._id,
          username: response.sender.username,
          profilePic: response.sender.profilePic
        }
      });
  
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (message) => {
      if (!message || !message.sender || message.chatId !== chatId) return;

      const formattedMessage = {
        id: message._id,
        content: message.content,
        sender: {
          _id: message.sender._id,
          username: message.sender.username,
          profilePic: message.sender.profilePic
        },
        isCurrentUser: message.sender._id.toString() === currentUserId.toString(),
        createdAt: new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => {
        const exists = prev.some((msg) => msg.id === message._id);
        return exists ? prev : [...prev, formattedMessage];
      });
    };

    socket.on("private message received", handleIncomingMessage);
    return () => socket.off("private message received", handleIncomingMessage);
  }, [socket, currentUserId, chatId, dispatch]);

  useEffect(() => {
    if (!socket) return;

    const handleUserTyping = ({ username }) => {
      setTypingUsers((prev) => {
        if (!prev.includes(username)) {
          return [...prev, username];
        }
        return prev;
      });
    };

    const handleUserStopTyping = ({ username }) => {
      setTypingUsers((prev) => prev.filter((user) => user !== username));
    };

    socket.on("private user typing", handleUserTyping);
    socket.on("private user stop typing", handleUserStopTyping);

    return () => {
      socket.off("private user typing", handleUserTyping);
      socket.off("private user stop typing", handleUserStopTyping);
    };
  }, [socket, chatId]);

  const handleTyping = (isTyping) => {
    if (!socket || !chatId) return;

    if (isTyping) {
      socket.emit("private typing", { chatId });
    } else {
      socket.emit("private stop typing", { chatId });
    }
  };

  const isRecipientOnline = onlineUsersInRoom.includes(userId);

  return (
    <div className="flex flex-col h-full bg-gray-50 md:ml-0 flex-1 transition-all duration-300">
      <PersonalChatHeader 
        userName={userName}
        showUserInfo={showUserInfo}
        toggleUserInfo={toggleUserInfo}
        isOnline={isRecipientOnline}
        profilePic={profilePic}
      />

      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {showUserInfo ? (
            <PersonalChatInfo
              userName={userName}
              profilePic={profilePic}
              isOnline={isRecipientOnline}
              description={description}
            />
          ) : (
            <>
              <PersonalChatMessages
                loadingMessages={loadingMessages}
                messages={messages}
                currentUserId={currentUserId}
                typingUsers={typingUsers}
                messagesEndRef={messagesEndRef}
                profilePic={profilePic}
              />
              <PersonalMessageInput
                onSendMessage={handleSendMessage}
                onTyping={handleTyping}
              />
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PersonalChatArea;