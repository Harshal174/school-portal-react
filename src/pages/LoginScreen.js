// src/pages/LoginScreen.js
import React, { useState } from 'react';
import { mockData } from '../data/mockData';

const LoginScreen = ({ onLogin }) => {
    const [role, setRole] = useState('teacher');
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRoleChange = (e) => {
        setRole(e.target.value);
        setError(''); // Clear error on role change
        setLoginId('');
        setPassword('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        const success = onLogin(loginId, password, role);
        if (!success) {
            setError('Invalid credentials for the selected role. Please try again.');
        }
    };

    const getLoginDetails = () => {
        if (role === 'student') {
            const testStudent = Object.values(mockData.students).flat().find(s => mockData.users.some(u => u.studentId === s.id));
            return {
                idLabel: 'Student ID',
                passwordLabel: 'Date of Birth (YYYY-MM-DD)',
                idPlaceholder: 'Enter your 10-digit ID',
                passwordPlaceholder: 'YYYY-MM-DD',
                hint: testStudent ? `Test ID: ${testStudent.studentId} | Password: ${testStudent.dob}` : 'No test student found.'
            };
        }
        return {
            idLabel: 'Email',
            passwordLabel: 'Password',
            idPlaceholder: 'user@school.com',
            passwordPlaceholder: 'password',
            hint: "Use `teacher@school.com` or `admin@school.com` with password `password`"
        };
    };

    const { idLabel, passwordLabel, idPlaceholder, passwordPlaceholder, hint } = getLoginDetails();

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-stone-50">
            <div className="w-full max-w-md">
                <div className="text-center mb-8 flex flex-col items-center">
                    {/* --- NEW: Custom SVG Icon --- */}
                    <div className="bg-teal-600 p-3 rounded-xl mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 18L9 11L12 14L15 11L20 18H4Z" fill="white" fillOpacity="0.5"/>
                            <path d="M12 2C15.3137 2 18 4.68629 18 8C18 11.3137 15.3137 14 12 14C8.68629 14 6 11.3137 6 8C6 4.68629 8.68629 2 12 2Z" fill="white"/>
                        </svg>
                    </div>
                    {/* --- UPDATED: School Name --- */}
                    <h1 className="text-3xl font-bold text-teal-700">CVPS Portal</h1>
                    <p className="text-slate-500 mt-1">Children Valley Public School</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="role" className="block text-sm font-medium text-slate-600 mb-1">I am a...</label>
                            <select id="role" value={role} onChange={handleRoleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500">
                                <option value="teacher">Teacher</option>
                                <option value="admin">Admin</option>
                                <option value="student">Student</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="loginId" className="block text-sm font-medium text-slate-600 mb-1">{idLabel}</label>
                            <input type="text" id="loginId" value={loginId} onChange={e => setLoginId(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" placeholder={idPlaceholder} required />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password"  className="block text-sm font-medium text-slate-600 mb-1">{passwordLabel}</label>
                            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" placeholder={passwordPlaceholder} required />
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                        <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition duration-300 font-semibold">Sign In</button>
                    </form>
                </div>
                <div className="text-center mt-4 text-sm text-slate-400">
                    <p>{hint}</p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
