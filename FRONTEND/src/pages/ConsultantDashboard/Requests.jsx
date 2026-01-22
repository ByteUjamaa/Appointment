import React, { useState, useEffect } from "react";
import { User, Calendar, Loader2 } from "lucide-react";
import appointmentService from "../../api/appointmentServices";

const Requests = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modal, setModal] = useState({
    open: false,
    type: "", // "view", "accept", "reject", "complete"
    requestId: null,
    reason: "",
    sessionDate: "",
    sessionTime: "",
  });

  // Fetch requests on mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await appointmentService.getRequests();
        setRequests(data || []);
      } catch (err) {
        setError("Failed to load requests. Please try again later.");
        console.error("Fetch Error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const openModal = (type, id) => {
    const req = requests.find((r) => r.id === id);
    setModal({
      open: true,
      type,
      requestId: id,
      reason: req?.consultant_response || "",
      sessionDate: req?.sessionDate || "",
      sessionTime: req?.sessionTime || "",
    });
  };

  const closeModal = () => {
    setModal({
      open: false,
      type: "",
      requestId: null,
      reason: "",
      sessionDate: "",
      sessionTime: "",
    });
  };

  const submitAction = async () => {
    if (!modal.reason.trim()) {
      alert("Please provide a response or reason.");
      return;
    }

    try {
      setLoading(true);

      let newStatus = "";
      if (modal.type === "accept") newStatus = "Accepted";
      if (modal.type === "reject") newStatus = "Rejected";
      if (modal.type === "complete") newStatus = "Completed";

      const confirmed_datetime =
  modal.type === "accept" && modal.sessionDate && modal.sessionTime
    ? `${modal.sessionDate}T${modal.sessionTime}:00`
    : null;

await appointmentService.updateStatus(
  modal.requestId,
  newStatus,
  modal.reason,
  confirmed_datetime
);


      setRequests((prev) =>
        prev.map((req) =>
          req.id === modal.requestId
            ? {
                ...req,
                status: newStatus,
                consultant_response: modal.reason,
                appointment:
                  modal.type === "accept"
                    ? `${modal.sessionDate} at ${modal.sessionTime}`
                    : req.appointment,
              }
            : req
        )
      );

      closeModal();
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert(
        "Failed to update request: " +
          (err.response?.data ? JSON.stringify(err.response.data) : "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter((req) => req.status === activeTab);
  const selectedRequest = requests.find((req) => req.id === modal.requestId);

  const tabs = ["Pending", "Accepted", "Rejected", "Completed"];

  const statusColor = {
    Pending: "bg-yellow-100 text-yellow-800",
    Accepted: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    Completed: "bg-blue-100 text-blue-800",
  };

  const statusBorder = {
    Pending: "border-l-yellow-400",
    Accepted: "border-l-green-400",
    Rejected: "border-l-red-400",
    Completed: "border-l-blue-400",
  };

  if (loading && requests.length === 0) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Consultation Requests</h2>
      <p className="text-gray-600 mb-8">Review and manage student consultation requests.</p>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        {tabs.map((tab) => {
          const count = requests.filter((r) => r.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "text-blue-600 border-b-3 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
              <span
                className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === tab ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-700"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Request Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-12 text-lg">
            No {activeTab.toLowerCase()} requests at the moment.
          </p>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all border-l-4 ${statusBorder[req.status]} p-6`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{req.title}</h3>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor[req.status]}`}>
                  {req.status}
                </span>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <User size={16} className="text-gray-500" />
                  {req.student_name || "Unknown Student"}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  {req.date || req.created_at || "Unknown Date"}
                </p>
              </div>

              {req.appointment && (
                <p className="mt-4 text-sm text-green-700 font-medium">Scheduled: {req.appointment}</p>
              )}

              {req.consultant_response && (
                <p className="mt-2 text-sm text-gray-700">
                  <strong>Response:</strong> {req.supervisor_comment || req.consultant_response}
                </p>
              )}

              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={() => openModal("view", req.id)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium text-left"
                >
                  View Details →
                </button>

                {activeTab === "Pending" && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => openModal("accept", req.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => openModal("reject", req.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium transition"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {activeTab === "Accepted" && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => openModal("complete", req.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition"
                    >
                      Mark as Completed
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modal.open && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {modal.type === "accept"
                  ? "Accept Request"
                  : modal.type === "reject"
                  ? "Reject Request"
                  : modal.type === "complete"
                  ? "Submit Response"
                  : "Request Details"}
              </h3>

              {/* View Details */}
              {modal.type === "view" && (
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Type:</strong> {selectedRequest.appointment_type?.label || "Unknown Type"}
                  </p>
                  <p>
                    <strong>Student:</strong> {selectedRequest.student_name || "Unknown Student"}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedRequest.status}
                  </p>
                  <p>
                    <strong>Date:</strong> {selectedRequest.date || selectedRequest.created_at}
                  </p>
                  <div>
                    <strong>Description:</strong>
                    <p className="text-gray-600 mt-1">{selectedRequest.description || "No description"}</p>
                  </div>

                  {selectedRequest.appointment && (
                    <p className="text-green-700">
                      <strong>Scheduled:</strong> {selectedRequest.appointment}
                    </p>
                  )}

                  {selectedRequest.consultant_response && (
                    <div>
                      <strong>Consultant Response:</strong>
                      <p className="text-gray-600 mt-1">{selectedRequest.supervisor_comment}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Show textarea for accept/reject/complete */}
              {["accept", "reject", "complete"].includes(modal.type) && (
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Response / Notes <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-4 h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    placeholder="Provide your response..."
                    value={modal.reason}
                    onChange={(e) => setModal({ ...modal, reason: e.target.value })}
                  />
                </div>
              )}

              {/* Show date/time only when accepting */}
              {modal.type === "accept" && (
                <div className="mb-8">
                  <label className="block text-gray-700 font-medium mb-3">
                    Schedule Consultation <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                      value={modal.sessionDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setModal({ ...modal, sessionDate: e.target.value })}
                    />
                    <input
                      type="time"
                      className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                      value={modal.sessionTime}
                      onChange={(e) => setModal({ ...modal, sessionTime: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                {["accept", "reject", "complete"].includes(modal.type) && (
                  <button
                    onClick={submitAction}
                    disabled={loading}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white rounded-lg font-medium transition flex items-center gap-2"
                  >
                    {loading && <Loader2 size={20} className="animate-spin" />}
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
