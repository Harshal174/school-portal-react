// src/pages/teacher/TeacherAttendanceHistory.js
import React, { useState, useMemo, useEffect } from 'react';
import { mockData } from '../../data/mockData';
import Modal from '../../components/common/Modal';

// FIX: The component now accepts `currentUser` as a prop instead of using a hook
const TeacherAttendanceHistory = ({ currentUser }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [modal, setModal] = useState({ isOpen: false, date: null, records: [] });
    const [isTransitioning, setIsTransitioning] = useState(false);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const today = new Date();

    const markedDays = useMemo(() => {
        const days = new Set();
        if (!currentUser) return days;
        const teacherScheduleSlots = mockData.schedule.filter(s => s.teacherId === currentUser.id);
        
        mockData.attendance.forEach(a => {
            if (teacherScheduleSlots.some(s => s.classId === a.classId && s.period === a.period)) {
                days.add(a.date);
            }
        });
        return days;
    }, [currentUser]);

    const handleDayClick = (date) => {
        const records = mockData.attendance.filter(a => a.date === date && markedDays.has(date));
        if (records.length === 0) return;

        const recordsByClassPeriod = {};
        records.forEach(rec => {
            const key = `${rec.classId}-${rec.period}`;
            if (!recordsByClassPeriod[key]) {
                const cls = mockData.classes.find(c => c.id === rec.classId);
                recordsByClassPeriod[key] = { className: cls?.name || 'Unknown Class', period: rec.period, present: 0, absent: 0, late: 0 };
            }
            if (rec.status === 'Present') recordsByClassPeriod[key].present++;
            else if (rec.status === 'Absent') recordsByClassPeriod[key].absent++;
            else if (rec.status === 'Late') recordsByClassPeriod[key].late++;
        });
        setModal({ isOpen: true, date, records: Object.values(recordsByClassPeriod) });
    };

    const changeMonth = (offset) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentDate(prevDate => {
                const newDate = new Date(prevDate);
                newDate.setMonth(newDate.getMonth() + offset);
                return newDate;
            });
        }, 150);
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsTransitioning(false), 50);
        return () => clearTimeout(timer);
    }, [currentDate]);

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">My Attendance History</h1>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-700">{monthNames[month]} {year}</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-stone-100 text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-stone-100 text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center font-semibold text-slate-500 text-sm">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="py-2">{day}</div>)}
                </div>
                <div className={`grid grid-cols-7 gap-2 mt-2 transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                        const day = i + 1;
                        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const hasRecord = markedDays.has(dateString);
                        const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

                        let dayClasses = "h-12 w-12 flex items-center justify-center rounded-lg transition-colors duration-200";
                        if (hasRecord) {
                            dayClasses += " bg-teal-100 text-teal-800 font-bold cursor-pointer hover:bg-teal-200";
                        } else {
                            dayClasses += " text-slate-600 hover:bg-stone-100";
                        }
                        if (isToday) {
                            dayClasses += " ring-2 ring-teal-500";
                        }

                        return (
                            <button key={day} onClick={() => handleDayClick(dateString)} className={dayClasses} disabled={!hasRecord}>
                                {day}
                            </button>
                        );
                    })}
                </div>
            </div>

            {modal.isOpen && (
                <Modal onClose={() => setModal({ isOpen: false })}>
                    <h3 className="text-xl font-bold mb-4">Attendance Summary for {modal.date}</h3>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                        {modal.records.length > 0 ? modal.records.map(rec => (
                            <div key={`${rec.className}-${rec.period}`} className="p-3 bg-stone-50 rounded-lg border">
                                <p className="font-bold text-slate-800">{rec.className} - Period {rec.period}</p>
                                <p className="text-sm text-slate-600 mt-1">
                                    <span className="text-green-600 font-medium">Present: {rec.present}</span>,{' '}
                                    <span className="text-red-600 font-medium">Absent: {rec.absent}</span>,{' '}
                                    <span className="text-amber-600 font-medium">Late: {rec.late}</span>
                                </p>
                            </div>
                        )) : <p>No records found.</p>}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default TeacherAttendanceHistory;
