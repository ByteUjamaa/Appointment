import { Calendar, Notebook, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentService from "../../api/appointmentServices";

/* POPUP FORM */
function NewAppointmentModal({ isOpen, onClose, onCreate }) {
  const [types, setTypes] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    date: "",
    time: "",
    note: "",
  });

  useEffect(() => {
    if (isOpen) {
      AppointmentService.getAppointmentTypes().then(setTypes);
      AppointmentService.getTeachers().then(setTeachers);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreate(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold">Book New Appointment</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            name="teacher"
            onChange={(e) => setForm({ ...form, teacher: e.target.value })}
            className="w-full border p-3 rounded"
            required
          >
            <option value="">Select Teacher</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.full_name || t.user?.username}
              </option>
            ))}
          </select>

          <select
            name="appointment_type"
            onChange={(e) =>
              setForm({ ...form, appointment_type: e.target.value })
            }
            className="w-full border p-3 rounded"
            required
          >
            <option value="">Select Type</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            required
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full border p-3 rounded"
          />
          <input
            type="time"
            name="time"
            required
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="w-full border p-3 rounded"
          />
          <textarea
            name="note"
            placeholder="Purpose of appointment"
            rows="3"
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
      </div>
    </div>
  );
}

export default function Appointments() {
  const [statusCount, setStatusCount] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [appts, counts] = await Promise.all([
        AppointmentService.getAppointments(),
        AppointmentService.getStatusCount(),
      ]);
      setAppointments(appts);
      setStatusCount(counts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (form) => {
    await AppointmentService.createAppointment(form);
    loadData();
  };

  /* FILTERED LIST */
  const filteredAppointments =
    activeTab === "all"
      ? appointments
      : appointments.filter((a) => a.status === activeTab);
  if (loading) return <div className="p-6">Loading appointments</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-gray-600">
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

      {/*  SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["pending", "accepted", "completed", "rejected"].map((status) => (
          <div
            key={status}
            className="bg-white border border-blue-400 rounded-lg p-5 text-center"
          >
            <p>{status}</p>
            <p>{statusCount[status] || 0}</p>
          </div>
        ))}
      </div>

      {/*  filter tabs according to status */}
      <div className="w-full bg-gray-300 rounded-full border border-blue-400 p-2 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "accepted", "completed", "rejected"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-fit px-6 py-3 rounded-full font-medium capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-blue-200 text-white shadow-md"
                    : "bg-transparent text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab === "all" ? "All " : tab}
              </button>
            )
          )}
        </div>
      </div>

      {/*  APPOINTMENTS GRID */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        {filteredAppointments.map((a) => (
          <div
            key={a.id}
            className=" p-4 rounded-xl space-y-2 border"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">
                {a.teacher_name || a.teacher?.full_name}
              </h3>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  a.status === "accepted"
                    ? "bg-blue-100 text-blue-700"
                    : a.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : a.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {a.status}
              </span>
            </div>
            <p className="text-gray-600">{a.appointment_type_name || a.type}</p>
            <div className="text-sm space-y-1">
              <p className="flex items-center gap-2">
                <Calendar size={16} /> {a.date}
              </p>
              <p className="flex items-center gap-2">
                <Clock size={16} /> {a.time}
              </p>
              {a.note && (
                <p className="flex items-center gap-2">
                  <Notebook size={16} /> {a.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <NewAppointmentModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
