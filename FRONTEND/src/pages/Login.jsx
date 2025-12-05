import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/login/', {
        username: formData.username,
        password: formData.password,
      });

      // Store token and user data
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      // Redirect based on user role
      const userRole = response.data.user?.role || response.data.role;
      if (userRole === 'lecturer' || userRole === 'Lecturer') {
        navigate('/lecturer/dashboard');
      } else if (userRole === 'student' || userRole === 'Student') {
        navigate('/student/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Invalid username or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8 relative overflow-hidden">
      {/* Subtle gradient backgrounds in corners */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-gradient-to-br from-blue-200/30 to-slate-300/20 rounded-br-full"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-gradient-to-tl from-purple-200/20 to-slate-300/20 rounded-tl-full"></div>
      
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-10 relative z-10">
        <div className="text-center mb-8">
          {/* Icon Container */}
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-11 h-11" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" fill="white"/>
            </svg>
          </div>
          
          <h1 className="text-gray-800 text-3xl font-bold mb-2">Student Portal</h1>
          <p className="text-gray-500 text-sm">Sign in to access your consultation dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full mb-6">
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="username" className="block mb-2 text-gray-900 font-medium text-sm">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              disabled={loading}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-lg text-base bg-gray-50 text-gray-800 transition-all focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-gray-700 font-medium text-sm">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-lg text-base bg-gray-50 text-gray-800 transition-all focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-800 text-white rounded-lg text-base font-semibold cursor-pointer transition-all mt-2 hover:bg-blue-900 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-800/30 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
{/* 
        <div className="bg-blue-100 rounded-lg p-5 mt-6">
          <p className="font-bold text-blue-800 mb-3 text-sm">Default Credentials:</p>
          <p className="text-blue-800 my-1 text-sm">Username: student</p>
          <p className="text-blue-800 my-1 text-sm">Password: password123</p>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
