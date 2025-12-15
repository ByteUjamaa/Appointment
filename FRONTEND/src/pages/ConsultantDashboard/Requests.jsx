import React, { useState } from "react";
import { User, Calendar } from "lucide-react";

const Requests = () => {
  const [activeTab, setActiveTab] = useState("Pending");

  const [requests, setRequests] = useState([
    {
      id: 1,
      title: "Website Redesign Consultation",
      description:
        "Client needs consultation for complete website redesign. Looking for modern UI/UX recommendations.",
      student: "John Smith",
      date: "December 10, 2025 at 01:27 PM",
      status: "Pending",
      reason: "",
    },
  
    {
      id: 2,
      title: "Database Architecture Review",
      description:
        "Client wants optimization of database schema for improved performance.",
      student: "Mary Daniel",
      date: "December 11, 2025 at 10:00 AM",
      status: "Pending",
      reason: "",
    },

  ]);

  const [modal, setModal] = useState({
    open: false,
    type: "",
    requestId: null,
    reason: "",
    sessionDate: "",
    sessionTime: "",
  });

  const openModal = (type, id) => {
    setModal({
      open: true,
      type,
      requestId: id,
      reason: "",
      sessionDate: "",
      sessionTime: "",
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

  const submitAction = () => {
    if (modal.type !== "view") {
      if (!modal.reason.trim()) {
        alert("Please provide a reason.");
        return;
      }

      if (modal.type === "accept" && (!modal.sessionDate || !modal.sessionTime)) {
        alert("Please provide consultation date and time.");
        return;
      }
    }

    // Update request values
    if (modal.type === "accept" || modal.type === "deny") {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === modal.requestId
            ? {
                ...req,
                status: modal.type === "accept" ? "Approved" : "Denied",
                reason: modal.reason,
                appointment:
                  modal.type === "accept"
                    ? `${modal.sessionDate} at ${modal.sessionTime}`
                    : null,
              }
            : req
        )
      );
    }

    closeModal();
  };

  const filteredRequests = requests.filter((req) => req.status === activeTab);
  const selectedRequest = requests.find((req) => req.id === modal.requestId);

  const tabs = ["Pending", "Approved", "Denied", "Completed"];

  const statusColor = {
    Pending: "bg-yellow-200 text-yellow-800",
    Approved: "bg-green-200 text-green-800",
    Denied: "bg-red-200 text-red-800",
    Completed: "bg-blue-200 text-blue-800",
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800">Consultation Requests</h2>
      <p className="text-gray-600 mb-6">
        Manage and respond to client consultation requests.
      </p>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-6 py-2 font-medium ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Request Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.length === 0 ? (
          <p className="text-gray-500 col-span-full">
            No {activeTab.toLowerCase()} requests.
          </p>
        ) : (
          filteredRequests.map((req) => (
            <div key={req.id} className="bg-white shadow rounded-xl p-4 border">
              {/* Title and Status */}
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-semibold line-clamp-2">
                  {req.title}
                </h3>

                <span
                  className={`px-2 py-1 text-xs rounded-full ${statusColor[req.status]}`}
                >
                  {req.status}
                </span>
              </div>

              {/* Student + Date */}
              <div className="mt-3 space-y-2 text-gray-600 text-sm">
                <p className="flex items-center gap-2">
                  <User size={16} /> {req.student}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar size={16} /> {req.date}
                </p>
              </div>

              {/* SEE MORE */}
              <button
                onClick={() => openModal("view", req.id)}
                className="mt-4 text-blue-600 hover:underline text-sm"
              >
                See more →
              </button>

              {/* Accept / Deny */}
              {req.status === "Pending" && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => openModal("accept", req.id)}
                    className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 text-sm rounded-lg"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => openModal("deny", req.id)}
                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 text-sm rounded-lg"
                  >
                    Deny
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {modal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-3">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 max-h-[90vh] overflow-y-auto">
            {/* VIEW DETAILS MODAL */}
            {modal.type === "view" && selectedRequest && (
              <>
                <h3 className="text-xl font-bold mb-3">Request Details</h3>

                <p className="font-semibold text-gray-800">
                  {selectedRequest.title}
                </p>

                <p className="text-gray-600 mt-3">
                  {selectedRequest.description}
                </p>

                <div className="mt-4 text-gray-700 space-y-2">
                  <p>
                    <strong>Student:</strong> {selectedRequest.student}
                  </p>
                  <p>
                    <strong>Date:</strong> {selectedRequest.date}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedRequest.status}
                  </p>

                  {selectedRequest.appointment && (
                    <p>
                      <strong>Appointment:</strong>{" "}
                      {selectedRequest.appointment}
                    </p>
                  )}

                  {selectedRequest.reason && (
                    <p>
                      <strong>Consultant Reason:</strong>{" "}
                      {selectedRequest.reason}
                    </p>
                  )}
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </>
            )}

            {/* ACCEPT / DENY MODAL */}
            {(modal.type === "accept" || modal.type === "deny") && (
              <>
                <h3 className="text-xl font-bold mb-3">
                  {modal.type === "accept" ? "Accept Request" : "Deny Request"}
                </h3>

                <p className="text-gray-600 mb-2">Provide description here:</p>

                <textarea
                  className="w-full border rounded-lg p-3 h-24 outline-none"
                  placeholder="Write your description here..."
                  value={modal.reason}
                  onChange={(e) =>
                    setModal({ ...modal, reason: e.target.value })
                  }
                ></textarea>

                {modal.type === "accept" && (
                  <div className="mt-4">
                    <p className="text-gray-600 mb-2 font-semibold">
                      Set Session Date & Time
                    </p>

                    <input
                      type="date"
                      className="w-full border rounded-lg p-2 mb-3"
                      value={modal.sessionDate}
                      onChange={(e) =>
                        setModal({ ...modal, sessionDate: e.target.value })
                      }
                    />

                    <input
                      type="time"
                      className="w-full border rounded-lg p-2"
                      value={modal.sessionTime}
                      onChange={(e) =>
                        setModal({ ...modal, sessionTime: e.target.value })
                      }
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-5">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={submitAction}
                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
