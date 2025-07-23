// src/pages/admin/StudentDetail.js
import React from 'react';
import { mockData } from '../../data/mockData';

/**
 * Displays the detailed profile view for a single student.
 * This is typically shown when an admin clicks on a student from a class list.
 * @param {object} props
 * @param {number} props.studentId - The ID of the student to display.
 * @param {function} props.onBack - Callback function to return to the previous view.
 */
const StudentDetail = ({ studentId, onBack }) => {
    // Find the student from the flattened list of all students
    const student = Object.values(mockData.students).flat().find(s => s.id === studentId);
    
    if (!student) {
        return (
            <div>
                <button onClick={onBack} className="text-teal-600 mb-4 font-semibold">&larr; Back</button>
                <p>Student not found.</p>
            </div>
        );
    }

    const studentClass = mockData.classes.find(c => c.id === student.classId);

    // Helper function to calculate overall attendance percentage for the student
    const getOverallAttendance = () => {
        const records = mockData.attendance.filter(a => a.studentId === student.id);
        if (records.length === 0) return 'N/A';
        const presentCount = records.filter(r => r.status === 'Present' || r.status === 'Late').length;
        return `${((presentCount / records.length) * 100).toFixed(0)}%`;
    };

    return (
        <div>
            <button onClick={onBack} className="text-teal-600 mb-4 font-semibold">&larr; Back to {studentClass.name}</button>
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
                <div className="text-center">
                    <img src={student.profilePicUrl} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-teal-200" />
                    <h1 className="text-3xl font-bold">{student.name}</h1>
                    <p className="text-slate-500">Student ID: {student.studentId}</p>
                    <p className="text-slate-500">{studentClass.name}</p>
                </div>
                <div className="mt-8 pt-6 border-t grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-sm text-slate-500">Date of Birth</p>
                        <p className="font-semibold">{student.dob}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Overall Attendance</p>
                        <p className="font-semibold text-green-600">{getOverallAttendance()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetail;
