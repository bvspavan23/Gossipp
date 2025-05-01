import { FiUsers, FiCircle } from "react-icons/fi";

const UsersList = ({ users }) => {
  return (
    <div className="h-full w-full border-l border-gray-200 bg-white relative overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-200 bg-white flex items-center sticky top-0 z-10 shadow-sm">
        <FiUsers className="text-blue-500 mr-2 text-xl" />
        <span className="text-lg font-bold text-gray-700">Members</span>
        <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          {users.length}
        </span>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user._id}>
              <div className="group relative flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="mr-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 truncate">{user.username}</p>
                </div>
                <div className="flex items-center bg-green-50 px-2 py-1 rounded-full">
                  <FiCircle className="text-green-400 text-xs mr-1" />
                  <span className="text-xs text-green-600 font-medium">online</span>
                </div>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-25 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersList;
