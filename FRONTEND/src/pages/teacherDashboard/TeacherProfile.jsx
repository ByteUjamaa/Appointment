import React, { useState } from "react";
import ProfileForm from "../../components/ProfileForm";

const TeacherProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    full_name: "Jane Smith",
    username: "teacher",
    email: "teacher@university.edu",
    phone: "+1 (555) 111-0000"
  });

  const handleSave = (data) => {
    setProfile(data);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8">
        <ProfileForm 
          mode="edit" 
          role="teacher"
          onSubmit={handleSave}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Profile Information</h1>
          <p className="text-gray-600">View your profile details</p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Profile
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
              {profile.full_name}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
              {profile.username}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
              {profile.email}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
              {profile.phone}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;