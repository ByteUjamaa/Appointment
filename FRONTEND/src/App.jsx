import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth
import Login from './pages/Login';

// Student Pages
import StudentDashboard from './pages/studentDashboard/StudentDashboard';
import Home from './pages/studentDashboard/Home';
import Appointments from './pages/studentDashboard/Appointments';
import Reports from './pages/studentDashboard/Reports';
import Profile from './pages/studentDashboard/Profile';

// Consultant Dashboard
import Dashboard from './pages/ConsultantDashboard/Dashboard';

// Admin Layout & Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import { Supervisors } from './pages/admin/supervisors/Supervisor';
import { Appointment } from './pages/admin/appointments/Appointment';

import './styles/App.css';

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
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="reports" element={<Reports />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Consultant Dashboard */}
          <Route path="/ConsultantDashboard" element={<Dashboard />} />

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
