'use client';

import React from 'react';
import { Home, BookOpen, Cloud, Calculator, Settings } from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'tagebuch', label: 'Tagebuch', icon: BookOpen },
  { id: 'wetter', label: 'Wetter', icon: Cloud },
  { id: 'rechner', label: 'Rechner', icon: Calculator },
  { id: 'einstellungen', label: 'Einstellungen', icon: Settings },
];

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  return (
    <nav className="bg-white shadow-sm border-t">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-3 px-4 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};