'use client';

import React from 'react';
import { Thermometer, ExternalLink } from 'lucide-react';

const DWD_URL = 'https://www.dwd.de/DE/leistungen/bodentemperatur/bodentemperatur.html';

export const SoilTemperatureCard: React.FC = () => {
  return (
    <button
      onClick={() => window.open(DWD_URL, '_blank')}
      className="w-full text-left bg-white/70 backdrop-blur-xl rounded-2xl shadow-medium border border-white/50 p-5 active:scale-[0.98] transition-all duration-200 hover:shadow-strong"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-soft">
            <Thermometer className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Bodentemperatur</h3>
            <p className="text-sm text-gray-500">Pommelsbrunn-Mittelburg</p>
            <p className="text-xs text-primary-600 font-medium mt-0.5">DWD · Bayern</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-primary-600 bg-primary-50 px-3 py-1.5 rounded-xl">
          <span className="text-sm font-medium">Öffnen</span>
          <ExternalLink className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 leading-relaxed">
          Tippen zum Öffnen der aktuellen DWD Bodentemperaturen in 5, 10, 20 und 50cm Tiefe für die Station Pommelsbrunn-Mittelburg.
        </p>
      </div>
    </button>
  );
};
