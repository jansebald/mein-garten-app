'use client';

import React, { useEffect, useState } from 'react';
import { Trash2, Edit, Droplets, Scissors, Sprout, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { storage } from '@/lib/storage';
import { GardenEntry } from '@/types/garden';

export const EntryList: React.FC = () => {
  const [entries, setEntries] = useState<GardenEntry[]>([]);
  const [filter, setFilter] = useState<'all' | GardenEntry['type']>('all');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const allEntries = storage.getGardenEntries();
    setEntries(allEntries);
  };

  const handleDelete = (id: string) => {
    if (confirm('Eintrag wirklich löschen?')) {
      storage.deleteGardenEntry(id);
      loadEntries();
    }
  };

  const getActivityIcon = (type: GardenEntry['type']) => {
    switch (type) {
      case 'fertilizer':
        return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'mowing':
        return <Scissors className="w-5 h-5 text-green-500" />;
      case 'seeding':
        return <Sprout className="w-5 h-5 text-yellow-500" />;
      case 'watering':
        return <Droplets className="w-5 h-5 text-blue-400" />;
      case 'maintenance':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityLabel = (type: GardenEntry['type']) => {
    const labels = {
      fertilizer: 'Düngung',
      mowing: 'Mähung',
      seeding: 'Aussaat',
      watering: 'Bewässerung',
      maintenance: 'Pflege',
    };
    return labels[type] || 'Aktivität';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredEntries = filter === 'all' 
    ? entries 
    : entries.filter(entry => entry.type === filter);

  const filterOptions = [
    { value: 'all', label: 'Alle', count: entries.length },
    { value: 'fertilizer', label: 'Düngung', count: entries.filter(e => e.type === 'fertilizer').length },
    { value: 'seeding', label: 'Aussaat', count: entries.filter(e => e.type === 'seeding').length },
    { value: 'mowing', label: 'Mähung', count: entries.filter(e => e.type === 'mowing').length },
    { value: 'watering', label: 'Bewässerung', count: entries.filter(e => e.type === 'watering').length },
    { value: 'maintenance', label: 'Pflege', count: entries.filter(e => e.type === 'maintenance').length },
  ];

  return (
    <Card title="Alle Einträge" subtitle={`${filteredEntries.length} Einträge`}>
      {/* Filter Buttons */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value as any)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                filter === option.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Keine Einträge gefunden.</p>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="text-primary-500 hover:text-primary-600 text-sm mt-2"
            >
              Alle Einträge anzeigen
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getActivityIcon(entry.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">
                        {getActivityLabel(entry.type)} - {entry.plant}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {formatDate(entry.date)}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
                      {entry.area && (
                        <span>📐 {entry.area}m²</span>
                      )}
                      {entry.amount && (
                        <span>⚖️ {entry.amount}g</span>
                      )}
                      {entry.seeds && (
                        <span>🌱 {entry.seeds}g Saatgut</span>
                      )}
                      {entry.fertilizer && (
                        <span>🧪 {entry.fertilizer}</span>
                      )}
                      {entry.variety && (
                        <span>🏷️ {entry.variety}</span>
                      )}
                    </div>
                    
                    {entry.notes && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {entry.notes}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(entry.id)}
                    className="flex items-center"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};