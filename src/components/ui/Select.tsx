import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  variant?: 'default' | 'filled' | 'outlined';
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  variant = 'default',
  className = '',
  id,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseClasses = 'w-full px-4 py-3 pr-10 rounded-xl appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    default: 'bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-primary-500 focus:ring-primary-100',
    filled: 'bg-gray-100 border-0 text-gray-900 focus:bg-gray-50 focus:ring-primary-100',
    outlined: 'bg-transparent border-2 border-gray-300 text-gray-900 focus:border-primary-500 focus:ring-primary-100',
  };

  const errorClasses = error 
    ? 'border-red-500 focus:border-red-500 focus:ring-red-100' 
    : '';

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          id={selectId}
          className={`${baseClasses} ${variantClasses[variant]} ${errorClasses} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <ChevronDown className="w-5 h-5" />
        </div>
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
