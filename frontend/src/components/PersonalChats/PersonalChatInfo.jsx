import { motion } from "framer-motion";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AlertMessage from "../Alert/AlertMessage";
const PersonalChatInfo = ({
  userName,
  bio,
  profilePic,
  isOnline
}) => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto p-4"
    >
      <div className="flex flex-col items-center mb-6">
        {alert && (
          <div className="mb-4 w-full max-w-md">
            <AlertMessage type={alert.type} message={alert.message} />
          </div>
        )}

        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4 overflow-hidden">
          <img
            src={profilePic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl font-bold text-gray-800 text-center">
          {userName}
        </h2>
        <p className="text-gray-600 text-center mt-2 mb-6 px-4">
          {bio || "No bio available"}
        </p>

        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="font-medium">Status</span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              isOnline ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
            }`}>
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalChatInfo;