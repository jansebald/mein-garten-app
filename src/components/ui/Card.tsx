import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'glass' | 'elevated';
  interactive?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  title, 
  subtitle,
  variant = 'default',
  interactive = false,
  onClick 
}) => {
  const baseClasses = 'rounded-2xl p-5 transition-all duration-300 ease-out';
  
  const variantClasses = {
    default: 'bg-white shadow-soft border border-gray-100',
    glass: 'bg-white/70 backdrop-blur-xl shadow-medium border border-white/50',
    elevated: 'bg-white shadow-strong border border-transparent',
  };

  const interactiveClasses = interactive || onClick 
    ? 'active:scale-[0.98] cursor-pointer hover:shadow-medium' 
    : '';

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="animate-fade-in">
        {children}
      </div>
    </div>
  );
};