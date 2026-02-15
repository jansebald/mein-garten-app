import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  variant = 'default',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseClasses = 'w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    default: 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-primary-500 focus:ring-primary-100',
    filled: 'bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:bg-gray-50 focus:ring-primary-100',
    outlined: 'bg-transparent border-2 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-primary-100',
  };

  const errorClasses = error 
    ? 'border-red-500 focus:border-red-500 focus:ring-red-100' 
    : '';

  const iconPadding = icon ? 'pl-12' : '';

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          id={inputId}
          className={`${baseClasses} ${variantClasses[variant]} ${errorClasses} ${iconPadding} ${className}`}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 animate-slide-down">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};
