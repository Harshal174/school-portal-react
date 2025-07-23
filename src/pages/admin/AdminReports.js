// src/pages/admin/AdminReports.js
import React, { useState, useMemo } from 'react';
import { mockData } from '../../data/mockData';
import Modal from '../../components/common/Modal'; // Assuming a generic Modal component exists

// Helper function to generate and download CSV
const downloadCSV = (csvContent, fileName) => {
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// --- NEW: Helper to get a color and icon for each grade level ---
const getGradeDetails = (className) => {
    const gradeMatch = className.match(/Grade (\d+)/);
    const grade = gradeMatch ? parseInt(gradeMatch[1]) : 0;

    switch (grade) {
        case 1: return { color: 'border-sky-500', icon: '1️⃣' };
        case 2: return { color: 'border-red-500', icon: '2️⃣' };
        case 3: return { color: 'border-amber-500', icon: '3️⃣' };
        case 4: return { color: 'border-emerald-500', icon: '4️⃣' };
        case 5: return { color: 'border-indigo-500', icon: '5️⃣' };
        case 6: return { color: 'border-rose-500', icon: '6️⃣' };
        case 7: return { color: 'border-cyan-500', icon: '7️⃣' };
        case 8: return { color: 'border-violet-500', icon: '8️⃣' };
        default: return { color: 'border-slate-500', icon: '🏫' };
    }
};


const AdminReports = () => {
    // State machine for views
    const [view, setView] = useState('main');
    const [reportType, setReportType] = useState(null);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState(null);

    // --- SUB-COMPONENTS FOR EACH VIEW ---

    const MainSelector = () => (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">School Reports</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Student Reports Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-teal-100 p-3 rounded-full">
                            <span className="text-3xl">🎓</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Student Reports</h2>
                    </div>
                    <p className="text-slate-600 mb-4">View attendance or assessment summaries for students by class.</p>
                    <div className="space-y-2">
                        <button onClick={() => { setReportType('attendance'); setView('studentSelector'); }} className="w-full p-3 bg-teal-50 hover:bg-teal-100 rounded-lg text-teal-800 font-semibold transition text-left">
                            Attendance Reports
                        </button>
                        <button onClick={() => { setReportType('marks'); setView('studentSelector'); }} className="w-full p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-indigo-800 font-semibold transition text-left">
                            Assessment Reports
                        </button>
                    </div>
                </div>
                {/* Teacher Reports Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-sky-100 p-3 rounded-full">
                            <span className="text-3xl">👥</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Teacher Reports</h2>
                    </div>
                    <p className="text-slate-600 mb-4">View the detailed monthly attendance grid for all teachers.</p>
                    <div className="space-y-2">
                        <button onClick={() => setView('teacherReport')} className="w-full p-3 bg-sky-50 hover:bg-sky-100 rounded-lg text-sky-800 font-semibold transition text-left">
                           Teacher Attendance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // --- UI ENHANCEMENT START ---
    // Redesigned StudentReportSelector with beautiful cards
    const StudentReportSelector = () => {
        const title = reportType === 'attendance' ? 'Student Attendance' : 'Student Assessment';
        const nextView = reportType === 'attendance' ? 'studentAttendance' : 'studentMarksList';
        return (
            <div>
                <button onClick={() => setView('main')} className="text-teal-600 mb-4 font-semibold">&larr; Back to Report Types</button>
                <h1 className="text-3xl font-bold mb-8">{title}: Select a Class</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {mockData.classes.map(c => {
                        const { color, icon } = getGradeDetails(c.name);
                        return (
                            <button 
                                key={c.id} 
                                onClick={() => { setSelectedClassId(c.id); setView(nextView); }} 
                                className={`p-5 bg-white hover:shadow-xl hover:-translate-y-1 rounded-xl shadow-md border-l-4 ${color} transition-all flex flex-col justify-between items-start text-left`}
                            >
                                <span className="text-4xl">{icon}</span>
                                <p className="font-bold text-slate-800 mt-2 text-lg">{c.name}</p>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };
    // --- UI ENHANCEMENT END ---

    const AttendanceGrid = ({ title, data, date, setDate, onExport, backView }) => {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const daysInMonth = new Date(date.year, date.month + 1, 0).getDate();
        return (
          <div>
            <button onClick={() => setView(backView)} className="text-teal-600 mb-4 font-semibold">&larr; Back</button>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold">{title}</h1>
                <div className="flex gap-2 items-center">
                    <select value={date.month} onChange={e => setDate({...date, month: parseInt(e.target.value)})} className="p-2 border rounded-lg bg-white shadow-sm">
                        {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
                    </select>
                    <select value={date.year} onChange={e => setDate({...date, year: parseInt(e.target.value)})} className="p-2 border rounded-lg bg-white shadow-sm">
                        <option>2025</option><option>2024</option>
                    </select>
                    <button onClick={onExport} className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 shadow-sm">Export CSV</button>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                <table className="w-full border-collapse min-w-[1200px]">
                    <thead className="bg-slate-50 text-center">
                        <tr>
                            <th className="p-2 text-left font-bold text-slate-600 sticky left-0 bg-slate-50 z-20 border-r border-b"></th>
                            {Array.from({ length: daysInMonth }, (_, i) => {
                                const dayName = new Date(date.year, date.month, i + 1).toLocaleDateString('en-US', { weekday: 'narrow' });
                                return <th key={i} className="p-1 font-semibold text-xs text-slate-400 border-b">{dayName}</th>
                            })}
                        </tr>
                        <tr>
                            <th className="p-3 text-left font-bold text-slate-600 sticky left-0 bg-slate-50 z-20 border-r">{data.header}</th>
                            {Array.from({ length: daysInMonth }, (_, i) => <th key={i} className="p-3 font-semibold text-sm text-slate-500">{String(i + 1).padStart(2, '0')}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.rows.map(row => (
                            <tr key={row.id} className="border-t">
                                <td className="p-3 font-semibold text-slate-800 sticky left-0 bg-white border-r">{row.name}</td>
                                {row.statuses.map((status, index) => (
                                    <td key={index} className="p-2 text-center">
                                        <span className={`w-7 h-7 flex items-center justify-center mx-auto rounded-full text-white text-xs font-bold ${status.color}`}>
                                            {status.char}
                                        </span>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        )
    };
    
    const TeacherAttendanceReport = () => {
        const [date, setDate] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() });
        const reportData = useMemo(() => {
            const daysInMonth = new Date(date.year, date.month + 1, 0).getDate();
            const teachers = mockData.users.filter(u => u.role === 'teacher');
            const rows = teachers.map(teacher => {
                const statuses = [];
                for (let day = 1; day <= daysInMonth; day++) {
                    const d = `${date.year}-${String(date.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const record = mockData.teacherAttendance.find(a => a.teacherId === teacher.id && a.date === d);
                    const statusChar = record ? record.status.charAt(0) : '';
                    const color = statusChar === 'P' ? 'bg-green-500' : (statusChar === 'O' ? 'bg-red-500' : 'bg-slate-200');
                    statuses.push({ char: statusChar, color });
                }
                return { id: teacher.id, name: teacher.name, statuses };
            });
            return { header: 'Teacher', rows };
        }, [date]);
        return <AttendanceGrid title="Monthly Teacher Attendance" data={reportData} date={date} setDate={setDate} onExport={() => {}} backView="main" />;
    };

    const StudentAttendanceReport = () => {
        const [date, setDate] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() });
        const cls = mockData.classes.find(c => c.id === selectedClassId);
        const attendanceMap = useMemo(() => {
            const map = new Map();
            for (const record of mockData.attendance) {
                const key = `${record.studentId}_${record.date}`;
                if (!map.has(key)) map.set(key, []);
                map.get(key).push(record.status);
            }
            return map;
        }, []);
        const reportData = useMemo(() => {
            const daysInMonth = new Date(date.year, date.month + 1, 0).getDate();
            const students = mockData.students[selectedClassId] || [];
            const rows = students.map(student => {
                const statuses = [];
                for (let day = 1; day <= daysInMonth; day++) {
                    const d = `${date.year}-${String(date.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const records = attendanceMap.get(`${student.id}_${d}`) || [];
                    let dailyStatus = '';
                    if (records.includes('Absent')) dailyStatus = 'A';
                    else if (records.includes('Late')) dailyStatus = 'L';
                    else if (records.length > 0) dailyStatus = 'P';
                    const color = dailyStatus === 'P' ? 'bg-green-500' : (dailyStatus === 'A' ? 'bg-red-500' : (dailyStatus === 'L' ? 'bg-amber-500' : 'bg-slate-200'));
                    statuses.push({ char: dailyStatus, color });
                }
                return { id: student.id, name: student.name, statuses };
            });
            return { header: 'Student', rows };
        }, [date, selectedClassId, attendanceMap]);
        return <AttendanceGrid title={`Attendance: ${cls.name}`} data={reportData} date={date} setDate={setDate} onExport={() => {}} backView="studentSelector" />;
    };

    const StudentMarksReport = () => {
        const cls = mockData.classes.find(c => c.id === selectedClassId);
        const students = mockData.students[selectedClassId] || [];
        return (
            <div>
                <button onClick={() => setView('studentSelector')} className="text-teal-600 mb-4 font-semibold">&larr; Back to Class Selection</button>
                <h1 className="text-3xl font-bold mb-8">Assessment Summary: {cls.name}</h1>
                <div className="bg-white rounded-xl shadow-md p-6">
                    {students.map(student => (
                        <button key={student.id} onClick={() => { setSelectedStudentId(student.id); setView('studentFullReport'); }} className="w-full text-left flex items-center justify-between border-b py-3 last:border-0 hover:bg-stone-50 rounded-lg px-2 -mx-2">
                            <p className="font-medium">{student.name}</p>
                            <span className="text-teal-600 font-bold text-xl">→</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const StudentFullReport = () => <StudentReportCard studentId={selectedStudentId} onBack={() => setView('studentMarksList')} />;

    const renderView = () => {
        switch (view) {
            case 'studentSelector': return <StudentReportSelector />;
            case 'teacherReport': return <TeacherAttendanceReport />;
            case 'studentAttendance': return <StudentAttendanceReport />;
            case 'studentMarksList': return <StudentMarksReport />;
            case 'studentFullReport': return <StudentFullReport />;
            case 'main':
            default:
                return <MainSelector />;
        }
    };

    return <div>{renderView()}</div>;
};

const StudentReportCard = ({ studentId, onBack }) => {
    const currentUser = useMemo(() => {
        return Object.values(mockData.students).flat().find(s => s.id === studentId);
    }, [studentId]);
    const studentClass = useMemo(() => {
        if (!currentUser) return null;
        return mockData.classes.find(c => c.id === currentUser.classId);
    }, [currentUser]);
    const overallStats = useMemo(() => {
        if (!currentUser) return { attendance: 'N/A', marks: { percentage: 0, total: 0, max: 0 } };
        const attendanceRecords = mockData.attendance.filter(a => a.studentId === currentUser.id);
        const presentCount = attendanceRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
        const attendance = attendanceRecords.length > 0 ? `${((presentCount / attendanceRecords.length) * 100).toFixed(0)}%` : 'N/A';
        const studentMarks = mockData.marks.filter(m => m.studentId === currentUser.id);
        let totalMarks = 0;
        let maxTotalMarks = 0;
        studentMarks.forEach(mark => {
            const exam = mockData.exams.find(e => e.id === mark.examId);
            if (exam) {
                totalMarks += mark.marksObtained;
                maxTotalMarks += exam.maxMarks;
            }
        });
        const percentage = maxTotalMarks > 0 ? ((totalMarks / maxTotalMarks) * 100).toFixed(2) : 0;
        return { attendance, marks: { percentage, total: totalMarks, max: maxTotalMarks } };
    }, [currentUser]);
    const reportCardData = useMemo(() => {
        if (!currentUser) return [];
        const studentMarks = mockData.marks.filter(m => m.studentId === currentUser.id);
        return mockData.exams.map(exam => ({
            ...exam,
            subjectMarks: mockData.subjects.map(subject => {
                const mark = studentMarks.find(m => m.examId === exam.id && m.subjectId === subject.id);
                return {
                    subjectName: subject.name,
                    marksObtained: mark ? mark.marksObtained : '-',
                };
            })
        }));
    }, [currentUser]);
    if (!currentUser || !studentClass) return <p>Loading student data...</p>;
    return (
        <div>
            <button onClick={onBack} className="text-teal-600 mb-4 font-semibold">&larr; Back to Student List</button>
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b">
                    <img src={currentUser.profilePicUrl} alt="Profile" className="w-24 h-24 rounded-full border-4 border-teal-200" />
                    <div>
                        <h1 className="text-3xl font-bold text-center sm:text-left">{currentUser.name}</h1>
                        <p className="text-slate-500 text-center sm:text-left">Student ID: {currentUser.studentId} | Class: {studentClass.name}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-stone-50 p-4 rounded-xl">
                        <h3 className="font-bold text-lg mb-2">Overall Attendance</h3>
                        <p className="text-4xl font-bold text-green-600">{overallStats.attendance}</p>
                        <p className="text-sm text-slate-500">Based on all recorded periods.</p>
                    </div>
                    <div className="bg-stone-50 p-4 rounded-xl">
                        <h3 className="font-bold text-lg mb-2">Overall Assessment Score</h3>
                        <p className="text-4xl font-bold text-teal-600">{overallStats.marks.percentage}%</p>
                        <p className="text-sm text-slate-500">{overallStats.marks.total} / {overallStats.marks.max} total marks</p>
                    </div>
                </div>
                <div className="mt-8">
                    <h3 className="font-bold text-xl mb-4">Subject-wise Marks</h3>
                    <div className="space-y-6">
                        {reportCardData.map(exam => (
                            <div key={exam.id} className="border rounded-lg">
                                <p className="p-3 bg-stone-100 font-semibold border-b">{exam.name} (Max Marks: {exam.maxMarks})</p>
                                <div className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {exam.subjectMarks.map(mark => (
                                        <div key={mark.subjectName} className="text-center p-2 bg-stone-50 rounded">
                                            <p className="font-semibold text-sm">{mark.subjectName}</p>
                                            <p className="text-lg">{mark.marksObtained}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
