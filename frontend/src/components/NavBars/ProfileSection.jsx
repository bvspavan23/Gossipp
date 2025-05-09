import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ProfileSection = ({ isCollapsed, profilePic, username, LogoutComponent }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div className="p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0">
      <div className="relative">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={`flex items-center justify-center space-x-2 w-full p-2 rounded-md hover:bg-gray-100 transition-colors ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
              <img 
                src={profilePic} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            {!isCollapsed && (
              <span className="font-medium text-gray-700 truncate max-w-[120px]">
                {username || "User"}
              </span>
            )}
          </div>
          {!isCollapsed && (
            <FiChevronDown className={`text-gray-500 transition-transform ${isProfileOpen ? 'transform rotate-180' : ''}`} />
          )}
        </button>
        <AnimatePresence>
          {isProfileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`absolute bg-white rounded-md shadow-lg overflow-hidden z-50 ${
                isCollapsed ? 'left-14 bottom-14 w-40' : 'left-0 bottom-14 w-full'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  navigate("/profile");
                  setIsProfileOpen(false);
                }}
                className="flex items-center space-x-2 w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-700"
              >
                <FiUser className="text-gray-500" />
                <span>View Profile</span>
              </button>
              <LogoutComponent setIsProfileOpen={setIsProfileOpen} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProfileSection;