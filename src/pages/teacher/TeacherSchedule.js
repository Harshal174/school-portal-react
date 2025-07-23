// src/pages/teacher/TeacherSchedule.js
import React, { useMemo } from 'react';
import { mockData } from '../../data/mockData';

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

// Helper for period timings
const getPeriodTime = (period) => {
    const times = [
        "08:00 AM - 09:00 AM", "09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM",
        "11:00 AM - 12:00 PM", "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM",
    ];
    return times[period - 1] || '';
}

const TeacherSchedule = ({ currentUser }) => {
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

  const allPeriods = Array.from({ length: 6 }, (_, i) => i + 1);

  if (!currentUser) {
    return <p>Loading schedule...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Daily Schedule</h1>
        <div className="space-y-4">
            {allPeriods.map(period => {
                const assignment = mySchedule.find(a => a.period === period);
                if (assignment) {
                    const { icon, color } = getSubjectDetails(assignment.subject.name);
                    return (
                        <div key={period} className="bg-white rounded-xl shadow-md p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${color}`}>
                                    <span className="text-3xl">{icon}</span>
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-slate-800">{assignment.subject.name}</p>
                                    <p className="text-sm text-slate-500">Period {assignment.period} | {getPeriodTime(assignment.period)}</p>
                                </div>
                            </div>
                            <div className="sm:ml-auto text-left sm:text-right">
                                <p className="text-sm text-slate-500">Class</p>
                                <p className="font-semibold text-slate-700">{assignment.class.name}</p>
                            </div>
                        </div>
                    );
                }
                // Render a placeholder for free periods
                return (
                    <div key={period} className="bg-white rounded-xl shadow-sm border border-dashed p-5 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-slate-100">
                            <span className="text-3xl">☕</span>
                        </div>
                        <div>
                            <p className="font-bold text-lg text-slate-500">Free Period</p>
                            <p className="text-sm text-slate-400">Period {period} | {getPeriodTime(period)}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default TeacherSchedule;
