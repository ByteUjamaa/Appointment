import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileForm from "./ProfileForm";
import ChangePassword from "./ChangePassword";

const FirstLoginProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const role = localStorage.getItem('user_role') || 'student';

  useEffect(() => {
    const firstLogin = localStorage.getItem('first_login') === 'true';
    if (!firstLogin) {
      navigate('/dashboard');
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/accounts/profile/', {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem('access_token');
      
      let backendData;
      if (role === 'student') {
        backendData = {
          first_name: updatedData.user?.first_name || "",
          last_name: updatedData.user?.last_name || "",
          email: updatedData.user?.email || "",
          phone: updatedData.phone || "",
          course: updatedData.course || "",
          year_of_study: updatedData.year_of_study || "",
          first_login: false
        };
      } else {
        backendData = {
          first_name: updatedData.user?.first_name || "",
          last_name: updatedData.user?.last_name || "",
          email: updatedData.user?.email || "",
          phone: updatedData.phone || "",
          title: updatedData.title || "",
          available_days: updatedData.available_days || [],
          first_login: false
        };
      }

      const response = await fetch('http://localhost:8000/api/accounts/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(backendData)
      });

      if (response.ok) {
        localStorage.setItem('first_login', 'false');
        alert("Profile updated! Now change your password.");
        setShowChangePassword(true);
      } else {
        throw new Error('Profile update failed');
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handlePasswordChangeComplete = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('first_login');
    alert("Profile updated! Please login again.");
    navigate('/login');
  };

  const handleCancel = () => {
    alert("Complete your profile first.");
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  if (showChangePassword) {
    return (
      <ChangePassword 
        onSuccess={handlePasswordChangeComplete}
        forceChange={true}
      />
    );
  }

  return (
    <ProfileForm 
      role={role === 'student' ? 'student' : 'teacher'}
      initialData={profile}
      onSave={handleSaveProfile}
      onCancel={handleCancel}
      isFirstLogin={true}
    />
  );
};

export default FirstLoginProfile;