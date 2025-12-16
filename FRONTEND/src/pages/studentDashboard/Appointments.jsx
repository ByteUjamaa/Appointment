import { Calendar, Notebook, Clock } from "lucide-react";

//useState store component data(state) while useState run code when component loads or updates 
import { useEffect, useState } from "react";

// file contains the API service layer
import AppointmentService from "../../api/appointmentServices";

/* POPUP FORM */ // to create new appointment modal
//this is the moda; component hat ahndle behavior of forms when openes and closes
function NewAppointmentModal({ isOpen, onClose, onCreate }) {

  //creating the modal state for appointment creation
  const [types, setTypes] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const[loading, setLoading] = useState(false)

  //stores user input annd control the the form approach
  const [form, setForm] = useState({
    teacher: "",
    appointment_type: "",
    date: "",
    time: "",
    note: "",
  });


  //when thee form modal is open fetch the teachers and appointment type it runs only when the form modal is opened 
  useEffect(()=>{
    setLoading(true);
    if (isOpen){

      //runs both the API requests in parallel and ensure faster sequential calls
    Promise.all([
      AppointmentService.getAppointmentTypes(),
      AppointmentService.getTeachers()
    ])

    //after running it stores the API repsonses in state
    .then(([typesData, teachersData])=>{
      setTypes(typesData);
      setTeachers(teachersData);

    })
    //the. is stops the loading spinner even if error occurs 
    .finally(()=> setLoading(false))
  }
  },[isOpen]);


  //this for form submission so onsubmiting the form it prevents the page reload 
 const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      //this sends ther form data to parent component the parent decides how to create the appointment 
      await onCreate(form);
      //on closes the form modal then resent the  form so that the next user can use the form again
      onClose();
      // Reset form for next time
      setForm({ teacher: "", appointment_type: "", date: "", time: "", note: "" });
    } catch (err) {
      console.error("Failed to create appointment", err);
      alert("Failed to book appointment. Please try again.");
    }
  };

  //if the form modal is not opened then dont return the form
  if (!isOpen) return null;

  return (

    //full screen overly and dark background focus
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold">Book New Appointment</h2>

    {/* shows loading message while fetching the teachers and types  */}
    {loading ?(
      <p>Loading options</p>
    ):(

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            name="teacher"
            onChange={(e) => setForm({ ...form, teacher: e.target.value })}
            className="w-full border p-3 rounded text-gray-900"
            required
          >
            <option value="">Select Teacher</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {/* SupervisorProfileSerializer gives first_name, last_name, title */}
                {`${t.title || ""} ${t.first_name || ""} ${t.last_name || ""}`.trim() ||
                  "Unnamed Supervisor"}
              </option>
            ))}
          </select>

          <select
            name="appointment_type"
            onChange={(e) =>
              setForm({ ...form, appointment_type: e.target.value })
            }
            className="w-full border p-3 rounded text-gray-900"
            required
          >
            <option value="">Select Type</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
               {/* taking the value of the appointment type */}
                {t.label || t.value}
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
        )}
      </div>
    </div>
  );
}


//for the main appointments components
export default function Appointments() {

  const [statusCount, setStatusCount] = useState({});   //stores the count of appointmnet status
  const [appointments, setAppointments] = useState([]);  //list all appoinmernts
  const [openModal, setOpenModal] = useState(false); //controls the modal when opened and closes 
  const [activeTab, setActiveTab] = useState("all"); //used for filtering appointmwnrts 
  const [loading, setLoading] = useState(true); //shows loading screen while data loads

 
const loadData = async () => {
  setLoading(true);
  try {
    const [appts, counts] = await Promise.all([
      AppointmentService.getAppointments(),
      AppointmentService.getStatusCount(),
    ]);

    // DEBUG: See exactly what the backend sends
    console.log("Raw status counts from API:", counts);
    console.log("Type of counts:", typeof counts);
    console.log("Is array?", Array.isArray(counts));

    let normalizedCounts = {};

    if (Array.isArray(counts)) {
      // If it's an array of objects like [{status: "pending", count: 4}, ...]
      normalizedCounts = counts.reduce((acc, item) => {
        const key = (item.status || item.name || item.key)?.toString().toLowerCase();
        if (key) acc[key] = item.count || item.value || 0;
        return acc;
      }, {});
    } else if (typeof counts === "object" && counts !== null) {
 
      normalizedCounts = Object.fromEntries(
        Object.entries(counts).map(([key, value]) => [key.toLowerCase().trim(), value])
      );
    }

    console.log("Final normalized counts:", normalizedCounts);

   setAppointments(appts);

// Calculate status counts from the actual appointments list
const calculatedCounts = appts.reduce((acc, apt) => {
  const status = apt.status?.toLowerCase();
  if (status) {
    acc[status] = (acc[status] || 0) + 1;
  }
  return acc;
}, {});

setStatusCount(calculatedCounts);

  } catch (err) {
    console.error("Failed to load appointments", err);
    alert("Failed to load data. Please refresh.");
  } finally {
    setLoading(false);
  }
};


  //runs once when the component mounts 
  useEffect(() => {
    loadData();
  }, []);

  //sends new appointment to backedn after created and reloads data after creation
  const handleCreate = async (form) => {
    // Backend expects: supervisor (id), appointment_type (id), date, time, description
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

  // /* FILTERED LIST */ shows the appointments based om selected tabs
 const filteredAppointments =
    activeTab === "all"
      ? appointments
      : appointments.filter((a) => a.status?.toLowerCase() === activeTab);


      //this centralize the status labels and styling it prevents hardcoding everywhere
  const statusConfig = {
    all: { label: "All", color: "gray" },
    pending: { label: "Pending", color: "yellow" },
    accepted: { label: "Accepted", color: "blue" },
    completed: { label: "Completed", color: "green" },
    rejected: { label: "Rejected", color: "red" },
  };

  //stops rendering until data is ready
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

        {/* onclicking the appointmernt+ button then open the appoinrments form modal */}
        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg flex items-center gap-2"
        >
          + New Appointment
        </button>
      </div>

      {/*  SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

      {/* loops over statuses and display the count per status */}
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

      {/*  filter tabs according to status */}
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

            {/* by default start with all tab */}
            {statusConfig[tab].label}
            {tab !== "all" && ` (${statusCount[tab] || 0})`}
          </button>
        ))}
      </div>

     
     {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* display each apppointmet card and return no appointments found incase no appoinmenrs was created   */}
        {filteredAppointments.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-10">
            No appointments found.
          </p>
        ) : (
          //if there are appointments then they will be mapped according to id and status
          filteredAppointments.map((a) => (
            <div
              key={a.id}
              className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">
                  {a.teacher_name || a.teacher?.full_name || "Unknown Teacher"}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    a.status === "accepted"
                      ? "bg-blue-100 text-blue-800"
                      : a.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : a.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : a.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {a.status || "unknown"}
                </span>
              </div>

              <p className="text-gray-700 font-medium">
                {a.appointment_type_name || a.type?.name || "General Meeting"}
              </p>

              <div className="text-sm text-gray-600 space-y-2">
                <p className="flex items-center gap-2">
                  <Calendar size={16} /> {a.date}
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={16} /> {a.time}
                </p>
                {a.note && (
                  <p className="flex items-start gap-2">
                    <Notebook size={16} className="mt-0.5" />
                    <span>{a.note}</span>
                  </p>
                )}
              </div>
            </div>
          ))
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