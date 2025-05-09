import { motion } from "framer-motion";
import { FiUsers, FiChevronDown, FiChevronRight, FiX } from "react-icons/fi";

const SidebarHeader = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  return (
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
      <button
        onClick={() => setIsMobileOpen(false)}
        className="md:hidden p-1 hover:bg-gray-100 rounded-full transition"
      >
        <FiX className="text-gray-600 text-xl" />
      </button>
    </div>
  );
};

export default SidebarHeader;