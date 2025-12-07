import { Home, FileText, BarChart2, User, LogOut } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white shadow-md p-5">
      <h2 className="text-2xl font-bold mb-6">Consultant Portal</h2>

      <ul className="space-y-4">
        <li className="flex items-center gap-3 p-3 bg-purple-600 text-white rounded-lg cursor-pointer">
          <Home /> Home
        </li>

        <li className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
          <FileText /> Requests
        </li>

        <li className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
          <BarChart2 /> Reports
        </li>

        <li className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
          <User /> Profile
        </li>

        <li className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer text-red-600">
          <LogOut /> Logout
        </li>
      </ul>
    </div>
  );
}
