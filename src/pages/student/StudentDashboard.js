// src/pages/student/StudentDashboard.js

import React, { useMemo } from 'react';
import { mockData } from '../../data/mockData';
import StudentSchedule from './StudentSchedule'; // Import the schedule component

// In a real app, get this from an Auth Context. For this example, we'll find the first student.
const studentUser = mockData.users.find(u => u.role === 'student');
const currentUser = Object.values(mockData.students).flat().find(s => s.id === studentUser.studentId);


const StudentDashboard = () => {
  // Use the current date to find today's attendance record.
  const today = '2025-07-23'; 

  // Memoize data lookups for performance.
  const dashboardData = useMemo(() => {
    if (!currentUser) {
      return { className: 'N/A', attendanceStatus: null };
    }
    
    const studentClass = mockData.classes.find(c => c.id === currentUser.classId);
    
    // Find any attendance record for the student today (checking all periods)
    const attendanceRecord = mockData.attendance.find(a => 
      a.studentId === currentUser.id && a.date === today
    );

    return {
      className: studentClass ? studentClass.name : 'N/A',
      attendanceStatus: attendanceRecord ? attendanceRecord.status : null
    };
  }, []);

  const renderAttendanceStatus = () => {
    if (!dashboardData.attendanceStatus) {
      return (
        <div className="p-2 rounded-lg font-semibold bg-stone-100 text-slate-500">
          No attendance marked for today.
        </div>
      );
    }
    
    const isPresent = dashboardData.attendanceStatus === 'Present';
    const colorClass = isPresent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

    return (
      <div className={`p-2 rounded-lg font-semibold ${colorClass}`}>
        Today's Status: {dashboardData.attendanceStatus}
      </div>
    );
  };
  
  if (!currentUser) {
    return <p>Could not find student data. Please log in again.</p>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Welcome, {currentUser.name}!</h1>
      <p className="text-slate-500 mb-8">Here is your information for today.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-slate-500 font-semibold mb-2">My Class</h3>
          <p className="text-2xl font-bold">{dashboardData.className}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-slate-500 font-semibold mb-2">Today's Attendance</h3>
          {renderAttendanceStatus()}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Today's Schedule</h2>
        {/* Embed the reusable StudentSchedule component */}
        <StudentSchedule classId={currentUser.classId} />
      </div>
    </div>
  );
};

export default StudentDashboard;