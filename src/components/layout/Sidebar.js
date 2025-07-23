// src/components/layout/Sidebar.js
import React from 'react';

const Sidebar = ({ currentUser, navItems, onNavigate, onLogout, currentScreen }) => {
  return (
    // The key classes here are `md:h-screen`, `md:sticky`, and `md:top-0`
    // This makes the sidebar take the full height of the screen and stick to the top on medium screens and up.
    <nav className="hidden md:flex md:flex-col md:w-64 bg-white shadow-md md:h-screen md:sticky md:top-0">
      <div className="p-4 border-b flex items-center gap-3">
        {/* --- NEW: Custom SVG Icon --- */}
        <div className="bg-teal-600 p-2 rounded-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 18L9 11L12 14L15 11L20 18H4Z" fill="white" fillOpacity="0.5"/>
                <path d="M12 2C15.3137 2 18 4.68629 18 8C18 11.3137 15.3137 14 12 14C8.68629 14 6 11.3137 6 8C6 4.68629 8.68629 2 12 2Z" fill="white"/>
            </svg>
        </div>
        <div>
            {/* --- UPDATED: School Name --- */}
            <h2 className="text-xl font-bold text-teal-700">CVPS Portal</h2>
            <p className="text-xs text-slate-400">Children Valley Public School</p>
        </div>
      </div>
      <div className="p-4 border-b">
        <p className="font-bold text-slate-700 truncate">{currentUser.name}</p>
        <p className="text-sm text-slate-500 capitalize">{currentUser.role}</p>
      </div>
      <div className="flex-grow p-4 space-y-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full text-left p-3 rounded-lg hover:bg-stone-100 transition font-medium text-slate-700 flex items-center gap-3 ${
              currentScreen === item.id ? 'bg-teal-50 text-teal-700' : ''
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <div className="p-4 border-t">
        <button
          onClick={onLogout}
          className="w-full text-left text-slate-600 hover:bg-stone-100 p-2 rounded-lg transition flex items-center gap-3 font-medium"
        >
          <span className="text-xl">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
