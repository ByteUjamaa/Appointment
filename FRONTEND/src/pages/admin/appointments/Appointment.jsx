import { useContext, useState } from 'react';
import { Plus, Calendar,  Trash2, } from 'lucide-react';
import { AppointmentModal } from './AppointmentsModal';
import { AdminContext } from '../AdminDashboard';



export function Appointment() {

const { 
  appointmentTypes = [], 
  createAppointmentType, 
  deleteAppointmentType 
} = useContext(AdminContext) || {};
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = (appointment) => {
    createAppointmentType(appointment);
    setIsModalOpen(false);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900">Appointment Types</h1>
          <p className="text-gray-600 mt-1">Manage appointment types and durations</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Appointment Type
        </button>
      </div>

      {/* Appointment Types List */}
      {appointmentTypes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-gray-900 mb-2">No appointment types yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first appointment type</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Appointment Type
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointmentTypes.map((appointmentType) => (
            <div
              key={appointmentType.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <button
                  onClick={() => deleteAppointmentType(appointmentType.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete appointment type"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-gray-900 mb-2">{appointmentType.name}</h3>
            

              {appointmentType.description && (
                <p className="text-gray-600 text-sm">{appointmentType.description}</p>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-400 text-xs">
                  Created {new Date(appointmentType.createdAt).toLocaleDateString()}
                </p>
              </div>
              
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateAppointmentType={handleCreate}
      />
    </div>
  );
}
