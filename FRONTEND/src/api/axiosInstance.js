// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:  'http://localhost:8000/api/appointments',
  headers: { 'Content-Type': 'application/json' },
});

// Add JWT token to every request, this is automatically added 
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto refresh token on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const res = await axios.post('http://localhost:8000/api/accounts/token/refresh/', {
          refresh: refreshToken,
        });

        const { access } = res.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;