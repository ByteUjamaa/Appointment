import axiosInstance from "./axiosInstance";

const AppointmentService = {
  // Appointments
  getAppointmentTypes: () =>
    axiosInstance.get("/appointments/types/").then((r) => r.data),

  getTeachers: () =>
    axiosInstance.get("/accounts/supervisors/").then((r) => r.data),

  createAppointment: (data) =>
    axiosInstance.post("/appointments/create/", data).then((r) => r.data),

  getAppointments: () =>
    axiosInstance.get("/appointments/").then((r) => r.data),

  getAppointmentResponse: (appointmentId) =>
    axiosInstance
      .get(`/appointments/${appointmentId}/response/`)
      .then((r) => r.data),

  getStatusCount: () =>
    axiosInstance.get("/appointments/status-count/").then((r) => r.data),

  updateStatus: (id, status) =>
    axiosInstance
      .patch(`/appointments/${id}/update-status/`, { status })
      .then((r) => r.data),

  // Dashboard
  getDashboardSummary: () =>
    axiosInstance.get("/appointments/dashboard/summary/").then((r) => r.data),

  getDashboardStats: () =>
    axiosInstance.get("/consultant/stats").then((r) => r.data),

  getRecentActivity: () =>
    axiosInstance.get("/consultant/activity/").then((r) => r.data),

  getRequests: () =>
    axiosInstance.get("/consultant/requests").then((r) => r.data),

  // ✅ Reports
  getReports: () =>
    axiosInstance.get("/reports/create").then((r) => r.data),

  getReportsByStudent: (studentId) =>
    axiosInstance
      .get(`/reports/create/?student=${studentId}`)
      .then((r) => r.data),

  createReport: (data) =>
    axiosInstance.post("/reports/create/", data).then((r) => r.data),

  updateReport: (id, data) =>
    axiosInstance.patch(`/reports/${id}/`, data).then((r) => r.data),

  submitReport: (id) =>
    axiosInstance.patch(`/reports/${id}/submit/`).then((r) => r.data),
};

export default AppointmentService;
