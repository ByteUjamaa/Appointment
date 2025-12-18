import React, { useState, useEffect } from "react";
import ProfileForm from "../../components/ProfileForm";
import ChangePassword from "../../components/ChangePassword";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  // Fetch profile data
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      
      if (!token) {
        setError("Please login first");
        setProfile(getEmptyProfile());
        return;
      }

      // Use correct endpoint with /api/
      const response = await fetch('http://localhost:8000/api/accounts/profile/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Extract from nested user object or flat structure
        const flattenedData = {
          first_name: data.user?.first_name || data.first_name || "",
          last_name: data.user?.last_name || data.last_name || "",
          email: data.user?.email || data.email || "",
          phone: data.phone || "",
          course: data.course || "",
          year_of_study: data.year_of_study || "",
          username: data.user?.username || data.username || ""
        };
        
        setProfile(flattenedData);
        setError("");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || `Server error: ${response.status}`);
      }
      
    } catch (err) {
      console.error("Fetch profile error:", err);
      setError(err.message);
      setProfile(getEmptyProfile());
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedData) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      
      if (!token) {
        alert("Please login first");
        return;
      }

      const response = await fetch('http://localhost:8000/api/accounts/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Extract from nested user object or flat structure
        const flattenedData = {
          first_name: data.user?.first_name || data.first_name || "",
          last_name: data.user?.last_name || data.last_name || "",
          email: data.user?.email || data.email || "",
          phone: data.phone || "",
          course: data.course || "",
          year_of_study: data.year_of_study || "",
          username: data.user?.username || data.username || ""
        };
        
        setProfile(flattenedData);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || 'Update failed');
      }
    } catch (err) {
      console.error("Save error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const getEmptyProfile = () => ({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    course: "",
    year_of_study: "",
    username: ""
  });

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
        <button 
          onClick={fetchProfile}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <ProfileForm 
        initialData={profile}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-lg">
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            Note: {error}
          </div>
        )}
        
        <div className="flex justify-between items-center mb-6">
          <div className="text-center flex-1">
            <div className="text-purple-600 text-5xl mb-2">👤</div>
            <h2 className="text-2xl font-bold">Student Profile</h2>
            <p className="text-gray-500 text-sm">View your profile details</p>
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

        <div className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">First Name</label>
              <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                {profile.first_name || "-"}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Last Name</label>
              <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                {profile.last_name || "-"}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-500 mb-1">Email</label>
            <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
              {profile.email || "-"}
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-500 mb-1">Phone</label>
            <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
              {profile.phone || "-"}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Course</label>
              <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                {profile.course || "-"}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Year of Study</label>
              <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                {profile.year_of_study ? `Year ${profile.year_of_study}` : "-"}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
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

export default Profile;