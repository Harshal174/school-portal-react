// src/pages/student/StudentAttendanceHistory.js
import React, { useState, useMemo, useEffect } from 'react';
import { mockData } from '../../data/mockData';
import Modal from '../../components/common/Modal';

const StudentAttendanceHistory = ({ currentUser }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [modal, setModal] = useState({ isOpen: false, date: null, records: [] });
    const [isTransitioning, setIsTransitioning] = useState(false);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const today = new Date();

    // Pre-process attendance data into a map for fast lookups
    const attendanceByDate = useMemo(() => {
        if (!currentUser) return new Map();
        const map = new Map();
        mockData.attendance
            .filter(a => a.studentId === currentUser.id)
            .forEach(record => {
                if (!map.has(record.date)) {
                    map.set(record.date, []);
                }
                map.get(record.date).push(record);
            });
        return map;
    }, [currentUser]);

    const handleDayClick = (dateString) => {
        const records = attendanceByDate.get(dateString) || [];
        if (records.length > 0) {
            records.sort((a,b) => a.period - b.period); // Sort by period
            setModal({ isOpen: true, date: dateString, records });
        }
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
                        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-stone-100 text-slate-500">&lt;</button>
                        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-stone-100 text-slate-500">&gt;</button>
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
                        const records = attendanceByDate.get(dateString);
                        const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
                        
                        let dayStatusColor = 'bg-stone-100 text-slate-600';
                        if (records) {
                            if (records.some(r => r.status === 'Absent')) dayStatusColor = 'bg-red-100 text-red-800 font-bold hover:bg-red-200';
                            else if (records.some(r => r.status === 'Late')) dayStatusColor = 'bg-amber-100 text-amber-800 font-bold hover:bg-amber-200';
                            else dayStatusColor = 'bg-green-100 text-green-800 font-bold hover:bg-green-200';
                        }

                        let dayClasses = `h-12 w-12 flex items-center justify-center rounded-lg transition-colors duration-200 ${dayStatusColor}`;
                        if (isToday) dayClasses += " ring-2 ring-teal-500";

                        return (
                            <button key={day} onClick={() => handleDayClick(dateString)} className={dayClasses} disabled={!records}>
                                {day}
                            </button>
                        );
                    })}
                </div>
            </div>

            {modal.isOpen && (
                <Modal onClose={() => setModal({ isOpen: false })}>
                    <h3 className="text-xl font-bold mb-4">Attendance for {modal.date}</h3>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {modal.records.map(rec => {
                            const statusColor = rec.status === 'Present' ? 'text-green-600' : rec.status === 'Absent' ? 'text-red-600' : 'text-amber-600';
                            return (
                                <div key={rec.period} className="flex justify-between items-center p-3 bg-stone-50 rounded-lg border">
                                    <p className="font-semibold text-slate-700">Period {rec.period}</p>
                                    <p className={`font-bold ${statusColor}`}>{rec.status}</p>
                                </div>
                            );
                        })}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default StudentAttendanceHistory;
