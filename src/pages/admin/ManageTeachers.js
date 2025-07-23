// src/pages/admin/ManageTeachers.js
import React, { useState, useMemo } from 'react';
import { mockData } from '../../data/mockData';
import Modal from '../../components/common/Modal';
import TeacherDetail from './TeacherDetail';

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState(mockData.users.filter(u => u.role === 'teacher'));
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState({ type: 'list', teacherId: null });
  const [modal, setModal] = useState({ type: null, data: null });

  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, teachers]);

  const handleSaveTeacher = (formData) => {
    const newTeacher = {
        id: Date.now(),
        teacherId: 'TCH' + Date.now(),
        role: 'teacher',
        status: 'active',
        passwordChanged: false,
        profilePicUrl: `https://placehold.co/128x128/e9d5ff/4c1d95?text=${formData.name.charAt(0)}`,
        ...formData,
    };
    setTeachers(prev => [...prev, newTeacher]);
    mockData.users.push(newTeacher);
    setModal({ type: null, data: null });
  };

  const handleToggleStatus = (teacherId, e) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher && window.confirm(`Are you sure you want to ${teacher.status === 'active' ? 'deactivate' : 'activate'} ${teacher.name}?`)) {
        const newStatus = teacher.status === 'active' ? 'inactive' : 'active';
        setTeachers(teachers.map(t => t.id === teacherId ? { ...t, status: newStatus } : t));
        const teacherInMock = mockData.users.find(u => u.id === teacherId);
        if (teacherInMock) teacherInMock.status = newStatus;
    }
  };

  const TeacherForm = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({ name: '', email: '', qualifications: '', password: 'password' });
    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold mb-4">Add New Teacher</h3>
            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                <input type="text" name="name" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                <input type="email" name="email" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 mb-1">Qualifications</label>
                <input type="text" name="qualifications" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., M.Sc. in Physics" required />
            </div>
             <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={onCancel} className="bg-slate-200 px-4 py-2 rounded-lg font-semibold hover:bg-slate-300">Cancel</button>
                <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700">Add Teacher</button>
            </div>
        </form>
    );
  };

  if (view.type === 'detail') {
      return <TeacherDetail teacherId={view.teacherId} onBack={() => setView({ type: 'list' })} />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Manage Teachers</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-grow">
              <input 
                type="text" 
                placeholder="Search teachers..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-400">🔍</span>
              </div>
            </div>
            <button onClick={() => setModal({ type: 'add' })} className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 flex items-center gap-2 shadow-sm flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                Add Teacher
            </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map(t => (
            <div key={t.id} onClick={() => setView({ type: 'detail', teacherId: t.id })} className="bg-white rounded-xl shadow-md border p-5 flex flex-col text-center items-center hover:shadow-lg hover:border-teal-500 transition-all cursor-pointer">
                <img src={t.profilePicUrl} alt={t.name} className="w-24 h-24 rounded-full border-4 border-slate-200" />
                <h3 className="font-bold text-lg mt-3 text-slate-800">{t.name}</h3>
                <p className="text-sm text-slate-500">{t.qualifications}</p>
                <div className="mt-4 flex items-center gap-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${t.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                    </span>
                    <button onClick={(e) => handleToggleStatus(t.id, e)} className={`${t.status === 'active' ? 'text-red-500' : 'text-green-500'} font-semibold text-sm hover:underline`}>
                        {t.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                </div>
            </div>
        ))}
      </div>

      {modal.type && (
          <Modal onClose={() => setModal({ type: null })}>
              {modal.type === 'add' && <TeacherForm onSave={handleSaveTeacher} onCancel={() => setModal({ type: null })} />}
          </Modal>
      )}
    </div>
  );
};

export default ManageTeachers;
