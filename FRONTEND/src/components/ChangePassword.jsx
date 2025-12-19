import React, { useState } from "react";

const ChangePassword = ({ onClose }) => {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (formData.new_password.length < 6) {
      setError("New password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.old_password === formData.new_password) {
      setError("New password must be different from old password");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      
      if (!token) {
        setError("You are not logged in. Please login again.");
        setLoading(false);
        return;
      }

      // Use correct endpoint with /api/
      const response = await fetch('http://localhost:8000/api/accounts/change-password/', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          old_password: formData.old_password,
          new_password: formData.new_password
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      
      if (response.ok) {
        alert("Password changed successfully!");
        onClose();
      } else {
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setError(data.detail || data.error || "Failed to change password");
        } else {
          const text = await response.text();
          setError(`Server error: ${text.substring(0, 100)}`);
        }
      }
    } catch (err) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Current Password</label>
            <input
              type="password"
              name="old_password"
              placeholder="Enter current password"
              value={formData.old_password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">New Password</label>
            <input
              type="password"
              name="new_password"
              placeholder="Enter new password (min 6 characters)"
              value={formData.new_password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
              minLength={6}
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm new password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
              disabled={loading}
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
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
              {loading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;