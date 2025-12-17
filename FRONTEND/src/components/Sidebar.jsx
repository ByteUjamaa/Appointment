import {
  BarChart3,
  CalendarCheck,
  Home,
  User,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom"; //NavLink is the special version of Link and automatically knows which route is active and its perfect for navigation



//this is the functional compoennt that receives props isOPpen and setIsOPen
const Sidebar = ({ isOpen, setIsOpen }) => {
  //navigation items
  const navItems = [
    { name: "Home", path: "/studentDashboard/home", icon: <Home size={20} /> },
    { name: "Appointments", path: "/studentDashboard/appointments", icon: <CalendarCheck size={20} /> },
    { name: "Reports", path: "/studentDashboard/reports", icon: <BarChart3 size={20} /> },
    { name: "Supervisors", path: "/studentDashboard/supervisors", icon: <BarChart3 size={20} /> },
    { name: "Profile", path: "/studentDashboard/profile", icon: <User size={20} /> },
  ];

  return (
    <>

    {/* shows the semi transparent overly when the sidebar is opened and clicking it closes the sidebar lg:hidden makes this visible only on samll screens */}
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
        className={`fixed left-0 h-screen w-64 bg-white dark:bg-gray-950 shadow-lg p-6 z-50
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
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>

      </div>
    </>
  );
};

export default Sidebar;
