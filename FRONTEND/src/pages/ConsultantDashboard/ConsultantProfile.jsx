import React, { useState, useEffect } from "react";
import ProfileForm from "../../components/ProfileForm";
import ChangePassword from "../../components/ChangePassword";

const ConsultantProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [availabilityOptions, setAvailabilityOptions] = useState([]);

  // Day mapping
  const dayMapping = {
    'mon': 'Monday', 'tue': 'Tuesday', 'wed': 'Wednesday',
    'thu': 'Thursday', 'fri': 'Friday', 'sat': 'Saturday'
  };

  const reverseDayMapping = {
    'Monday': 'mon', 'Tuesday': 'tue', 'Wednesday': 'wed',
    'Thursday': 'thu', 'Friday': 'fri', 'Saturday': 'sat'
  };

  useEffect(() => { 
    fetchAvailabilityOptions();
    fetchProfile();
  }, []);

  // Fetch availability options from backend
  const fetchAvailabilityOptions = async () => {
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      const endpoints = [
        'http://localhost:8000/api/availability/',
      ];
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': token ? `Bearer ${token}` : ''
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setAvailabilityOptions(data);
            return;
          }
        } catch (err) {
          continue;
        }
      }
      
      // Fallback to default days
      const defaultDays = [
        { id: 1, day: 'mon', display_name: 'Monday' },
        { id: 2, day: 'tue', display_name: 'Tuesday' },
        { id: 3, day: 'wed', display_name: 'Wednesday' },
        { id: 4, day: 'thu', display_name: 'Thursday' },
        { id: 5, day: 'fri', display_name: 'Friday' },
        { id: 6, day: 'sat', display_name: 'Saturday' }
      ];
      setAvailabilityOptions(defaultDays);
      
    } catch (err) {
      console.error('Error fetching availability:', err);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      if (!token) { setError("Please login"); setProfile(getEmptyProfile()); return; }

      const response = await fetch('http://localhost:8000/api/accounts/profile/', {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Process available days
        let availabilityDisplay = [];
        let availabilityDayCodes = [];
        
        if (data.available_days && Array.isArray(data.available_days)) {
          if (data.available_days.length > 0) {
            const firstItem = data.available_days[0];
            
            // Display names from serializer ['Monday', 'Tuesday']
            if (typeof firstItem === 'string' && firstItem.length > 3) {
              availabilityDisplay = data.available_days;
              // Convert to day codes
              availabilityDayCodes = data.available_days.map(dayName => {
                const foundDay = Object.entries(dayMapping).find(([code, name]) => name === dayName);
                return foundDay ? foundDay[0] : dayName.toLowerCase().slice(0, 3);
              });
            }
            // Day codes ['mon', 'tue']
            else if (typeof firstItem === 'string') {
              availabilityDayCodes = data.available_days;
              availabilityDisplay = data.available_days.map(code => dayMapping[code] || code);
            }
            // Objects with day property [{id: 1, day: 'mon'}, ...]
            else if (typeof firstItem === 'object' && firstItem.day) {
              availabilityDayCodes = data.available_days.map(item => item.day);
              availabilityDisplay = data.available_days.map(item => dayMapping[item.day] || item.day);
            }
          }
        }
        
        setProfile({
          title: data.title || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          Availability: availabilityDisplay,
          availability_day_codes: availabilityDayCodes,
          username: data.username || "",
        });
        setError("");
      } else {
        setError(`Error: ${response.status}`);
      }
    } catch (err) {
      setError(err.message);
      setProfile(getEmptyProfile());
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      if (!token) { alert("Please login"); return; }

      // Extract from ProfileForm
      const firstName = updatedData.user?.first_name || "";
      const lastName = updatedData.user?.last_name || "";
      const email = updatedData.user?.email || "";

      if (!firstName || !lastName || !email) {
        throw new Error("First name, last name, and email are required");
      }

      // Get selected days from form
      const selectedDayCodes = updatedData.available_days_input || [];
      
      // Prepare data for backend
      const backendData = {
        title: updatedData.title || "",
        phone: updatedData.phone || "",
        first_name: firstName,
        last_name: lastName,
        email: email,
        available_days_input: selectedDayCodes
      };

      const response = await fetch('http://localhost:8000/api/accounts/profile/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(backendData)
      });

      const responseData = await response.json();
      
      if (response.ok) {
        // Update local state with selected days
        const displayDays = selectedDayCodes.map(day => dayMapping[day] || day);
        
        setProfile(prev => ({
          ...prev,
          title: updatedData.title || "",
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: updatedData.phone || "",
          Availability: displayDays,
          availability_day_codes: selectedDayCodes
        }));
        
        alert("Profile updated successfully!");
        setIsEditing(false);
        fetchProfile();
      } else {
        throw new Error(responseData.detail || 'Update failed');
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
      throw err;
    }
  };

  const handleCancelEdit = () => setIsEditing(false);
  
  const getEmptyProfile = () => ({ 
    title: "", first_name: "", last_name: "", email: "", 
    phone: "", Availability: [], availability_day_codes: [], username: "" 
  });

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-lg">
        {error && <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-lg text-sm">{error}</div>}
        
        <div className="flex justify-between items-center mb-6">
          <div className="text-center flex-1">
            <div className="text-purple-600 text-5xl mb-2">👨‍🏫</div>
            <h2 className="text-2xl font-bold">Consultant Profile</h2>
          </div>
          <button onClick={() => setIsEditing(true)} className="ml-4 p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Title</label>
            <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
              {profile?.title || "-"}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">First Name</label>
              <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                {profile?.first_name || "-"}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Last Name</label>
              <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                {profile?.last_name || "-"}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Email</label>
              <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                {profile?.email || "-"}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Phone</label>
              <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                {profile?.phone || "-"}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-500 mb-1">Availability</label>
            <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 min-h-[3rem]">
              {profile?.Availability && profile.Availability.length > 0 
                ? profile.Availability.join(", ") 
                : "Not specified"}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button onClick={() => setShowChangePassword(true)} className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition">
            Change Password
          </button>
        </div>
      </div>

      {showChangePassword && <ChangePassword onClose={() => setShowChangePassword(false)} />}
    </div>
  );
};

export default ConsultantProfile;