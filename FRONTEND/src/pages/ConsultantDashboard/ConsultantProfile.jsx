
import api from "../../api/axiosInstance";
import React, { useState, useEffect } from "react";
import ProfileForm from "../../components/ProfileForm";
import ChangePassword from "../../components/ChangePassword";

const ConsultantProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/accounts/profile/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (err) {
      setError(err.message);
      // Fallback data
      setProfile({
        full_name: "Dr. Jane Smith",
        username: "jsmith",
        email: "j.smith@university.edu",
        phone: "+255 712 987 654",
        consultation_days: ["Monday", "Wednesday", "Friday"]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (updatedData) => {
     try {
    const response = await api.put('/accounts/profile/', updatedData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        // 'Content-Type': 'application/json' is set automatically by Axios
      }
    });

    // Axios already parses JSON for you!
    const data = response.data;

    setProfile(data);
    setIsEditing(false);
    alert("Profile updated successfully!");

  } catch (err) {
    // Handle Axios errors properly
    const message = err.response?.data?.message 
      || err.response?.data?.detail 
      || err.message 
      || 'Failed to update profile';

    alert(`Error: ${message}`);
  }
};

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error && !profile) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">Error: {error}</div>;
  }

  if (isEditing) {
    return (
      <ProfileForm 
        role="teacher" 
        initialData={profile}
        onSave={handleSaveProfile}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-lg">
        
        <div className="flex justify-between items-center mb-6">
          <div className="text-center flex-1">
            <div className="text-purple-600 text-5xl mb-2">👤</div>
            <h2 className="text-2xl font-bold">Consultant Profile</h2>
            <p className="text-gray-500 text-sm">View your profile details</p>
          </div>
          
          <button
            onClick={() => setIsEditing(true)}
            className="ml-4 p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm text-gray-500 mb-1">Full Name</label><div className="border border-gray-300 rounded-lg p-3 bg-gray-50">{profile.full_name}</div></div>
            <div><label className="block text-sm text-gray-500 mb-1">Username</label><div className="border border-gray-300 rounded-lg p-3 bg-gray-50">{profile.username}</div></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm text-gray-500 mb-1">Email</label><div className="border border-gray-300 rounded-lg p-3 bg-gray-50">{profile.email}</div></div>
            <div><label className="block text-sm text-gray-500 mb-1">Phone</label><div className="border border-gray-300 rounded-lg p-3 bg-gray-50">{profile.phone}</div></div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Consultation Days</label>
            <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
              {profile.consultation_days ? profile.consultation_days.join(", ") : "Not specified"}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button 
            onClick={() => setShowChangePassword(true)}
            className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Change Password
          </button>
        </div>
      </div>

      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  );
};

export default ConsultantProfile;