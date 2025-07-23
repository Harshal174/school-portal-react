// src/components/common/Spinner.js
import React from 'react';

/**
 * A simple, reusable loading spinner component.
 */
const Spinner = () => {
    return (
        <div 
            className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
            style={{ borderTopColor: 'transparent', borderLeftColor: 'white', borderRightColor: 'white' }}
        ></div>
    );
};

export default Spinner;
