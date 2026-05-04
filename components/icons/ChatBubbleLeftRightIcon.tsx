import React from 'react';

const ChatBubbleLeftRightIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72.16c-1.04.044-1.884.884-1.884 1.928v.001M18 18.248V12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12v6a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0018 18.248zM9.75 9.75c0-1.036-.84-1.875-1.875-1.875H4.875c-1.036 0-1.875.84-1.875 1.875v1.875c0 1.036.84 1.875 1.875 1.875h3c.234 0 .46-.04.675-.116"
    />
  </svg>
);

export default ChatBubbleLeftRightIcon;