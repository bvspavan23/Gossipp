import { FiMessageCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const PersonalChatMessages = ({ 
  loadingMessages, 
  messages, 
  currentUserId,
  typingUsers,
  messagesEndRef 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto flex flex-col"
    >
      <div className="flex-1 p-4 space-y-4">
        {loadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse text-gray-500">
              Loading messages...
            </div>
          </div>
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.isCurrentUser ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`flex items-center mb-1 space-x-2 ${
                  message.isCurrentUser ? "flex-row-reverse" : ""
                }`}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img 
                    src={message.sender.profilePic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {message.isCurrentUser
                    ? "You"
                    : message.sender.username}{" "}
                  • {message.createdAt}
                </span>
              </div>

              <div
                className={`p-3 rounded-lg max-w-[80%] md:max-w-[60%] ${
                  message.isCurrentUser
                    ? "bg-gradient-to-r from-[#4f5bd5] to-[#962fbf] text-white"
                    : "bg-white text-gray-800 rounded-tl-none shadow-sm"
                }`}
              >
                <p className="break-words">{message.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
            <FiMessageCircle className="text-4xl" />
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {typingUsers.length > 0 && (
        <div className="px-4 pb-2">
          <div className="text-xs text-gray-500 italic">
            {typingUsers.length === 1 ? (
              `${typingUsers[0]} is typing...`
            ) : (
              <div>
                {typingUsers.map((user, index) => (
                  <div key={user}>
                    {user} is typing
                    {index < typingUsers.length - 1 ? "," : "..."}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PersonalChatMessages;