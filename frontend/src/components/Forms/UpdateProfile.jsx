import React, { useEffect, useState } from "react";
import { ProfileAPI } from "../../services/users/userService";
import { useNavigate } from "react-router-dom";
import { UpdateProfileAPI } from "../../services/users/userService";
import AlertMessage from "../Alert/AlertMessage";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const EditProfileForm = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    profilepic: "",
    profilepicFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userProfile = await ProfileAPI();
        setUser(userProfile);
        setFormData({
          username: userProfile.username,
          email: userProfile.email,
          profilepic: userProfile.profilepic,
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
        setAlert({
          type: "error",
          message: "Failed to load profile data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
  
    if (name === "profilepic" && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        profilepic: URL.createObjectURL(file),
        profilepicFile: file,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
  
    const form = new FormData();
    form.append("username", formData.username);
    form.append("email", formData.email);
  
    if (formData.profilepicFile) {
      form.append("profilePic", formData.profilepicFile);
    }
  
    try {
      const updatedData = await UpdateProfileAPI(form);
      setAlert({
        type: "success",
        message: "Profile updated successfully!",
      });
      // Navigate after a short delay to show the success message
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      console.error("Failed to update profile", error);
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-start mb-4">
          <button
            onClick={() => navigate("/Gossipp/chats")}
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Chats
          </button>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          Edit Profile
        </h2>
        {alert && (
          <div className="mb-6">
            <AlertMessage type={alert.type} message={alert.message} />
          </div>
        )}
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {loading ? (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <AiOutlineLoading3Quarters className="animate-spin text-blue-600 text-2xl" />
                  </div>
                ) : (
                  <>
                    <img
                      src={formData.profilepic || "https://via.placeholder.com/150"}
                      alt="Profile preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow-md"
                    />
                    {formData.profilepic && (
                      <div className="absolute inset-0 rounded-full bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white text-sm font-medium">Change</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              <label className={`cursor-pointer ${loading ? 'bg-indigo-400' : 'bg-indigo-600'} text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 transition duration-300`}>
                <span>Upload New Photo</span>
                <input
                  type="file"
                  name="profilepic"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                  disabled={loading}
                />
              </label>
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center">
                    <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileForm;