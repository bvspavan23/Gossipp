import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Shift = ({ name, path, isCollapsed }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.5)' }}
      className="p-4 border-b border-gray-200"
    >
      <button
        onClick={() => navigate(path)}
        className={`flex items-center justify-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors w-full p-2 rounded-md hover:bg-gray-100 ${
          isCollapsed ? 'justify-center' : ''
        }`}
      >
        {isCollapsed ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{name}</span>
          </>
        )}
      </button>
    </motion.div>
  );
};

export default Shift;