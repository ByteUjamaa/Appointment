import React, { useState } from "react";

const ProfileForm = ({ role = "student", mode = "firstLogin" }) => {
  const isStudent = role === "student";
  const isFirstLogin = mode === "firstLogin";
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    major: "",
    academic_year: "",
    new_password: "",
    confirm_password: ""
  });

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

    // TODO: Replace with real API
    console.log("Mode:", mode);
    console.log("Data:", formData);
    
    setTimeout(() => {
      if (isFirstLogin) {
        alert("Profile completed! Please login with new password.");
        window.location.href = "/login";
      } else {
        alert("Profile updated!");
        // In dashboard, you would close the edit mode
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-lg">
        
        {/* Icon */}
        <div className="text-center mb-4">
          <div className="text-purple-600 text-5xl mb-2">👤</div>
          <h2 className="text-2xl font-bold">
            {isFirstLogin ? "Complete Your Profile" : "Edit Profile"}
          </h2>
          <p className="text-gray-500 text-sm">
            {isFirstLogin 
              ? "This is your first login. Please update your information."
              : "Update your profile information."}
          </p>
        </div>

        {/* Form */}
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

          {/* STUDENT ONLY FIELDS */}
          {isStudent && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full"
                required={isStudent}
              >
                <option value="">Select Major *</option>
                <option value="CSN">CSN</option>
                <option value="ISM">ISM</option>
                <option value="DSA">DSA</option>
              </select>

              <select
                name="academic_year"
                value={formData.academic_year}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full"
                required={isStudent}
              >
                <option value="">Select Year *</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>
          )}

          {/* PASSWORD FIELDS ONLY FOR FIRST LOGIN */}
          {isFirstLogin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="password"
                name="new_password"
                placeholder="New Password *"
                value={formData.new_password}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full"
                required={isFirstLogin}
                minLength={6}
              />
              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm Password *"
                value={formData.confirm_password}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full"
                required={isFirstLogin}
              />
            </div>
          )}

          {/* BUTTON */}
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : isFirstLogin ? "Save & Continue" : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ProfileForm;