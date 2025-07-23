// src/pages/student/StudentReportCard.js
import React, { useMemo } from 'react';
import { mockData } from '../../data/mockData';

// Helper to determine the color of the mark based on percentage
const getMarkColor = (marks, maxMarks) => {
    if (marks === '-') return 'text-slate-500';
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= 90) return 'text-green-600 font-bold';
    if (percentage >= 75) return 'text-green-500 font-semibold';
    if (percentage >= 60) return 'text-blue-500';
    if (percentage >= 40) return 'text-amber-600';
    return 'text-red-600 font-semibold';
};

// Helper to determine the color of the progress bar
const getProgressBarColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-600';
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-amber-500';
    return 'bg-red-500';
};

// --- NEW: Helper to get an icon and color for each subject ---
const getSubjectDetails = (subjectName) => {
    switch (subjectName) {
        case 'English': return { icon: '📖', color: 'text-blue-600' };
        case 'Hindi': return { icon: '🕉️', color: 'text-orange-600' };
        case 'Mathematics': return { icon: '🧮', color: 'text-red-600' };
        case 'Science': return { icon: '🔬', color: 'text-green-600' };
        case 'Social Studies': return { icon: '🌍', color: 'text-yellow-600' };
        case 'Computer Science': return { icon: '💻', color: 'text-indigo-600' };
        case 'Art & Craft': return { icon: '🎨', color: 'text-purple-600' };
        case 'Physical Education': return { icon: '⚽', color: 'text-pink-600' };
        default: return { icon: '📚', color: 'text-slate-600' };
    }
};

const StudentReportCard = ({ currentUser }) => {
    const studentClass = useMemo(() => {
        if (!currentUser) return null;
        return mockData.classes.find(c => c.id === currentUser.classId);
    }, [currentUser]);
    
    const reportCardData = useMemo(() => {
        if (!currentUser) return [];

        const studentMarks = mockData.marks.filter(m => m.studentId === currentUser.id);

        return mockData.exams.map(exam => {
            const marksForExam = studentMarks.filter(m => m.examId === exam.id);
            let totalMarks = 0;
            let maxTotalMarks = 0;

            const subjectMarks = marksForExam.map(mark => {
                const subject = mockData.subjects.find(s => s.id === mark.subjectId);
                totalMarks += mark.marksObtained;
                maxTotalMarks += exam.maxMarks;
                return {
                    subjectName: subject ? subject.name : 'Unknown Subject',
                    marksObtained: mark.marksObtained,
                };
            });

            const percentage = maxTotalMarks > 0 ? ((totalMarks / maxTotalMarks) * 100).toFixed(2) : 0;

            return {
                ...exam,
                subjectMarks,
                totalMarks,
                maxTotalMarks,
                percentage,
            };
        });
    }, [currentUser]);

    if (!currentUser) {
        return <p>Loading student data...</p>;
    }

    return (
        // --- NEW: Main container to center the content ---
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 mb-8">
                <img src={currentUser.profilePicUrl} alt="Profile" className="w-24 h-24 rounded-full border-4 border-teal-200 shadow-md" />
                <div>
                    <h1 className="text-3xl font-bold text-center sm:text-left">{currentUser.name}</h1>
                    <p className="text-slate-500 text-center sm:text-left">Student ID: {currentUser.studentId} | Class: {studentClass?.name}</p>
                </div>
            </div>
            
            <div className="space-y-8">
                {reportCardData.map(examData => (
                    <div key={examData.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-5 border-b bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-800">{examData.name}</h2>
                            <p className="text-sm text-slate-500">{new Date(examData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                {examData.subjectMarks.map(mark => {
                                    const { icon, color } = getSubjectDetails(mark.subjectName);
                                    return (
                                        <div key={mark.subjectName} className="flex justify-between items-center border-b pb-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{icon}</span>
                                                <p className={`font-semibold ${color}`}>{mark.subjectName}</p>
                                            </div>
                                            <p className={`text-lg ${getMarkColor(mark.marksObtained, examData.maxMarks)}`}>
                                                {mark.marksObtained} <span className="text-sm text-slate-400">/ {examData.maxMarks}</span>
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="p-5 bg-slate-50 border-t">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-slate-700">Total</h4>
                                <p className="text-lg font-bold text-slate-800">{examData.totalMarks} / {examData.maxTotalMarks}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-slate-700">Percentage</h4>
                                <p className={`text-lg font-bold ${getMarkColor(examData.totalMarks, examData.maxTotalMarks)}`}>{examData.percentage}%</p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                <div 
                                    className={`h-2.5 rounded-full ${getProgressBarColor(examData.percentage)}`} 
                                    style={{ width: `${examData.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentReportCard;
