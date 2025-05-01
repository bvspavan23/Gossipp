import { motion } from "framer-motion";

const ChatInfo = ({ 
  groupName, 
  description, 
  members, 
  onlineUsersInRoom 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto p-4"
    >
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <span className="text-2xl text-blue-600 font-bold">
            {groupName?.charAt(0)}
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 text-center">
          {groupName}
        </h2>
        <p className="text-gray-600 text-center mt-2 mb-6 px-4">
          {description}
        </p>

        <div className="w-full max-w-md mx-auto">
          <h3 className="font-semibold text-gray-700 mb-3">
            Members ({members.length})
          </h3>
          <div className="space-y-3">
            {members.map((member) => {
              const isOnline = onlineUsersInRoom.includes(member._id);
              return (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isOnline
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {member.username.charAt(0)}
                    </div>
                    <span className="font-medium">
                      {member.username}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      isOnline
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatInfo;