import React, { useState } from "react";

const ProfileForm = ({ role = "student", onSave, onCancel, initialData = {}, isFirstLogin = false }) => {
  const isStudent = role === "student";
  const isConsultant = !isStudent;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(() => {
    const baseData = {
      first_name: initialData.first_name || "",
      last_name: initialData.last_name || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
    };

    if (isStudent) {
      baseData.course = initialData.course || "";
      baseData.year_of_study = initialData.year_of_study || "";
    }

    if (isConsultant) {
      baseData.title = initialData.title || "";
      
      // Handle availability initialization
      if (initialData.Availability && Array.isArray(initialData.Availability)) {
        baseData.Availability = initialData.Availability;
      } else if (initialData.availability_day_codes && Array.isArray(initialData.availability_day_codes)) {
        // Convert day codes to display names
        const dayCodeToDisplay = {
          'mon': 'Monday', 'tue': 'Tuesday', 'wed': 'Wednesday',
          'thu': 'Thursday', 'fri': 'Friday', 'sat': 'Saturday'
        };
        baseData.Availability = initialData.availability_day_codes.map(
          code => dayCodeToDisplay[code] || code
        );
      } else {
        baseData.Availability = [];
      }
    }

    return baseData;
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayMapping = {
    'Monday': 'mon', 'Tuesday': 'tue', 'Wednesday': 'wed',
    'Thursday': 'thu', 'Friday': 'fri', 'Saturday': 'sat'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Phone number validation - only allow digits
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: digitsOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const toggleDay = (day) => {
    const currentDays = formData.Availability || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    setFormData({ ...formData, Availability: newDays });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let dataToSave;
      
      if (isStudent) {
        dataToSave = {
          user: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email
          },
          phone: formData.phone,
          course: formData.course,
          year_of_study: formData.year_of_study
        };
      } else {
        // Convert display names to day codes for backend
        const availableDaysCodes = (formData.Availability || []).map(day => dayMapping[day]);
        
        dataToSave = {
          user: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email
          },
          phone: formData.phone,
          title: formData.title,
          available_days_input: availableDaysCodes
        };
      }

      await onSave(dataToSave);
      if (!isFirstLogin) onCancel();
      
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
            {isConsultant ? "👨‍🏫" : "👤"}
          </div>
          <h2 className="text-2xl font-bold">
            {isFirstLogin ? "Complete Your Profile" : "Edit Profile"}
          </h2>
          <p className="text-gray-500 text-sm">
            {isFirstLogin ? "Complete profile to continue" : "Update profile information"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isConsultant && (
            <div>
              <select
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full"
              >
                <option value="">Select Title</option>
                <option value="Dr.">Dr.</option>
                <option value="Prof.">Prof.</option>
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="first_name"
                placeholder="First Name *"
                value={formData.first_name}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full"
                required
              />
            </div>
            <div>
              <input
                type="text"
                name="last_name"
                placeholder="Last Name *"
                value={formData.last_name}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full"
                required
              />
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone * (numbers only)"
                value={formData.phone}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full"
                required
                pattern="[0-9]*"
                inputMode="numeric"
                title="Please enter only numbers"
              />
            </div>
          </div>

          {isStudent && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <select
                  name="course"
                  value={formData.course || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-3 w-full"
                >
                  <option value="">Select Course</option>
                  <option value="CSN">CSN</option>
                  <option value="ISM">ISM</option>
                  <option value="DS">Data Science</option>
                </select>
              </div>
              <div>
                <select
                  name="year_of_study"
                  value={formData.year_of_study || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-3 w-full"
                >
                  <option value="">Year of Study</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                </select>
              </div>
            </div>
          )}

          {isConsultant && (
            <div>
              <label className="block text-sm text-gray-600 mb-2">Availability (Select all that apply)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {days.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`p-2 rounded border transition ${
                      formData.Availability?.includes(day) 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            {!isFirstLogin && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
                disabled={loading}
              >
                Cancel
              </button>
            )}
            
            <button 
              type="submit"
              disabled={loading}
              className={`${isFirstLogin ? 'w-full' : 'flex-1'} bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50`}
            >
              {loading ? "Saving..." : isFirstLogin ? "Save & Continue" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;