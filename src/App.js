// src/App.js
import React, { useState } from 'react';

// Common Components
import LoginScreen from './pages/LoginScreen';
import UserProfile from './pages/student/UserProfile';
import MoreMenu from './pages/MoreMenu';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';

// Admin Page Components
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageTeachers from './pages/admin/ManageTeachers';
import AdminReports from './pages/admin/AdminReports';
import ManageClasses from './pages/admin/ManageClasses';
import ManageSchedule from './pages/admin/ManageSchedule';
import ManageLeaves from './pages/admin/ManageLeaves';
import ManageExams from './pages/admin/ManageExams';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';

// Teacher Page Components
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import EnterMarks from './pages/teacher/EnterMarks';
import TeacherSchedule from './pages/teacher/TeacherSchedule';
import TeacherAttendanceHistory from './pages/teacher/TeacherAttendanceHistory';
import ApplyLeave from './pages/teacher/ApplyLeave';
import MarkStudentAttendance from './pages/teacher/MarkStudentAttendance';

// Student Page Components
import StudentDashboard from './pages/student/StudentDashboard';
import StudentSchedule from './pages/student/StudentSchedule';
import StudentReportCard from './pages/student/StudentReportCard';
import StudentAttendanceHistory from './pages/student/StudentAttendanceHistory';
import StudentAnnouncements from './pages/student/StudentAnnouncements';

// Data and Hooks
import { mockData } from './data/mockData';
import { useAuth } from './hooks/useAuth';

