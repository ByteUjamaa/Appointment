import React, { useState } from "react";

const ProfileForm = ({ role = "student", onSave, onCancel, initialData = {} }) => {
  const isStudent = role === "student";
  const [loading, setLoading] = useState(false);

  // Form state 
  const [formData, setFormData] = useState({
    full_name: initialData.full_name || "",
    username: initialData.username || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    major: initialData.major || "",
    academic_year: initialData.academic_year || "",
    password: "",
    confirm_password: "",
    consultation_days: initialData.consultation_days || []
  });

  const [selectedDays, setSelectedDays] = useState(initialData.consultation_days || []);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const toggleDay = (day) => {
    const newDays = selectedDays.includes(day) 
      ? selectedDays.filter(d => d !== day) 
      : [...selectedDays, day];
    setSelectedDays(newDays);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data to save
      const dataToSave = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        ...(isStudent && {
          major: formData.major,
          academic_year: formData.academic_year
        }),
        ...(!isStudent && {
          consultation_days: selectedDays
        })
      };

      // Call parent's onSave function
      if (onSave) {
        await onSave(dataToSave);
      }
      
      // Success - go back to view mode
      if (onCancel) {
        onCancel();
      }
      
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-lg">
        
        <div className="text-center mb-4">
          <div className="text-purple-600 text-5xl mb-2">
            {!isStudent ? "👨‍🏫" : "👤"}
          </div>
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <p className="text-gray-500 text-sm">
            Update your profile information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="full_name"
              placeholder="Full Name *"
              value={formData.full_name}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
              required
            />
            <input
              type="text"
              name="username"
              placeholder="Username *"
              value={formData.username}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
              required
              disabled={!!initialData.username}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
              required
            />
          </div>

          {isStudent && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full"
              >
                <option value="">Select Major</option>
                <option value="CSN">CSN</option>
                <option value="ISM">ISM</option>
                <option value="DSA">DSA</option>
              </select>
              <select
                name="academic_year"
                value={formData.academic_year}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full"
              >
                <option value="">Select Year</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>
          )}

          {!isStudent && (
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Consultation Days (Select all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {days.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`p-2 rounded border ${selectedDays.includes(day) ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-300'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            {/* CORRECT Cancel button styling */}
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
              disabled={loading}
            >
              Cancel
            </button>

            <button 
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;