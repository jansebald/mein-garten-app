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
      
      // 1. Düngung (März, Juni, September) - mit optimalem Zeitfenster
      if (this.isOptimalFertilizerMonth(month) && this.shouldRecommendFertilizing(weather)) {
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

      // 5. Hinweise für Düngung außerhalb optimaler Zeit
      const fertilizerHint = this.getFertilizerSeasonHint(month, weather);
      if (fertilizerHint) return fertilizerHint;

      // 6. Allgemeine Monatstipps
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

  private isOptimalFertilizerMonth(month: number): boolean {
    const today = new Date();
    const dayOfMonth = today.getDate();
    
    // Optimale Zeitfenster für Düngung:
    // März: 15. - 31. (Frühjahrsdüngung nach Frostende)
    // Juni: 1. - 20. (Sommerdüngung vor Hitze)  
    // September: 1. - 25. (Herbstdüngung vor Winterruhe)
    
    switch (month) {
      case 2: // März
        return dayOfMonth >= 15; // Ab Mitte März
      case 5: // Juni  
        return dayOfMonth <= 20; // Bis Mitte Juni
      case 8: // September
        return dayOfMonth <= 25; // Bis Ende September
      default:
        return false;
    }
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
    
    // Month-specific optimal dates
    let optimalDates: number[] = [];
    switch (month) {
      case 2: // März - nach Frostende
        optimalDates = [18, 22, 25];
        break;
      case 5: // Juni - vor Sommerhitze
        optimalDates = [5, 10, 15];
        break;
      case 8: // September - rechtzeitig vor Winter
        optimalDates = [8, 15, 20];
        break;
    }
    
    for (const dayOfMonth of optimalDates) {
      const date = new Date(today.getFullYear(), today.getMonth(), dayOfMonth);
      if (date > today) {
        return date;
      }
    }
    
    return null;
  }

  private getFertilizerSeasonHint(month: number, weather: Weather): SmartNotification | null {
    const today = new Date();
    const dayOfMonth = today.getDate();
    const temp = weather.current.temp;

    // Hinweise wenn NICHT die optimale Zeit ist
    switch (month) {
      case 2: // März - vor dem 15. zu früh
        if (dayOfMonth < 15) {
          return {
            title: '❄️ Noch zu früh',
            body: `Frühjahr-Dünger ab 15. März bei >10°C (heute ${temp}°C)`,
            priority: 'medium',
            type: 'fertilizer'
          };
        }
        break;
        
      case 5: // Juni - nach dem 20. zu spät
        if (dayOfMonth > 20) {
          return {
            title: '🌞 Sommer-Düngung verpasst',
            body: `Nächste Chance: September 1.-25. bei <25°C`,
            priority: 'low',
            type: 'fertilizer'
          };
        }
        break;
        
      case 8: // September - nach dem 25. zu spät
        if (dayOfMonth > 25) {
          return {
            title: '🍂 Herbst-Düngung verpasst',
            body: `Nächste Chance: März 15.-31. nach Frost`,
            priority: 'low',
            type: 'fertilizer'
          };
        }
        break;
        
      // Hinweise in "falschen" Monaten
      case 1: // Februar
        return {
          title: '⏰ Düngung bald',
          body: `Frühjahr-Dünger ab 15. März vorbereiten`,
          priority: 'low',
          type: 'fertilizer'
        };
        
      case 4: // Mai
        return {
          title: '⏰ Sommer-Düngung bald',
          body: `ProNatura Sommer 1.-20. Juni bei gutem Wetter`,
          priority: 'low',
          type: 'fertilizer'
        };
        
      case 7: // August
        return {
          title: '⏰ Herbst-Düngung bald',
          body: `ProNatura Herbst 1.-25. September vorbereiten`,
          priority: 'low',
          type: 'fertilizer'
        };
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