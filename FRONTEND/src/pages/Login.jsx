import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 



const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/accounts/login/", {
        username: formData.username,
        password: formData.password,
      });


      // SAVE TOKENS
      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
      }
      if (response.data.refresh_token) {
        localStorage.setItem("refresh_token", response.data.refresh_token);
      }
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      if (response.data.role) {
        localStorage.setItem("role", response.data.role);
      }

      // Decide where to go next based on role + first_login, falling back to backend redirect_path
      const { role, first_login, redirect_path } = response.data;
      let redirectPath = redirect_path || "/";

      if (role === "student") {
        // First login → student fills profile, second login → student home dashboard
        redirectPath = first_login
          ? "/studentDashboard/profile"
          : "/studentDashboard/home";
      } else if (role === "supervisor") {
        // First login → consultant fills profile, second login → consultant home dashboard
        redirectPath = first_login
          ? "/ConsultantDashboard/ConsultantProfile"
          : "/ConsultantDashboard/Consultanthome";
      } else if (role === "admin") {
        redirectPath = "/admin";
      }

      navigate(redirectPath);
    } catch (err) {
      if (err.response) {
        console.error("Backend error:", err.response.data);
        setError(
          err.response.data.error || err.response.data.message || "Login failed"
        );
      } else if (err.request) {
        console.error("No response from backend:", err.request);
        setError("No response from server. Check your network.");
      } else {
        console.error("Error:", err.message);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-gradient-to-br from-blue-200/30 to-slate-300/20 rounded-br-full"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-gradient-to-tl from-purple-200/20 to-slate-300/20 rounded-tl-full"></div>

      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-10 relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-gray-800 text-3xl font-bold mb-2">
            Portal Login
          </h1>
          <p className="text-gray-500 text-sm">
            Sign in to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full mb-6">
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="username"
              className="block mb-2 text-gray-900 font-medium text-sm"
            >
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
              className="w-full px-4 py-3.5 border border-gray-300 rounded-lg text-base bg-gray-50 text-gray-800
                         transition-all focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4
                         focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-gray-700 font-medium text-sm"
            >
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
              className="w-full px-4 py-3.5 border border-gray-300 rounded-lg text-base bg-gray-50 text-gray-800
                         transition-all focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4
                         focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-800 text-white rounded-lg text-base font-semibold cursor-pointer
                       transition-all mt-2 hover:bg-blue-900 hover:-translate-y-0.5 hover:shadow-lg
                       hover:shadow-blue-800/30 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
