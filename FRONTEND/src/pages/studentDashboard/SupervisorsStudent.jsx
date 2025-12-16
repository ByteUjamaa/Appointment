import React, { useEffect, useState } from "react";
import AppointmentService from "../../api/appointmentServices";
import { User, Calendar } from "lucide-react";

function SupervisorsStudent() {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

   const getAvailableDays=(supervisors) =>{
    return(
      supervisors.days ||
      []
    )
  }

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        setLoading(true);
        const data = await AppointmentService.getTeachers();
        setSupervisors(data);
      } catch (err) {
        console.error("Failed to load supervisors", err);
        setError("Failed to load supervisors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisors();

 

  }, []);

  

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Loading supervisors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!supervisors.length) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No supervisors available yet
          </h2>
          <p className="text-gray-600">
            Please check back later or contact the administration.
          </p>
        </div>
      </div>
    );
  }

return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Available Supervisors</h1>
        <p className="text-gray-600 mt-1">
          View all supervisors and their available days for appointments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {supervisors.map((s) => {
          const availableDays = getAvailableDays(s);
          const hasDays = availableDays.length > 0;

          return (
            <div
              key={s.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-7 h-7 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900 truncate">
                    {`${s.title || ""} ${s.first_name || ""} ${s.last_name || ""}`.trim() ||
                      "Unnamed Supervisor"}
                  </h2>
                  <p className="text-sm text-gray-600 truncate">{s.email || "No email"}</p>
                </div>
              </div>

              {/* Available Days */}
              <div className="mt-5">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Available Days</span>
                </div>

                {hasDays ? (
                  <div className="flex flex-wrap gap-2">
                    {availableDays.map((day, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No days specified</p>
                )}
              </div>

              {/* Phone (optional) */}
              {s.phone && (
                <div className="mt-4 pt-4 border-t text-sm text-gray-700">
                  <span className="font-medium">Phone:</span> {s.phone}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default SupervisorsStudent;
