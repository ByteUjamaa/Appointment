import { Calendar, Notebook, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import AppointmentService from "../../api/appointmentServices";

/* POPUP FORM */
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
      <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold">Book New Appointment</h2>

        {loading ? (
          <p>Loading options...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={form.teacher}
              onChange={(e) => setForm({ ...form, teacher: e.target.value })}
              className="w-full border p-3 rounded text-gray-900"
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
              className="w-full border p-3 rounded text-gray-900"
              required
            >
              <option value="">Select Type</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label || t.value || "Unnamed Type"}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border p-3 rounded"
              required
            />
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full border p-3 rounded"
              required
            />
            <textarea
              placeholder="Purpose of appointment"
              rows="3"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full border p-3 rounded"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded"
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
  const [statusCount, setStatusCount] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [types, setTypes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fixed: Added getTeachers() — now 4 promises, 4 values
      const [appts, counts, teachersData, typesData] = await Promise.all([
        AppointmentService.getAppointments(),
        AppointmentService.getStatusCount(),
        AppointmentService.getTeachers(), // ← This was missing!
        AppointmentService.getAppointmentTypes(),
      ]);
      
      // Fallback to calculating from appointments
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

  const statusConfig = {
    all: { label: "All", color: "gray" },
    pending: { label: "Pending", color: "yellow" },
    accepted: { label: "Accepted", color: "blue" },
    completed: { label: "Completed", color: "green" },
    rejected: { label: "Rejected", color: "red" },
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-800 dark:text-gray-100">
        Loading appointments...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Appointments
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Book and track your supervision sessions
          </p>
        </div>
        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg flex items-center gap-2"
        >
          + New Appointment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Object.entries(statusConfig)
          .filter(([key]) => key !== "all")
          .map(([key, config]) => (
            <div
              key={key}
              className="bg-white dark:bg-gray-900 border-2 border-blue-200 dark:border-gray-700 rounded-xl p-6 text-center shadow-sm"
            >
              <p className="text-gray-600 dark:text-gray-300 capitalize">
                {config.label}
              </p>
              <p className="text-3xl font-bold mt-2 text-blue-600">
                {statusCount[key] || 0}
              </p>
            </div>
          ))}
      </div>

      {/* Tabs */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1 inline-flex flex-wrap gap-2">
        {Object.keys(statusConfig).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-medium capitalize transition-all ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {statusConfig[tab].label}
            {tab !== "all" && ` (${statusCount[tab] || 0})`}
          </button>
        ))}
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            return (
              <div
                key={a.id}
                className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{teacherName}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      a.status?.toLowerCase() === "accepted"
                        ? "bg-blue-100 text-blue-800"
                        : a.status?.toLowerCase() === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : a.status?.toLowerCase() === "completed"
                        ? "bg-green-100 text-green-800"
                        : a.status?.toLowerCase() === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800" // fallback
                    }`}
                  >
                    {a.status || "unknown"}
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
                      <Notebook size={16} className="mt-0.5" />
                      <span>{a.description}</span>
                    </p>
                  )}
                </div>
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
