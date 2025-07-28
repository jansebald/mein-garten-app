'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Droplets, Scissors, Wind, Sprout } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MONTHLY_LAWN_CARE, PERFECT_GREEN_SCHEDULE } from '@/lib/constants';

export const PerfectGreenCalendar: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  
  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  const currentMonthPlan = MONTHLY_LAWN_CARE.find(plan => 
    months.indexOf(plan.month) === selectedMonth
  );

  const currentMonthSchedule = PERFECT_GREEN_SCHEDULE.filter(schedule => 
    months.indexOf(schedule.month) === selectedMonth
  );

  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case 'duengen':
        return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'maehen':
        return <Scissors className="w-4 h-4 text-green-500" />;
      case 'lueften':
        return <Wind className="w-4 h-4 text-purple-500" />;
      case 'nachsaeen':
        return <Sprout className="w-4 h-4 text-yellow-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (activity: string, isActive: boolean) => {
    if (!isActive) return 'bg-gray-50 text-gray-400';
    
    switch (activity) {
      case 'duengen':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'maehen':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'lueften':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'nachsaeen':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  if (!currentMonthPlan) {
    return (
      <Card title="Perfect Green Rasenpflege-Kalender">
        <p className="text-gray-500">Keine Pläne für den ausgewählten Monat verfügbar.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card title="Perfect Green Rasenpflege-Kalender">
        {/* Month Selector */}
        <div className="mb-6">
          <div className="flex overflow-x-auto gap-2 pb-2">
            {months.map((month, index) => (
              <button
                key={month}
                onClick={() => setSelectedMonth(index)}
                className={`px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedMonth === index
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        {/* Current Month Activities */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Aktivitäten für {months[selectedMonth]}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Düngung */}
            <div className={`p-4 border rounded-lg ${getPriorityColor('duengen', currentMonthPlan.duengen)}`}>
              <div className="flex items-center space-x-3 mb-2">
                {getActivityIcon('duengen')}
                <span className="font-medium">Düngung</span>
                {currentMonthPlan.duengen ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400" />
                )}
              </div>
              {currentMonthPlan.duengen ? (
                <div className="text-sm space-y-1">
                  <p><strong>Typ:</strong> {currentMonthPlan.duengerTyp}</p>
                  <p><strong>Menge:</strong> {currentMonthPlan.duengerMenge}g/m²</p>
                  <p className="text-xs opacity-75">Bei Temperaturen ab 10°C</p>
                </div>
              ) : (
                <p className="text-sm opacity-75">Keine Düngung erforderlich</p>
              )}
            </div>

            {/* Mähen */}
            <div className={`p-4 border rounded-lg ${getPriorityColor('maehen', currentMonthPlan.maehen)}`}>
              <div className="flex items-center space-x-3 mb-2">
                {getActivityIcon('maehen')}
                <span className="font-medium">Mähen</span>
                {currentMonthPlan.maehen ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400" />
                )}
              </div>
              {currentMonthPlan.maehen ? (
                <div className="text-sm space-y-1">
                  <p><strong>Laufzeit:</strong> {currentMonthPlan.laufzeitProWoche}</p>
                  <p><strong>Klingenwechsel:</strong> {currentMonthPlan.klingenwechselProMonat}x pro Monat</p>
                  <p className="text-xs opacity-75">Schnitthöhe: 25-50mm</p>
                </div>
              ) : (
                <p className="text-sm opacity-75">Mähpause</p>
              )}
            </div>

            {/* Lüften */}
            <div className={`p-4 border rounded-lg ${getPriorityColor('lueften', currentMonthPlan.lueften)}`}>
              <div className="flex items-center space-x-3 mb-2">
                {getActivityIcon('lueften')}
                <span className="font-medium">Lüften</span>
                {currentMonthPlan.lueften ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <p className="text-sm opacity-75">
                {currentMonthPlan.lueften 
                  ? 'Rasen lüften für bessere Nährstoffaufnahme'
                  : 'Kein Lüften erforderlich'
                }
              </p>
            </div>

            {/* Nachsäen */}
            <div className={`p-4 border rounded-lg ${getPriorityColor('nachsaeen', currentMonthPlan.nachsaeen)}`}>
              <div className="flex items-center space-x-3 mb-2">
                {getActivityIcon('nachsaeen')}
                <span className="font-medium">Nachsäen</span>
                {currentMonthPlan.nachsaeen ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <p className="text-sm opacity-75">
                {currentMonthPlan.nachsaeen 
                  ? 'Kahle Stellen nachsäen'
                  : 'Kein Nachsäen erforderlich'
                }
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Schedule */}
      {currentMonthSchedule.length > 0 && (
        <Card title="Detaillierter Düngeplan" subtitle={`${months[selectedMonth]} - Perfect Green`}>
          <div className="space-y-3">
            {currentMonthSchedule.map((schedule, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {schedule.week}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {schedule.month} - Woche {schedule.week}
                    </p>
                    <p className="text-sm text-gray-600">{schedule.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600">{schedule.amount}g/m²</p>
                  <p className="text-xs text-gray-500">{schedule.fertilizer}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tips */}
      <Card title="Profi-Tipps">
        <div className="space-y-3 text-sm">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p><strong>Temperatur beachten:</strong> Düngen Sie nur bei Bodentemperaturen ab 10°C für optimale Nährstoffaufnahme.</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <p><strong>Mähroboter-Tipp:</strong> Halten Sie die Schnitthöhe zwischen 25-50mm für perfektes Mulchen.</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <p><strong>Lüften statt Vertikutieren:</strong> Verwenden Sie niemals einen Vertikutierer bei Mähroboter-Rasen!</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <p><strong>Bewässerung:</strong> Bei Hitzeperioden 15 Liter pro m² bewässern, am besten vor Regentagen düngen.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};