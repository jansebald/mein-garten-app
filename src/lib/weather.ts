import { Weather } from '@/types/garden';
import { WEATHER_CONFIG } from './constants';
import { storage } from './storage';

class WeatherService {
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  async getCurrentWeather(): Promise<Weather['current']> {
    try {
      const cachedData = storage.getCachedWeatherData();
      if (cachedData?.current) {
        return cachedData.current;
      }

      const response = await fetch(
        `${this.baseUrl}/weather?q=${WEATHER_CONFIG.CITY}&appid=${WEATHER_CONFIG.API_KEY}&units=metric&lang=de`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();

      const weatherData = {
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        precipitation: data.rain?.['1h'] || 0,
      };

      // Cache the data
      storage.cacheWeatherData({ current: weatherData });
      
      return weatherData;
    } catch (error) {
      console.warn('Weather API failed, using mock data:', error);
      return this.getMockCurrentWeather();
    }
  }

  async getWeatherForecast(): Promise<Weather['forecast']> {
    try {
      const cachedData = storage.getCachedWeatherData();
      if (cachedData?.forecast) {
        return cachedData.forecast;
      }

      const response = await fetch(
        `${this.baseUrl}/forecast?q=${WEATHER_CONFIG.CITY}&appid=${WEATHER_CONFIG.API_KEY}&units=metric&lang=de`
      );

      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
      }

      const data = await response.json();

      // Group by day and take daily forecasts
      const dailyForecasts = this.processForecastData(data.list);
      
      // Cache the data
      const currentCached = storage.getCachedWeatherData();
      storage.cacheWeatherData({ 
        ...currentCached,
        forecast: dailyForecasts 
      });
      
      return dailyForecasts;
    } catch (error) {
      console.warn('Forecast API failed, using mock data:', error);
      return this.getMockForecast();
    }
  }

  async getCompleteWeather(): Promise<Weather> {
    const [current, forecast] = await Promise.all([
      this.getCurrentWeather(),
      this.getWeatherForecast()
    ]);

    return { current, forecast };
  }

  private processForecastData(forecastList: any[]): Weather['forecast'] {
    const dailyData = new Map<string, any>();

    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().split('T')[0];

      if (!dailyData.has(dayKey) && dailyData.size < 3) {
        dailyData.set(dayKey, {
          day: date.toLocaleDateString('de-DE', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short' 
          }),
          temp_high: Math.round(item.main.temp_max),
          temp_low: Math.round(item.main.temp_min),
          rain: item.rain?.['3h'] || 0,
          condition: item.weather[0].main,
          description: item.weather[0].description,
        });
      }
    });

    return Array.from(dailyData.values());
  }

  private getMockCurrentWeather(): Weather['current'] {
    const mockWeathers = [
      { temp: 18, condition: 'Clear', description: 'sonnig', humidity: 65, precipitation: 0 },
      { temp: 15, condition: 'Clouds', description: 'bewölkt', humidity: 75, precipitation: 0 },
      { temp: 12, condition: 'Rain', description: 'leichter Regen', humidity: 85, precipitation: 2.5 },
      { temp: 22, condition: 'Clear', description: 'heiter', humidity: 55, precipitation: 0 },
    ];

    const randomIndex = Math.floor(Math.random() * mockWeathers.length);
    return mockWeathers[randomIndex];
  }

  private getMockForecast(): Weather['forecast'] {
    const today = new Date();
    const mockForecasts = [];

    for (let i = 1; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      mockForecasts.push({
        day: date.toLocaleDateString('de-DE', { 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short' 
        }),
        temp_high: Math.round(15 + Math.random() * 10),
        temp_low: Math.round(8 + Math.random() * 5),
        rain: Math.random() > 0.7 ? Math.round(Math.random() * 5) : 0,
        condition: Math.random() > 0.5 ? 'Clear' : 'Clouds',
        description: Math.random() > 0.5 ? 'sonnig' : 'bewölkt',
      });
    }

    return mockForecasts;
  }

  // Weather-based garden recommendations
  getGardenRecommendations(weather: Weather): Array<{
    type: 'success' | 'warning' | 'info';
    title: string;
    message: string;
  }> {
    const recommendations = [];
    const temp = weather.current.temp;
    const rain = weather.current.precipitation;
    const upcomingRain = weather.forecast.reduce((sum, day) => sum + day.rain, 0);

    // Temperature-based recommendations
    if (temp < 10) {
      recommendations.push({
        type: 'warning' as const,
        title: 'Zu kalt zum Düngen',
        message: 'Düngen erst ab 10°C Bodentemperatur für optimale Nährstoffaufnahme.'
      });
    } else if (temp >= 10 && temp <= 20) {
      recommendations.push({
        type: 'success' as const,
        title: 'Optimale Düngbedingungen',
        message: 'Perfekte Temperatur für Rasendüngung. Jetzt ist der ideale Zeitpunkt!'
      });
    }

    // Rain-based recommendations
    if (upcomingRain > 5) {
      recommendations.push({
        type: 'info' as const,
        title: 'Regen erwartet',
        message: 'Idealer Zeitpunkt zum Düngen - der Regen sorgt für gute Nährstoffverteilung.'
      });
    } else if (upcomingRain === 0 && temp > 25) {
      recommendations.push({
        type: 'warning' as const,
        title: 'Bewässerung empfohlen',
        message: 'Bei dieser Hitze sollten Sie 15 Liter pro m² bewässern.'
      });
    }

    // Seasonal recommendations
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5 && temp >= 10) {
      recommendations.push({
        type: 'info' as const,
        title: 'Frühjahrszeit',
        message: 'Zeit für ProNatura Frühjahrs-Dünger und erste Mähroboter-Einsätze.'
      });
    } else if (month >= 9 && month <= 11) {
      recommendations.push({
        type: 'info' as const,
        title: 'Herbstzeit',
        message: 'ProNatura Herbst-Dünger für die Wintervorbereitung verwenden.'
      });
    }

    // Humidity recommendations
    if (weather.current.humidity > 80 && temp > 20) {
      recommendations.push({
        type: 'warning' as const,
        title: 'Hohe Luftfeuchtigkeit',
        message: 'Achten Sie auf Pilzkrankheiten. Eventuell Mähpause einlegen.'
      });
    }

    return recommendations;
  }

  // Check if weather is suitable for specific activities
  isGoodForActivity(weather: Weather, activity: 'fertilizing' | 'mowing' | 'seeding'): boolean {
    const temp = weather.current.temp;
    const rain = weather.current.precipitation;
    const upcomingRain = weather.forecast.slice(0, 2).reduce((sum, day) => sum + day.rain, 0);

    switch (activity) {
      case 'fertilizing':
        return temp >= 10 && rain < 5 && upcomingRain > 0;
      
      case 'mowing':
        return rain < 1 && weather.current.humidity < 85;
      
      case 'seeding':
        return temp >= 8 && temp <= 25 && upcomingRain > 2;
      
      default:
        return true;
    }
  }
}

export const weatherService = new WeatherService();