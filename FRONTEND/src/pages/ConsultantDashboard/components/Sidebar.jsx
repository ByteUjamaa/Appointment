import { Home, FileText, BarChart2, User, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClasses =
    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition";
    

  return (
    <div className=" w-64 h-screen bg-white shadow-md p-5">
      <h2 className="text-2xl font-bold mb-6">Consultant Portal</h2>

      <ul className="space-y-4">

        {/* HOME */}
        <NavLink
          to="/consultantDashboard/home"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`
          }
        >
          <Home /> Home
        </NavLink>

        {/* REQUESTS */}
        <NavLink
          to="/consultantDashboard/requests"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`
          }
        >
          <FileText /> Requests
        </NavLink>

        {/* REPORTS */}
        <NavLink
          to="/consultantDashboard/reports"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`
          }
        >
          <BarChart2 /> Reports
        </NavLink>

        {/* PROFILE */}
        <NavLink
          to="/consultantDashboard/Consultantprofile"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`
          }
        >
          <User /> Profile
        </NavLink>

        {/* LOGOUT */}
        <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer text-red-600">
          <LogOut /> Logout
        </div>
      </ul>
    </div>
  );
}
