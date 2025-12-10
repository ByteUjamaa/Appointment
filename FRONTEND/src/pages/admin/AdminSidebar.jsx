import {
  BarChart3,
  CalendarCheck,
  Home,
  LogOut,
  User,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { name: "Supervisors", path: "/admin/supervisors", icon: <Home size={20} /> },
    { name: "Appointments", path: "/admin/appointment-types", icon: <CalendarCheck size={20} /> },
  
  ];

  return (
    <>
      {/*  BACKDROP (BELOW HEADER) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          style={{ top: "72px" }}
        />
      )}

      {/* SIDEBAR BELOW HEADER */}
      <div
        className={`fixed left-0 h-screen w-64 bg-blue-100 shadow-lg p-6 z-50
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
        style={{ top: "72px" }} 
      >
        

        <ul className="space-y-4">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition-all
                  ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-10 pt-5 border-t">
          <button className="flex items-center gap-3 text-red-600 font-semibold">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
