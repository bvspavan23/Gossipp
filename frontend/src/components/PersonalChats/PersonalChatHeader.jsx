import { FiMessageCircle, FiInfo, FiX } from "react-icons/fi";
const PersonalChatHeader = ({ userName, showUserInfo, toggleUserInfo }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="flex items-center space-x-3">
        <FiMessageCircle className="text-blue-500 text-2xl" />
        <div className="max-w-[90%]">
          <h1 className="text-lg font-bold text-gray-800 truncate">
            {userName}
          </h1>
          <p className="text-sm text-gray-500 truncate">{"Hey there! I'm using Gossipp"}</p>
        </div>
      </div>
      <button
        type="button"
        className="text-gray-400 hover:text-blue-500 cursor-pointer text-xl p-1"
        aria-label="Information"
        onClick={toggleUserInfo}
      >
        {showUserInfo ? <FiX /> : <FiInfo />}
      </button>
    </div>
  );
};

export default PersonalChatHeader;