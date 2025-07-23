// src/pages/admin/ManageSchedule.js
import React, { useState, useMemo } from 'react';
import { mockData } from '../../data/mockData';
import Modal from '../../components/common/Modal';

// Helper to get an icon and color for each subject
const getSubjectDetails = (subjectName) => {
    if (!subjectName) return { icon: '❓', color: 'bg-slate-100 text-slate-800' };
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

const ManageSchedule = () => {
    const [modal, setModal] = useState({ isOpen: false, classId: null, period: null });
    const [schedule, setSchedule] = useState(mockData.schedule);

    const handleSlotClick = (classId, period) => {
        setModal({ isOpen: true, classId, period });
    };

    const handleAssignTeacher = (classId, period, teacherId) => {
        const newSchedule = schedule.map(s => 
            (s.classId === classId && s.period === period) ? { ...s, teacherId: teacherId ? parseInt(teacherId) : null } : s
        );
        setSchedule(newSchedule);
        mockData.schedule = newSchedule;
        setModal({ isOpen: false, classId: null, period: null });
    };

    const periods = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6'];

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Master Schedule</h1>
            <div className="space-y-8">
                {mockData.classes.map(cls => (
                    <div key={cls.id} className="bg-white rounded-xl shadow-md border overflow-hidden">
                        <h2 className="p-4 text-xl font-bold text-slate-800 bg-slate-50 border-b">{cls.name}</h2>
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {periods.map((_, i) => {
                                const periodNum = i + 1;
                                const assignment = schedule.find(s => s.classId === cls.id && s.period === periodNum);
                                
                                if (!assignment) return <div key={i} className="p-2"></div>;

                                const teacher = mockData.users.find(u => u.id === assignment.teacherId);
                                const subject = mockData.subjects.find(s => s.id === assignment.subjectId);
                                const { icon, color } = getSubjectDetails(subject?.name);

                                return (
                                    <div key={i} className="flex flex-col">
                                        <p className="text-sm font-bold text-slate-500 mb-2 text-center">{`Period ${periodNum}`}</p>
                                        <button 
                                            onClick={() => handleSlotClick(cls.id, periodNum)} 
                                            className={`w-full h-32 text-left p-3 rounded-lg transition-all flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1 ${teacher ? color : 'bg-slate-50 hover:bg-slate-100 border-2 border-dashed'}`}
                                        >
                                            {teacher ? (
                                                <>
                                                    <div>
                                                        <span className="text-2xl">{icon}</span>
                                                        <p className="font-bold mt-1 text-sm">{subject?.name}</p>
                                                    </div>
                                                    <p className="text-xs truncate font-medium">{teacher.name}</p>
                                                </>
                                            ) : (
                                                <div className="text-center text-slate-400 m-auto">
                                                    <span className="text-2xl">+</span>
                                                    <p className="text-xs mt-1">Assign</p>
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
            {modal.isOpen && (
                <Modal onClose={() => setModal({ isOpen: false })}>
                    <AssignTeacherForm 
                        classId={modal.classId} 
                        period={modal.period}
                        onSave={handleAssignTeacher}
                        onCancel={() => setModal({ isOpen: false })}
                    />
                </Modal>
            )}
        </div>
    );
};

const AssignTeacherForm = ({ classId, period, onSave, onCancel }) => {
    const assignment = mockData.schedule.find(s => s.classId === classId && s.period === period);
    const cls = mockData.classes.find(c => c.id === classId);
    const subject = mockData.subjects.find(s => s.id === assignment.subjectId);

    const availableTeachers = useMemo(() => {
        const busyTeacherIds = mockData.schedule
            .filter(s => s.period === period && s.teacherId !== null && s.teacherId !== assignment.teacherId)
            .map(s => s.teacherId);
        return mockData.users.filter(u => u.role === 'teacher' && u.status === 'active' && !busyTeacherIds.includes(u.id));
    }, [period, assignment.teacherId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(classId, period, e.target.teacher.value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold mb-4">Assign Teacher</h3>
            <div className="mb-4 space-y-1 p-3 bg-slate-50 rounded-lg">
                <p><span className="font-semibold">Class:</span> {cls.name}</p>
                <p><span className="font-semibold">Period:</span> {period}</p>
                <p><span className="font-semibold">Subject:</span> {subject.name}</p>
            </div>
            <label htmlFor="teacher" className="block text-sm font-medium text-slate-600 mb-1">Select an Available Teacher</label>
            <select name="teacher" defaultValue={assignment.teacherId || ''} className="w-full px-4 py-2 border rounded-lg">
                <option value="">-- Unassigned --</option>
                {availableTeachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={onCancel} className="bg-slate-200 px-4 py-2 rounded-lg">Cancel</button>
                <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg">Update Assignment</button>
            </div>
        </form>
    );
};

export default ManageSchedule;
