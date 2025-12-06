import { Calendar, Notebook, Timer } from "lucide-react";
import { useEffect, useState } from "react";
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
    status: "completed",
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    type: "Research Consultation",
    date: "2025-11-29",
    time: "02:00 PM",
    status: "pending",
  },
  {
    id: 3,
    name: "Dr. Emily Davis",
    type: "Thesis Review",
    date: "2025-12-01",
    time: "11:00 AM",
    status: "completed",
  },
];

let MOCK_REPORTS = []; // You can prefill this if needed

/* POPUP FORM */
function NewReportModal({ isOpen, onClose, onCreate, appointments }) {
  const [form, setForm] = useState({
    appointmentId: "",
    description: "",
  });

  if (!isOpen) return null;

  const completedAppointments = appointments.filter(
    (a) => a.status === "completed"
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreate(form);
    onClose();
  };

  const saveDraft = async () => {
    await onCreate({ ...form, status: "draft" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px] space-y-4">
        <h2 className="text-xl font-bold">New Report</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

            <input type="title" placeholder="report title" className=" border p-2 w-full"/> 
            
          <select
            name="appointmentId"
            onChange={handleChange}
            className="border p-2 w-full"
            required
          >
            <option value="">Select Completed Appointment</option>
            {completedAppointments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} — {a.date} ({a.type})
              </option>
            ))}
          </select>
          
          
        

          <textarea
            name="description"
            onChange={handleChange}
            placeholder="Write report..."
            className="border p-2 w-full"
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveDraft}
              className="px-4 py-2 border rounded"
            >
              Save Draft
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  /* LOAD appointments */
  useEffect(() => {
    if (USE_MOCK_DATA) {
      setAppointments(MOCK_APPOINTMENTS);
    } else {
      fetch("/api/appointments")
        .then((res) => res.json())
        .then((data) => setAppointments(data));
    }
  }, []);

  /* LOAD reports */
  useEffect(() => {
    if (USE_MOCK_DATA) {
      setReports(MOCK_REPORTS);
    } else {
      fetch("/api/reports")
        .then((res) => res.json())
        .then((data) => setReports(data));
    }
  }, []);

  const reloadFromAPI = async () => {
    const res = await fetch("/api/reports");
    const data = await res.json();
    setReports(data);
  };

  /* CREATE report */
  const handleCreate = async (form) => {
    const selectedAppointment = appointments.find(
      (a) => a.id === Number(form.appointmentId)
    );

    if (!selectedAppointment) return;

    const newReport = {
      id: Date.now(),
      status: form.status || "submitted",
      name: selectedAppointment.name,
      type: selectedAppointment.type,
      date: selectedAppointment.date,
      time: selectedAppointment.time,
      note: form.description,
    };

    if (USE_MOCK_DATA) {
      MOCK_REPORTS = [...MOCK_REPORTS, newReport];
      setReports([...MOCK_REPORTS]);
    } else {
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReport),
      });
      reloadFromAPI();
    }
  };

  /* COUNTERS */
  const draftCount = reports.filter((a) => a.status === "draft").length;
  const submittedCount = reports.filter((a) => a.status === "submitted").length;
  const reviewedCount = reports.filter((a) => a.status === "reviewed").length;

  /* FILTERED LIST */
  const filteredReports =
    activeTab === "all" ? reports : reports.filter((a) => a.status === activeTab);

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-gray-500">
            Create and manage your consultation and research reports
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-black text-white px-4 py-2 rounded flex items-center gap-2"
        >
          + New Report
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-3 gap-4">
        <div className="border border-blue-400 rounded-xl p-4">
          <p className="text-gray-500">Draft</p>
          <p className="text-2xl font-bold">{draftCount}</p>
        </div>
        <div className="border border-blue-400 rounded-xl p-4">
          <p className="text-gray-500">Submitted</p>
          <p className="text-2xl font-bold">{submittedCount}</p>
        </div>
        <div className="border border-blue-400 rounded-xl p-4">
          <p className="text-gray-500">Reviewed</p>
          <p className="text-2xl font-bold">{reviewedCount}</p>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex bg-gray-300 justify-between rounded-full px-8 py-1 border w-full">
        {[
          { key: "all", label: `All (${reports.length})` },
          { key: "draft", label: `Draft (${draftCount})` },
          { key: "submitted", label: `Submitted (${submittedCount})` },
          { key: "reviewed", label: `Reviewed (${reviewedCount})` },
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

      {/* REPORTS GRID */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        {filteredReports.map((a) => (
          <div
            key={a.id}
            className="p-4 rounded-xl space-y-2 border border-blue-400"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold">{a.name}</h3>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize
                  ${
                    a.status === "draft"
                      ? "bg-blue-100 text-blue-700"
                      : a.status === "submitted"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
              >
                {a.status}
              </span>
            </div>

            <p className="text-gray-500">{a.type}</p>
            <div className="flex items-center gap-2"><Calendar /> <p>{a.date}</p></div>
            <div className="flex items-center gap-2"><Timer /> <p>{a.time}</p></div>
            <div className="flex items-center gap-2"><Notebook /> <p>{a.note}</p></div>
          </div>
        ))}
      </div>

      <NewReportModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={handleCreate}
        appointments={appointments}
      />
    </div>
  );
}
