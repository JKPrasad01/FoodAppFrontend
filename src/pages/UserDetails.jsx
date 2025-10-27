import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiCamera,
  FiEdit,
  FiX,
  FiCheck,
} from "react-icons/fi";

export default function UserDetails({ user, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Update formData if the user prop changes
  useEffect(() => {
    setFormData({ ...user });
    setPreviewImage(user.userProfile);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);

      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick = () => {
    // Convert image to base64 if a new one was selected
    if (profileImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        const updatedUser = { ...formData, userProfile: base64String };
        onUpdate(updatedUser);
        setIsEditing(false);
      };
      reader.readAsDataURL(profileImage);
    } else {
      onUpdate(formData);
      setIsEditing(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({ ...user });
    setPreviewImage(user.userProfile);
    setProfileImage(null);
  };

  const removeProfileImage = () => {
    setPreviewImage(null);
    setProfileImage(null);
    setFormData((prev) => ({ ...prev, userProfile: "" }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center md:w-1/3">
          <div className="relative">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-indigo-100 shadow-lg">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <FiUser className="text-gray-400 text-6xl" />
                </div>
              )}
            </div>

            {isEditing && (
              <>
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-4 right-4 bg-indigo-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-indigo-700 transition"
                >
                  <FiCamera className="text-xl" />
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {previewImage && (
                  <button
                    onClick={removeProfileImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                  >
                    <FiX className="text-lg" />
                  </button>
                )}
              </>
            )}
          </div>

          <div className="mt-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? (
                <input
                  name="username"
                  value={formData.username || ""}
                  onChange={handleChange}
                  className="text-center bg-indigo-50 rounded-lg px-4 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Your Name"
                />
              ) : (
                <span>{user.username}</span>
              )}
            </h2>

            {isEditing ? (
              <input
                name="userEmail"
                type="email"
                value={formData.userEmail || ""}
                onChange={handleChange}
                className="mt-2 text-gray-600 bg-indigo-50 rounded-lg px-4 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your Email"
              />
            ) : (
              <p className="mt-2 text-gray-600 flex items-center justify-center">
                <FiMail className="mr-2" /> {user.userEmail}
              </p>
            )}
          </div>
        </div>

        {/* User Details Section */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Profile Information
            </h2>
            {!isEditing ? (
              <button
                onClick={handleEditClick}
                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                <FiEdit className="mr-2" /> Edit Profile
              </button>
            ) : (
              <div className="space-x-3">
                <button
                  onClick={handleCancelClick}
                  className="flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  <FiX className="mr-2" /> Cancel
                </button>
                <button
                  onClick={handleUpdateClick}
                  className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <FiCheck className="mr-2" /> Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
            {/* Contact Number */}
            <div className="border-b pb-4 border-gray-200">
              <div className="flex items-center mb-2">
                <FiPhone className="text-indigo-600 mr-2" />
                <label className="block font-semibold text-gray-700">
                  Contact Number:
                </label>
              </div>
              {isEditing ? (
                <input
                  name="contactNumber"
                  value={formData.contactNumber || ""}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your phone number"
                />
              ) : (
                <p className="text-gray-800">
                  {user.contactNumber || "Not provided"}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center mb-2">
                <FiHome className="text-indigo-600 mr-2" />
                <label className="block font-semibold text-gray-700">
                  Address:
                </label>
              </div>
              {isEditing ? (
                <textarea
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your full address"
                />
              ) : (
                <p className="text-gray-800 whitespace-pre-line">
                  {user.address || "Not provided"}
                </p>
              )}
            </div>

            {/* Bio */}
            <div>
              <div className="flex items-center mb-2">
                <FiUser className="text-indigo-600 mr-2" />
                <label className="block font-semibold text-gray-700">
                  Bio:
                </label>
              </div>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio || ""}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-800">{user.bio || "No bio provided"}</p>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">
                  Account Created
                </h4>
                <p className="text-gray-600">{user.createdDate}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">
                  Last Updated
                </h4>
                <p className="text-gray-600">{user.lastUpdateTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
