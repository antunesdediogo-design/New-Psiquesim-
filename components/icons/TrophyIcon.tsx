
import React from 'react';

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"
    />
     <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" 
    />
     <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H9.75A2.25 2.25 0 007.5 6v2.25m9 0H15v2.25A2.25 2.25 0 0112.75 15h-1.5A2.25 2.25 0 019 12.75V8.25m7.5 0h-1.5m-1.5 0H9m-1.5 0H7.5m9 0v2.25c0 .621-.504 1.125-1.125 1.125H12v2.25c0 .621-.504 1.125-1.125 1.125H9.75A1.125 1.125 0 018.625 15V12.75m0-4.5H12m0 0h1.5m-1.5 0H8.625M12 3v2.25" />

  </svg>
);

const TrophyIconSolid: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M17.625 3.188c.34-.14 1.053.113 1.053.507V5.25h-2.131A10.45 10.45 0 0112 3.75c-1.63 0-3.17.383-4.547 1.055H5.325V3.695c0-.394.713-.646 1.053-.507C7.95 3.86 9.87 4.5 12 4.5s4.05-.64 5.625-1.312zM12 6a9.006 9.006 0 00-7.394 4.075c-.224.346-.224.793 0 1.14l.113.175a9.006 9.006 0 0014.562 0l.113-.175c.224-.347.224-.794 0-1.14A9.006 9.006 0 0012 6zm-5.625 6.75a.75.75 0 100 1.5.75.75 0 000-1.5zM12 12.75a.75.75 0 100 1.5.75.75 0 000-1.5zm5.625 0a.75.75 0 100 1.5.75.75 0 000-1.5z" clipRule="evenodd" />
        <path d="M12 16.5a2.25 2.25 0 00-2.25 2.25v.75a.75.75 0 00.75.75h3a.75.75 0 00.75-.75v-.75A2.25 2.25 0 0012 16.5z" />
    </svg>
);


export default TrophyIconSolid;
