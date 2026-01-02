// src/layouts/AdminDashboard.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";


// Create a simple context 
export const AdminContext = React.createContext({});

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [supervisors, setSupervisors] = useState([]);
  const [appointmentTypes, setAppointmentTypes ] = useState([])

  // These functions  used by child pages
  const createSupervisor = (newSupervisor) => {
    const supervisorWithId = {
      ...newSupervisor,
      id: Date.now(), 
      createdAt: new Date().toISOString(),
    };
    setSupervisors(prev => [...prev, supervisorWithId]);
   
  };

  const deleteSupervisor = (id) => {
    setSupervisors(prev => prev.filter(s => s.id !== id));

  };

//   for appointments
const createAppointmentType = (newAppointmentType) =>{
    const appointmentTypeWithId ={
        ...newAppointmentType,
            id:Date.now(),
            createdAt:new Date().toISOString(),
        }
        setAppointmentTypes(prev=> [...prev, appointmentTypeWithId])
    }

    const deleteAppointmentType = (id) =>{
        setAppointmentTypes(prev => prev.filter(a => a.id !==id))
    }




  // Pass everything through context
  const contextValue = {
    supervisors,
    createSupervisor,
    deleteSupervisor,
    appointmentTypes,
    createAppointmentType,
    deleteAppointmentType,
    // You can add more shared state here later (appointment types, etc.)
  };

  return (
    <AdminContext.Provider value={contextValue}>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100">

        {/* SIDEBAR */}
        <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 lg:ml-64">
          <AdminHeader isOpen={isOpen} setIsOpen={setIsOpen} />
          
           <main className="pt-[80px] pl-0  pb-6">
            <Outlet /> {/* Child pages go here */}
          </main>
        </div>
      </div>
    </AdminContext.Provider>
  );
};

export default AdminDashboard;