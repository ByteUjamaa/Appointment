import React from 'react';
import { BrowserRouter , Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
// Auth
import Login from './pages/Login';

// Student Pages
import StudentDashboard from './pages/studentDashboard/StudentDashboard';
import Home from './pages/studentDashboard/Home';
import Appointments from './pages/studentDashboard/Appointments';
import Reports from './pages/studentDashboard/Reports';
import SupervisorsStudent from './pages/studentDashboard/SupervisorsStudent';
import Profile from './pages/studentDashboard/Profile';
import FirstLoginProfile from './components/FirstLoginProfile'; 

// Consultant Dashboard
import Dashboard from './pages/ConsultantDashboard/Dashboard';
import Consultanthome from './pages/ConsultantDashboard/Consultanthome';
import Requests from './pages/ConsultantDashboard/Requests';
import ConsultantProfile from './pages/ConsultantDashboard/ConsultantProfile';
import ConsultantReports from './pages/ConsultantDashboard/ConsultantReports';

// Admin Layout & Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import { Supervisors } from './pages/admin/supervisors/Supervisor';
import { Appointment } from './pages/admin/appointments/Appointment';

import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App min-h-screen bg-gray-50">
        <Routes>

          {/* Auth Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* First Login Profile Update Routes (Outside Dashboard) */}
          <Route 
            path="/studentDashboard/first-login-profile" 
            element={<FirstLoginProfile />} 
          />
          <Route 
            path="/ConsultantDashboard/first-login-profile" 
            element={<FirstLoginProfile />} 
          />

          {/* Student Dashboard - Nested Routes */}
          <Route element={<ProtectedRoute role="student" />}>
            <Route path="/studentDashboard/*" element={<StudentDashboard />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<Home />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="reports" element={<Reports />} />
              <Route path="supervisors" element={<SupervisorsStudent />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Consultant Dashboard */}
          <Route element={<ProtectedRoute role="supervisor" />}>
            <Route path="/ConsultantDashboard/*" element={<Dashboard />}>
              <Route index element={<Navigate to="Consultanthome" replace />} />
              <Route path="Consultanthome" element={<Consultanthome />} />
              <Route path="requests" element={<Requests />} />
              <Route path="ConsultantProfile" element={<ConsultantProfile />} />
              <Route path="ConsultantReports" element={<ConsultantReports />} />
            </Route>
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
    </BrowserRouter>
  );
}

export default App;