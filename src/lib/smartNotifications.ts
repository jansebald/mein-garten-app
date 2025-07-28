import { weatherService } from './weather';
import { Weather } from '@/types/garden';

interface SmartNotification {
  title: string;
  body: string;
  priority: 'high' | 'medium' | 'low';
  type: 'fertilizer' | 'mowing' | 'watering' | 'aeration' | 'general';
}

class SmartNotificationService {
  // Kurze, präzise Gartentipps basierend auf aktuellem Wetter
  async generateWeatherBasedTip(): Promise<SmartNotification | null> {
    try {
      const weather = await weatherService.getCompleteWeather();
      const month = new Date().getMonth();
      const temp = weather.current.temp;
      const rain = weather.current.precipitation;
      const upcomingRain = weather.forecast.slice(0, 2).reduce((sum, day) => sum + day.rain, 0);
      const humidity = weather.current.humidity;

      // Priorisierte Empfehlungen basierend auf Wetter und Saison
      
      // 1. Düngung (März, Juni, September)
      if ([2, 5, 8].includes(month) && this.shouldRecommendFertilizing(weather)) {
        return this.getFertilizerNotification(weather, upcomingRain);
      }

      // 2. Bewässerung bei Hitze
      if (temp > 25 && upcomingRain < 1) {
        return {
          title: '🌡️ Rasen bewässern',
          body: `${temp}°C, kein Regen: 15L/m² morgens gießen`,
          priority: 'high',
          type: 'watering'
        };
      }

      // 3. Lüftung (Frühjahr/Herbst bei geeignetem Wetter)
      if ([2, 3, 8, 9].includes(month) && this.shouldRecommendAeration(weather)) {
        return {
          title: '🌱 Rasen lüften',
          body: `Perfekte Bedingungen: ${temp}°C, nicht zu nass`,
          priority: 'medium',
          type: 'aeration'
        };
      }

      // 4. Mähen bei gutem Wetter
      if (this.shouldRecommendMowing(weather)) {
        return {
          title: '✂️ Mähen empfohlen',
          body: `Trocken, ${temp}°C: Ideale Mähbedingungen`,
          priority: 'medium',
          type: 'mowing'
        };
      }

      // 5. Allgemeine Monatstipps
      return this.getMonthlyTip(month, weather);

    } catch (error) {
      console.error('Error generating smart notification:', error);
      return null;
    }
  }

  private shouldRecommendFertilizing(weather: Weather): boolean {
    const temp = weather.current.temp;
    const rain = weather.current.precipitation;
    const upcomingRain = weather.forecast.slice(0, 2).reduce((sum, day) => sum + day.rain, 0);
    
    return temp >= 10 && temp <= 25 && rain < 5 && upcomingRain > 0.5;
  }

  private shouldRecommendAeration(weather: Weather): boolean {
    const temp = weather.current.temp;
    const rain = weather.current.precipitation;
    const humidity = weather.current.humidity;
    
    return temp >= 8 && temp <= 20 && rain < 2 && humidity < 80;
  }

  private shouldRecommendMowing(weather: Weather): boolean {
    const temp = weather.current.temp;
    const rain = weather.current.precipitation;
    const humidity = weather.current.humidity;
    
    return temp >= 5 && rain < 1 && humidity < 85;
  }

  private getFertilizerNotification(weather: Weather, upcomingRain: number): SmartNotification {
    const temp = weather.current.temp;
    const month = new Date().getMonth();
    
    let fertilizerType = 'Dünger';
    if (month === 2) fertilizerType = 'Frühjahrsdünger';
    else if (month === 5) fertilizerType = 'Sommerdünger';
    else if (month === 8) fertilizerType = 'Herbstdünger';

    const rainInfo = upcomingRain > 3 ? ', Regen kommt' : '';
    
    return {
      title: `🌿 ${fertilizerType} streuen`,
      body: `${temp}°C optimal${rainInfo}. Jetzt düngen!`,
      priority: 'high',
      type: 'fertilizer'
    };
  }

  private getMonthlyTip(month: number, weather: Weather): SmartNotification {
    const temp = weather.current.temp;
    const tips = [
      { title: '❄️ Januar', body: `Geräte prüfen, Pläne machen. ${temp}°C` },
      { title: '🌱 Februar', body: `Boden vorbereiten bei ${temp}°C` },
      { title: '🌿 März', body: `Erste Düngung ab 10°C (aktuell ${temp}°C)` },
      { title: '🌸 April', body: `Regelmäßig mähen bei ${temp}°C` },
      { title: '🌺 Mai', body: `Gießen bei ${temp}°C, Unkraut jäten` },
      { title: '☀️ Juni', body: `Sommerpflege bei ${temp}°C starten` },
      { title: '🌞 Juli', body: `Viel gießen! ${temp}°C = 15L/m²` },
      { title: '🌾 August', body: `Schädlinge prüfen bei ${temp}°C` },
      { title: '🍂 September', body: `Herbstdüngung bei ${temp}°C` },
      { title: '🍁 Oktober', body: `Laub entfernen, ${temp}°C beachten` },
      { title: '🥶 November', body: `Wintervorbereitung bei ${temp}°C` },
      { title: '❄️ Dezember', body: `Ruhezeit, Planung für ${new Date().getFullYear() + 1}` }
    ];

    return {
      ...tips[month],
      priority: 'low' as const,
      type: 'general' as const
    };
  }

  // Prüft ob eine bestimmte Aktivität heute empfohlen wird
  async shouldNotifyForActivity(activity: 'fertilizer' | 'mowing' | 'aeration'): Promise<boolean> {
    try {
      const weather = await weatherService.getCompleteWeather();
      const month = new Date().getMonth();

      switch (activity) {
        case 'fertilizer':
          return [2, 5, 8].includes(month) && this.shouldRecommendFertilizing(weather);
        
        case 'mowing':
          return this.shouldRecommendMowing(weather);
        
        case 'aeration':
          return [2, 3, 8, 9].includes(month) && this.shouldRecommendAeration(weather);
        
        default:
          return false;
      }
    } catch (error) {
      console.error('Error checking activity recommendation:', error);
      return false;
    }
  }

  // Generiert mehrere Optionen für den Tag
  async getDailyRecommendations(): Promise<SmartNotification[]> {
    try {
      const weather = await weatherService.getCompleteWeather();
      const recommendations: SmartNotification[] = [];

      // Immer einen Haupttipp
      const mainTip = await this.generateWeatherBasedTip();
      if (mainTip) recommendations.push(mainTip);

      // Zusätzliche Tipps basierend auf Wetter
      const temp = weather.current.temp;
      const rain = weather.current.precipitation;

      if (temp < 5) {
        recommendations.push({
          title: '🥶 Frostschutz',
          body: `${temp}°C: Kübelpflanzen schützen`,
          priority: 'high',
          type: 'general'
        });
      }

      if (rain > 10) {
        recommendations.push({
          title: '🌧️ Starkregen',
          body: `${rain}mm: Drainage prüfen`,
          priority: 'medium',
          type: 'general'
        });
      }

      return recommendations;
    } catch (error) {
      console.error('Error generating daily recommendations:', error);
      return [];
    }
  }
}

export const smartNotificationService = new SmartNotificationService();