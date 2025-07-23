// src/pages/admin/ManageLeaves.js
import React, { useState, useMemo } from 'react';
import { mockData } from '../../data/mockData';
import { callGeminiAPI } from '../../api/geminiAPI';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';

const ManageLeaves = () => {
    const [leaves, setLeaves] = useState(mockData.leaves);
    const [modal, setModal] = useState({ type: null, data: null });
    const [loadingState, setLoadingState] = useState({ leaveId: null, action: null }); // Tracks which specific action is loading
    
    const [viewMode, setViewMode] = useState('calendar');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [filters, setFilters] = useState({ status: 'All', teacherId: 'All' });

    const filteredLeaves = useMemo(() => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        return leaves.filter(leave => {
            const leaveDate = new Date(leave.startDate);
            const statusMatch = filters.status === 'All' || leave.status === filters.status;
            const teacherMatch = filters.teacherId === 'All' || leave.teacherId === parseInt(filters.teacherId);
            if (viewMode === 'list') {
                return statusMatch && teacherMatch;
            }
            return statusMatch && teacherMatch && leaveDate.getMonth() === month && leaveDate.getFullYear() === year;
        });
    }, [leaves, filters, viewMode, currentDate]);

    const handleActionClick = async (leave, action) => {
        setLoadingState({ leaveId: leave.id, action: action });
        const actionText = action === 'approve' ? 'approved' : 'rejected';
        const prompt = `Draft a polite and professional email to a teacher named ${leave.teacherName} informing them that their leave request from ${leave.startDate} to ${leave.endDate} for "${leave.reason}" has been ${actionText}. Keep it brief and to the point.`;
        
        let emailBody = '';

        try {
            // Attempt to call the API
            emailBody = await callGeminiAPI(prompt);
        } catch (error) {
            console.error("Error generating email:", error); // Log the actual error for debugging
            
            // --- FIX START: Fallback to a default message on API failure ---
            alert("Could not generate an AI-powered email. A default message will be used.");
            emailBody = `Dear ${leave.teacherName},\n\nThis is to inform you that your leave request from ${leave.startDate} to ${leave.endDate} has been ${actionText}.\n\nSincerely,\nSchool Administration`;
            // --- FIX END ---
        } finally {
            // Always proceed to the confirmation modal, even if the API failed
            setModal({ type: 'confirmAction', data: { leave, action, emailBody } });
            setLoadingState({ leaveId: null, action: null });
        }
    };

    const confirmLeaveAction = (leaveId, action) => {
        const newStatus = action === 'approve' ? 'Approved' : 'Rejected';
        const updatedLeaves = leaves.map(l => l.id === leaveId ? { ...l, status: newStatus } : l);
        setLeaves(updatedLeaves);
        
        const leaveInMock = mockData.leaves.find(l => l.id === leaveId);
        if(leaveInMock) leaveInMock.status = newStatus;
        
        setModal({ type: null, data: null });
    };

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <h1 className="text-3xl font-bold">Manage Leave Requests</h1>
                <FilterControls filters={filters} setFilters={setFilters} viewMode={viewMode} setViewMode={setViewMode} />
            </div>
            
            {viewMode === 'calendar' ? (
                <CalendarView leaves={filteredLeaves} currentDate={currentDate} setCurrentDate={setCurrentDate} setModal={setModal} />
            ) : (
                <ListView leaves={filteredLeaves} onActionClick={handleActionClick} loadingState={loadingState} />
            )}

            {modal.type === 'confirmAction' && (
                <Modal onClose={() => setModal({ type: null })}>
                    <h3 className="text-xl font-bold mb-4">Confirm {modal.data.action}</h3>
                    <p className="mb-4">You are about to {modal.data.action} this request. The following email will be sent:</p>
                    <div className="bg-stone-100 p-3 rounded-md border text-sm" dangerouslySetInnerHTML={{ __html: modal.data.emailBody.replace(/\n/g, '<br>') }} />
                    <div className="flex justify-end gap-2 mt-6">
                        <button onClick={() => setModal({ type: null })} className="bg-slate-200 px-4 py-2 rounded-lg">Cancel</button>
                        <button onClick={() => confirmLeaveAction(modal.data.leave.id, modal.data.action)} className="bg-teal-600 text-white px-4 py-2 rounded-lg">Send & {modal.data.action.charAt(0).toUpperCase() + modal.data.action.slice(1)}</button>
                    </div>
                </Modal>
            )}
            
            {modal.type === 'leaveDetails' && (
                <Modal onClose={() => setModal({ type: null })}>
                    <LeaveDetails leave={modal.data} onActionClick={handleActionClick} loadingState={loadingState} />
                </Modal>
            )}
        </div>
    );
};

// --- SUB-COMPONENTS ---

