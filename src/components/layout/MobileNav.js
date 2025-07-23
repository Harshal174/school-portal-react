// src/components/layout/MobileNav.js
import React from 'react';

const MobileNav = ({ navItems, onNavigate, onLogout, currentScreen }) => {
  // Define the maximum number of items to show in the main bar.
  const MAX_VISIBLE_ITEMS = 5;

  // If the total number of items (including logout) fits, display them all.
  // This will apply to the student and teacher roles.
  if (navItems.length + 1 <= MAX_VISIBLE_ITEMS) {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-t border-t border-slate-200 flex justify-around">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center p-2 h-16 flex-1 transition-colors ${
              currentScreen === item.id ? 'text-teal-600' : 'text-slate-500'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs font-medium text-center">{item.label}</span>
          </button>
        ))}
        <button
          onClick={onLogout}
          className="flex flex-col items-center justify-center p-2 h-16 flex-1 text-slate-500"
        >
          <span className="text-2xl">🚪</span>
          <span className="text-xs font-medium">Logout</span>
        </button>
      </nav>
    );
  }

  // --- "More" Button Logic for Admin Role ---
  // If there are too many items, show the first 4 and a "More" button.
  const visibleItems = navItems.slice(0, MAX_VISIBLE_ITEMS - 1);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-t border-t border-slate-200 flex justify-around">
      {visibleItems.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex flex-col items-center justify-center p-2 h-16 flex-1 transition-colors ${
            currentScreen === item.id ? 'text-teal-600' : 'text-slate-500'
          }`}
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="text-xs font-medium text-center">{item.label}</span>
        </button>
      ))}
      <button
        onClick={() => onNavigate('more')} // This tells App.js to open the "More" menu
        className={`flex flex-col items-center justify-center p-2 h-16 flex-1 transition-colors ${
          currentScreen === 'more' ? 'text-teal-600' : 'text-slate-500'
        }`}
      >
        <span className="text-2xl">•••</span>
        <span className="text-xs font-medium">More</span>
      </button>
    </nav>
  );
};

export default MobileNav;
