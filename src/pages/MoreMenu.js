// src/pages/MoreMenu.js
import React from 'react';

const MoreMenu = ({ navItems, onNavigate, onLogout, currentScreen }) => {
  // This component receives the *entire* list of nav items
  // and is responsible for displaying them.
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">More Options</h1>
      <div className="space-y-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full text-left p-4 rounded-lg hover:bg-stone-100 transition font-medium text-slate-700 flex items-center gap-4 ${
              currentScreen === item.id ? 'bg-teal-50 text-teal-700' : 'bg-white shadow-sm border'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-lg">{item.label}</span>
          </button>
        ))}
        <button
          onClick={onLogout}
          className="w-full text-left p-4 rounded-lg hover:bg-stone-100 transition font-medium text-slate-700 flex items-center gap-4 bg-white shadow-sm border"
        >
          <span className="text-2xl">🚪</span>
          <span className="text-lg">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default MoreMenu;
