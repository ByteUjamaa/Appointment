import { useEffect, useState } from "react";
import { Calendar, Clock, Notebook, ChevronDown } from "lucide-react";
import AppointmentService from "../../api/appointmentServices";

export default function ConsultantReports({ studentId }) {
  const [reports, setReports] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedReports, setExpandedReports] = useState(new Set());
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [appointmentsData, teachersData, reportsData] = await Promise.all([
          AppointmentService.getAppointments(),
          AppointmentService.getTeachers(),
          AppointmentService.getReports(), // ✅ CORRECT ENDPOINT
        ]);

        // 🔍 FILTER REPORTS BY STUDENT
        const studentReports = studentId
          ? reportsData.filter((r) => r.student === studentId)
          : reportsData;

        setAppointments(appointmentsData || []);
        setTeachers(teachersData || []);
        setReports(studentReports || []);
      } catch (err) {
        console.error("Failed to load data:", err);
        alert("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [studentId]);

  const toggleReportExpansion = (reportId) => {
    setExpandedReports((prev) => {
      const next = new Set(prev);
      next.has(reportId) ? next.delete(reportId) : next.add(reportId);
      return next;
    });
  };

  const draftCount = reports.filter((r) => r.status === "draft").length;
  const submittedCount = reports.filter((r) => r.status === "submitted").length;
  const reviewedCount = reports.filter((r) => r.status === "reviewed").length;

  const filteredReports =
    activeTab === "all"
      ? reports
      : reports.filter((r) => r.status === activeTab);

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading reports...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Student Reports</h1>

      {/* Tabs */}
      <div className="bg-gray-100 rounded-full p-1 inline-flex gap-2">
        {[
          { key: "all", label: `All (${reports.length})` },
          { key: "draft", label: `Draft (${draftCount})` },
          { key: "submitted", label: `Submitted (${submittedCount})` },
          { key: "reviewed", label: `Reviewed (${reviewedCount})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-full font-medium ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No reports found
          </p>
        ) : (
          filteredReports.map((report) => {
            const appointment = appointments.find(
              (a) => a.id === report.appointment
            );
            const teacher = teachers.find(
              (t) => t.id === appointment?.supervisor
            );

            const isExpanded = expandedReports.has(report.id);

            return (
              <div
                key={report.id}
                className="bg-white border rounded-xl p-5 space-y-4"
              >
                <div className="flex justify-between">
                  <h3 className="font-bold">
                    {report.title || "Untitled Report"}
                  </h3>
                  <span className="text-xs uppercase font-bold">
                    {report.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  Supervisor:{" "}
                  {teacher
                    ? `${teacher.first_name} ${teacher.last_name}`
                    : "Unknown"}
                </p>

                <div className="text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <Calendar size={16} /> {appointment?.date || "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={16} /> {appointment?.time || "N/A"}
                  </p>
                </div>

                <button
                  onClick={() => toggleReportExpansion(report.id)}
                  className="w-full flex justify-between items-center font-medium"
                >
                  <span className="flex gap-2 items-center">
                    <Notebook size={16} /> Report Content
                  </span>
                  <ChevronDown
                    className={`transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">
                    {report.content || "No content"}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
