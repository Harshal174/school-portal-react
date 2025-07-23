import React from 'react';

/**
 * A reusable, styled button component for the application.
 * It accepts various props to customize its appearance and behavior.
 *
 * @param {object} props - The component's props.
 * @param {function} props.onClick - The function to call when the button is clicked.
 * @param {React.ReactNode} props.children - The content to display inside the button (e.g., text, an icon).
 * @param {string} [props.variant='primary'] - The button style variant ('primary', 'secondary', 'danger').
 * @param {string} [props.className=''] - Additional Tailwind CSS classes to apply.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @returns {JSX.Element} The rendered button element.
 */
export default function Button({ onClick, children, variant = 'primary', className = '', disabled = false }) {
  const baseClasses = 'w-full px-4 py-2 rounded-lg font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  };

  const disabledClasses = 'disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
}
