// src/api/appointmentService.js
import axiosInstance from './axiosInstance';

const AppointmentService = {
  // GET /appointment-types/
  getAppointmentTypes: () => axiosInstance.get('/appointment-types/').then(r => r.data),

  // GET /teachers/
  getTeachers: () => axiosInstance.get('/teachers/').then(r => r.data),

  // POST /appointments/create/
  createAppointment: (data) => axiosInstance.post('/appointments/create/', data).then(r => r.data),

  // GET /appointments/
  getAppointments: () => axiosInstance.get('/appointments/').then(r => r.data),

  // PATCH /appointments/<id>/update-status/
  updateStatus: (id, status) =>
    axiosInstance.patch(`/appointments/${id}/update-status/`, { status }).then(r => r.data),

  // GET /appointments/status-count/
  getStatusCount: () => axiosInstance.get('/appointments/status-count/').then(r => r.data),

  getDashboardSummary: () => axiosInstance.get('/appointments/status-count/').then(r => r.data)
};


// api for getting the summary of dashboard in home



export default AppointmentService;