function App() {
  const { currentUser, login, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState({ name: 'dashboard', params: {} });

  const handleNavigation = (screenName, params = {}) => {
    setCurrentScreen({ name: screenName, params });
  };

  const getNavItems = (role) => {
    if (role === 'teacher') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
        { id: 'mySchedule', label: 'My Schedule', icon: '🗓️' },
        { id: 'enterMarks', label: 'Enter Marks', icon: '📝' },
        { id: 'attendanceHistory', label: 'History', icon: '📜' },
        { id: 'leaves', label: 'Apply Leave', icon: '✉️' },
        { id: 'profile', label: 'Profile', icon: '👤' },
      ];
    } else if (role === 'admin') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'announcements', label: 'Announcements', icon: '📢' },
        { id: 'manageExams', label: 'Manage Exams', icon: '📝' },
        { id: 'manageLeaves', label: 'Manage Leaves', icon: '✉️' },
        { id: 'manageTeachers', label: 'Teachers', icon: '👥' },
        { id: 'manageClasses', label: 'Classes', icon: '🏫' },
        { id: 'manageSchedule', label: 'Schedule', icon: '🗓️' },
        { id: 'reports', label: 'Reports', icon: '📈' },
      ];
    } else if (role === 'student') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
        { id: 'mySchedule', label: 'My Schedule', icon: '🗓️' },
        { id: 'reportCard', label: 'Report Card', icon: '📄' },
        { id: 'attendance', label: 'Attendance', icon: '✔️' },
        { id: 'announcements', label: 'Announcements', icon: '📢' },
        { id: 'profile', label: 'Profile', icon: '👤' },
      ];
    }
    return [];
  };

  const navItems = currentUser ? getNavItems(currentUser.role) : [];

  const renderPageContent = () => {
    if (!currentUser) {
      return <LoginScreen onLogin={login} />;
    }
    
    const MAX_VISIBLE_ITEMS = 5;

    switch (currentUser.role) {
      case 'teacher':
        const teacherHiddenNavItems = navItems.slice(MAX_VISIBLE_ITEMS - 1);
        switch (currentScreen.name) {
          case 'dashboard':
            return <TeacherDashboard currentUser={currentUser} onNavigate={handleNavigation} />;
          case 'mySchedule':
            return <TeacherSchedule currentUser={currentUser} />;
          case 'enterMarks':
            return <EnterMarks currentUser={currentUser} onMarksSaved={() => handleNavigation('dashboard')} />;
          case 'attendanceHistory':
            return <TeacherAttendanceHistory currentUser={currentUser} />;
          case 'leaves':
            return <ApplyLeave currentUser={currentUser} onLeaveApplied={() => handleNavigation('dashboard')} />;
          case 'profile':
            return <UserProfile currentUser={currentUser} onLogout={logout} />;
          case 'markAttendance':
            return <MarkStudentAttendance 
                        classId={currentScreen.params.classId} 
                        period={currentScreen.params.period}
                        onBack={() => handleNavigation('dashboard')} 
                    />;
          // --- FIX: Added case to handle the 'more' screen for teachers ---
          case 'more':
              return <MoreMenu 
                        navItems={teacherHiddenNavItems} 
                        onNavigate={handleNavigation} 
                        onLogout={logout}
                        currentScreen={currentScreen.name}
                      />;
          default:
            return <TeacherDashboard currentUser={currentUser} onNavigate={handleNavigation} />;
        }
      case 'admin':
        const adminHiddenNavItems = navItems.slice(MAX_VISIBLE_ITEMS - 1);
        switch (currentScreen.name) {
            case 'dashboard':
              return <AdminDashboard onNavigate={handleNavigation} />;
            case 'announcements':
              return <ManageAnnouncements />;
            case 'manageExams':
              return <ManageExams />;
            case 'manageLeaves':
              return <ManageLeaves />;
            case 'manageTeachers':
              return <ManageTeachers />;
            case 'manageClasses':
              return <ManageClasses />;
            case 'manageSchedule':
              return <ManageSchedule />;
            case 'reports':
              return <AdminReports />;
            case 'more':
              return <MoreMenu 
                        navItems={adminHiddenNavItems} 
                        onNavigate={handleNavigation} 
                        onLogout={logout}
                        currentScreen={currentScreen.name}
                      />;
            default:
              return <AdminDashboard onNavigate={handleNavigation} />;
          }
      case 'student':
        const studentDetails = Object.values(mockData.students).flat().find(s => s.id === currentUser.studentId);
        const studentHiddenNavItems = navItems.slice(MAX_VISIBLE_ITEMS - 1);
        switch (currentScreen.name) {
          case 'dashboard':
            return <StudentDashboard currentUser={studentDetails} />;
          case 'mySchedule':
            return <StudentSchedule classId={studentDetails?.classId} />;
          case 'reportCard':
            return <StudentReportCard currentUser={studentDetails} />;
          case 'attendance':
            return <StudentAttendanceHistory currentUser={studentDetails} />;
          case 'announcements':
            return <StudentAnnouncements />;
          case 'profile':
            return <UserProfile currentUser={currentUser} onLogout={logout} />;
          // --- FIX: Added case to handle the 'more' screen for students ---
          case 'more':
              return <MoreMenu 
                        navItems={studentHiddenNavItems} 
                        onNavigate={handleNavigation} 
                        onLogout={logout}
                        currentScreen={currentScreen.name}
                      />;
          default:
            return <StudentDashboard currentUser={studentDetails} />;
        }
      default:
        return <LoginScreen onLogin={login} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {currentUser ? (
        <div className="flex h-screen overflow-hidden">
          <Sidebar
            currentUser={currentUser}
            navItems={navItems}
            onNavigate={(screenName) => handleNavigation(screenName)}
            onLogout={logout}
            currentScreen={currentScreen.name}
          />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
            <div className="w-full max-w-7xl mx-auto">
              {renderPageContent()}
            </div>
          </main>
          <MobileNav
            navItems={navItems}
            onNavigate={(screenName) => handleNavigation(screenName)}
            onLogout={logout}
            currentScreen={currentScreen.name}
          />
        </div>
      ) : (
        <LoginScreen onLogin={login} />
      )}
    </div>
  );
}

export default App;
