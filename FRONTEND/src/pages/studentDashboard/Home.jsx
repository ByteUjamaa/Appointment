import axios from 'axios';
import React, { useState,useEffect } from 'react'


const dashboardMock = {
  appointments: {
    pending: 6,
    accepted: 10,
    completed: 22,
  },
  reports: {
    drafts: 3,
    submitted: 14,
  },
  activities: 41,
};
const USE_MOCK = true;



export default function  Home()  {

    const [summary,setSummary] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        if (USE_MOCK){
            setTimeout(()=>{
                setSummary(dashboardMock);
                setLoading(false)
            },700)
        }else{
            fetchSummary();
        }
    },[])

    const fetchSummary = async()=>{
        try{
            const res = await axios.get("");
            setSummary(res.data);

        }catch(error){
            console.error("failed to fetch dashboard summary", error);
        }finally{
            setLoading(false)
        }
    };

    if (loading){
        return <div className='p-6'>Loading dashboard....</div>
    }
 return (
  <div className="p-6 space-y-10">

    {/* HEADER */}
    <div className='text-start'>
      <h1 className='text-3xl font-semibold'>Welcome back, name</h1>
      <p>Here's an overview of your consultation activities</p>
    </div>

    {/* ✅ ROW 1 — APPOINTMENTS */}
    <div>
      <h2 className="text-lg font-semibold mb-4">Appointments</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className='bg-white shadow rounded-xl p-6'>
          <h3 className='text-gray-500'>Pending</h3>
          <p className='text-3xl font-bold text-yellow-600'>
            {summary?.appointments?.pending}
          </p>
        </div>

        <div className='bg-white shadow rounded-xl p-6'>
          <h3 className='text-gray-500'>Accepted</h3>
          <p className='text-3xl font-bold text-blue-600'>
            {summary?.appointments?.accepted}
          </p>
        </div>

        <div className='bg-white shadow rounded-xl p-6'>
          <h3 className='text-gray-500'>Completed</h3>
          <p className='text-3xl font-bold text-green-600'>
            {summary?.appointments?.completed}
          </p>
        </div>

        <div className='bg-white shadow rounded-xl p-6'>
          <h3 className='text-gray-500'>Upcoming</h3>
          <p className='text-3xl font-bold'>
            {summary?.appointments?.upcoming}
          </p>
        </div>

      </div>
    </div>

    {/* ✅ ROW 2 — REPORTS */}
    <div>
      <h2 className="text-lg font-semibold mb-4">Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className='bg-white shadow rounded-xl p-6'>
          <h3 className='text-gray-500'>Drafts</h3>
          <p className='text-3xl font-bold text-orange-600'>
            {summary?.reports?.drafts}
          </p>
        </div>

        <div className='bg-white shadow rounded-xl p-6'>
          <h3 className='text-gray-500'>Submitted</h3>
          <p className='text-3xl font-bold text-purple-600'>
            {summary?.reports?.submitted}
          </p>
        </div>

        <div className='bg-white shadow rounded-xl p-6'>
          <h3 className='text-gray-500'>Total Reports</h3>
          <p className='text-3xl font-bold'>
            {summary?.reports?.total}
          </p>
        </div>

      </div>
    </div>

    {/* ✅ ROW 3 — ACTIVITY OVERVIEW */}
    <div>
      <h2 className="text-lg font-semibold mb-4">Activity Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-gray-500">Completed Sessions</h3>
          <p className="text-3xl font-bold text-green-600">
            {summary?.activities?.completedSessions}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-gray-500">Total Appointments</h3>
          <p className="text-3xl font-bold">
            {summary?.activities?.totalAppointments}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-gray-500">Total Reports</h3>
          <p className="text-3xl font-bold">
            {summary?.activities?.totalReports}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-gray-500">Total Activities</h3>
          <p className="text-3xl font-bold">
            {summary?.activities?.totalActivities}
          </p>
        </div>

      </div>
    </div>

  </div>
)
}
