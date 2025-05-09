import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserByIdAPI } from "../../services/connections/connectionServices";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

const PersonInfo = () => {
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { userId } = useParams();
  console.log("USER ID FROM PERSONAL INFO COMPONENT", userId);
  
  const loggedInUser = JSON.parse(localStorage.getItem("userInfo"))?.user;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPersonInfo = async () => {
      try {
        setUser(null);
        const PersonInfo = await getUserByIdAPI(userId);
        console.log("USER PROFILE", PersonInfo);
        setUser(PersonInfo);
        // Check if the logged in user is in this user's connections
        if (PersonInfo?.connections?.includes(loggedInUser?._id)) {
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    };

    if (userId) {
      fetchPersonInfo();
    }
  }, [userId, loggedInUser?._id]);

  const handleConnection = async () => {
    try {
      setIsConnected(!isConnected);
    } catch (error) {
      console.error("Connection action failed:", error);
    }
  };

  if (!user) return <p className="text-center mt-6">Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">User Profile</h1>
        <div className="relative w-32 h-32 rounded-full border-4 border-indigo-100 shadow-lg mb-6 overflow-hidden">
          <img
            src={user.profilePic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
            alt="Profile"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-full text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
          <p className="text-gray-600 mb-2">{user.email}</p>
          {user.bio && <p className="text-gray-500 text-sm mt-2">{user.bio}</p>}
        </div>
        <div className="flex space-x-4 w-full justify-center">
          {loggedInUser?._id !== userId && (
            <button
              onClick={handleConnection}
              className={`px-6 py-2 rounded-lg transition-colors duration-300 shadow-md ${
                isConnected 
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {isConnected ? "Remove Connection" : "Connect"}
            </button>
          )}
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300 shadow-md"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonInfo;