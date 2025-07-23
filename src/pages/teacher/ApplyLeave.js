// src/pages/teacher/ApplyLeave.js
import React, { useState } from 'react';
import { mockData } from '../../data/mockData';
import { callGeminiAPI } from '../../api/geminiAPI';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../hooks/useAuth';

const ApplyLeave = ({ onLeaveApplied }) => {
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        leaveType: 'Sick Leave',
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSuggestReason = async () => {
        if (!formData.startDate || !formData.endDate) {
            alert('Please select start and end dates first.');
            return;
        }
        setIsLoading(true);
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const durationText = `${duration} day${duration > 1 ? 's' : ''}`;
        const prompt = `Generate a brief, professional, and polite reason for a teacher's leave application. Type of leave: ${formData.leaveType}. Duration: ${durationText}.`;
        
        try {
            const suggestedReason = await callGeminiAPI(prompt);
            setFormData({ ...formData, reason: suggestedReason });
        } catch (error) {
            console.error("Gemini API Error:", error);
            alert("Sorry, an error occurred while generating a response.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newLeave = {
            id: Date.now(),
            teacherId: currentUser.id,
            teacherName: currentUser.name,
            status: 'Pending',
            ...formData
        };
        mockData.leaves.push(newLeave);
        alert('Leave application submitted for approval.');
        if (onLeaveApplied) onLeaveApplied();
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Apply for Leave</h1>
            <div className="bg-white p-8 rounded-xl shadow-lg border">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Leave Type */}
                        <div className="relative">
                            <label htmlFor="leaveType" className="block text-sm font-medium text-slate-600 mb-1">Leave Type</label>
                            <div className="absolute inset-y-0 left-0 top-6 flex items-center pl-3 pointer-events-none">
                                <span className="text-slate-400">📋</span>
                            </div>
                            <select name="leaveType" value={formData.leaveType} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500">
                                <option>Sick Leave</option>
                                <option>Casual Leave</option>
                                <option>Personal Leave</option>
                            </select>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label htmlFor="startDate" className="block text-sm font-medium text-slate-600 mb-1">Start Date</label>
                                <div className="absolute inset-y-0 left-0 top-6 flex items-center pl-3 pointer-events-none">
                                    <span className="text-slate-400">🗓️</span>
                                </div>
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg" required />
                            </div>
                            <div className="relative">
                                <label htmlFor="endDate" className="block text-sm font-medium text-slate-600 mb-1">End Date</label>
                                 <div className="absolute inset-y-0 left-0 top-6 flex items-center pl-3 pointer-events-none">
                                    <span className="text-slate-400">🗓️</span>
                                </div>
                                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg" required />
                            </div>
                        </div>

                        {/* Reason */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="reason" className="block text-sm font-medium text-slate-600">Reason</label>
                                <button type="button" onClick={handleSuggestReason} disabled={isLoading} className="text-sm text-teal-600 font-semibold hover:text-teal-800 flex items-center gap-1 transition-colors">
                                    {isLoading ? <Spinner /> : '✨ Suggest with AI'}
                                </button>
                            </div>
                            <textarea name="reason" rows="4" value={formData.reason} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg" placeholder="Please provide a brief reason for your leave..." required />
                        </div>
                    </div>
                    <button type="submit" className="w-full mt-8 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition font-semibold shadow-md text-base">
                        Submit Application
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApplyLeave;
