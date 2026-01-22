import React, { useState } from "react";

const ChangePassword = ({ onSuccess, onClose, forceChange = false }) => {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (formData.new_password !== formData.confirm_password) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/accounts/change-password/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          old_password: formData.old_password,
          new_password: formData.new_password
        })
      });

      if (response.ok) {
        alert("Password changed!");
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Password change failed');
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {forceChange ? "Change Your Password" : "Change Password"}
            </h2>
            {onClose && !forceChange && (
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            )}
          </div>
          
          {forceChange && (
            <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded text-sm">
              🔒 Change password after first login
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <input
                type="password"
                value={formData.old_password}
                onChange={(e) => setFormData({...formData, old_password: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-3"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                value={formData.new_password}
                onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-3"
                required
                minLength="8"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                value={formData.confirm_password}
                onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-3"
                required
              />
            </div>
            
            {error && <div className="text-red-600 text-sm">{error}</div>}
            
            <div className="flex gap-3 pt-4">
              {onClose && !forceChange && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className={`${forceChange ? 'w-full' : 'flex-1'} bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700`}
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;