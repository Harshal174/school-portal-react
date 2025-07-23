// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { mockData } from '../data/mockData'; // Import your mock data

export const useAuth = () => {
  // Initialize currentUser state from sessionStorage or to null
  // This helps persist login across tab refreshes (in a mock scenario)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse stored user from sessionStorage:", error);
      return null;
    }
  });

  // Effect to store currentUser in sessionStorage whenever it changes
  useEffect(() => {
    try {
      if (currentUser) {
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
      } else {
        sessionStorage.removeItem('currentUser');
      }
    } catch (error) {
      console.error("Failed to save user to sessionStorage:", error);
    }
  }, [currentUser]);

  /**
   * Handles user login by checking credentials against mock data.
   * @param {string} loginId - The email for teacher/admin or student ID for student.
   * @param {string} password - The password for teacher/admin or DOB for student.
   * @param {string} role - The selected role ('teacher', 'admin', 'student').
   * @returns {boolean} - True if login is successful, false otherwise.
   */
  const login = (loginId, password, role) => {
    let user = null;

    if (role === 'student') {
      // For students, loginId is studentId, password is dob
      const allStudents = Object.values(mockData.students).flat();
      const student = allStudents.find(s => s.studentId === loginId && s.dob === password);
      if (student) {
        // Create a simplified user object for the appState
        user = {
          id: student.id,
          name: student.name,
          email: student.studentId, // Use studentId as login email for consistency
          role: 'student',
          studentId: student.id, // Store student-specific ID
          profilePicUrl: student.profilePicUrl
        };
      }
    } else {
      // For teachers and admins, loginId is email
      user = mockData.users.find(
        u => u.email === loginId && u.password === password && u.role === role
      );
      // Ensure the full user object (including teacherId, qualifications, profilePicUrl) is captured
      if (user) {
        user = { ...user }; // Create a shallow copy to prevent direct mutation of mockData
      }
    }

    if (user) {
      setCurrentUser(user);
      return true;
    } else {
      setCurrentUser(null);
      return false;
    }
  };

  /**
   * Logs out the current user.
   */
  const logout = () => {
    setCurrentUser(null);
  };

  return {
    currentUser,
    login,
    logout,
  };
};