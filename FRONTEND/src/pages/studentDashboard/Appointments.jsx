import { Calendar, Notebook, Timer } from "lucide-react";
import { useEffect, useState, } from "react";
import { useNavigate } from "react-router-dom";

/* MOCK TO API SWITCH */
const USE_MOCK_DATA = true;

/* MOCK DATA */
let MOCK_APPOINTMENTS = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    type: "Academic Advising",
    date: "2025-11-28",
    time: "10:00 AM",
    note: "Discuss dissertation progress",
    status: "accepted",
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    type: "Research Consultation",
    date: "2025-11-26",
    time: "2:00 PM",
    note: "Review methodology chapter",
    status: "pending",
  },
  {
    id: 3,
    name: "Prof. Michael Chen",
    type: "Research Consultation",
    date: "2025-11-26",
    time: "2:00 PM",
    note: "Review methodology chapter",
    status: "rejected",
  },
  {
    id: 4,
    name: "Prof. Michael Chen",
    type: "Research Consultation",
    date: "2025-11-26",
    time: "2:00 PM",
    note: "Review methodology chapter",
    status: "completed",
  },
];

/* POPUP FORM */
function NewAppointmentModal({ isOpen, onClose, onCreate }) {
  const [form, setForm] = useState({
    name: "",
    type: "",
    date: "",
    time: "",
    note: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreate(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px] space-y-4">
        <h2 className="text-xl font-bold">New Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-4"> 
        <input name="name" onChange={handleChange} placeholder="Doctor / Professor" className="border p-2 w-full" />
        <input name="type" onChange={handleChange} placeholder="Consultation Type" className="border p-2 w-full" />
        <input name="date" type="date" onChange={handleChange} className="border p-2 w-full" />
        <input name="time" type="time" onChange={handleChange} className="border p-2 w-full" />
        <textarea name="note" onChange={handleChange} placeholder="Purpose" className="border p-2 w-full" />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
          type="submit"
           className="px-4 py-2 bg-black text-white rounded">
            Create
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [openModal, setOpenModal] = useState(false)
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  /* LOAD APPOINTMENTS */
  useEffect(() => {
    if (USE_MOCK_DATA) {
      setAppointments(MOCK_APPOINTMENTS);
    } else {
      fetch("http://127.0.0.1:8000/api/appointments/")
        .then((res) => res.json())
        .then((data) => setAppointments(data));
    }
  }, []);

   const reloadFromAPI = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/appointments/");
    const data = await res.json();
    setAppointments(data);
  };


  /* CREATE  appointments*/
  const handleCreate = async (form) => {
    if (USE_MOCK_DATA) {
      const newAppointment = {
        id: Date.now(),
        status: "pending",
        ...form,
      };
      MOCK_APPOINTMENTS = [...MOCK_APPOINTMENTS, newAppointment];
      setAppointments([...MOCK_APPOINTMENTS]);
    } else {
      await fetch("http://127.0.0.1:8000/api/appointments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      reloadFromAPI();
    }
  };

  


  /* COUNTERS */
  const pendingCount = appointments.filter(a => a.status === "pending").length;
  const acceptedCount = appointments.filter(a => a.status === "accepted").length;
  const completedCount = appointments.filter(a => a.status === "completed").length;
  const rejectedCount = appointments.filter(a => a.status === "rejected").length;


  /* FILTERED LIST */
  const filteredAppointments =
    activeTab === "all"
      ? appointments
      : appointments.filter((a) => a.status === activeTab);

  return (
    <div className="p-6 space-y-6">

      {/*  HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-gray-500">Manage your consultation appointments</p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-black text-white px-4 py-2 rounded flex items-center gap-2"
        >
          + New Appointment
        </button>
      </div>

      {/*  SUMMARY CARDS */}
      <div className="grid grid-cols-4 gap-4">
        <div className="border border-blue-400 rounded-xl p-4">
          <p className="text-gray-500">Pending</p>
          <p className="text-2xl font-bold">{pendingCount}</p>
        </div>
        <div className="border border-blue-400 rounded-xl p-4">
          <p className="text-gray-500">Accepted</p>
          <p className="text-2xl font-bold">{acceptedCount}</p>
        </div>
        <div className="border border-blue-400 rounded-xl p-4">
          <p className="text-gray-500">Completed</p>
          <p className="text-2xl font-bold">{completedCount}</p>
        </div>
        <div className="border border-blue-400 rounded-xl p-4">
          <p className="text-gray-500">Rejected</p>
          <p className="text-2xl font-bold">{rejectedCount}</p>
        </div>
      </div>

      {/*  FILTER TABS WITH SELECTIVE BORDER */}
      <div className="flex bg-gray-300 justify-between rounded-full px-8 py-1 border  w-full">

        {[
          { key: "all", label: `All (${appointments.length})` },
          { key: "pending", label: `Pending (${pendingCount})` },
          { key: "accepted", label: `Accepted (${acceptedCount})` },
          { key: "completed", label: `Completed (${completedCount})` },
          { key: "rejected", label: `Rejected (${rejectedCount})` },

        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-1 rounded-full border-blue-400 font-medium transition
              ${
                activeTab === tab.key
                  ? "bg-white border"
                  : "text-gray-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/*  APPOINTMENTS GRID */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        {filteredAppointments.map((a) => (
          <div
            key={a.id}
            className=" p-4 rounded-xl space-y-2 border border-blue-400"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold">{a.name}</h3>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize
                  ${
                    a.status === "accepted"
                      ? "bg-blue-100 text-blue-700"
                      : a.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : a.status ==="completed"
                      ?"bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
              >
                {a.status}
              </span>
            </div>

            <p className="text-gray-500">{a.type}</p>
            <Calendar/> <p>{a.date}</p>
            <p><Timer/> {a.time}</p>
            <p><Notebook/> {a.note}</p>
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
