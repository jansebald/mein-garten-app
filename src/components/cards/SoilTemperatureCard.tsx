'use client';

import React, { useState, useEffect } from 'react';
import { Thermometer, TrendingUp, Droplets, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { soilTemperatureService, SoilTemperature } from '@/lib/soilTemperature';

export const SoilTemperatureCard: React.FC = () => {
  const [soilTemp, setSoilTemp] = useState<SoilTemperature | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSoilTemperature();
  }, []);

  const loadSoilTemperature = async () => {
    try {
      const data = await soilTemperatureService.getSoilTemperature();
      setSoilTemp(data);
    } catch (error) {
      console.error('Fehler beim Laden der Bodentemperatur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card variant="glass">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </Card>
    );
  }

  if (!soilTemp) return null;

  const temps = soilTemp.temperatures;
  const maxTemp = Math.max(temps.depth5cm, temps.depth10cm, temps.depth20cm, temps.depth50cm);

  return (
    <Card variant="glass" className="overflow-hidden">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Bodentemperatur</h3>
              <p className="text-xs text-gray-500">{soilTemp.station}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">
              {temps.depth5cm}°C
            </div>
            <div className="text-xs text-gray-500">5cm Tiefe</div>
          </div>
        </div>

        {/* Temperature Profile - Visual */}
        <div className="mb-4 bg-gradient-to-b from-orange-50 to-blue-50 rounded-xl p-4">
          <div className="space-y-2.5">
            {[
              { depth: '5cm', temp: temps.depth5cm, color: 'bg-orange-500' },
              { depth: '10cm', temp: temps.depth10cm, color: 'bg-amber-500' },
              { depth: '20cm', temp: temps.depth20cm, color: 'bg-yellow-500' },
              { depth: '50cm', temp: temps.depth50cm, color: 'bg-green-500' },
            ].map((item, index) => {
              const width = (item.temp / maxTemp) * 100;
              return (
                <div key={item.depth} className="flex items-center gap-3">
                  <div className="w-12 text-xs font-medium text-gray-600">{item.depth}</div>
                  <div className="flex-1 h-6 bg-white/50 rounded-lg overflow-hidden relative">
                    <div
                      className={`h-full ${item.color} rounded-lg transition-all duration-500`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <div className="w-14 text-sm font-semibold text-gray-700 text-right">
                    {item.temp}°C
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendation */}
        <div
          className={`rounded-xl p-4 ${
            soilTemp.canFertilize
              ? 'bg-green-50 border border-green-200'
              : 'bg-amber-50 border border-amber-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {soilTemp.canFertilize ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-1">
                {soilTemp.canFertilize ? 'Optimal zum Düngen!' : 'Noch zu kalt'}
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                {soilTemp.recommendation}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-white/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium text-gray-600">Aussaat</span>
            </div>
            <div className={`text-sm font-semibold ${soilTemp.canSeed ? 'text-green-600' : 'text-gray-400'}`}>
              {soilTemp.canSeed ? 'Geeignet' : 'Noch warten'}
            </div>
          </div>
          <div className="bg-white/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-medium text-gray-600">Düngung</span>
            </div>
            <div className={`text-sm font-semibold ${soilTemp.canFertilize ? 'text-green-600' : 'text-gray-400'}`}>
              {soilTemp.canFertilize ? 'Jetzt möglich' : 'Ab 10°C'}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 pt-3 border-t border-gray-200/50">
          <p className="text-xs text-gray-500 text-center">
            💡 <strong>Tipp:</strong> Düngen Sie erst ab 10°C Bodentemperatur für optimale Nährstoffaufnahme
          </p>
        </div>
      </div>
    </Card>
  );
};
