import { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getConnectionsAPI } from "../../services/connections/connectionServices";
import SidebarHeader from "./SidebarHeader";
import LogoutButton from "./Logout";
import ProfileSection from "./ProfileSection";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import Shift from "./Shift";
import UserSearch from "../SearchBars/UserSearch";

const generateChatId = (userId1, userId2) => {
  // Sort the IDs to ensure consistent chat ID regardless of order
  const sortedIds = [userId1, userId2].map((id) => id.toString()).sort();
  return `${sortedIds[0]}_${sortedIds[1]}`;
};

const PersonalSideBar = () => {
  const [usersData, setUsersData] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedUsers, setExpandedUsers] = useState({});
  const [isMobileOpen, setIsMobileOpen] = useState(true);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const currentUserId = userInfo?.user?._id;
  const profilePic =
    userInfo?.user.profilePic ||
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  const fetchUsers = async () => {
    try {
      const data = await getConnectionsAPI();
      setUsersData(data.filter((user) => user._id !== currentUserId));
      const initialExpandedState = data.reduce((acc, user) => {
        acc[user._id] = false;
        return acc;
      }, {});
      setExpandedUsers(initialExpandedState);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleUserClick = (userId) => {
    const chatId = generateChatId(currentUserId, userId);
    navigate(`/Gossipp/connections/${chatId}/${userId}`);
  };

  const AddConnection = () => {
    navigate("/add-connection");
  };

  const toggleUser = (userId) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <motion.div
        initial={{ x: "-100%" }}
        animate={{
          x: window.innerWidth < 768 ? (isMobileOpen ? 0 : "-100%") : 0,
          opacity: 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed md:relative z-40 flex flex-col h-screen bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 ${
          isCollapsed ? "w-20" : "w-64 lg:w-72"
        }`}
      >
        <SidebarHeader
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        <UserSearch isCollapsed={isCollapsed} />
        
        <Shift
          name="Go to Group Chats"
          path="/Gossipp/chats"
          isCollapsed={isCollapsed}
        />
        <div className="flex-1 overflow-y-auto p-4 mb-16 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {usersData.length > 0
            ? usersData.map((user) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="rounded-lg overflow-hidden shadow-sm"
                >
                  <div
                    className="p-3 bg-white border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => {
                      toggleUser(user._id);
                      handleUserClick(user._id);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div
                        className={`flex-1 min-w-0 ${
                          isCollapsed ? "text-center" : ""
                        }`}
                      >
                        {isCollapsed ? (
                          <div className="flex justify-center">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                              <img
                                src={user.profilePic || profilePic}
                                alt="User"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                                <img
                                  src={user.profilePic || profilePic}
                                  alt="User"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="font-semibold text-gray-800 truncate">
                                {user.username}
                              </span>
                            </div>
                            {expandedUsers[user._id] ? (
                              <FiChevronDown className="text-gray-500 flex-shrink-0" />
                            ) : (
                              <FiChevronRight className="text-gray-500 flex-shrink-0" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {!isCollapsed && (
                    <AnimatePresence>
                      {expandedUsers[user._id] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-gray-50 border-l border-r border-b border-gray-200"
                        >
                          <div className="p-3">
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {user.email}
                            </p>
                            <div className="flex justify-between items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUserClick(user._id);
                                }}
                                className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition flex-1"
                              >
                                Message
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </motion.div>
              ))
            : !isCollapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-400 py-4"
                >
                  No connections available
                </motion.p>
              )}
        </div>

        <motion.div
          whileHover={{ backgroundColor: "rgba(254, 226, 226, 0.5)" }}
          className="p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0"
        >
          <button
            onClick={AddConnection}
            className={`flex items-center justify-center space-x-2 text-blue-500 hover:text-green-700 transition-colors w-full p-2 rounded-md hover:bg-red-50 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <IoMdAdd className="text-xl" />
            {!isCollapsed && (
              <span className="font-medium">Add Connection</span>
            )}
          </button>
        </motion.div>
        <ProfileSection
          isCollapsed={isCollapsed}
          profilePic={profilePic}
          username={userInfo?.user.username}
          LogoutComponent={LogoutButton}
        />
      </motion.div>
      {/* Mobile menu toggle button */}
      {!isMobileOpen && (
        <motion.button
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FiMenu size={24} />
        </motion.button>
      )}
    </>
  );
};

export default PersonalSideBar;
