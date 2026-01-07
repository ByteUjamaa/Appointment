import React, { useState, useEffect } from "react";
import ProfileForm from "../../components/ProfileForm";
import ChangePassword from "../../components/ChangePassword";

const ConsultantProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [availabilityOptions, setAvailabilityOptions] = useState([]); // Store with IDs

  useEffect(() => { 
    fetchProfile();
    // Try to fetch availability options if endpoint exists
    // fetchAvailabilityOptions();
  }, []);

  // Try different endpoints for availability
  const fetchAvailabilityOptions = async () => {
    const endpoints = [
      'http://localhost:8000/api/availability/',
      'http://localhost:8000/api/availabilities/',
      'http://localhost:8000/api/days/',
      'http://localhost:8000/api/available-days/'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const token = localStorage.getItem('access_token') || localStorage.getItem('token');
        const response = await fetch(endpoint, {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Availability options found at', endpoint, ':', data);
          setAvailabilityOptions(data);
          return;
        }
      } catch (err) {
        // Continue to next endpoint
      }
    }
    console.log('No availability endpoint found');
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
        console.log('Full profile data:', data);
        
        // Process available days - check the actual structure
        let availabilityDisplay = [];
        let availabilityIds = [];
        
        if (data.available_days && Array.isArray(data.available_days)) {
          if (data.available_days.length > 0) {
            const firstItem = data.available_days[0];
            
            // Check what format we're getting
            console.log('First available_day item:', firstItem);
            console.log('Type:', typeof firstItem);
            
            // If it's IDs [1, 2, 3]
            if (typeof firstItem === 'number') {
              availabilityIds = data.available_days;
              availabilityDisplay = data.available_days.map(id => `Day ID: ${id}`);
            }
            // If it's objects [{id: 1, day: 'mon'}]
            else if (typeof firstItem === 'object' && firstItem.day) {
              availabilityIds = data.available_days.map(item => item.id);
              availabilityDisplay = data.available_days.map(item => {
                const dayMap = {
                  'mon': 'Monday', 'tue': 'Tuesday', 'wed': 'Wednesday',
                  'thu': 'Thursday', 'fri': 'Friday', 'sat': 'Saturday'
                };
                return dayMap[item.day] || item.day;
              });
            }
            // If it's strings ['mon', 'tue']
            else if (typeof firstItem === 'string') {
              const dayMap = {
                'mon': 'Monday', 'tue': 'Tuesday', 'wed': 'Wednesday',
                'thu': 'Thursday', 'fri': 'Friday', 'sat': 'Saturday'
              };
              availabilityDisplay = data.available_days.map(day => dayMap[day] || day);
              // We don't have IDs for strings, so we'll need to handle updates differently
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
          availability_ids: availabilityIds, // Store IDs if we have them
          username: data.username || "",
          original_available_days: data.available_days // Keep original for debugging
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

      // Extract from nested structure
      const firstName = updatedData.user?.first_name || "";
      const lastName = updatedData.user?.last_name || "";
      const email = updatedData.user?.email || "";

      if (!firstName || !lastName || !email) {
        throw new Error("First name, last name, and email are required");
      }

      // Option 1: Try sending what the backend originally sent us back
      const backendData = {
        title: updatedData.title || "",
        phone: updatedData.phone || "",
        first_name: firstName,
        last_name: lastName,
        email: email,
        available_days: profile?.original_available_days || [] // Send back exactly what we got
      
      };

      console.log("Sending to backend (with original available_days):", backendData);

      const response = await fetch('http://localhost:8000/api/accounts/profile/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(backendData)
      });

      const responseData = await response.json();
      
      if (response.ok) {
        console.log('Update successful:', responseData);
        alert("Profile updated successfully!");
        fetchProfile(); // Refresh
        setIsEditing(false);
      } else {
        console.error("Error response:", responseData);
        
        // If still failing, try without available_days completely
        if (responseData.available_days && responseData.available_days.includes("Incorrect type")) {
          console.log("Trying without available_days field...");
          
          const backupData = { ...backendData };
          delete backupData.available_days; // Remove the field entirely
          
          const backupResponse = await fetch('http://localhost:8000/api/accounts/profile/', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(backupData)
          });
          
          if (backupResponse.ok) {
            alert("Profile updated! (Availability days unchanged)");
            fetchProfile();
            setIsEditing(false);
          } else {
            const backupError = await backupResponse.json().catch(() => ({}));
            throw new Error(backupError.detail || 'Update failed even without available_days');
          }
        } else {
          throw new Error(responseData.detail || 'Update failed');
        }
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
      throw err;
    }
  };

  const handleCancelEdit = () => setIsEditing(false);
  const getEmptyProfile = () => ({ 
    title: "", first_name: "", last_name: "", email: "", 
    phone: "", Availability: [], username: "" 
  });

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (isEditing) return <ProfileForm role="teacher" initialData={profile} onSave={handleSaveProfile} onCancel={handleCancelEdit} />;

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
          <div><label className="block text-sm text-gray-500 mb-1">Title</label><div className="border border-gray-300 rounded-lg p-3 bg-gray-50">{profile?.title || "-"}</div></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm text-gray-500 mb-1">First Name</label><div className="border border-gray-300 rounded-lg p-3 bg-gray-50">{profile?.first_name || "-"}</div></div>
            <div><label className="block text-sm text-gray-500 mb-1">Last Name</label><div className="border border-gray-300 rounded-lg p-3 bg-gray-50">{profile?.last_name || "-"}</div></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm text-gray-500 mb-1">Email</label><div className="border border-gray-300 rounded-lg p-3 bg-gray-50">{profile?.email || "-"}</div></div>
            <div><label className="block text-sm text-gray-500 mb-1">Phone</label><div className="border border-gray-300 rounded-lg p-3 bg-gray-50">{profile?.phone || "-"}</div></div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Availability</label>
            <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 min-h-[3rem]">
              {profile?.Availability && profile.Availability.length > 0 ? profile.Availability.join(", ") : "Not specified"}
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