
import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="w-full max-w-5xl text-center py-8">
      <img
        src="https://digibeat.com/wp-content/uploads/2022/06/logo-white-300x80.png"
        alt="Digibeat Logo"
        className="h-16 mx-auto mb-6"
      />
      <h1 className="text-4xl font-bold text-[#66acde] sm:text-5xl">{title}</h1>
      {subtitle && <p className="mt-3 text-lg text-slate-400 sm:text-xl">{subtitle}</p>}
    </header>
  );
};
