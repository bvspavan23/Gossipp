import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getConnectionsAPI, getUserByIdAPI ,getUsersAPI} from "../../services/connections/connectionServices";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch } from "react-icons/fi";

const UserSearch = ({ isCollapsed }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const allConnections = await getUsersAPI();
        const filteredUsers = allConnections.filter(user =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredUsers);
      } catch (error) {
        console.error("Error searching users", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleUserClick = (userId) => {
    navigate(`/connections/${userId}`);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="relative px-4 py-2 border-b border-gray-200">
      <div className={`relative flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
        {!isCollapsed && (
          <FiSearch className="absolute left-3 text-gray-400" />
        )}
        <input
          type="text"
          placeholder={isCollapsed ? "" : "Search users..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          className={`w-full ${isCollapsed ? 'w-10 h-10 rounded-full' : 'pl-10 pr-4 py-2'} border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        />
      </div>

      <AnimatePresence>
        {isSearchFocused && (searchResults.length > 0 || isSearching) && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-1 w-full left-4 right-4 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {isSearching ? (
              <div className="p-3 flex justify-center">
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div
                  key={user._id}
                  className="p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 flex items-center"
                  onClick={() => handleUserClick(user._id)}
                >
                  <img 
                    src={user.profilePic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
                    alt={user.username}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-3 text-gray-500 text-center">No users found</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserSearch;