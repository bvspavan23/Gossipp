import { useEffect, useState } from "react";
import { FiUsers, FiMenu, FiX, FiChevronDown, FiChevronRight, FiUser, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../redux/slice/authSlice";
import { getGroupsAPI } from "../../services/groups/groupServices";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdAdd } from "react-icons/io";
import { useSelector } from "react-redux";

const Sidebar = ({ onGroupSelect }) => {
  const [groupsData, setGroupsData] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [isMobileOpen, setIsMobileOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isAdmin = true;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const Profile=useSelector((state) => state.user?.user);
  console.log("PROFILE FROM SIDE BAR:", Profile);
  
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  console.log("ACCOUNT INFO", userInfo);
  console.log("USER:",userInfo.user.username);
  
  const profilePic = userInfo?.user.profilePic || "https://via.placeholder.com/40";

  const CreateGroup = () => {
    navigate("/create-group");
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    dispatch(logoutAction());
    navigate("/");
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getGroupsAPI();
        setGroupsData(data);
        const initialExpandedState = data.reduce((acc, group) => {
          acc[group._id] = false;
          return acc;
        }, {});
        setExpandedGroups(initialExpandedState);
      } catch (error) {
        console.error("Error fetching groups", error);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Sidebar container */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ 
          x: window.innerWidth < 768 ? (isMobileOpen ? 0 : '-100%') : 0,
          opacity: 1
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed md:relative z-40 flex flex-col h-screen bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 ${
          isCollapsed ? 'w-20' : 'w-64 lg:w-72'
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center space-x-2 overflow-hidden"
          >
            <FiUsers className="text-blue-500 text-2xl flex-shrink-0" />
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-bold text-gray-800 whitespace-nowrap"
              >
                Gossipp
              </motion.span>
            )}
          </motion.div>
          
          {/* Collapse/expand button (desktop) */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:block p-1 hover:bg-gray-100 rounded-full transition"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <FiChevronRight className="text-gray-600 text-xl" />
            ) : (
              <FiChevronDown className="text-gray-600 text-xl transform rotate-90" />
            )}
          </motion.button>
          {/* Close button (mobile) */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1 hover:bg-gray-100 rounded-full transition"
          >
            <FiX className="text-gray-600 text-xl" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 mb-16 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {groupsData.length > 0 ? (
            groupsData.map((group) => (
              <motion.div
                key={group._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="rounded-lg overflow-hidden shadow-sm"
              >
                <div 
                  className="p-3 bg-white border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => {
                    toggleGroup(group._id);
                    if (onGroupSelect) {
                      onGroupSelect({
                        name: group.name,
                        description: group.description,
                        _id: group._id
                      });
                    }
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className={`flex-1 min-w-0 ${isCollapsed ? 'text-center' : ''}`}>
                      {isCollapsed ? (
                        <div className="flex justify-center">
                          <span className="font-semibold text-gray-800 text-lg">
                            {group.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-800 truncate">
                            {group.name}
                          </span>
                          {expandedGroups[group._id] ? (
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
                    {expandedGroups[group._id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-50 border-l border-r border-b border-gray-200"
                      >
                        <div className="p-3">
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {group.description}
                          </p>
                          <div className="flex justify-between items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/groups/${group._id}`);
                              }}
                              className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition flex-1"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            ))
          ) : (
            !isCollapsed && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-400 py-4"
              >
                No groups available
              </motion.p>
            )
          )}
        </div>
        <motion.div 
          whileHover={{ backgroundColor: 'rgba(254, 226, 226, 0.5)' }}
          className="p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0"
        >
          <button
            onClick={CreateGroup}
            className={`flex items-center justify-center space-x-2 text-blue-500 hover:text-green-700 transition-colors w-full p-2 rounded-md hover:bg-red-50 ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <IoMdAdd className="text-xl" />
            {!isCollapsed && <span className="font-medium">Create Group</span>}
          </button>
        </motion.div>
        <motion.div 
          className="p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0"
        >
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
                    {userInfo?.user.username || "User"}
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
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsProfileOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-3 text-left hover:bg-gray-50 text-red-500"
                  >
                    <FiLogOut className="text-red-500" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
      {/* Mobile menu toggle button (only visible on mobile) */}
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

export default Sidebar;