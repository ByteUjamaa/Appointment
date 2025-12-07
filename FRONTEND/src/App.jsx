import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';

// Student dashboard pages
import StudentDashboard from './pages/studentDashboard/StudentDashboard';
import Home from './pages/studentDashboard/Home';
import Appointments from './pages/studentDashboard/Appointments';
import Reports from './pages/studentDashboard/Reports';
import Profile from './pages/studentDashboard/Profile';

// Consultant dashboard
import Dashboard from './pages/ConsultantDashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>

        {/* AUTH ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* STUDENT DASHBOARD */}
        <Route path="/studentDashboard/*" element={<StudentDashboard />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* CONSULTANT DASHBOARD */}
        <Route path="/consultantDashboard" element={<Dashboard />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
