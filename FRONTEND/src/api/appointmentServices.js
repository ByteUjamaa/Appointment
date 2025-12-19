import axiosInstance from "./axiosInstance";

const AppointmentService = {
  getAppointmentTypes: () =>
    axiosInstance.get("/appointments/types/").then((r) => r.data),

  // Uses backend Accounts.urls → /api/accounts/supervisors/
  getTeachers: () =>
    axiosInstance.get("/accounts/supervisors/").then((r) => r.data),

  createAppointment: (data) =>
    axiosInstance.post("/appointments/create/", data).then((r) => r.data),

  getAppointments: () =>
    axiosInstance.get("/appointments/").then((r) => r.data),

  getStatusCount: () =>
    axiosInstance.get("/appointments/status-count/").then((r) => r.data),

  updateStatus: (id, status) =>
    axiosInstance
      .patch(`/appointments/${id}/update-status/`, { status })
      .then((r) => r.data),

  getDashboardSummary: () =>
    axiosInstance.get("/appointments/dashboard/summary/").then((r) => r.data),


  getDashboardStats:() => axiosInstance.get("/consultant/stats").then((r) => r.data),

  getRecentActivity:() => axiosInstance.get("/consultant/activity/").then((r) => r.data),

  getRequests:() => axiosInstance.get("/consultant/requests").then((r)=> r.data)


};

export default AppointmentService;




