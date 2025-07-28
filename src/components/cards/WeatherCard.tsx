'use client';

import React, { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Droplets, Thermometer } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Weather } from '@/types/garden';
import { weatherService } from '@/lib/weather';

const WeatherIcon: React.FC<{ condition: string; className?: string }> = ({ condition, className = 'w-8 h-8' }) => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return <Sun className={`${className} text-yellow-500`} />;
    case 'rain':
      return <CloudRain className={`${className} text-blue-500`} />;
    case 'clouds':
      return <Cloud className={`${className} text-gray-500`} />;
    default:
      return <Sun className={`${className} text-yellow-500`} />;
  }
};

export const WeatherCard: React.FC = () => {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Array<{
    type: 'success' | 'warning' | 'info';
    title: string;
    message: string;
  }>>([]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const weatherData = await weatherService.getCompleteWeather();
        setWeather(weatherData);
        setRecommendations(weatherService.getGardenRecommendations(weatherData));
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <Card title="Wetter in Kulmbach">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card title="Wetter in Kulmbach">
        <p className="text-gray-500">Wetterdaten konnten nicht geladen werden.</p>
      </Card>
    );
  }

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <Card title="Wetter in Kulmbach">
        <div className="space-y-4">
          {/* Current Weather */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <WeatherIcon condition={weather.current.condition} className="w-12 h-12" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{weather.current.temp}°C</p>
                <p className="text-sm text-gray-600 capitalize">{weather.current.description}</p>
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center text-sm text-gray-600">
                <Droplets className="w-4 h-4 mr-1" />
                {weather.current.humidity}%
              </div>
              {weather.current.precipitation > 0 && (
                <div className="flex items-center text-sm text-blue-600">
                  <CloudRain className="w-4 h-4 mr-1" />
                  {weather.current.precipitation}mm
                </div>
              )}
            </div>
          </div>

          {/* 3-Day Forecast */}
          <div className="grid grid-cols-3 gap-3">
            {weather.forecast.map((day, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-600 mb-2">{day.day}</p>
                <WeatherIcon condition={day.condition} className="w-6 h-6 mx-auto mb-2" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">{day.temp_high}°/{day.temp_low}°</p>
                  {day.rain > 0 && (
                    <p className="text-xs text-blue-600">{day.rain}mm</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card title="Garten-Empfehlungen" subtitle="Basierend auf dem aktuellen Wetter">
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-3 border rounded-lg ${getRecommendationColor(rec.type)}`}
              >
                <h4 className="font-medium text-sm mb-1">{rec.title}</h4>
                <p className="text-sm opacity-90">{rec.message}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};