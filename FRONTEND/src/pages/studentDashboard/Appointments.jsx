import {
  Calendar,
  Notebook,
  Clock,
  ChevronDown,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import AppointmentService from "../../api/appointmentServices";

function NewAppointmentModal({ isOpen, onClose, onCreate }) {
  const [types, setTypes] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    teacher: "",
    appointment_type: "",
    date: "",
    time: "",
    note: "",
  });

  // Compute today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  //  If you want to block today and only allow future dates (e.g. tomorrow+)
  // const tomorrow = new Date();
  // tomorrow.setDate(tomorrow.getDate() + 1);
  // const minDate = tomorrow.toISOString().split("T")[0];

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      Promise.all([
        AppointmentService.getAppointmentTypes(),
        AppointmentService.getTeachers(),
      ])
        .then(([typesData, teachersData]) => {
          setTypes(typesData || []);
          setTeachers(teachersData || []);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onCreate(form);
      onClose();
      setForm({
        teacher: "",
        appointment_type: "",
        date: "",
        time: "",
        note: "",
      });
    } catch (err) {
      console.error("Failed to create appointment", err);
      alert("Failed to book appointment. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4 shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900">
          Book New Appointment
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading options...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={form.teacher}
              onChange={(e) => setForm({ ...form, teacher: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {`${t.title || ""} ${t.first_name || ""} ${
                    t.last_name || ""
                  }`.trim() || "Unnamed Supervisor"}
                </option>
              ))}
            </select>

            <select
              value={form.appointment_type}
              onChange={(e) =>
                setForm({ ...form, appointment_type: e.target.value })
              }
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Type</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label || t.value || "Unnamed Type"}
                </option>
              ))}
            </select>

            {/* Date input with min=today */}
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              min={today} // This blocks all past dates
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />

            <textarea
              placeholder="Purpose of appointment (optional)"
              rows="3"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
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
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Book Appointment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [types, setTypes] = useState([]);
  const [statusCount, setStatusCount] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  // Per-appointment state for supervisor responses
  const [expandedAppointments, setExpandedAppointments] = useState({}); // { id: true/false }
  const [responses, setResponses] = useState({}); // { id: data | null }
  const [loadingResponses, setLoadingResponses] = useState({}); // { id: true/false }

  const loadData = async () => {
    setLoading(true);
    try {
      const [appts, counts, teachersData, typesData] = await Promise.all([
        AppointmentService.getAppointments(),
        AppointmentService.getStatusCount(),
        AppointmentService.getTeachers(),
        AppointmentService.getAppointmentTypes(),
      ]);

      const calculatedCounts = appts.reduce((acc, apt) => {
        const status = apt.status?.toLowerCase();
        if (status) acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      setAppointments(appts);
      setTeachers(teachersData || []);
      setTypes(typesData || []);
      setStatusCount(calculatedCounts);
    } catch (err) {
      console.error("Failed to load data", err);
      alert("Failed to load data. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Pre-fetch responses for appointments that are in final status
  useEffect(() => {
    appointments.forEach((a) => {
      const status = a.status?.toLowerCase();
      if (["accepted", "rejected", "completed"].includes(status)) {
        if (responses[a.id] === undefined && !loadingResponses[a.id]) {
          fetchResponse(a.id);
        }
      }
    });
  }, [appointments]);

  const fetchResponse = async (appointmentId) => {
    setLoadingResponses((prev) => ({ ...prev, [appointmentId]: true }));
    try {
      const data = await AppointmentService.getAppointmentResponse(
        appointmentId
      );
      setResponses((prev) => ({ ...prev, [appointmentId]: data }));
    } catch (err) {
      if (err.response?.status === 404) {
        setResponses((prev) => ({ ...prev, [appointmentId]: null }));
      } else {
        console.error(`Failed to fetch response for ${appointmentId}`, err);
        setResponses((prev) => ({ ...prev, [appointmentId]: null }));
      }
    } finally {
      setLoadingResponses((prev) => ({ ...prev, [appointmentId]: false }));
    }
  };

  const toggleResponse = (appointmentId) => {
    setExpandedAppointments((prev) => ({
      ...prev,
      [appointmentId]: !prev[appointmentId],
    }));

    // Fetch only when expanding and not already loaded
    if (
      !expandedAppointments[appointmentId] &&
      responses[appointmentId] === undefined
    ) {
      fetchResponse(appointmentId);
    }
  };

  const handleCreate = async (form) => {
    const payload = {
      supervisor: form.teacher,
      appointment_type: form.appointment_type,
      date: form.date,
      time: form.time,
      description: form.note,
    };

    await AppointmentService.createAppointment(payload);
    await loadData();
  };

  const filteredAppointments =
    activeTab === "all"
      ? appointments
      : appointments.filter((a) => a.status?.toLowerCase() === activeTab);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-800">
        Loading appointments...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">
            Book and track your supervision sessions
          </p>
        </div>
        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          + New Appointment
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {["pending", "accepted", "completed", "rejected"].map((key) => (
          <div
            key={key}
            className="bg-white border-2 border-blue-200 rounded-xl p-6 text-center shadow-sm"
          >
            <p className="text-gray-600 capitalize">{key}</p>
            <p className="text-3xl font-bold mt-2 text-blue-600">
              {statusCount[key] || 0}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gray-100 rounded-full p-1 inline-flex flex-wrap gap-2">
        {["all", "pending", "accepted", "completed", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-medium capitalize transition-all ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab !== "all" && ` (${statusCount[tab] || 0})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {filteredAppointments.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-10">
            No appointments found.
          </p>
        ) : (
          filteredAppointments.map((a) => {
            const teacher = teachers.find((t) => t.id === a.supervisor);
            const teacherName = teacher
              ? `${teacher.title || ""} ${teacher.first_name || ""} ${
                  teacher.last_name || ""
                }`.trim() || "Unknown Teacher"
              : "Unknown Teacher";

            const aptType = types.find((t) => t.id === a.appointment_type);
            const typeLabel =
              aptType?.label || aptType?.value || "General Meeting";

            const currentStatus = a.status?.toLowerCase() || "pending";
            const isFinalStatus = [
              "accepted",
              "rejected",
              "completed",
            ].includes(currentStatus);

            // Per-card response state
            const responseData = responses[a.id];
            const isLoading = loadingResponses[a.id];
            const hasResponse = !!(
              responseData?.supervisor_comment?.trim() ||
              responseData?.confirmed_datetime?.trim()
            );
            // const hasResponse = !!responseData?.confirmed_date_time?.trim();
            console.log(responseData?.supervisor_comment);
            console.log(responseData?.confirmed_datetime);

            const isExpanded = !!expandedAppointments[a.id];

            return (
              <div
                key={a.id}
                className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-900">
                    {teacherName}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      statusColors[currentStatus] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {a.status || "pending"}
                  </span>
                </div>

                <p className="text-blue-700 font-medium">{typeLabel}</p>

                <div className="text-sm text-gray-600 space-y-2">
                  <p className="flex items-center gap-2">
                    <Calendar size={16} /> {a.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={16} /> {a.time}
                  </p>
                  {a.description && (
                    <p className="flex items-start gap-2">
                      <Notebook size={16} className="mt-0.5 flex-shrink-0" />
                      <span className="break-words">{a.description}</span>
                    </p>
                  )}
                </div>

                {isFinalStatus && (
                  <div className="border-t pt-4 mt-4">
                    <button
                      onClick={() => toggleResponse(a.id)}
                      className="w-full flex items-center justify-between text-left font-medium text-gray-800 hover:text-blue-600 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <MessageSquare size={18} />
                        Supervisor Response
                        {hasResponse && !isExpanded && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                      </span>
                      {isLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <ChevronDown
                          size={20}
                          className={`transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-4 space-y-3">
                        {isLoading ? (
                          <p className="text-center text-gray-500 py-4">
                            <Loader2
                              className="inline animate-spin mr-2"
                              size={16}
                            />
                            Loading response...
                          </p>
                        ) : hasResponse ? (
                          <>
                            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                              <p className="text-gray-800 whitespace-pre-wrap">
                                {responseData.supervisor_comment}
                              </p>
                                <p className="text-gray-800 whitespace-pre-wrap">
                                {responseData.confirmed_datetime
                                  ? `Confirmed Date & Time: ${new Date(
                                      responseData.confirmed_datetime
                                    ).toLocaleString()}`
                                  : ""}
                              </p>
                            
                            </div>
                            {responseData.updated_at && (
                              <p className="text-xs text-gray-500">
                                Responded on:{" "}
                                {new Date(
                                  responseData.updated_at
                                ).toLocaleString()}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-500 italic">
                            No response provided by supervisor yet.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <NewAppointmentModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
