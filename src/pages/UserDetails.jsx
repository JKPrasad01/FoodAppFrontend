import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiCamera,
  FiEdit,
  FiX,
  FiCheck,
} from "react-icons/fi";

import InputBox from "../components/InputBox";
import Button from "../components/Button";

export default function UserDetails({ user, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(user.userProfile || null);

  // Sync when user updates
  useEffect(() => {
    setFormData({ ...user });
    setPreviewImage(user.userProfile || null);
    setProfileImageFile(null);
  }, [user]);


  // ------------------------------------
  // Handlers
  // ------------------------------------
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setProfileImageFile(null);
    setFormData((prev) => ({ ...prev, userProfile: "" }));
  };

  const handleSave = () => {
    const cleanData = {
      username: formData.username || user.username,
      userEmail: formData.userEmail || user.userEmail,
      contactNumber:
        formData.contactNumber !== "" &&
        formData.contactNumber !== null &&
        formData.contactNumber !== undefined
          ? Number(formData.contactNumber)
          : user.contactNumber,
      address: formData.address ?? user.address,
      bio: formData.bio ?? user.bio,
      userProfile: previewImage, // final base64 value
    };

    if (profileImageFile) {
      const reader = new FileReader();
      reader.onloadend = () =>
        onUpdate({ ...cleanData, userProfile: reader.result });
      reader.readAsDataURL(profileImageFile);
    } else {
      onUpdate(cleanData);
    }

    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({ ...user });
    setPreviewImage(user.userProfile || null);
    setProfileImageFile(null);
  };

  // ------------------------------------
  // UI
  // ------------------------------------

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <div className="flex flex-col md:flex-row gap-8">

        {/* PROFILE IMAGE */}
        <div className="flex flex-col items-center md:w-1/3">
          <div className="relative">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-indigo-100 shadow-lg">
              {previewImage ? (
                <img src={previewImage} className="w-full h-full object-cover" />
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
                  className="absolute bottom-4 right-4 bg-indigo-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-indigo-700"
                >
                  <FiCamera size={20} />
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
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    onClick={handleRemoveImage}
                  >
                    <FiX size={18} />
                  </button>
                )}
              </>
            )}
          </div>

          <div className="mt-6 text-center">
            {isEditing ? (
              <InputBox
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            ) : (
              <h2 className="text-2xl font-bold">{user.username}</h2>
            )}

            {isEditing ? (
              <InputBox
                label="Email"
                name="userEmail"
                type="email"
                value={formData.userEmail}
                onChange={handleChange}
              />
            ) : (
              <p className="mt-2 flex items-center justify-center text-gray-600">
                <FiMail className="mr-2" /> {user.userEmail}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Profile Information</h2>

            {!isEditing ? (
              <Button variant="primary" fullWidth={false} onClick={() => setIsEditing(true)}>
                <FiEdit /> Edit Profile
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button variant="secondary" fullWidth={false} onClick={cancelEdit}>
                  <FiX /> Cancel
                </Button>

                <Button variant="primary" fullWidth={false} onClick={handleSave}>
                  <FiCheck /> Save
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
            <InputBox
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <InputBox
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <InputBox
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoBox title="Account Created" value={user.createdDate} />
              <InfoBox title="Last Updated" value={user.lastUpdateTime} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function InfoBox({ title, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-semibold text-gray-700">{title}</h4>
      <p className="text-gray-600">{value}</p>
    </div>
  );
}
