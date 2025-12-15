
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth
import Login from './pages/Login';

// Student Pages
import StudentDashboard from './pages/studentDashboard/StudentDashboard';
import Home from './pages/studentDashboard/Home';
// import Appointments from './pages/studentDashboard/Appointments';
import Reports from './pages/studentDashboard/Reports';
import Profile from './pages/studentDashboard/Profile';
import ConsultantProfile from './pages/ConsultantDashboard/ConsultantProfile';

// Consultant Dashboard
import Dashboard from './pages/ConsultantDashboard/Dashboard';
import Consultanthome from './pages/ConsultantDashboard/Consultanthome';
import Requests from './pages/ConsultantDashboard/Requests';
// import Reports from './pages/ConsultantDashboard/Reports';
import ConsultantProfile from './pages/ConsultantDashboard/ConsultantProfile';

// Admin Layout & Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import { Supervisors } from './pages/admin/supervisors/Supervisor';
import { Appointment } from './pages/admin/appointments/Appointment';

import './styles/App.css';
import AppointmentService from './api/appointmentServices';
import Appointments from './pages/studentDashboard/Appointments';
import Requests from './pages/ConsultantDashboard/Requests';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Routes>

          {/* Auth Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Student Dashboard - Nested Routes */}
          <Route path="/studentDashboard/*" element={<StudentDashboard />}>
            <Route index element={<Navigate to="Home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="reports" element={<Reports />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Consultant Dashboard */}
        <Route path="/ConsultantDashboard/*" element={<Dashboard />}>
          <Route index element={<Navigate to="Consultanthome" replace />} />
          <Route path="Consultanthome" element={<Consultanthome />} />
          <Route path="requests" element={<Requests />} />
          {/* <Route path="reports" element={<Reports />} /> */}
          <Route path="ConsultantProfile" element={<ConsultantProfile />} />
        </Route>

          {/* Admin Dashboard - Nested Routes */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<Navigate to="supervisors" replace />} />
            <Route path="supervisors" element={<Supervisors />} />
            <Route path="appointment-types" element={<Appointment />} />
          </Route>

          {/* Redirects */}
          <Route path="/profile" element={<Navigate to="/studentDashboard/profile" replace />} />
          <Route path="/student/dashboard" element={<Navigate to="/studentDashboard/home" replace />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
