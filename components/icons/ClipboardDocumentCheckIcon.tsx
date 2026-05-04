import React from 'react';

const ClipboardDocumentCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.125 2.25h-4.5c-1.125 0-2.25.9-2.25 2.25v15c0 1.125.9 2.25 2.25 2.25h10.5c1.125 0 2.25-.9 2.25-2.25v-15c0-1.125-.9-2.25-2.25-2.25h-4.5m-1.5 0a.75.75 0 00-.75.75v1.5a.75.75 0 00.75.75h1.5a.75.75 0 00.75-.75v-1.5a.75.75 0 00-.75-.75m-1.5 0h-1.5m1.5 0h1.5m-1.5 0h-1.5m6 6.75l-1.5-1.5-1.5 1.5-1.5-1.5-1.5 1.5-1.5-1.5-1.5 1.5M15.375 12l-1.5-1.5-1.5 1.5-1.5-1.5-1.5 1.5-1.5-1.5-1.5 1.5M10.125 15.75h4.5"
    />
     <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h4.5m-4.5 0a2.25 2.25 0 012.25-2.25h0a2.25 2.25 0 012.25 2.25m-4.5 0a2.25 2.25 0 00-2.25 2.25v15c0 1.125.9 2.25 2.25 2.25h10.5c1.125 0 2.25-.9 2.25-2.25v-15c0-1.125-.9-2.25-2.25-2.25m-10.5 0h10.5m-4.5-2.25h0" />
     <path strokeLinecap="round" strokeLinejoin="round" d="M9.375 14.25l1.5 1.5 3.375-3.375" />

  </svg>
);

export default ClipboardDocumentCheckIcon;