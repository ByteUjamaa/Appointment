import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';

// Student dashboard pages
import StudentDashboard from './pages/studentDashboard/StudentDashboard';
import StudentHome from './pages/studentDashboard/Home';
import StudentAppointments from './pages/studentDashboard/Appointments';
import StudentReports from './pages/studentDashboard/Reports';
import StudentProfile from './pages/studentDashboard/Profile';

import './styles/App.css';

// Consultant dashboard pages
import Dashboard from './pages/ConsultantDashboard/Dashboard';
import ConsultantHome from './pages/ConsultantDashboard/Home';
import ConsultantRequests from './pages/ConsultantDashboard/Requests';
import ConsultantReports from './pages/ConsultantDashboard/Reports';
import TeacherProfile from './pages/teacherDashboard/TeacherProfile';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>

          {/* AUTH ROUTES */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* STUDENT DASHBOARD ROUTES */}
          <Route path="/studentDashboard/*" element={<StudentDashboard />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<StudentHome />} />
            <Route path="appointments" element={<StudentAppointments />} />
            <Route path="reports" element={<StudentReports />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          {/* CONSULTANT DASHBOARD ROUTES */}
          <Route path="/consultantDashboard/*" element={<Dashboard />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<ConsultantHome />} />
            <Route path="requests" element={<ConsultantRequests />} />
            <Route path="reports" element={<ConsultantReports />} />
            <Route path="profile" element={<TeacherProfile />} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
