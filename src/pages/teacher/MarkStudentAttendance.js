// src/pages/teacher/MarkStudentAttendance.js
import React, { useState } from 'react';
import { mockData } from '../../data/mockData';

/**
 * A form for teachers to mark attendance for a specific class and period.
 * @param {object} props
 * @param {string} props.classId - The ID of the class.
 * @param {number} props.period - The period number.
 * @param {function} props.onBack - Function to navigate back to the dashboard.
 */
const MarkStudentAttendance = ({ classId, period, onBack }) => {
    const students = mockData.students[classId] || [];
    const className = mockData.classes.find(c => c.id === classId)?.name || 'Unknown Class';
    const today = new Date().toISOString().split('T')[0];

    // Initialize state with existing attendance or default to 'Present'
    const getInitialState = () => {
        const initialState = {};
        students.forEach(student => {
            const record = mockData.attendance.find(a =>
                a.date === today &&
                a.classId === classId &&
                a.period === period &&
                a.studentId === student.id
            );
            initialState[student.id] = record ? record.status : 'Present';
        });
        return initialState;
    };

    const [attendance, setAttendance] = useState(getInitialState);

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Remove old records for this specific class/period/date
        mockData.attendance = mockData.attendance.filter(record =>
            !(record.date === today && record.classId === classId && record.period === period)
        );

        // Add the new or updated records
        Object.entries(attendance).forEach(([studentId, status]) => {
            mockData.attendance.push({
                date: today,
                classId,
                period,
                studentId: parseInt(studentId),
                status,
            });
        });

        alert('Attendance has been saved successfully.');
        onBack(); // Navigate back to the dashboard
    };

    return (
        <div>
            <button onClick={onBack} className="text-teal-600 mb-4 font-semibold">&larr; Back to Dashboard</button>
            <h1 className="text-3xl font-bold mb-2">Attendance for {className}</h1>
            <p className="text-slate-500 mb-8">Date: {today} | Period: {period}</p>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {students.map(s => (
                            <div key={s.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                <p className="font-medium">{s.name}</p>
                                <div className="flex space-x-2 sm:space-x-4">
                                    {['Present', 'Absent', 'Late'].map(status => (
                                        <label key={status} className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name={`student_${s.id}`}
                                                value={status}
                                                checked={attendance[s.id] === status}
                                                onChange={() => handleStatusChange(s.id, status)}
                                                className="form-radio text-teal-600"
                                            />
                                            <span>{status}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="submit" className="mt-8 w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition font-semibold">Submit Attendance</button>
                </form>
            </div>
        </div>
    );
};

export default MarkStudentAttendance;
