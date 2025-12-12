import { useEffect, useState } from "react";
import StatCard from "./components/StatCard";
import { Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { getDashboardStats, getRecentActivity } from "../../api/consultantApi";

export default function Home() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const statsData = await getDashboardStats();
      const activityData = await getRecentActivity();

      setStats(statsData);
      setActivity(activityData);
    }
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-5">Welcome back, consultant!</h1>
      <p className="text-gray-500 mb-10">Here’s an overview of your consultation requests</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<Clock />} label="Pending Requests" value={stats?.pending} color="yellow" />
        <StatCard icon={<CheckCircle />} label="Approved Requests" value={stats?.approved} color="green" />
        <StatCard icon={<XCircle />} label="Denied Requests" value={stats?.denied} color="red" />
        <StatCard icon={<TrendingUp />} label="Completed" value={stats?.completed} color="blue" />
      </div>

      {/* Recent Activity */}
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      <div className="bg-white p-5 rounded-xl shadow">
        {activity?.length === 0 ? (
          <p className="text-gray-500">No recent activity</p>
        ) : (
          activity.map((item, i) => (
            <div key={i} className="p-3 border-b last:border-none">
              {item.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

