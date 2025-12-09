import React, { useState } from "react";
import ProfileForm from "../../components/ProfileForm";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock data
  const profile = {
    full_name: "Zakia Naswabu",
    username: "Empress",
    email: "empress@example.com",
    phone: "+255 712 345 678",
    major: "ISM",
    academic_year: "3"
  };

  // If editing, show the ProfileForm
  if (isEditing) {
    return <ProfileForm role="student" mode="edit" />;
  }

  // View mode
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-lg">
        
        {/* Header with Edit Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-center flex-1">
            <div className="text-purple-600 text-5xl mb-2">👤</div>
            <h2 className="text-2xl font-bold">Profile Information</h2>
            <p className="text-gray-500 text-sm">
              View your profile details
            </p>
          </div>
          
          <button
            onClick={() => setIsEditing(true)}
            className="ml-4 p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition"
            title="Edit Profile"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Full Name</label>
              <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                {profile.full_name}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Username</label>
              <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                {profile.username}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Email</label>
              <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                {profile.email}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Phone</label>
              <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                {profile.phone}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Major</label>
              <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                {profile.major}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Academic Year</label>
              <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                Year {profile.academic_year}
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button 
          onClick={() => window.history.back()}
          className="mt-6 w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
};

export default Profile;