import { useEffect, useState } from "react";
import StatCard from "./components/StatCard";
import { Clock, CheckCircle, XCircle, TrendingUp, Loader2 } from "lucide-react";
import appointmentServices from "../../api/appointmentServices";

export default function Consultanthome({ userName, currentUser }) {
 const displayName = userName ||currentUser?.username || "Supervisor";
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [statsData, activityData] = await Promise.all([
          appointmentServices.getDashboardStats(),
          appointmentServices.getRecentActivity(),
        ]);

        setStats(statsData);
        setActivity(activityData || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-96">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-5">
        Welcome back, {displayName}!
      </h1>
      <p className="text-gray-500 mb-10">
        Here’s an overview of your consultation requests
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="Pending Requests"
          value={stats?.pending ?? 0}
          color="yellow"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          label="Accepted Requests"
          value={stats?.accepted ?? 0}
          color="green"
        />
        <StatCard
          icon={<XCircle className="w-6 h-6" />}
          label="Rejected Requests"
          value={stats?.rejected ?? 0}
          color="red"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Completed"
          value={stats?.completed ?? 0}
          color="blue"
        />
      </div>

      {/* Recent Activity */}
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      <div className="bg-white p-5 rounded-xl shadow">
        {activity.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        ) : (
          activity.map((item, i) => (
            <div
              key={item.id || i} // Prefer unique ID if available
              className="p-3 border-b last:border-none text-gray-800"
            >
              {item.note || "No message"}
            </div>
          ))
        )}
      </div>
    </div>
  );
}