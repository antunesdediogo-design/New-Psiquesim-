import React from 'react';

const TargetIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM12 21a9 9 0 100-18 9 9 0 000 18z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15a3 3 0 110-6 3 3 0 010 6z"
    />
  </svg>
);

export default TargetIcon;
