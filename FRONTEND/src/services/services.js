import axios from "axios";

// base API URL 
const API_BASE_URL =Process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// creating axioss instance
const api = axios.create({
    baseURL:API_BASE_URL,
    headers:{
        'Content-Type':'application/json',
    },    
});

// request interceptors:this automatically add JWT token for authorization
api.interceptors.request.use(
    (config) =>{
        const token = localStorage.getItem("access_token");
        if(token){
            config.headers['Authorization'] = `Bear ${token}`;

        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptors: this handle 401(unauthorized) try to refresh token retry once

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

      if(error.response?.status ===401 && !originalRequest._retry){
        originalRequest._retry = true;

        try{
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) throw new Error("No refresh token");

            const res = await axios.post("http://localhost:8000/api",{
                refresh:refreshToken,
            });

            const {access} = res.data;
            localStorage.setItem('access_token', access);

            // retry the original request with new token

            api.defaults.headers['Authorization'] = `Bearer ${access}`;
            originalRequest.headers['Authorization'] = `Bearer ${access}`;

            return api(originalRequest);
        } catch (refreshError){

            //  Refresh failed  this force logout
            localStorage.removeItem('access-token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem("user");

            // redirect to login 
            window.location.href = '/login';
            return Promise.reject(refreshError)
        }
      }
    }
)