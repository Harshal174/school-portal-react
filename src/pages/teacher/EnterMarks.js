// src/pages/teacher/EnterMarks.js
import React, { useState, useMemo, useEffect } from 'react';
import { mockData } from '../../data/mockData';

// Helper to get an icon and color for each subject
const getSubjectDetails = (subjectName) => {
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

// FIX: The component now correctly accepts and uses the `currentUser` prop
const EnterMarks = ({ currentUser, onMarksSaved }) => {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState({ classId: null, subjectId: null, examId: null });
  const [marks, setMarks] = useState({});

  const classOptions = useMemo(() => {
    if (!currentUser) return [];
    return [...new Set(mockData.schedule
      .filter(s => s.teacherId === currentUser.id)
      .map(s => s.classId))]
      .map(id => mockData.classes.find(c => c.id === id));
  }, [currentUser]);

  const subjectOptions = useMemo(() => {
    if (!selected.classId || !currentUser) return [];
    return [...new Set(mockData.schedule
      .filter(s => s.teacherId === currentUser.id && s.classId === selected.classId)
      .map(s => s.subjectId))]
      .map(id => mockData.subjects.find(s => s.id === id));
  }, [selected.classId, currentUser]);
  
  const examOptions = mockData.exams;
  const students = mockData.students[selected.classId] || [];

  useEffect(() => {
    if (step === 4) {
      const initialMarks = {};
      students.forEach(student => {
        const existingMark = mockData.marks.find(m => 
          m.studentId === student.id && 
          m.examId === selected.examId && 
          m.subjectId === selected.subjectId
        );
        initialMarks[student.id] = existingMark ? existingMark.marksObtained : '';
      });
      setMarks(initialMarks);
    }
  }, [step, selected.classId, selected.subjectId, selected.examId, students]);

  const handleMarkChange = (studentId, value) => {
    setMarks(prevMarks => ({ ...prevMarks, [studentId]: value }));
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    Object.entries(marks).forEach(([studentId, marksObtained]) => {
      if (marksObtained !== '') {
        const existingMarkIndex = mockData.marks.findIndex(m => 
            m.studentId === parseInt(studentId) && 
            m.examId === selected.examId && 
            m.subjectId === selected.subjectId
        );
        if (existingMarkIndex !== -1) {
          mockData.marks[existingMarkIndex].marksObtained = parseInt(marksObtained);
        } else {
          mockData.marks.push({
            id: Date.now() + parseInt(studentId),
            studentId: parseInt(studentId),
            classId: selected.classId,
            subjectId: selected.subjectId,
            examId: selected.examId,
            marksObtained: parseInt(marksObtained)
          });
        }
      }
    });
    alert('Marks saved successfully!');
    if (onMarksSaved) onMarksSaved();
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="font-bold text-xl mb-4 text-slate-700">Step 1: Select a Class</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{classOptions.map(c => 
              <button key={c.id} onClick={() => { setSelected({...selected, classId: c.id }); setStep(2); }} className="text-left p-4 bg-white hover:bg-teal-50 rounded-lg shadow-md border transition-all">
                <span className="text-2xl">🏫</span>
                <p className="font-bold text-slate-800 mt-2">{c.name}</p>
              </button>
            )}</div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="font-bold text-xl mb-4 text-slate-700">Step 2: Select a Subject</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{subjectOptions.map(s => {
                const { icon, color } = getSubjectDetails(s.name);
                return (
                    <button key={s.id} onClick={() => { setSelected({...selected, subjectId: s.id }); setStep(3); }} className="text-left p-4 bg-white hover:bg-teal-50 rounded-lg shadow-md border transition-all flex items-center gap-4">
                        <div className={`p-2 rounded-full ${color}`}><span className="text-2xl">{icon}</span></div>
                        <p className="font-bold text-slate-800">{s.name}</p>
                    </button>
                );
            })}</div>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="font-bold text-xl mb-4 text-slate-700">Step 3: Select an Exam</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{examOptions.map(e => 
              <button key={e.id} onClick={() => { setSelected({...selected, examId: e.id }); setStep(4); }} className="text-left p-4 bg-white hover:bg-teal-50 rounded-lg shadow-md border transition-all flex items-center gap-4">
                <div className="p-2 rounded-full bg-slate-100 text-slate-800"><span className="text-2xl">📝</span></div>
                <div>
                    <p className="font-bold text-slate-800">{e.name}</p>
                    <p className="text-sm text-slate-500">Max Marks: {e.maxMarks}</p>
                </div>
              </button>
            )}</div>
          </div>
        );
      case 4:
        const exam = examOptions.find(e => e.id === selected.examId);
        return (
          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              {students.map(student => (
                <div key={student.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border">
                  <label htmlFor={`student_mark_${student.id}`} className="font-semibold text-slate-700">{student.name}</label>
                  <input 
                    type="number" 
                    id={`student_mark_${student.id}`} 
                    className="w-28 p-2 border rounded-lg text-center font-bold" 
                    min="0" 
                    max={exam.maxMarks}
                    value={marks[student.id] || ''}
                    onChange={(e) => handleMarkChange(student.id, e.target.value)}
                    placeholder={`/ ${exam.maxMarks}`}
                  />
                </div>
              ))}
            </div>
            <button type="submit" className="mt-8 w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition font-semibold shadow-md">Save Marks</button>
          </form>
        );
      default: return null;
    }
  };

  if (!currentUser) {
      return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {step > 1 && <button onClick={handleBack} className="text-teal-600 mb-4 font-semibold">&larr; Back</button>}
      <h1 className="text-3xl font-bold mb-8">Enter Student Marks</h1>
      <div className="bg-slate-50 p-6 rounded-xl border">
        {renderStep()}
      </div>
    </div>
  );
};

export default EnterMarks;
