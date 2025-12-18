import React, { useState } from "react";

const ProfileForm = ({ role = "student", onSave, onCancel, initialData = {} }) => {
  const isStudent = role === "student";
  const isConsultant = !isStudent;
  const [loading, setLoading] = useState(false);

  // Form state - flattened from parent
  const [formData, setFormData] = useState({
    first_name: initialData.first_name || "",
    last_name: initialData.last_name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    
    // Student fields
    ...(isStudent && {
      course: initialData.course || "",
      year_of_study: initialData.year_of_study || ""
    }),
    
    // Consultant fields
    ...(isConsultant && { 
      title: initialData.title || "",
      Availability: initialData.Availability || []
    })
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Day mapping for backend
  const dayMapping = {
    'Monday': 'mon',
    'Tuesday': 'tue',
    'Wednesday': 'wed',
    'Thursday': 'thu',
    'Friday': 'fri',
    'Saturday': 'sat'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
        // Student data structure
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
        // Consultant data structure
        dataToSave = {
          user: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email
          },
          phone: formData.phone,
          title: formData.title,
          available_days: formData.Availability.map(day => dayMapping[day])
        };
      }

      console.log("ProfileForm sending:", dataToSave);
      await onSave(dataToSave);
      onCancel();
      
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
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <p className="text-gray-500 text-sm">
            Update your profile information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TITLE FIELD - Only for Consultants */}
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
                <option value="Mrs.">Mrs.</option>
              </select>
            </div>
          )}

          {/* NAME FIELDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="first_name"
              placeholder="First Name *"
              value={formData.first_name}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
              required
            />
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

          {/* CONTACT INFO */}
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

          {/* STUDENT FIELDS */}
          {isStudent && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          )}

          {/* CONSULTANT AVAILABILITY */}
          {isConsultant && (
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Availability (Select all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {days.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`p-2 rounded border ${
                      (formData.Availability || []).includes(day) 
                        ? 'bg-blue-100 border-blue-500' 
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex gap-4 pt-4">
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