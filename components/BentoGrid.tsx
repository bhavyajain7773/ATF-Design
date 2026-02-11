
import React from 'react';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ children, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {children}
    </div>
  );
};

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const BentoCard: React.FC<BentoCardProps> = ({ children, className = "", onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`group relative overflow-hidden bg-white border border-slate-100 rounded-3xl p-8 transition-all hover:shadow-2xl hover:shadow-slate-200/50 hover:border-slate-200 cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
};
