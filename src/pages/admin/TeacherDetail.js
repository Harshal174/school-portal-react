// src/pages/admin/TeacherDetail.js
import React, { useState, useMemo } from 'react';
import { mockData } from '../../data/mockData';
import Modal from '../../components/common/Modal'; // Assuming a generic Modal component exists

const TeacherDetail = ({ teacherId, onBack }) => {
    // Find the initial teacher data from the mockData source
    const initialTeacher = useMemo(() => mockData.users.find(u => u.id === teacherId), [teacherId]);

    // Use state to manage the teacher's data to trigger re-renders on update
    const [teacher, setTeacher] = useState(initialTeacher);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleSaveDetails = (formData) => {
        // Update the teacher's data in the component's state
        const updatedTeacher = { ...teacher, ...formData };
        setTeacher(updatedTeacher);

        // Also update the master mockData object for persistence
        const teacherInMock = mockData.users.find(u => u.id === teacherId);
        if (teacherInMock) {
            Object.assign(teacherInMock, formData);
        }

        setIsEditModalOpen(false); // Close the modal
    };

    const handleChangePicture = () => {
        // Simulate changing the picture by updating the placeholder URL with a new random color
        const randomColor = Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        const newPicUrl = `https://placehold.co/128x128/${randomColor}/ffffff?text=${teacher.name.charAt(0)}`;
        
        const updatedTeacher = { ...teacher, profilePicUrl: newPicUrl };
        setTeacher(updatedTeacher);
        
        // Update the master mockData object as well
        const teacherInMock = mockData.users.find(u => u.id === teacherId);
        if (teacherInMock) {
            teacherInMock.profilePicUrl = newPicUrl;
        }
    };

    if (!teacher) {
        return (
            <div>
                <button onClick={onBack} className="text-teal-600 mb-4 font-semibold">&larr; Back</button>
                <p>Teacher not found.</p>
            </div>
        );
    }

    return (
        <div>
            <button onClick={onBack} className="text-teal-600 mb-4 font-semibold">&larr; Back to Teacher List</button>
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
                <div className="text-center">
                    <img 
                        src={teacher.profilePicUrl} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-teal-200" 
                    />
                    <h1 className="text-3xl font-bold">{teacher.name}</h1>
                    <p className="text-slate-500">Teacher ID: {teacher.teacherId}</p>
                </div>
                <div className="mt-8 pt-6 border-t text-center">
                    <p className="text-sm text-slate-500">Qualifications</p>
                    <p className="font-semibold">{teacher.qualifications}</p>
                </div>
                <div className="mt-6 pt-6 border-t flex gap-4">
                    <button onClick={() => setIsEditModalOpen(true)} className="flex-1 bg-stone-100 text-slate-700 py-2 rounded-lg hover:bg-stone-200 transition font-semibold">
                        Edit Details
                    </button>
                    <button onClick={handleChangePicture} className="flex-1 bg-stone-100 text-slate-700 py-2 rounded-lg hover:bg-stone-200 transition font-semibold">
                        Change Picture
                    </button>
                </div>
            </div>

            {isEditModalOpen && (
                <Modal onClose={() => setIsEditModalOpen(false)}>
                    <EditTeacherForm 
                        teacher={teacher}
                        onSave={handleSaveDetails}
                        onCancel={() => setIsEditModalOpen(false)}
                    />
                </Modal>
            )}
        </div>
    );
};

// A sub-component for the edit form
const EditTeacherForm = ({ teacher, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: teacher.name,
        email: teacher.email,
        qualifications: teacher.qualifications
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold mb-4">Edit Teacher Details</h3>
            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 mb-1">Qualifications</label>
                <input type="text" name="qualifications" value={formData.qualifications} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
             <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={onCancel} className="bg-slate-200 px-4 py-2 rounded-lg font-semibold hover:bg-slate-300">Cancel</button>
                <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700">Save Changes</button>
            </div>
        </form>
    );
};

export default TeacherDetail;
