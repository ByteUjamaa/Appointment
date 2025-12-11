import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 md:ml-64">
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />

        <div className="pt-[80px] p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
