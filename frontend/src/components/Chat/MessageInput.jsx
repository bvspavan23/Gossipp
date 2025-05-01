import { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
const MessageInput = ({ 
  onSendMessage, 
  socket, 
  groupId, 
  currentUserId,
  userInfo 
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { groupId, username: userInfo.user.username });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("stop typing", { groupId });
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTyping && socket && groupId) {
        socket.emit("stop typing", { groupId });
      }
    };
  }, [isTyping, socket, groupId]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200 sticky bottom-0">
      <div className="relative">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full py-3 pr-16 pl-4 bg-gray-50 focus:bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all ${
            newMessage.trim()
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <FiSend className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;