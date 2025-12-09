import axios from "axios";
import React, { useState, useEffect } from "react";
import AppointmentService from "../../api/appointmentServices";


export default function Home() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AppointmentService.getDashboardSummary()
      .then(setSummary)
      .finally(() => setLoading(false));
  }, []);



  if (loading) {
    return <div className="p-6">Loading dashboard....</div>;
  }
  return (
    <div className="p-6 space-y-10">
      {/* HEADER */}
      <div className="text-start">
        <h1 className="text-3xl font-semibold">Welcome back, name</h1>
        <p>Here's an overview of your consultation activities</p>
      </div>

      {/*  APPOINTMENTS */}
      <div className="">
        <h2 className="text-lg font-semibold mb-4">Appointments</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow border border-blue-400 rounded-xl p-6">
            <h3 className="text-gray-500">Pending</h3>
            <p className="text-3xl font-bold text-gray-500">
              {summary?.appointments?.pending}
            </p>
          </div>

          <div className="bg-white shadow border border-blue-400 rounded-xl p-6">
            <h3 className="text-gray-500">Accepted</h3>
            <p className="text-3xl font-bold text-gray-500">
              {summary?.appointments?.accepted}
            </p>
          </div>

          <div className="bg-white shadow border border-blue-400 rounded-xl p-6">
            <h3 className="text-gray-500">Completed</h3>
            <p className="text-3xl font-bold text-gray-500">
              {summary?.appointments?.completed}
            </p>
          </div>

          <div className="bg-white shadow border border-blue-400 rounded-xl p-6">
            <h3 className="text-gray-500">Upcoming</h3>
            <p className="text-3xl font-bold">
              {summary?.appointments?.upcoming}
            </p>
          </div>
        </div>
      </div>

      {/* — REPORTS */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Reports</h2>
        <div className="grid grid-cols-3 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow border border-blue-400 rounded-xl p-6">
            <h3 className="text-gray-500">Drafts</h3>
            <p className="text-3xl font-bold text-gray-500">
              {summary?.reports?.drafts}
            </p>
          </div>

          <div className="bg-white shadow border border-blue-400 rounded-xl p-6">
            <h3 className="text-gray-500">Submitted</h3>
            <p className="text-3xl font-bold text-gray-500">
              {summary?.reports?.submitted}
            </p>
          </div>

          <div className="bg-white shadow border border-blue-400 rounded-xl p-6">
            <h3 className="text-gray-500">Total Reports</h3>
            <p className="text-3xl font-bold">{summary?.reports?.total}</p>
          </div>
        </div>
      </div>

      {/* activity summary */}

      <div className="bg-white rounded-xl border border-blue-400 px-8 py-9">
        <h1 className="mb-3 font-semibold">Actitvity Overview</h1>
        <p className="mb-3">Summary of your consultation journey</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gray-100  rounded-xl p-6">
            <p className="text-3xl font-bold">
              {summary?.activities?.completedSessions}
            </p>
            <h3 className="text-gray-500">Completed Sessions </h3>
          </div>

          <div className="bg-gray-100 shadow-md rounded-xl p-6">
            <p className="text-3xl font-bold">
              {summary?.activities?.totalAppointments}
            </p>
            <h3 className="text-gray-500">Total Appointments </h3>
          </div>

          <div className="bg-gray-100 shadow-md rounded-xl p-6">
            <p className="text-3xl font-bold">
              {summary?.activities?.totalReports}
            </p>
            <h3 className="text-gray-500">Total Reports</h3>
          </div>

          <div className="bg-gray-100 shadow-md rounded-xl p-6">
            <p className="text-3xl font-bold">
              {summary?.activities?.totalActivities}
            </p>
            <h3 className="text-gray-500">Total Activities</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
