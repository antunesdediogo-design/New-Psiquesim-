import React from 'react';

const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <style>
      {`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .animate-pulse-brain {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}
    </style>
    <g className="animate-pulse-brain">
      <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5c0 1.54.83 2.9 2.06 3.66" />
      <path d="M12 2a4.5 4.5 0 0 1 4.5 4.5c0 1.54-.83 2.9-2.06 3.66" />
      <path d="M12 20.5c-3.5 0-6.5-2-6.5-5.5s3-5.5 6.5-5.5" />
      <path d="M12 20.5c3.5 0 6.5-2 6.5-5.5s-3-5.5-6.5-5.5" />
      <path d="M5.5 15c0-1.74 1.43-3.22 3.26-3.5" />
      <path d="M18.5 15c0-1.74-1.43-3.22-3.26-3.5" />
      <path d="M12 9.5V2" />
      <path d="M12 21v-2" />
      <path d="M12 14v-2" />
      <path d="M9.94 10.16c-1.23.76-2.06 2.1-2.06 3.66" />
      <path d="M14.06 10.16c1.23.76 2.06 2.1 2.06 3.66" />
    </g>
  </svg>
);

export default BrainIcon;
