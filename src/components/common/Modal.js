// src/components/common/Modal.js
import React, { useEffect } from 'react';

/**
 * A generic, reusable modal component.
 * It renders its children inside a centered dialog box with a backdrop.
 * @param {object} props
 * @param {function} props.onClose - A function to call when the modal should be closed.
 * @param {React.ReactNode} props.children - The content to be displayed inside the modal.
 */
const Modal = ({ onClose, children }) => {
    // Effect to handle closing the modal when the 'Escape' key is pressed
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);

        // Cleanup function to remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    return (
        // The main modal container with a semi-transparent backdrop
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={onClose} // Close modal if the backdrop is clicked
        >
            {/* The modal dialog box */}
            <div
                className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md transform transition-all"
                onClick={e => e.stopPropagation()} // Prevent clicks inside the modal from closing it
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;
