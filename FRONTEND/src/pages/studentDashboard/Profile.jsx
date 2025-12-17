
import React, { useState, useEffect } from "react";
import ProfileForm from "../../components/ProfileForm";
import ChangePassword from "../../components/ChangePassword";
import api from "../../api";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  // Fetch profile data on component mount
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
      // Fallback to mock data if API fails
      setProfile({
        title:"",
        first_name: "",
        last_name:"",
        username: "",
        email: "",
        phone: "",
        major: "",
        academic_year: ""
      });
    } finally {
      setLoading(false);
    }
  };
const handleSave = async (updatedData) => {
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
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <ProfileForm 
        role="student"
        initialData={profile}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-lg">
        
        <div className="flex justify-between items-center mb-6">
          <div className="text-center flex-1">
            <div className="text-purple-600 text-5xl mb-2">👤</div>
            <h2 className="text-2xl font-bold">Profile Information</h2>
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
            <div><label className="block text-sm text-gray-500 mb-1">Title</label><div className="border border-gray-300 rounded-lg p-3 bg-gray-50">{profile.title}</div></div>
            <div><label className="block text-sm text-gray-500 mb-1">First Name</label><div className="border border-gray-300 rounded-lg p-3 bg-gray-50">{profile.first_name}</div></div>
            <div><label className="block text-sm text-gray-500 mb-1">Last Name</label><div className="border border-gray-300 rounded-lg p-3 bg-gray-50">{profile.last_name}</div></div>

            <div><label className="block text-sm text-gray-500 mb-1">Username</label><div className="border border-gray-300 rounded-lg p-3 bg-gray-50">{profile.username}</div></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm text-gray-500 mb-1">Email</label><div className="border border-gray-300 rounded-lg p-3 bg-gray-50">{profile.email}</div></div>
            <div><label className="block text-sm text-gray-500 mb-1">Phone</label><div className="border border-gray-300 rounded-lg p-3 bg-gray-50">{profile.phone}</div></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm text-gray-500 mb-1">Major</label><div className="border border-gray-300 rounded-lg p-3 bg-gray-50">{profile.major}</div></div>
            <div><label className="block text-sm text-gray-500 mb-1">Academic Year</label><div className="border border-gray-300 rounded-lg p-3 bg-gray-50">Year {profile.academic_year}</div></div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button 
            onClick={() => setShowChangePassword(true)}
            className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Change Password
          </button>
          
          {/* Optional: Add a button to check profile access */}
          <button 
            onClick={async () => {
              try {
                const response = await fetch('/accounts/check-profile-access/', {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
                });
                const data = await response.json();
                alert(`Profile access: ${data.has_access ? 'Granted' : 'Denied'}`);
              } catch (err) {
                alert('Error checking access');
              }
            }}
            className="w-full border border-gray-600 text-gray-600 py-3 rounded-lg hover:bg-gray-50 transition"
          >
            Check Profile Access
          </button>
        </div>
      </div>

      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  );
};

export default Profile;