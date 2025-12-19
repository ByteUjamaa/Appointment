import { Navigate, Outlet } from "react-router-dom";

/**
 * role is optional:
 *  - "student"
 *  - "consultant"
 */
const ProtectedRoute = ({ role }) => {
  // Example auth check (adjust to your app)
  const token = localStorage.getItem("access_token");
  const userRole = localStorage.getItem("role"); // "student" or "consultant"

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role
  if (role && userRole !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
