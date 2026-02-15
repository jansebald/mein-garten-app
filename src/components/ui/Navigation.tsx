'use client';

import React from 'react';
import { Home, BookOpen, Cloud, Calculator, Settings } from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'tagebuch', label: 'Tagebuch', icon: BookOpen },
  { id: 'wetter', label: 'Wetter', icon: Cloud },
  { id: 'rechner', label: 'Rechner', icon: Calculator },
  { id: 'einstellungen', label: 'Mehr', icon: Settings },
];

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Backdrop blur glass effect */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50" />
      
      {/* Safe area padding for iOS notch */}
      <div className="relative pb-safe">
        <div className="flex items-center justify-around px-2 pt-2 pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl
                  transition-all duration-300 ease-out min-w-[64px] group
                  active:scale-90
                  ${isActive 
                    ? 'text-primary-600' 
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Icon with background indicator */}
                <div className="relative">
                  <div 
                    className={`
                      absolute inset-0 rounded-full transition-all duration-300
                      ${isActive 
                        ? 'bg-primary-100 scale-110' 
                        : 'bg-transparent scale-0 group-hover:scale-100 group-hover:bg-gray-100'
                      }
                    `}
                  />
                  <Icon 
                    className={`
                      relative w-6 h-6 transition-all duration-300
                      ${isActive ? 'scale-110' : 'scale-100'}
                    `}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                
                {/* Label */}
                <span 
                  className={`
                    text-[11px] font-medium transition-all duration-300
                    ${isActive ? 'scale-105' : 'scale-100'}
                  `}
                >
                  {tab.label}
                </span>
                
                {/* Active indicator dot */}
                {isActive && (
                  <div 
                    className="absolute bottom-0 w-1 h-1 bg-primary-600 rounded-full animate-scale-in"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
