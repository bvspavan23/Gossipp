import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ProfileAPI } from "../../services/users/userService";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const localUser = userInfo?.user?._id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setUser(null); 
        const userProfile = await ProfileAPI();
        console.log("USER PROFILE", userProfile);
        setUser(userProfile);
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };

    if (localUser) {
      fetchProfile(); 
    }
  }, [localUser]);

  if (!user) return <p className="text-center mt-6">No profile data available.</p>;

  const UpdateProfile = () => {
    navigate("/update-profile");
  };

  const ViewConnections = () => {
    navigate("/connections");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

        {/* Profile Picture */}
        <div className="relative w-32 h-32 rounded-full border-4 border-indigo-100 shadow-lg mb-6 overflow-hidden">
          <img
            src={user.profilepic}
            alt="Profile"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-indigo-50 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
        </div>

        {/* User Info */}
        <div className="w-full text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
          <p className="text-gray-600 mb-4">{user.email}</p>

          {/* Example Stats */}
          <div className="flex justify-center space-x-6 mb-6">
            <div className="text-center">
              <p className="font-bold text-gray-800">120</p>
              <p className="text-sm text-gray-500">Connections</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-800">45</p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 w-full justify-center">
          <button
            onClick={UpdateProfile}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-md"
          >
            Edit Profile
          </button>
          <button
            onClick={ViewConnections}
            className="px-6 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-300 shadow-md"
          >
            View Connections
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
