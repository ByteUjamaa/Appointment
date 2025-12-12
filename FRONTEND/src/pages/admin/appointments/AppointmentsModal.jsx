import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react'

export function AppointmentModal ({isOpen, onClose, onCreateAppointmentType}){
    const[name, setName] = useState('');
    const[description, setDescription] = useState('')

    useEffect(()=>{
        if (!isOpen){
            // reset form when modal closes
            setName("");
            setDescription("");
        }
    },[isOpen]);

    const handleSubmit = (e) =>{
        e.preventDefault();

             if(!name.trim()){
            alert("Please enter an appointment type name")
            return
        }
    onCreateAppointmentType({
        name:name.trim(),
        description:description.trim()
    }); 
    onClose();

    };

    if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
        <div className='bg-white rounded-lg shad0w-xl max-w-md w-full'>
            {/* header */}
            <div className='flex items-center justify-between p-6 border-b border-gray-200'>
                <h2 className='text-gray-900'>Add New Appointment Type</h2>
                <button
                onClick={onClose}
                className='p-1 hover:bg-gray-100 rounded-lg transition-colors'
                aria-label='close modal'
                >
                    <X className='w-5 h-5 text-gray-500'/>
                </button>
            </div>

            {/* form */}
            <form onSubmit={handleSubmit} className='p-6 space-y-4'>
                <label htmlFor='name' className='block text-sm text-gray-700 mb-1.5'>
                    Appointment Type name <span className='text-red-500'>*</span>
                </label>
                <input
                type="text"
                id="name"
                value={name}
                onChange={(e)=> setName(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                placeholder='e.g.,Desertation'
                autoFocus
                />
                  <label htmlFor='name' className='block text-sm text-gray-700 mb-1.5'>
                    Description(optional) <span className='text-red-500'>*</span>
                </label>
                <textarea
                id="description"
                value={description}
                onChange={(e)=> setDescription(e.target.value)}
                row={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                placeholder='Enter brief description'
                autoFocus
                />

                {/* actions  */}
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
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Appointment Type
            </button>
          </div>
            </form>
        </div>
    </div>
  )
}

