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
        const waterAmount = temp > 30 ? '20L/m²' : '15L/m²';
        const timing = temp > 28 ? 'früh 6-8 Uhr' : 'morgens';
        return {
          title: '🌡️ Rasen bewässern',
          body: `${temp}°C: ${waterAmount} ${timing} gießen`,
          priority: 'high',
          type: 'watering'
        };
      }

      // 3. Lüftung (Frühjahr/Herbst bei geeignetem Wetter)
      if ([2, 3, 8, 9].includes(month) && this.shouldRecommendAeration(weather)) {
        const tool = month <= 3 ? 'Vertikutierer' : 'Aerifizierer';
        const depth = month <= 3 ? '2-4mm tief' : '5-8cm tief';
        return {
          title: '🌱 Rasen lüften',
          body: `${tool} ${depth} bei ${temp}°C nutzen`,
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
    const today = new Date();
    const recommendedDate = this.getOptimalFertilizerDate(weather, month);
    
    let fertilizerInfo = { type: 'Dünger', amount: '25g/m²' };
    if (month === 2) fertilizerInfo = { type: 'ProNatura Frühjahr', amount: '30g/m²' };
    else if (month === 5) fertilizerInfo = { type: 'ProNatura Sommer', amount: '25g/m²' };
    else if (month === 8) fertilizerInfo = { type: 'ProNatura Herbst', amount: '35g/m²' };

    const dateInfo = recommendedDate ? ` am ${recommendedDate.getDate()}.${recommendedDate.getMonth() + 1}.` : '';
    const rainReason = upcomingRain > 3 ? ' (Regen erwartet)' : upcomingRain > 1 ? ' (leichter Regen)' : '';
    
    return {
      title: `🌿 ${fertilizerInfo.type}`,
      body: `${fertilizerInfo.amount}${dateInfo} bei ${temp}°C${rainReason}`,
      priority: 'high',
      type: 'fertilizer'
    };
  }

  private getOptimalFertilizerDate(weather: Weather, month: number): Date | null {
    const today = new Date();
    const forecast = weather.forecast;
    
    // Find best day in next 3 days based on rain forecast
    for (let i = 0; i < forecast.length; i++) {
      const day = forecast[i];
      if (day.rain > 1 && day.rain < 8) { // Good amount of rain, not too much
        const date = new Date(today);
        date.setDate(today.getDate() + i + 1);
        return date;
      }
    }
    
    // If no perfect day found, suggest mid-month optimal dates
    const optimalDates = [15, 20, 25];
    for (const dayOfMonth of optimalDates) {
      const date = new Date(today.getFullYear(), today.getMonth(), dayOfMonth);
      if (date > today) {
        return date;
      }
    }
    
    return null;
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