// src/pages/UserProfile.js
import React from 'react';

const UserProfile = ({ currentUser, onLogout }) => {
    if (!currentUser) {
        return <p>Loading profile...</p>;
    }

    // Enhance user details based on role for display purposes
    const userDetails = {
        ...currentUser,
        profilePicUrl: currentUser.profilePicUrl || `https://placehold.co/128x128/d1d5db/1f2937?text=${currentUser.name.charAt(0)}`,
        idLabel: currentUser.role === 'student' ? 'Student ID' : (currentUser.role === 'teacher' ? 'Teacher ID' : 'Email'),
        idValue: currentUser.role === 'teacher' ? currentUser.teacherId : currentUser.email,
    };

    return (
        <div className="max-w-2xl mx-auto">
             <h1 className="text-3xl font-bold mb-8 text-center">Profile</h1>
            <div className="bg-white p-8 rounded-2xl shadow-lg border">
                <div className="flex flex-col items-center text-center">
                    <img 
                        src={userDetails.profilePicUrl} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full mb-4 border-4 border-teal-200 shadow-md" 
                    />
                    <h2 className="text-2xl font-bold text-slate-800">{userDetails.name}</h2>
                    <p className="text-sm font-medium text-teal-600 uppercase tracking-wide">{userDetails.role}</p>
                </div>
                
                <div className="mt-8 pt-6 border-t space-y-4">
                    <div className="flex items-center">
                        <span className="text-2xl w-8">🆔</span>
                        <div className="ml-4">
                            <p className="text-sm text-slate-500">{userDetails.idLabel}</p>
                            <p className="font-semibold text-slate-700">{userDetails.idValue}</p>
                        </div>
                    </div>
                    {userDetails.qualifications && (
                        <div className="flex items-center">
                            <span className="text-2xl w-8">🎓</span>
                            <div className="ml-4">
                                <p className="text-sm text-slate-500">Qualifications</p>
                                <p className="font-semibold text-slate-700">{userDetails.qualifications}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t space-y-3">
                    {currentUser.role !== 'student' && (
                         <button className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-3 rounded-lg hover:bg-slate-200 transition font-semibold">
                            <span>🔑</span> Change Password
                         </button>
                    )}
                    <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-700 py-3 rounded-lg hover:bg-red-100 transition font-semibold">
                        <span>🚪</span> Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