const FilterControls = ({ filters, setFilters, viewMode, setViewMode }) => {
    const teachers = useMemo(() => mockData.users.filter(u => u.role === 'teacher'), []);
    const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));

    return (
        <div className="flex flex-wrap items-center gap-2">
            <select name="teacherId" value={filters.teacherId} onChange={handleFilterChange} className="p-2 border rounded-lg bg-white shadow-sm">
                <option value="All">All Teachers</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <select name="status" value={filters.status} onChange={handleFilterChange} className="p-2 border rounded-lg bg-white shadow-sm">
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
            </select>
            <div className="flex rounded-lg shadow-sm border">
                <button onClick={() => setViewMode('calendar')} className={`px-3 py-2 rounded-l-lg ${viewMode === 'calendar' ? 'bg-teal-600 text-white' : 'bg-white'}`}>Calendar</button>
                <button onClick={() => setViewMode('list')} className={`px-3 py-2 rounded-r-lg ${viewMode === 'list' ? 'bg-teal-600 text-white' : 'bg-white'}`}>List</button>
            </div>
        </div>
    );
};

const CalendarView = ({ leaves, currentDate, setCurrentDate, setModal }) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const changeMonth = (offset) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    const getStatusColor = (status) => {
        if (status === 'Pending') return 'bg-amber-500 hover:bg-amber-600';
        if (status === 'Approved') return 'bg-green-500 hover:bg-green-600';
        return 'bg-red-500 hover:bg-red-600';
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-700">{monthNames[month]} {year}</h2>
                <div className="flex items-center gap-2">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-stone-100 text-slate-500">&lt;</button>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-stone-100 text-slate-500">&gt;</button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => <div key={day} className="text-center text-xs font-bold text-slate-400 py-2">{day}</div>)}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const leavesOnDay = leaves.filter(l => l.startDate === dateString);
                    return (
                        <div key={day} className="border rounded-lg min-h-[120px] p-1.5 flex flex-col">
                            <span className="font-semibold text-sm text-slate-600">{day}</span>
                            <div className="flex-grow space-y-1 mt-1">
                                {leavesOnDay.map(leave => (
                                    <button key={leave.id} onClick={() => setModal({ type: 'leaveDetails', data: leave })} className={`w-full text-left p-1.5 rounded-md text-white text-xs ${getStatusColor(leave.status)}`}>
                                        <p className="font-bold truncate">{leave.teacherName}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ListView = ({ leaves, onActionClick, loadingState }) => {
    const getStatusColor = (status) => {
        if (status === 'Pending') return 'border-amber-300 bg-amber-50';
        if (status === 'Approved') return 'border-green-300 bg-green-50';
        return 'border-red-300 bg-red-50';
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            {leaves.length > 0 ? leaves.map(leave => (
                <div key={leave.id} className={`p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${getStatusColor(leave.status)}`}>
                    <div>
                        <p className="font-bold">{leave.teacherName}</p>
                        <p className="text-sm text-slate-600">{leave.startDate} to {leave.endDate}</p>
                        <p className="text-sm text-slate-500 mt-1">Reason: {leave.reason}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {leave.status === 'Pending' ? (
                            <>
                                <button onClick={() => onActionClick(leave, 'approve')} disabled={loadingState.leaveId !== null} className="bg-green-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-green-600 w-24 h-8 flex items-center justify-center">
                                    {loadingState.leaveId === leave.id && loadingState.action === 'approve' ? <Spinner /> : 'Approve'}
                                </button>
                                <button onClick={() => onActionClick(leave, 'reject')} disabled={loadingState.leaveId !== null} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-600 w-24 h-8 flex items-center justify-center">
                                    {loadingState.leaveId === leave.id && loadingState.action === 'reject' ? <Spinner /> : 'Reject'}
                                </button>
                            </>
                        ) : (
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${leave.status === 'Approved' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{leave.status}</span>
                        )}
                    </div>
                </div>
            )) : <p className="text-slate-500 text-center py-8">No leave requests match the current filters.</p>}
        </div>
    );
};

const LeaveDetails = ({ leave, onActionClick, loadingState }) => (
    <div>
        <h3 className="text-xl font-bold mb-4">Leave Details</h3>
        <div className="space-y-2 text-sm">
            <p><strong>Teacher:</strong> {leave.teacherName}</p>
            <p><strong>Dates:</strong> {leave.startDate} to {leave.endDate}</p>
            <p><strong>Reason:</strong> {leave.reason}</p>
            <p><strong>Status:</strong> <span className={`font-semibold ${leave.status === 'Pending' ? 'text-amber-600' : (leave.status === 'Approved' ? 'text-green-600' : 'text-red-600')}`}>{leave.status}</span></p>
        </div>
        {leave.status === 'Pending' && (
            <div className="flex items-center gap-2 mt-6 pt-4 border-t">
                <button onClick={() => onActionClick(leave, 'approve')} disabled={loadingState.leaveId !== null} className="bg-green-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-green-600 w-24 h-8 flex items-center justify-center">
                    {loadingState.leaveId === leave.id && loadingState.action === 'approve' ? <Spinner /> : 'Approve'}
                </button>
                <button onClick={() => onActionClick(leave, 'reject')} disabled={loadingState.leaveId !== null} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-600 w-24 h-8 flex items-center justify-center">
                    {loadingState.leaveId === leave.id && loadingState.action === 'reject' ? <Spinner /> : 'Reject'}
                </button>
            </div>
        )}
    </div>
);

export default ManageLeaves;
