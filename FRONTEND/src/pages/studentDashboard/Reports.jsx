import {
  Calendar,
  Clock,
  Notebook,
  Edit2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import AppointmentService from "../../api/appointmentServices";

function ReportModal({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  appointments,
  teachers,
  editReport = null,
}) {
  const [form, setForm] = useState({
    title: "",
    appointmentId: "",
    description: "",
  });

  const isEditing = !!editReport;

  // Initialize form when modal opens or editReport changes
  useEffect(() => {
    if (isOpen) {
      if (editReport) {
        setForm({
          title: editReport.title || "",
          appointmentId: editReport.appointment?.toString() || "",
          description: editReport.content || "",
        });
      } else {
        setForm({
          title: "",
          appointmentId: "",
          description: "",
        });
      }
    }
  }, [isOpen, editReport]);

  if (!isOpen) return null;

  const acceptedAppointments = appointments.filter(
    (a) => a.status?.toLowerCase() === "accepted"
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.appointmentId || !form.title.trim()) return;

    const reportData = {
      appointment: Number(form.appointmentId),
      title: form.title.trim(),
      content: form.description.trim(),
    };

    if (isEditing) {
      // Update draft first
      await onUpdate(editReport.id, reportData);
      // Then submit
      await AppointmentService.submitReport(editReport.id);
    } else {
      // Create draft
      const newReport = await onCreate(reportData);
      // Submit it
      await AppointmentService.submitReport(newReport.id);
    }

    onClose();
  };

  const handleSaveDraft = async (e) => {
    e.preventDefault();
    if (!form.appointmentId || !form.title.trim()) return;

    const reportData = {
      appointment: Number(form.appointmentId),
      title: form.title.trim(),
      content: form.description.trim(),
      status: "draft",
    };

    if (isEditing) {
      await onUpdate(editReport.id, reportData);
    } else {
      await onCreate(reportData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Edit Report" : "New Report"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Report Title (e.g., Progress Review Meeting)"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />

          <select
            name="appointmentId"
            value={form.appointmentId}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
            disabled={isEditing} // Disable appointment change when editing
          >
            <option value="">Select an Accepted Appointment</option>
            {acceptedAppointments.length === 0 ? (
              <option disabled>No accepted appointments available</option>
            ) : (
              acceptedAppointments.map((a) => {
                const teacher = teachers.find((t) => t.id === a.supervisor);
                const supervisorName = teacher
                  ? `${teacher.title || ""} ${teacher.first_name || ""} ${
                      teacher.last_name || ""
                    }`.trim() || "Unknown Supervisor"
                  : "Unknown Supervisor";

                const typeLabel = a.appointment_type_label || "Meeting";

                return (
                  <option key={a.id} value={a.id}>
                    {supervisorName} — {a.date} at {a.time} ({typeLabel})
                  </option>
                );
              })
            )}
          </select>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Write your meeting outcomes, discussions, and action points..."
            rows="6"
            className="w-full border border-gray-300 p-3 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isEditing ? "Update Report" : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [expandedReports, setExpandedReports] = useState(new Set()); // ✅ Track expanded reports

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [appointmentsData, teachersData, reportsData] = await Promise.all(
          [
            AppointmentService.getAppointments(),
            AppointmentService.getTeachers(),
            AppointmentService.getReports(),
          ]
        );

        setAppointments(appointmentsData || []);
        setTeachers(teachersData || []);
        setReports(reportsData || []);
      } catch (err) {
        console.error("Failed to load data:", err);
        alert("Failed to load reports or appointments.");
        setAppointments([]);
        setTeachers([]);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCreate = async (reportData) => {
    const report = await AppointmentService.createReport(reportData);
    const updatedReports = await AppointmentService.getReports();
    setReports(updatedReports || []);
    return report;
  };

  const handleUpdate = async (reportId, reportData) => {
    console.log("Updating report:", reportId, reportData);
    try {
      await AppointmentService.updateReport(reportId, reportData);
      const updatedReports = await AppointmentService.getReports();
      setReports(updatedReports || []);
    } catch (err) {
      console.error("Failed to update report:", err);
      alert(
        "Failed to update report: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleEdit = (report) => {
    // Double-check that only draft reports can be edited
    if (report.status?.toLowerCase() !== "draft") {
      alert(
        "Only draft reports can be edited. Submitted and reviewed reports are locked."
      );
      return;
    }

    setEditingReport(report);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingReport(null);
  };

  //  Toggle report expansion
  const toggleReportExpansion = (reportId) => {
    setExpandedReports((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reportId)) {
        newSet.delete(reportId);
      } else {
        newSet.add(reportId);
      }
      return newSet;
    });
  };

  // Truncate text function
  const truncateText = (text, maxLength = 150) => {
    if (!text) return "No content written yet.";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const draftCount = reports.filter(
    (r) => r.status?.toLowerCase() === "draft"
  ).length;
  const submittedCount = reports.filter(
    (r) => r.status?.toLowerCase() === "submitted"
  ).length;
  const reviewedCount = reports.filter(
    (r) => r.status?.toLowerCase() === "reviewed"
  ).length;

  const filteredReports =
    activeTab === "all"
      ? reports
      : reports.filter((r) => r.status?.toLowerCase() === activeTab);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">Loading reports...</div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">
            Write reports for your accepted supervision sessions
          </p>
        </div>
        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          + New Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-blue-200 rounded-xl p-6 text-center shadow-sm">
          <p className="text-gray-600">Drafts</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{draftCount}</p>
        </div>
        <div className="bg-white border-2 border-blue-200 rounded-xl p-6 text-center shadow-sm">
          <p className="text-gray-600">Submitted</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {submittedCount}
          </p>
        </div>
        <div className="bg-white border-2 border-blue-200 rounded-xl p-6 text-center shadow-sm">
          <p className="text-gray-600">Reviewed</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {reviewedCount}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-gray-100 rounded-full p-1 inline-flex flex-wrap gap-2">
        {[
          { key: "all", label: `All (${reports.length})` },
          { key: "draft", label: `Draft (${draftCount})` },
          { key: "submitted", label: `Submitted (${submittedCount})` },
          { key: "reviewed", label: `Reviewed (${reviewedCount})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {filteredReports.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-10">
            {activeTab === "all"
              ? "No reports created yet. Create one for an accepted appointment."
              : `No ${activeTab} reports found.`}
          </p>
        ) : (
          filteredReports.map((report) => {
            const appointment = appointments.find(
              (a) => a.id === report.appointment
            );
            const teacher = teachers.find(
              (t) => t.id === appointment?.supervisor
            );
            const supervisorName = teacher
              ? `${teacher.title || ""} ${teacher.first_name || ""} ${
                  teacher.last_name || ""
                }`.trim() || "Unknown Supervisor"
              : "Unknown Supervisor";

            const date = appointment?.date || "N/A";
            const time = appointment?.time || "N/A";
            const isDraft = report.status?.toLowerCase() === "draft";
            const isExpanded = expandedReports.has(report.id); // Check if expanded
            const content = report.content || "No content written yet.";
            const toggleReportExpansion = (id) => {
              setExpandedReports((prev) => {
                const newSet = new Set(prev);
                newSet.has(id) ? newSet.delete(id) : newSet.add(id);
                return newSet;
              });
            };

            return (
              <div
                key={report.id}
                className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-900">
                    {report.title || "Untitled Report"}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        isDraft
                          ? "bg-blue-100 text-blue-800"
                          : report.status?.toLowerCase() === "submitted"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {report.status || "draft"}
                    </span>
                    {/*  ONLY show edit button for DRAFT reports */}
                    {isDraft && (
                      <button
                        onClick={() => handleEdit(report)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit report"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  From session with <strong>{supervisorName}</strong>
                </p>

                <div className="text-sm text-gray-600 space-y-1">
                  <p className="flex items-center gap-2">
                    <Calendar size={16} /> {date}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={16} /> {time}
                  </p>
                </div>

                {/*  Content with View More/Less toggle */}
                {/* Expandable Report Content */}
                <div className="border-t pt-4 mt-4">
                  <button
                    onClick={() => toggleReportExpansion(report.id)}
                    className="w-full flex items-center justify-between text-left font-medium text-gray-800 hover:text-blue-600 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Notebook size={18} />
                      Report Content
                      {!isExpanded && content && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          View
                        </span>
                      )}
                    </span>

                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-4 space-y-3">
                      {content ? (
                        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                          <p className="text-gray-800 whitespace-pre-wrap text-sm">
                            {content}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">
                          No content written yet.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <ReportModal
        isOpen={openModal}
        onClose={handleCloseModal}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        appointments={appointments}
        teachers={teachers}
        editReport={editingReport}
      />
    </div>
  );
}
