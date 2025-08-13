
import React from 'react';

export const TableIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className="w-6 h-6"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5V7.5c0-.988.708-1.763 1.623-1.954C6.278 5.343 7.57 5.25 9 5.25h6c1.43 0 2.722.093 3.998.296C20.042 5.737 20.75 6.512 20.75 7.5v10.875m-17.25 0c0 .621.504 1.125 1.125 1.125h15c.621 0 1.125-.504 1.125-1.125m-17.25 0h17.25M3.75 9.75h16.5M3.75 12.75h16.5m-16.5 3h16.5" />
  </svg>
);
