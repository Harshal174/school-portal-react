// src/pages/admin/AdminDashboard.js
import React, { useMemo } from 'react';
import { mockData } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';

// Icon components for stat cards (simple SVGs)
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M12 14a5 5 0 100-10 5 5 0 000 10z" />
    </svg>
);

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const CheckCircleIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const AdminDashboard = ({ onNavigate = () => {} }) => { // Add a default empty function for safety
    const { currentUser } = useAuth();

    const stats = useMemo(() => {
        const totalTeachers = mockData.users.filter(u => u.role === 'teacher').length;
        const pendingLeaves = mockData.leaves.filter(l => l.status === 'Pending');
        // A more realistic calculation for today's attendance
        const today = new Date().toISOString().split('T')[0];
        const attendanceRecordsToday = mockData.teacherAttendance.filter(a => a.date === today);
        const presentToday = attendanceRecordsToday.filter(a => a.status === 'Present').length;
        const todaysAttendance = totalTeachers > 0 ? `${Math.round((presentToday / totalTeachers) * 100)}%` : 'N/A';

        return { totalTeachers, pendingLeaves, todaysAttendance };
    }, []);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-slate-500">Welcome back, {currentUser?.name || 'Admin'}!</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Teachers" value={stats.totalTeachers} icon={<UsersIcon />} />
                <StatCard title="Pending Leave Requests" value={stats.pendingLeaves.length} icon={<MailIcon />} />
                <StatCard title="Teacher Attendance Today" value={stats.todaysAttendance} icon={<CheckCircleIcon />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pending Leaves List */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border">
                    <h2 className="text-xl font-bold mb-4">Recent Pending Leaves</h2>
                    <div className="space-y-4">
                        {stats.pendingLeaves.length > 0 ? (
                            stats.pendingLeaves.slice(0, 4).map(leave => (
                                <div key={leave.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-bold text-slate-800">{leave.teacherName}</p>
                                        <p className="text-sm text-slate-500">{leave.startDate} to {leave.endDate}</p>
                                    </div>
                                    <span className="text-sm font-medium text-amber-600">Pending</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 text-center py-4">No pending leave requests.</p>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <QuickActionButton onClick={() => onNavigate('announcements')}>Create Announcement</QuickActionButton>
                        <QuickActionButton onClick={() => onNavigate('manageTeachers')}>Add New Teacher</QuickActionButton>
                        <QuickActionButton onClick={() => onNavigate('reports')}>View Full Reports</QuickActionButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-component for individual stat cards
const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border flex items-center gap-6">
        <div className="bg-slate-100 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <h3 className="text-slate-500 font-semibold">{title}</h3>
            <p className="text-4xl font-bold mt-1">{value}</p>
        </div>
    </div>
);

// Sub-component for quick action buttons
const QuickActionButton = ({ children, onClick }) => (
    <button onClick={onClick} className="w-full text-left p-3 bg-slate-50 hover:bg-teal-50 rounded-lg font-semibold text-slate-700 hover:text-teal-800 transition-colors">
        {children}
    </button>
);

export default AdminDashboard;
