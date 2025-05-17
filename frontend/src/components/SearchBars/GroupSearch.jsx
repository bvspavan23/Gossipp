import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getGroupsAPI, getGroupByIdAPI } from "../../services/groups/groupServices";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch } from "react-icons/fi";

const GroupSearch = ({ isCollapsed }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchGroups = async () => {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
        return;
      }

      try {
        const allGroups = await getGroupsAPI();
        const filteredGroups = allGroups.filter(group =>
          group.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredGroups);
      } catch (error) {
        console.error("Error searching groups", error);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchGroups();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleGroupClick = (groupId) => {
    navigate(`/groups/${groupId}`);
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
          placeholder={isCollapsed ? "" : "Search groups..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          className={`w-full ${isCollapsed ? 'w-10 h-10 rounded-full' : 'pl-10 pr-4 py-2'} border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        />
      </div>

      <AnimatePresence>
        {isSearchFocused && searchResults.length > 0 && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-1 w-full left-4 right-4 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {searchResults.map((group) => (
              <div
                key={group._id}
                className="p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 flex items-center"
                onClick={() => handleGroupClick(group._id)}
              >
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  {group.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{group.name}</p>
                  <p className="text-xs text-gray-500 truncate">{group.description}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroupSearch;