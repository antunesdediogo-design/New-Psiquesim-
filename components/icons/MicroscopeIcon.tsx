
import React from 'react';

const MicroscopeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.5 1.5a.75.75 0 00-1.5 0v6.145l-2.47-2.47a.75.75 0 00-1.06 1.06L10.94 9.7l-3.32 3.32a.75.75 0 001.06 1.06l3.32-3.32 3.47 3.47a.75.75 0 101.06-1.06L12.5 10.76l3.47-3.47a.75.75 0 00-1.06-1.06L12.5 8.645V1.5z" />
    <path fillRule="evenodd" d="M3.75 13.5a.75.75 0 00-1.5 0v4.5a3 3 0 003 3h10.5a3 3 0 003-3v-4.5a.75.75 0 00-1.5 0v4.5a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-4.5z" clipRule="evenodd" />
    </svg>

);

export default MicroscopeIcon;
