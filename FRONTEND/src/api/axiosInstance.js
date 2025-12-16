
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

//create axios instance with base url that every request will be attache with the base api
//and the response type should be in json format and the the fail requstts should terminated after 10seconds
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Request interceptor: Add token and store it to localstorage this runs before every request
//get acces token from the local storage and automatically attaches it to headers
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle 401 with refresh token to allow access  and prevents multiple request of refresh token queues
//  should fail the request when the token is being refreshed meaning one refresh request at a time
let isRefreshing = false;
let failedQueue = [];


//this may resolve or rejects all the queue requests if and only faith access token fail or succeed
//if the token is refrshed then try queued requests otherwise og out the user 
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};


//if the request is accepted thr return the response 
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {

    //this saves the failed requests and retry them later once the tpoken is accessed 
    const originalRequest = error.config;
     
    //handles the unathorized accesss when thr token is invalid or expired _retry prevents the infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;


      //for all requests wait in queue and retries after the refresh finishes 
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

 //locks the refresh process so that only one refresh call happens 
      isRefreshing = true;

      try {

        //gets the refresh token stored in localstorage at login for refresh token lives longer than access token
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(`${API_URL}/accounts/token/refresh/`, {
          refresh: refreshToken,
        });

        //set/save  the access token used automatically by request intercerptor 
        const { access } = res.data;
        localStorage.setItem("access_token", access);


        //update header sends the original request by this case the user never expercince the token expire 
        processQueue(null, access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {

        //but if the refresh token expired or invalid then the user must login agin
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

//make this instance reusable across the app
export default axiosInstance;
