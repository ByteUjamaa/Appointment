import { useState, useEffect } from 'react';
import { X } from 'lucide-react';



export function SupervisorModal({ isOpen, onClose, onCreateSupervisor }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [title,setTitle] = useState('')
  const [first_name,setFirstName] = useState('')
  const [last_name,setLastName] = useState('')


  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setUsername('');
      setPassword('');
      setTitle('');
      setFirstName('');
      setLastName('');

    }
  }, [isOpen]);

  const handleSubmit = (e) =>{
        e.preventDefault();

        if (!username.trim() ||
         !password.trim() || 
         !title.trim() ||
         !first_name.trim() || 
         !last_name.trim()) {
      alert('Please fill in all fields');
      return;
    }

    onCreateSupervisor({
      username: username.trim(),
      password:password.trim(),
      title:title.trim(),
      first_name:first_name.trim(),
      last_name:last_name.trim(),
      role: 'supervisor',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Add New Supervisor</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="first_name" className="block text-sm text-gray-700 mb-1.5">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="first_name"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter First Name"
              autoFocus
            />
          </div><div>
            <label htmlFor="last_name" className="block text-sm text-gray-700 mb-1.5">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="last_name"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter Last Name"
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Eg. Dr."
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm text-gray-700 mb-1.5">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter username"
              autoFocus
            />
          </div>
        

          <div>
            <label htmlFor="password" className="block text-sm text-gray-700 mb-1.5">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              Role
            </label>
            <input
              type="text"
              value="Supervisor"
              disabled
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Supervisor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
