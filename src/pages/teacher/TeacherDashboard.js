// src/pages/teacher/TeacherDashboard.js
import React, { useState, useEffect, useMemo } from 'react';
import { mockData } from '../../data/mockData';
// No longer needs useAuth, as currentUser will be passed as a prop
// import { useAuth } from '../../hooks/useAuth';

// Helper to get an icon and color for each subject
const getSubjectDetails = (subjectName) => {
    switch (subjectName) {
        case 'English': return { icon: '📖', color: 'bg-blue-100 text-blue-800' };
        case 'Hindi': return { icon: '🕉️', color: 'bg-orange-100 text-orange-800' };
        case 'Mathematics': return { icon: '🧮', color: 'bg-red-100 text-red-800' };
        case 'Science': return { icon: '🔬', color: 'bg-green-100 text-green-800' };
        case 'Social Studies': return { icon: '🌍', color: 'bg-yellow-100 text-yellow-800' };
        case 'Computer Science': return { icon: '💻', color: 'bg-indigo-100 text-indigo-800' };
        case 'Art & Craft': return { icon: '🎨', color: 'bg-purple-100 text-purple-800' };
        case 'Physical Education': return { icon: '⚽', color: 'bg-pink-100 text-pink-800' };
        default: return { icon: '📚', color: 'bg-slate-100 text-slate-800' };
    }
};

// --- FIX: The component now accepts `currentUser` as a prop ---
const TeacherDashboard = ({ currentUser, onNavigate }) => {
  const today = new Date().toISOString().split('T')[0];
  const [selfAttendance, setSelfAttendance] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const record = mockData.teacherAttendance.find(a => a.teacherId === currentUser.id && a.date === today);
      setSelfAttendance(record || null);
    }
  }, [currentUser, today]);

  const mySchedule = useMemo(() => {
    if (!currentUser) return [];
    return mockData.schedule
      .filter(s => s.teacherId === currentUser.id)
      .map(assignment => ({
        ...assignment,
        class: mockData.classes.find(c => c.id === assignment.classId),
        subject: mockData.subjects.find(s => s.id === assignment.subjectId),
      }))
      .sort((a, b) => a.period - b.period);
  }, [currentUser]);

  const handleSelfAttendance = (status) => {
    const newRecord = { teacherId: currentUser.id, date: today, status };
    const recordIndex = mockData.teacherAttendance.findIndex(a => a.teacherId === currentUser.id && a.date === today);
    if (recordIndex > -1) mockData.teacherAttendance.splice(recordIndex, 1);
    mockData.teacherAttendance.push(newRecord);
    setSelfAttendance(newRecord);
  };

  const handleMarkStudentAttendance = (classId, period) => {
    onNavigate('markAttendance', { classId, period });
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {currentUser.name}!</h1>
          <p className="text-slate-500">Here is your schedule for today.</p>
        </div>
        <div>
          {selfAttendance ? (
            <div className={`p-2 rounded-lg font-semibold ${selfAttendance.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              You are marked {selfAttendance.status} for today.
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => handleSelfAttendance('Present')} className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600">Mark Present</button>
              <button onClick={() => handleSelfAttendance('On Leave')} className="bg-amber-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-600">Mark On Leave</button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {mySchedule.map(assignment => {
            const { icon, color } = getSubjectDetails(assignment.subject.name);
            return (
                <div key={assignment.period} className="bg-white rounded-xl shadow-md p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                        <div className={`p-3 rounded-full ${color}`}>
                            <span className="text-3xl">{icon}</span>
                        </div>
                        <div>
                            <p className="font-bold text-lg text-slate-800">{assignment.subject.name}</p>
                            <p className="text-sm text-slate-500">Period {assignment.period} | {assignment.class.name}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleMarkStudentAttendance(assignment.classId, assignment.period)} 
                        className="bg-teal-100 text-teal-800 px-4 py-2 rounded-lg hover:bg-teal-200 transition font-semibold w-full sm:w-auto mt-4 sm:mt-0"
                    >
                        Mark Attendance
                    </button>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default TeacherDashboard;
