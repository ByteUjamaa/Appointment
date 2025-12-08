import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000/api", // your Django backend
});

// Fetch dashboard stats
export const getDashboardStats = async () => {
    const res = await API.get("/consultant/stats/");
    return res.data;
};

// Fetch recent activity
export const getRecentActivity = async () => {
    const res = await API.get("/consultant/activity/");
    return res.data;
};

// Fetch request list
export const getRequests = async () => {
    const res = await API.get("/consultant/requests/");
    return res.data;
};
