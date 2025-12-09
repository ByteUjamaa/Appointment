// src/pages/ConsultantDashboard/ConsultantDashboard.jsx
import React, { useState } from "react";
import { FiHome, FiFileText, FiUser, FiLogOut, FiBell, FiSettings, FiCalendar } from "react-icons/fi";
import Requests from "./Requests"; // The Requests component we created

const sidebarItems = [
  { name: "Home", icon: <FiHome />, page: "Home" },
  { name: "Requests", icon: <FiFileText />, page: "Requests" },
  { name: "Reports", icon: <FiFileText />, page: "Reports" },
  { name: "Profile", icon: <FiUser />, page: "Profile" },
  { name: "Logout", icon: <FiLogOut />, page: "Logout" },
];

const ConsultantDashboard = () => {
  const [activePage, setActivePage] = useState("Requests"); // Requests active by default

  const renderContent = () => {
    switch (activePage) {
      case "Requests":
        return <Requests />;
      case "Home":
        return <div className="p-6">Home Page Content</div>;
      case "Reports":
        return <div className="p-6">Reports Page Content</div>;
      case "Profile":
        return <div className="p-6">Profile Page Content</div>;
      default:
        return <div className="p-6">Select a page</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 text-xl font-bold border-b">Consultant Portal</div>
        <nav className="flex-1 mt-6">
          {sidebarItems.map(item => (
            <button
              key={item.name}
              onClick={() => setActivePage(item.page)}
              className={`flex items-center w-full px-6 py-3 text-left hover:bg-purple-50 transition-colors ${
                activePage === item.page ? "bg-purple-600 text-white" : "text-gray-700"
              } rounded-r-lg mb-1`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Topbar */}
        <header className="flex justify-between items-center p-4 bg-white shadow-sm border-b">
          <div className="text-xl font-semibold">{activePage}</div>
          <div className="flex items-center space-x-4">
            <FiSettings className="text-gray-600 w-6 h-6" />
            <div className="relative">
              <FiBell className="text-gray-600 w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="w-8 h-8 bg-purple-600 text-white flex items-center justify-center rounded-full">
              C
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-gray-100">{renderContent()}</main>
      </div>
    </div>
  );
};

export default ConsultantDashboard;
