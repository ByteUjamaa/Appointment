import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">

      {/* SIDEBAR */}
      <div className="h-full">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* STICKY HEADER */}
        <div className="sticky top-0 z-20 bg-white shadow">
          <Header isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>

        
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-20">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
