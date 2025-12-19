import React, { useState, useEffect } from "react";
import AppointmentService from "../../api/appointmentServices";

export default function Home() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        setLoading(true);
        // Assuming you have a proper dashboard endpoint
        // If not, update AppointmentService to include getDashboardSummary()
        const data = await AppointmentService.getDashboardSummary();
        setSummary(data);
      } catch (err) {
        console.error("Failed to load dashboard summary", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardSummary();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6"
              >
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-4"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Fallback safe access
  const appointments = summary?.appointments || {};
  const reports = summary?.reports || {};
  const activities = summary?.activities || {};

  return (
    <div className="p-6 space-y-10 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="text-start">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back, {/* Replace with actual user name when available */}
          {summary?.user_name || "Student"}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Here's an overview of your consultation activities
        </p>
      </div>

      {/* APPOINTMENTS SUMMARY */}
      <section>
        <h2 className="text-xl font-semibold mb-5 text-gray-800 dark:text-gray-100">
          Appointments
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Pending"
            value={appointments.pending || 0}
            color="text-yellow-600"
          />
          <DashboardCard
            title="Accepted"
            value={appointments.accepted || 0}
            color="text-blue-600"
          />
          <DashboardCard
            title="Completed"
            value={appointments.completed || 0}
            color="text-green-600"
          />
          <DashboardCard
            title="Upcoming"
            value={appointments.upcoming || appointments.accepted || 0}
            color="text-purple-600"
          />
        </div>
      </section>

      {/* REPORTS SUMMARY */}
      <section>
        <h2 className="text-xl font-semibold mb-5 text-gray-800 dark:text-gray-100">
          Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard title="Drafts" value={reports.drafts || 0} />
          <DashboardCard title="Submitted" value={reports.submitted || 0} />
          <DashboardCard
            title="Total Reports"
            value={reports.total || 0}
            highlight
          />
        </div>
      </section>

      {/* ACTIVITY OVERVIEW */}
      <section className="bg-white dark:bg-gray-900 border border-blue-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
          Activity Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Summary of your consultation journey
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ActivityCard
            label="Completed Sessions"
            value={activities.completedSessions || 0}
          />
          <ActivityCard
            label="Total Appointments"
            value={activities.totalAppointments || 0}
          />
          <ActivityCard
            label="Total Reports"
            value={activities.totalReports || 0}
          />
          <ActivityCard
            label="Total Activities"
            value={activities.totalActivities || 0}
            highlight
          />
        </div>
      </section>
    </div>
  );
}

// Reusable Card Components for Clean Code
function DashboardCard({
  title,
  value,
  color = "text-gray-700",
  highlight = false,
}) {
  return (
    <div
      className={`bg-white dark:bg-gray-900 border-2 ${
        highlight
          ? "border-blue-500 shadow-lg"
          : "border-blue-300 dark:border-gray-700"
      } rounded-xl p-6 text-center transition hover:shadow-md`}
    >
      <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium">
        {title}
      </h3>
      <p
        className={`text-4xl font-bold mt-3 ${color} ${
          highlight ? "text-blue-700" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ActivityCard({ label, value, highlight = false }) {
  return (
    <div
      className={`bg-gray-50 rounded-xl p-6 text-center ${
        highlight ? "ring-2 ring-blue-500 shadow-md" : ""
      }`}
    >
      <p className={`text-4xl font-bold ${highlight ? "text-blue-700" : "text-gray-800"}`}>
        {value}
      </p>
      <h3 className="text-gray-600 text-sm mt-3">{label}</h3>
    </div>
  );
}