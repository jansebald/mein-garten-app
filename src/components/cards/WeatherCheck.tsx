'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, Calendar, Thermometer, CloudRain } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { weatherService } from '@/lib/weather';
import { smartNotificationService } from '@/lib/smartNotifications';

interface WeatherAdvice {
  shouldFertilize: boolean;
  reason: string;
  temperature: number;
  rain: number;
  upcomingRain: number;
  betterDates?: { date: string; reason: string }[];
}

export const WeatherCheck: React.FC = () => {
  const [advice, setAdvice] = useState<WeatherAdvice | null>(null);
  const [loading, setLoading] = useState(false);

  const checkFertilizerWeather = async () => {
    setLoading(true);
    try {
      const weather = await weatherService.getCompleteWeather();
      const temp = weather.current.temp;
      const rain = weather.current.precipitation;
      const upcomingRain = weather.forecast.slice(0, 3).reduce((sum, day) => sum + day.rain, 0);
      const humidity = weather.current.humidity;
      
      // Prüfe ob heute optimal ist
      const shouldFertilize = await evaluateFertilizerConditions(weather);
      let reason = '';
      
      if (shouldFertilize) {
        if (upcomingRain > 3) {
          reason = `Perfekt! ${temp}°C und Regen kommt (${upcomingRain.toFixed(1)}mm)`;
        } else if (temp >= 10 && temp <= 20) {
          reason = `Gute Bedingungen bei ${temp}°C. Nach Düngung wässern!`;
        } else {
          reason = `Möglich bei ${temp}°C, aber nicht optimal`;
        }
      } else {
        if (temp < 10) {
          reason = `Zu kalt (${temp}°C). Mindestens 10°C nötig`;
        } else if (temp > 30) {
          reason = `Zu heiß (${temp}°C). Rasen könnte verbrennen`;
        } else if (rain > 5) {
          reason = `Zu nass (${rain}mm Regen). Dünger wird weggeschwemmt`;
        } else if (humidity > 90) {
          reason = `Zu feucht (${humidity}% Luftfeuchtigkeit)`;
        } else {
          reason = `Aktuell nicht optimal`;
        }
      }

      // Finde bessere Termine
      const betterDates = await findBetterFertilizerDates(weather);

      setAdvice({
        shouldFertilize,
        reason,
        temperature: temp,
        rain,
        upcomingRain,
        betterDates
      });
    } catch (error) {
      console.error('Error checking fertilizer weather:', error);
      setAdvice({
        shouldFertilize: false,
        reason: 'Wetterdaten konnten nicht geladen werden',
        temperature: 0,
        rain: 0,
        upcomingRain: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const evaluateFertilizerConditions = async (weather: any): Promise<boolean> => {
    const temp = weather.current.temp;
    const rain = weather.current.precipitation;
    const upcomingRain = weather.forecast.slice(0, 2).reduce((sum: number, day: any) => sum + day.rain, 0);
    const humidity = weather.current.humidity;

    // Zu kalt
    if (temp < 10) return false;
    
    // Zu heiß ohne Regen
    if (temp > 30 && upcomingRain < 1) return false;
    
    // Aktuell zu viel Regen
    if (rain > 5) return false;
    
    // Zu hohe Luftfeuchtigkeit
    if (humidity > 90) return false;

    // Prüfe Saison
    const month = new Date().getMonth();
    const dayOfMonth = new Date().getDate();
    
    // Nicht in optimaler Saison
    if (month === 2 && dayOfMonth < 15) return false; // März vor 15.
    if (month === 5 && dayOfMonth > 20) return false; // Juni nach 20.
    if (month === 8 && dayOfMonth > 25) return false; // September nach 25.
    if (![2, 5, 8].includes(month)) return false; // Nur März, Juni, September

    return true;
  };

  const findBetterFertilizerDates = async (weather: any): Promise<{ date: string; reason: string }[]> => {
    const betterDates: { date: string; reason: string }[] = [];
    const today = new Date();

    // Prüfe nächste 7 Tage
    weather.forecast.forEach((day: any, index: number) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index + 1);
      
      const temp = (day.temp_high + day.temp_low) / 2;
      const rain = day.rain;
      
      let score = 0;
      let reason = '';
      
      // Bewerte Temperatur
      if (temp >= 12 && temp <= 18) {
        score += 3;
        reason += `Ideal ${temp.toFixed(0)}°C`;
      } else if (temp >= 10 && temp <= 25) {
        score += 2;
        reason += `Gut ${temp.toFixed(0)}°C`;
      } else {
        score -= 1;
        reason += `${temp.toFixed(0)}°C`;
      }

      // Bewerte Regen
      if (rain > 1 && rain < 5) {
        score += 3;
        reason += `, perfekter Regen (${rain.toFixed(1)}mm)`;
      } else if (rain > 0 && rain <= 1) {
        score += 1;
        reason += `, leichter Regen`;
      } else if (rain === 0) {
        score += 0;
        reason += `, trocken (gießen!)`;
      } else {
        score -= 2;
        reason += `, zu nass (${rain.toFixed(1)}mm)`;
      }

      if (score >= 3) {
        betterDates.push({
          date: date.toLocaleDateString('de-DE', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short' 
          }),
          reason
        });
      }
    });

    return betterDates.slice(0, 3); // Max 3 Vorschläge
  };

  const getAdviceColor = () => {
    if (!advice) return 'text-gray-600';
    return advice.shouldFertilize ? 'text-green-600' : 'text-red-600';
  };

  const getAdviceIcon = () => {
    if (!advice) return null;
    return advice.shouldFertilize ? 
      <CheckCircle className="w-6 h-6 text-green-600" /> : 
      <XCircle className="w-6 h-6 text-red-600" />;
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Thermometer className="w-6 h-6 text-primary-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Düngung-Check</h2>
        </div>

        <div className="space-y-4">
          <Button
            onClick={checkFertilizerWeather}
            disabled={loading}
            className="w-full text-lg py-3"
          >
            {loading ? 'Prüfe Wetter...' : '🌿 Soll ich heute düngen?'}
          </Button>

          {advice && (
            <div className="mt-6 space-y-4">
              {/* Hauptempfehlung */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                {getAdviceIcon()}
                <div className="flex-1">
                  <h3 className={`font-semibold ${getAdviceColor()}`}>
                    {advice.shouldFertilize ? 'Ja, heute düngen!' : 'Besser nicht heute'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{advice.reason}</p>
                </div>
              </div>

              {/* Wetter-Details */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Thermometer className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm font-medium text-blue-900">{advice.temperature}°C</div>
                  <div className="text-xs text-blue-600">Temperatur</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <CloudRain className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm font-medium text-blue-900">{advice.rain}mm</div>
                  <div className="text-xs text-blue-600">Aktueller Regen</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <CloudRain className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm font-medium text-blue-900">{advice.upcomingRain.toFixed(1)}mm</div>
                  <div className="text-xs text-blue-600">3-Tage Regen</div>
                </div>
              </div>

              {/* Alternative Termine */}
              {advice.betterDates && advice.betterDates.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Bessere Termine:
                  </h4>
                  <div className="space-y-2">
                    {advice.betterDates.map((option, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="font-medium text-green-900">{option.date}</span>
                        <span className="text-sm text-green-700">{option.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};