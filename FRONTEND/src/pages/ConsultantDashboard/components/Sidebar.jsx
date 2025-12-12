import { Home, FileText, BarChart2, User, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ isOpen, setIsOpen }) {
  const linkClasses =
    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition";

  return (
    <div
      className={`fixed md:static top-0 left-0 h-screen bg-white shadow-md p-5 z-50 transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 w-64`}
    >
      <h2 className="text-2xl font-bold mb-6">Consultant Portal</h2>

      <ul className="space-y-4">
        <NavLink
          to="home"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`
          }
        >
          <Home /> Home
        </NavLink>

        <NavLink
          to="requests"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`
          }
        >
          <FileText /> Requests
        </NavLink>

        <NavLink
          to="reports"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`
          }
        >
          <BarChart2 /> Reports
        </NavLink>

        <NavLink
          to="ConsultantProfile"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`
          }
        >
          <User /> Profile
        </NavLink>

        <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer text-red-600">
          <LogOut /> Logout
        </div>
      </ul>
    </div>
  );
}
