// src/pages/admin/supervisors/Supervisors.jsx
import { useState, useContext } from 'react';
import { Plus, User, Trash2 } from 'lucide-react';
import { SupervisorModal } from './SupervisorModal';
import { AdminContext } from '../AdminDashboard'; 

export function Supervisors() {
  const { supervisors, createSupervisor, deleteSupervisor } = useContext(AdminContext);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = (supervisor) => {
    createSupervisor(supervisor);
    setIsModalOpen(false);
  };

  // Safe fallback
  if (!supervisors)
     return <div>Loading...</div>;

  return (
    <div className="p-8">
    
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Supervisors</h1>
          <p className="text-gray-600 mt-1">Manage supervisor accounts</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Add Supervisor
        </button>
      </div>

      {supervisors.length === 0 ? (
      
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-gray-900 font-medium mb-2">No supervisors yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first supervisor account</p>
          {/* <button onClick={() => setIsModalOpen(true)} className="rounded-lg p-3 text-white bg-blue-500 ">
            <Plus className="w-4 h-4" /> Add Supervisor
          </button> */}
        </div>
) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
       
          <table className="w-full">
              
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-700 text-sm">Title</th>
                <th className="text-left px-6 py-3 text-gray-700 text-sm">FirstName</th>
                <th className="text-left px-6 py-3 text-gray-700 text-sm">Last Name</th>
                <th className="text-left px-6 py-3 text-gray-700 text-sm">Username</th>
                <th className="text-left px-6 py-3 text-gray-700 text-sm">Role</th>
                <th className="text-left px-6 py-3 text-gray-700 text-sm">Created</th>
                <th className="text-right px-6 py-3 text-gray-700 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {supervisors.map((supervisor) => (
                <tr key={supervisor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-gray-900">{supervisor.title}</span>
                    </div>
                  </td>
                   <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-gray-900">{supervisor.first_name}</span>
                    </div>
                  </td>
                   <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-gray-900">{supervisor.last_name}</span>
                    </div>
                  </td>
                     <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-gray-900">{supervisor.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                      {supervisor.role.charAt(0).toUpperCase() + supervisor.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(supervisor.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteSupervisor(supervisor.id)}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SupervisorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateSupervisor={handleCreate}
      />
    </div>
  );
}