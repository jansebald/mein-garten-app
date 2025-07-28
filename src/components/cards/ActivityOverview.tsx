'use client';

import React, { useEffect, useState } from 'react';
import { Droplets, Scissors, Sprout, Calendar, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { storage } from '@/lib/storage';
import { GardenEntry } from '@/types/garden';

export const ActivityOverview: React.FC = () => {
  const [recentEntries, setRecentEntries] = useState<GardenEntry[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const loadData = () => {
      const entries = storage.getRecentEntries(5);
      const statistics = storage.getStatistics();
      setRecentEntries(entries);
      setStats(statistics);
    };

    loadData();
    
    // Listen for storage changes
    const handleStorageChange = () => loadData();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getActivityIcon = (type: GardenEntry['type']) => {
    switch (type) {
      case 'fertilizer':
        return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'mowing':
        return <Scissors className="w-4 h-4 text-green-500" />;
      case 'seeding':
        return <Sprout className="w-4 h-4 text-yellow-500" />;
      case 'watering':
        return <Droplets className="w-4 h-4 text-blue-400" />;
      case 'maintenance':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityLabel = (type: GardenEntry['type']) => {
    const labels = {
      fertilizer: 'Gedüngt',
      mowing: 'Gemäht',
      seeding: 'Gesät',
      watering: 'Bewässert',
      maintenance: 'Pflege',
    };
    return labels[type] || 'Aktivität';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Heute';
    if (diffDays === 2) return 'Gestern';
    if (diffDays <= 7) return `vor ${diffDays - 1} Tagen`;
    
    return date.toLocaleDateString('de-DE', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      {stats && (
        <Card title="Übersicht" subtitle="Letzte 30 Tage">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-primary-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
              </div>
              <p className="text-2xl font-bold text-primary-600">{stats.recentEntries}</p>
              <p className="text-sm text-gray-600">Aktivitäten</p>
            </div>
            
            {stats.daysSinceLastFertilizer !== null && (
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Droplets className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-600">{stats.daysSinceLastFertilizer}</p>
                <p className="text-sm text-gray-600">Tage seit Düngung</p>
              </div>
            )}
            
            {stats.daysSinceLastMowing !== null && stats.daysSinceLastFertilizer === null && (
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Scissors className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">{stats.daysSinceLastMowing}</p>
                <p className="text-sm text-gray-600">Tage seit Mähung</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Recent Activities */}
      <Card title="Letzte Aktivitäten" subtitle={`${recentEntries.length} Einträge`}>
        {recentEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Noch keine Aktivitäten vorhanden.</p>
            <p className="text-sm mt-1">Starten Sie mit Ihrem ersten Eintrag!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentEntries.map((entry) => (
              <div key={entry.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {getActivityIcon(entry.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {getActivityLabel(entry.type)} - {entry.plant}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{formatDate(entry.date)}</span>
                    {entry.amount && (
                      <span>• {entry.amount}g</span>
                    )}
                    {entry.area && (
                      <span>• {entry.area}m²</span>
                    )}
                  </div>
                  {entry.notes && (
                    <p className="text-xs text-gray-600 mt-1 truncate">{entry.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};