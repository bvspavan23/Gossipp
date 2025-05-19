import { useState, useRef, useEffect } from "react";
import { FiSend, FiSmile } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";

const PersonalMessageInput = ({ 
  onSendMessage,
  socket,
  userId, 
  currentUserId,
  onTyping  
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeoutRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      onTyping(true);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping(false);
    }, 2000);
  };

  const handleEmojiClick = (emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    handleTyping(); // Trigger typing indicator when adding emoji
  };

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
      setShowEmojiPicker(false);
      if (isTyping) {
        setIsTyping(false);
        onTyping(false);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200 sticky bottom-0">
      <div className="relative">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full py-3 pr-16 pl-12 bg-gray-50 focus:bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          type="button"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-blue-500 transition-colors"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <FiSmile className="text-xl" />
        </button>
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
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-0 z-10" ref={emojiPickerRef}>
            <EmojiPicker 
              onEmojiClick={handleEmojiClick} 
              width={300}
              height={400}
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalMessageInput;