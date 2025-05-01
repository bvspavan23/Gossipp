import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle } from "react-icons/fi";
import { getMessagesAPI, sendMessageAPI } from "../../services/chats/chatServices";
import {getMembersAPI} from "../../services/groups/groupServices";
import { useDispatch } from "react-redux";
import { addMessage } from "../../redux/slice/chatSlice";
import ChatHeader from "./ChatHeader";
import ChatInfo from "./ChatInfo";
import ChatMessages from "./ChatMessages";
import MessageInput from "./MessageInput";
import {useNavigate} from "react-router-dom";
const ChatArea = ({ groupName, description, groupId, onlineUsers, socket }) => {
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [members, setMembers] = useState([]);
  const [onlineUsersInRoom, setOnlineUsersInRoom] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const currentUserId = userInfo?.user?._id;
  const isMember = members.some(member => member._id === currentUserId);

  const handleJoin=()=>{
    navigate(`/groups/${groupId}`);
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, showGroupInfo]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!socket || !groupId) return;
    
    socket.emit("join room", groupId);
    socket.on("users in room", (users) => {
      setOnlineUsersInRoom(users.map((user) => user._id));
    });
    socket.on("user left", (userId) => {
      setOnlineUsersInRoom((prev) => prev.filter((id) => id !== userId));
    });
    return () => {
      socket.emit("leave room", groupId);
      socket.off("users in room");
      socket.off("user left");
    };
  }, [socket, groupId]);

  const toggleGroupInfo = async () => {
    if (!showGroupInfo) {
      try {
        const Mems = await getMembersAPI(groupId);
        const updatedMembers = Mems.map((member) => ({
          ...member,
          isOnline: onlineUsersInRoom.includes(member._id),
        }));
        setMembers(updatedMembers);
      } catch (error) {
        console.log(error);
      }
    }
    setShowGroupInfo(!showGroupInfo);
  };

  const fetchMessages = async (groupId) => {
    setLoadingMessages(true);
    try {
      const chats = await getMessagesAPI(groupId);
      const formattedMessages = chats.map((message) => ({
        id: message._id,
        content: message.content,
        sender: {
          username: message.sender.username,
          _id: message.sender._id,
        },
        isCurrentUser: message.sender._id === currentUserId,
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
    if (groupId) {
      fetchMessages(groupId);
      const fetchMembers = async () => {
        try {
          const Mems = await getMembersAPI(groupId);
          setMembers(Mems);
        } catch (error) {
          console.log(error);
        }
      };
      fetchMembers();
    }
  }, [groupId]);

  const handleSendMessage = async (messageContent) => {
    const messageData = {
      content: messageContent,
      groupId,
      senderId: currentUserId,
    };

    try {
      const response = await sendMessageAPI(messageData);
      dispatch(addMessage(response));
      socket.emit("new message", response);

      setMessages((prev) => [
        ...prev,
        {
          id: response._id,
          content: response.content,
          sender: {
            _id: response.sender._id,
            username: response.sender.username,
          },
          isCurrentUser: true,
          createdAt: new Date(response.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (message) => {
      if (!message || !message.sender || message.group !== groupId) return;

      const formattedMessage = {
        id: message._id,
        content: message.content,
        sender: {
          _id: message.sender._id,
          username: message.sender.username,
        },
        isCurrentUser: message.sender._id === currentUserId,
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

    socket.on("message received", handleIncomingMessage);
    return () => socket.off("message received", handleIncomingMessage);
  }, [socket, currentUserId, groupId]);

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

    socket.on("user typing", handleUserTyping);
    socket.on("user stop typing", handleUserStopTyping);

    return () => {
      socket.off("user typing", handleUserTyping);
      socket.off("user stop typing", handleUserStopTyping);
    };
  }, [socket, groupId]);

  if (!isMember) {
    return (
      <div className="flex flex-col h-full bg-gray-50 md:ml-0 flex-1 transition-all duration-300 items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
            <FiMessageCircle className="text-gray-400 text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            You aren't a member of this group
          </h2>
          <p className="text-gray-600 mb-6">
            Join the group to start gossiping with other members
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors" onClick={handleJoin}>
            Join Group
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 md:ml-0 flex-1 transition-all duration-300">
      <ChatHeader 
        groupName={groupName}
        description={description}
        showGroupInfo={showGroupInfo}
        toggleGroupInfo={toggleGroupInfo}
      />

      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {showGroupInfo ? (
            <ChatInfo
              groupName={groupName}
              description={description}
              members={members}
              onlineUsersInRoom={onlineUsersInRoom}
            />
          ) : (
            <>
              <ChatMessages
                loadingMessages={loadingMessages}
                messages={messages}
                currentUserId={currentUserId}
                typingUsers={typingUsers}
                messagesEndRef={messagesEndRef}
              />
              <MessageInput
                onSendMessage={handleSendMessage}
                socket={socket}
                groupId={groupId}
                currentUserId={currentUserId}
                userInfo={userInfo}
              />
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatArea;