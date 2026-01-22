import axiosInstance from "./axiosInstance";

const AppointmentService = {
  /* =======================
     APPOINTMENTS
  ======================= */

  getAppointmentTypes: () =>
    axiosInstance.get("/appointments/types/").then((r) => r.data),

  getTeachers: () =>
    axiosInstance.get("/accounts/supervisors/").then((r) => r.data),

  createAppointment: (data) =>
    axiosInstance.post("/appointments/create/", data).then((r) => r.data),

  getAppointments: () =>
    axiosInstance.get("/appointments/").then((r) => r.data),

  /* =======================
     APPOINTMENT RESPONSE
  ======================= */

  // Get response (used to check existence)
  getAppointmentResponse: (appointmentId) =>
    axiosInstance
      .get(`/appointments/${appointmentId}/response/`)
      .then((r) => r.data),

  /**
   * Create OR Update response
   * - POST if response does NOT exist
   * - PATCH if response EXISTS
   */
updateStatus: (
  id,
  status,
  supervisor_comment = "",
  confirmed_datetime = null
) =>
  axiosInstance
    .patch(`/appointments/${id}/response/`, {
      status: status.toLowerCase(), // 🔥 THIS LINE FIXES EVERYTHING
      supervisor_comment,
      confirmed_datetime,
    })
    .then((r) => r.data),


    // const hasResponse = checkResponse.data?.data !== null;

    // const payload = {
    //   status,
    //   supervisor_comment,
    //   confirmed_datetime,
    // };

  //   // 2️⃣ Decide POST or PATCH
  //   if (hasResponse) {
  //     // UPDATE existing response
  //     return axiosInstance
  //       .patch(`/appointments/${appointmentId}/response/`, payload)
  //       .then((r) => r.data);
  //   } else {
  //     // CREATE new response
  //     return axiosInstance
  //       .post(`/appointments/${appointmentId}/response/`, payload)
  //       .then((r) => r.data);
  //   }
  // },

  /* =======================
     STATUS & COUNTS
  ======================= */

  getStatusCount: () =>
    axiosInstance.get("/appointments/status-count/").then((r) => r.data),

  /* =======================
     DASHBOARD
  ======================= */

  getDashboardSummary: () =>
    axiosInstance
      .get("/appointments/dashboard/summary/")
      .then((r) => r.data),

  getDashboardStats: () =>
    axiosInstance.get("/consultant/stats").then((r) => r.data),

  getRecentActivity: () =>
    axiosInstance.get("/consultant/activity/").then((r) => r.data),

  getRequests: () =>
    axiosInstance.get("/consultant/requests").then((r) => r.data),

  /* =======================
     REPORTS
  ======================= */

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
