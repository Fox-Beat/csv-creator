
import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode; // Button text
  icon?: React.ReactNode;
  className?: string;
  title?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  disabled = false,
  children,
  icon,
  className = 'bg-sky-600 hover:bg-sky-500',
  title
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        flex items-center justify-center px-6 py-3 border border-transparent 
        text-base font-medium rounded-md shadow-sm text-white 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-[#66acde]
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-150 ease-in-out
        ${className}
      `}
    >
      {icon && <span className="mr-2 h-5 w-5">{icon}</span>}
      {children}
    </button>
  );
};
