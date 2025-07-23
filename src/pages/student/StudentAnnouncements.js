// src/pages/student/StudentAnnouncements.js
import React from 'react';
import { mockData } from '../../data/mockData';

// Helper function to determine the icon based on the announcement title
const getIconForAnnouncement = (title) => {
    const lowerCaseTitle = title.toLowerCase();
    if (lowerCaseTitle.includes('sport')) {
        return '🏆'; // Trophy for sports
    }
    if (lowerCaseTitle.includes('meeting') || lowerCaseTitle.includes('parent')) {
        return '👥'; // Group of people for meetings
    }
    if (lowerCaseTitle.includes('exam') || lowerCaseTitle.includes('test')) {
        return '📝'; // Memo for exams
    }
    if (lowerCaseTitle.includes('holiday') || lowerCaseTitle.includes('break')) {
        return '🎉'; // Party popper for holidays
    }
    return '📢'; // Default loudspeaker
};

// Helper to check if an announcement is recent (e.g., within the last 5 days)
const isRecent = (dateString) => {
    const announcementDate = new Date(dateString);
    const today = new Date();
    const fiveDaysAgo = new Date(today.setDate(today.getDate() - 5));
    return announcementDate > fiveDaysAgo;
};

const StudentAnnouncements = () => {
    // Sort announcements by date, most recent first
    const sortedAnnouncements = [...mockData.announcements].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">School Announcements</h1>
            <div className="space-y-6">
                {sortedAnnouncements.map(ann => (
                    <div key={ann.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-teal-500 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-start gap-4">
                            <div className="text-3xl bg-teal-100 p-3 rounded-full">
                                {getIconForAnnouncement(ann.title)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-bold text-xl text-slate-800">{ann.title}</h3>
                                    {isRecent(ann.date) && (
                                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-500 mb-2">{new Date(ann.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                <p className="text-slate-600 leading-relaxed">{ann.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentAnnouncements;
