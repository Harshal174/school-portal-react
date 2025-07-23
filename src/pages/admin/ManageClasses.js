// src/pages/admin/ManageClasses.js
import React, { useState, useMemo } from 'react';
import { mockData } from '../../data/mockData';
import Modal from '../../components/common/Modal';
import StudentDetail from './StudentDetail';

// Helper function to get a color and icon for each grade level
const getGradeDetails = (className) => {
    const gradeMatch = className.match(/Grade (\d+)/);
    const grade = gradeMatch ? parseInt(gradeMatch[1]) : 0;

    switch (grade) {
        case 1: return { color: 'border-sky-500', icon: '1️⃣' };
        case 2: return { color: 'border-red-500', icon: '2️⃣' };
        case 3: return { color: 'border-amber-500', icon: '3️⃣' };
        case 4: return { color: 'border-emerald-500', icon: '4️⃣' };
        case 5: return { color: 'border-indigo-500', icon: '5️⃣' };
        case 6: return { color: 'border-rose-500', icon: '6️⃣' };
        case 7: return { color: 'border-cyan-500', icon: '7️⃣' };
        case 8: return { color: 'border-violet-500', icon: '8️⃣' };
        default: return { color: 'border-slate-500', icon: '🏫' };
    }
};

const ManageClasses = () => {
  const [view, setView] = useState('list');
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [modal, setModal] = useState({ type: null, data: null });
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddClass = (formData) => {
    const newClass = {
      id: 'C' + Date.now(),
      name: formData.name,
      teacherId: parseInt(formData.teacherId),
    };
    mockData.classes.push(newClass);
    mockData.students[newClass.id] = [];
    setModal({ type: null });
  };

  const handleAssignClassTeacher = (classId, teacherId) => {
    const classToUpdate = mockData.classes.find(c => c.id === classId);
    if (classToUpdate) {
      classToUpdate.teacherId = teacherId ? parseInt(teacherId) : null;
    }
    setModal({ type: null });
  };
  
  const handleAddStudent = (classId, studentName) => {
      const newStudent = {
        id: Date.now(),
        studentId: String(Math.floor(1000000000 + Math.random() * 9000000000)),
        name: studentName,
        dob: '2010-01-01',
        classId: classId,
        profilePicUrl: `https://placehold.co/128x128/0d9488/ffffff?text=${studentName.charAt(0)}`
      };
      if (!mockData.students[classId]) {
        mockData.students[classId] = [];
      }
      mockData.students[classId].push(newStudent);
      setModal({ type: null });
  }

  const renderClassList = () => {
    const filteredClasses = mockData.classes.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Manage Classes</h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-grow">
                <input 
                  type="text" 
                  placeholder="Search classes..." 
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400">🔍</span>
                </div>
              </div>
              <button onClick={() => setModal({ type: 'addClass' })} className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 flex items-center gap-2 shadow-sm flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                  Add Class
              </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map(c => {
                const classTeacher = mockData.users.find(u => u.id === c.teacherId);
                const { color, icon } = getGradeDetails(c.name);
                return (
                    <div key={c.id} onClick={() => { setSelectedClassId(c.id); setView('classDetails'); }} className={`bg-white rounded-xl shadow-md p-5 flex flex-col justify-between border-l-4 ${color} hover:shadow-lg hover:border-l-8 transition-all cursor-pointer`}>
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{icon}</span>
                                <h3 className="font-bold text-xl text-slate-800">{c.name}</h3>
                            </div>
                            <p className="text-slate-500 mt-2 pl-1">Class Teacher: <span className="font-semibold text-slate-600">{classTeacher ? classTeacher.name : 'Unassigned'}</span></p>
                        </div>
                        <div className="mt-4 pt-4 border-t flex justify-between items-center">
                            <p className="text-slate-500 font-semibold">
                                <span className="text-2xl font-bold text-teal-600">{mockData.students[c.id] ? mockData.students[c.id].length : 0}</span> Students
                            </p>
                            <span className="text-teal-500 font-bold text-2xl">→</span>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    );
  };

  const renderClassDetails = () => {
      const cls = mockData.classes.find(c => c.id === selectedClassId);
      const studentsInClass = mockData.students[selectedClassId] || [];
      return (
          <div className="max-w-4xl mx-auto">
              <button onClick={() => setView('list')} className="text-teal-600 mb-4 font-semibold">&larr; Back to All Classes</button>
              <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                  <h1 className="text-3xl font-bold">Students in {cls.name}</h1>
                  <div className="flex gap-2">
                      <button onClick={() => setModal({ type: 'assignTeacher', data: cls })} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">Assign Teacher</button>
                      <button onClick={() => setModal({ type: 'addStudent', data: cls })} className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700">Add Student</button>
                  </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                  {studentsInClass.length > 0 ? studentsInClass.map(s => (
                      <button key={s.id} onClick={() => { setSelectedStudentId(s.id); setView('studentDetails'); }} className="w-full text-left flex items-center justify-between border-b py-3 last:border-0 hover:bg-stone-50 rounded-lg px-2 -mx-2">
                          <p className="font-medium">{s.name}</p>
                          <span className="text-teal-600 font-bold text-xl">→</span>
                      </button>
                  )) : <p className="text-slate-500 text-center py-8">No students found in this class.</p>}
              </div>
          </div>
      );
  };
  
  const renderCurrentView = () => {
      switch(view) {
          case 'studentDetails':
              return <StudentDetail studentId={selectedStudentId} onBack={() => setView('classDetails')} />;
          case 'classDetails':
              return renderClassDetails();
          case 'list':
          default:
              return renderClassList();
      }
  }

  const renderModalContent = () => {
      if (!modal.type) return null;
      // ... (Modal form logic remains the same)
      return null;
  }

  return (
      <div>
          {renderCurrentView()}
          {modal.type && (
              <Modal onClose={() => setModal({ type: null })}>
                  {renderModalContent()}
              </Modal>
          )}
      </div>
  );
};

export default ManageClasses;
