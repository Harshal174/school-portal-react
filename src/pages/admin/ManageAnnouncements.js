// src/pages/admin/ManageAnnouncements.js
import React, { useState } from 'react';
import { mockData } from '../../data/mockData';
import Modal from '../../components/common/Modal';

// Helper function to determine the icon based on the announcement title
const getIconForAnnouncement = (title) => {
    const lowerCaseTitle = title.toLowerCase();
    if (lowerCaseTitle.includes('sport')) return '🏆';
    if (lowerCaseTitle.includes('meeting')) return '👥';
    if (lowerCaseTitle.includes('exam')) return '📝';
    if (lowerCaseTitle.includes('holiday')) return '🎉';
    return '📢';
};

// Helper to check if an announcement is recent
const isRecent = (dateString) => {
    const announcementDate = new Date(dateString);
    const today = new Date();
    const fiveDaysAgo = new Date(today.setDate(today.getDate() - 5));
    return announcementDate > fiveDaysAgo;
};


const ManageAnnouncements = () => {
    const [announcements, setAnnouncements] = useState(mockData.announcements);
    const [modal, setModal] = useState({ isOpen: false, data: null });

    const handleSave = (formData) => {
        if (modal.data) {
            const updatedAnnouncements = announcements.map(ann =>
                ann.id === modal.data.id ? { ...ann, ...formData } : ann
            );
            setAnnouncements(updatedAnnouncements);
            const index = mockData.announcements.findIndex(a => a.id === modal.data.id);
            if(index > -1) mockData.announcements[index] = { ...mockData.announcements[index], ...formData };
        } else {
            const newAnnouncement = {
                id: Date.now(),
                date: new Date().toISOString().split('T')[0],
                ...formData,
            };
            const updatedAnnouncements = [newAnnouncement, ...announcements];
            setAnnouncements(updatedAnnouncements);
            mockData.announcements.unshift(newAnnouncement);
        }
        setModal({ isOpen: false, data: null });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            setAnnouncements(announcements.filter(ann => ann.id !== id));
            mockData.announcements = mockData.announcements.filter(ann => ann.id !== id);
        }
    };

    const AnnouncementForm = ({ announcement, onSave, onCancel }) => {
        const [title, setTitle] = useState(announcement?.title || '');
        const [content, setContent] = useState(announcement?.content || '');

        const handleSubmit = (e) => {
            e.preventDefault();
            onSave({ title, content });
        };

        return (
            <form onSubmit={handleSubmit}>
                <h3 className="text-xl font-bold mb-4">{announcement ? 'Edit Announcement' : 'Create Announcement'}</h3>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-slate-600 mb-1">Title</label>
                    <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="content" className="block text-sm font-medium text-slate-600 mb-1">Content</label>
                    <textarea id="content" rows="5" value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button type="button" onClick={onCancel} className="bg-slate-200 px-4 py-2 rounded-lg">Cancel</button>
                    <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg">{announcement ? 'Save Changes' : 'Publish'}</button>
                </div>
            </form>
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Announcements</h1>
                <button onClick={() => setModal({ isOpen: true, data: null })} className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 flex items-center gap-2 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    New Announcement
                </button>
            </div>
            <div className="space-y-6">
                {announcements.sort((a, b) => new Date(b.date) - new Date(a.date)).map(ann => (
                    <div key={ann.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-teal-500">
                        <div className="flex items-start gap-4">
                            <div className="text-3xl bg-teal-100 p-3 rounded-full">
                                {getIconForAnnouncement(ann.title)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-xl text-slate-800">{ann.title}</h3>
                                            {isRecent(ann.date) && (
                                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500">{new Date(ann.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                    <div className="flex gap-3 flex-shrink-0">
                                        <button onClick={() => setModal({ isOpen: true, data: ann })} className="text-blue-600 font-semibold text-sm hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(ann.id)} className="text-red-600 font-semibold text-sm hover:underline">Delete</button>
                                    </div>
                                </div>
                                <p className="text-slate-600 mt-3 border-t pt-3">{ann.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {modal.isOpen && (
                <Modal onClose={() => setModal({ isOpen: false, data: null })}>
                    <AnnouncementForm
                        announcement={modal.data}
                        onSave={handleSave}
                        onCancel={() => setModal({ isOpen: false, data: null })}
                    />
                </Modal>
            )}
        </div>
    );
};

export default ManageAnnouncements;
