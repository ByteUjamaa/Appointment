import React, { useState } from "react";

const ChangePassword = ({ onClose }) => {
  const [formData, setFormData] = useState({
    current_password: "",
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
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate
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

    try {
      // TODO: Connect to your Django endpoint /accounts/change-password/
      const response = await fetch("/accounts/change-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: formData.current_password,
          new_password: formData.new_password
        }),
      });

      if (response.ok) {
        alert("Password changed successfully!");
        onClose();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to change password");
      }
    } catch (err) {
      setError("Network error. Please try again.");
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
          <input
            type="password"
            name="current_password"
            placeholder="Current Password *"
            value={formData.current_password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
            disabled={loading}
          />
          <input
            type="password"
            name="new_password"
            placeholder="New Password * (min 6 characters)"
            value={formData.new_password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
            minLength={6}
            disabled={loading}
          />
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm New Password *"
            value={formData.confirm_password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
            disabled={loading}
          />
          
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
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