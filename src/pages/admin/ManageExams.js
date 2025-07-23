// src/pages/admin/ManageExams.js
import React, { useState } from 'react';
import { mockData } from '../../data/mockData';
import Modal from '../../components/common/Modal'; // Assuming a generic Modal component exists

const ManageExams = () => {
    const [exams, setExams] = useState(mockData.exams);
    const [modal, setModal] = useState({ isOpen: false, data: null }); // data holds the exam to edit

    const handleSave = (formData) => {
        if (modal.data) { // Editing an existing exam
            const updatedExams = exams.map(exam =>
                exam.id === modal.data.id ? { ...exam, ...formData } : exam
            );
            setExams(updatedExams);
            const index = mockData.exams.findIndex(e => e.id === modal.data.id);
            if (index > -1) mockData.exams[index] = { ...mockData.exams[index], ...formData };
        } else { // Creating a new exam
            const newExam = {
                id: Date.now(),
                ...formData
            };
            const updatedExams = [...exams, newExam];
            setExams(updatedExams);
            mockData.exams.push(newExam);
        }
        setModal({ isOpen: false, data: null });
    };

    const handleDelete = (id) => {
        const exam = exams.find(e => e.id === id);
        if (window.confirm(`Are you sure you want to delete the exam "${exam.name}"? This will also delete all associated marks.`)) {
            setExams(exams.filter(e => e.id !== id));
            mockData.exams = mockData.exams.filter(e => e.id !== id);
            mockData.marks = mockData.marks.filter(m => m.examId !== id);
        }
    };

    // A sub-component for the Add/Edit form, rendered inside the modal
    const ExamForm = ({ exam, onSave, onCancel }) => {
        const [name, setName] = useState(exam?.name || '');
        const [date, setDate] = useState(exam?.date || '');
        const [maxMarks, setMaxMarks] = useState(exam?.maxMarks || '');

        const handleSubmit = (e) => {
            e.preventDefault();
            onSave({ name, date, maxMarks: parseInt(maxMarks) });
        };

        return (
            <form onSubmit={handleSubmit}>
                <h3 className="text-xl font-bold mb-4">{exam ? 'Edit Exam' : 'Create Exam'}</h3>
                <div className="mb-4">
                    <label htmlFor="examName" className="block text-sm font-medium text-slate-600 mb-1">Exam Name</label>
                    <input id="examName" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="examDate" className="block text-sm font-medium text-slate-600 mb-1">Date</label>
                    <input id="examDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="maxMarks" className="block text-sm font-medium text-slate-600 mb-1">Max Marks</label>
                    <input id="maxMarks" type="number" value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button type="button" onClick={onCancel} className="bg-slate-200 px-4 py-2 rounded-lg">Cancel</button>
                    <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg">{exam ? 'Save Changes' : 'Create'}</button>
                </div>
            </form>
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Exams</h1>
                <button onClick={() => setModal({ isOpen: true, data: null })} className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 flex items-center gap-2 shadow-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    New Exam
                </button>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border">
                <div className="space-y-4">
                    {exams.map(exam => (
                        <div key={exam.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
                            <div className="flex items-center gap-4">
                                <div className="text-3xl bg-slate-200 p-3 rounded-lg">📝</div>
                                <div>
                                    <h3 className="font-bold text-xl text-slate-800">{exam.name}</h3>
                                    <p className="text-sm text-slate-500">
                                        Date: {new Date(exam.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} | Max Marks: {exam.maxMarks}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 flex-shrink-0 self-end sm:self-center">
                                <button onClick={() => setModal({ isOpen: true, data: exam })} className="text-blue-600 font-semibold text-sm hover:underline">Edit</button>
                                <button onClick={() => handleDelete(exam.id)} className="text-red-600 font-semibold text-sm hover:underline">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {modal.isOpen && (
                <Modal onClose={() => setModal({ isOpen: false, data: null })}>
                    <ExamForm
                        exam={modal.data}
                        onSave={handleSave}
                        onCancel={() => setModal({ isOpen: false, data: null })}
                    />
                </Modal>
            )}
        </div>
    );
};

export default ManageExams;
