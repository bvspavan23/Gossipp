import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGroupAPI } from "../../services/groups/groupServices";

const GroupForm = () => {
  const [formData, setFormData] = useState({
    name: "", 
    description: "",
    profilepic: "", // preview URL
    profilepicFile: null, 
  });

  const navigate = useNavigate();
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

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    if (formData.profilepicFile) {
      form.append("profilePic", formData.profilepicFile); 
    }

    try {
      const response = await createGroupAPI(form);
      console.log("Group created:", response);
      // dispatch()
      navigate("/Gossipp/chats"); 
    } catch (error) {
      console.error("Failed to create group", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          Create Group
        </h2>

        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
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
              </div>

              <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 transition duration-300">
                <span>Upload Photo</span>
                <input
                  type="file"
                  name="profilepic"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Group Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Group Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                id="description"
                name="description"
                type="text"
                required
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create Group
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GroupForm;
