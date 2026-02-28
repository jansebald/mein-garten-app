import { Weather } from '@/types/garden';

export interface SoilTemperature {
  station: string;
  location: string;
  timestamp: string;
  temperatures: {
    depth5cm: number;
    depth10cm: number;
    depth20cm: number;
    depth50cm: number;
  };
  recommendation: string;
  canFertilize: boolean;
  canSeed: boolean;
}

class SoilTemperatureService {
  // Mapping von Locations zu nächsten DWD Stationen
  private stationMapping: { [key: string]: string } = {
    'Happurg': 'Nürnberg',
    'Kulmbach': 'Bayreuth',
    'Nürnberg': 'Nürnberg',
    'München': 'München',
    'Default': 'Nürnberg'
  };

  // Mock-Daten basierend auf typischen Werten für Februar/März in Bayern
  private getMockSoilTemperature(): SoilTemperature {
    const now = new Date();
    const month = now.getMonth();
    
    // Temperatur-Simulation basierend auf Jahreszeit
    let baseTemp = 5;
    if (month >= 2 && month <= 4) baseTemp = 8; // Frühjahr
    else if (month >= 5 && month <= 8) baseTemp = 18; // Sommer
    else if (month >= 9 && month <= 10) baseTemp = 12; // Herbst
    else baseTemp = 3; // Winter

    const depth5cm = baseTemp + Math.random() * 2;
    const depth10cm = baseTemp - 0.5 + Math.random() * 1.5;
    const depth20cm = baseTemp - 1 + Math.random();
    const depth50cm = baseTemp - 2 + Math.random() * 0.5;

    const canFertilize = depth5cm >= 10;
    const canSeed = depth5cm >= 8 && depth5cm <= 25;

    let recommendation = '';
    if (depth5cm < 8) {
      recommendation = 'Zu kalt: Boden ist noch in Winterruhe. Noch nicht düngen oder aussäen.';
    } else if (depth5cm >= 8 && depth5cm < 10) {
      recommendation = 'Grenzbereich: Für Aussaat geeignet, aber noch nicht optimal zum Düngen.';
    } else if (depth5cm >= 10 && depth5cm <= 15) {
      recommendation = 'Optimal: Perfekte Bedingungen für Düngung und Rasenaussaat!';
    } else if (depth5cm > 15 && depth5cm <= 20) {
      recommendation = 'Gut: Gute Bedingungen für alle Gartenarbeiten.';
    } else {
      recommendation = 'Warm: Bei Hitze morgens oder abends arbeiten und gut bewässern.';
    }

    return {
      station: 'Pommelsbrunn-Mittelburg',
      location: 'Bayern, Nürnberger Land',
      timestamp: now.toISOString(),
      temperatures: {
        depth5cm: parseFloat(depth5cm.toFixed(1)),
        depth10cm: parseFloat(depth10cm.toFixed(1)),
        depth20cm: parseFloat(depth20cm.toFixed(1)),
        depth50cm: parseFloat(depth50cm.toFixed(1)),
      },
      recommendation,
      canFertilize,
      canSeed,
    };
  }

  async getSoilTemperature(location?: string): Promise<SoilTemperature> {
    try {
      // In der Zukunft: Echte DWD API Integration
      // Für jetzt: Intelligente Mock-Daten
      return this.getMockSoilTemperature();
    } catch (error) {
      console.warn('Bodentemperatur-Abruf fehlgeschlagen, verwende Fallback:', error);
      return this.getMockSoilTemperature();
    }
  }

  // Hilfsfunktion: Berechne ob Bedingungen gut für Aktivität sind
  checkConditionsForActivity(
    soilTemp: SoilTemperature,
    weather: Weather,
    activity: 'fertilizing' | 'seeding' | 'mowing'
  ): {
    suitable: boolean;
    reason: string;
  } {
    const temp5cm = soilTemp.temperatures.depth5cm;
    const airTemp = weather.current.temp;

    switch (activity) {
      case 'fertilizing':
        if (temp5cm < 10) {
          return {
            suitable: false,
            reason: `Bodentemperatur zu niedrig (${temp5cm}°C). Mindestens 10°C erforderlich.`,
          };
        }
        if (airTemp < 8) {
          return {
            suitable: false,
            reason: `Lufttemperatur zu niedrig (${airTemp}°C). Warten Sie auf wärmeres Wetter.`,
          };
        }
        return {
          suitable: true,
          reason: 'Optimale Bedingungen für Düngung!',
        };

      case 'seeding':
        if (temp5cm < 8 || temp5cm > 25) {
          return {
            suitable: false,
            reason: `Bodentemperatur nicht optimal (${temp5cm}°C). Ideal: 8-25°C.`,
          };
        }
        return {
          suitable: true,
          reason: 'Gute Keimbedingungen!',
        };

      case 'mowing':
        if (temp5cm < 8) {
          return {
            suitable: false,
            reason: 'Rasen wächst noch nicht aktiv.',
          };
        }
        return {
          suitable: true,
          reason: 'Rasen wächst aktiv.',
        };

      default:
        return { suitable: true, reason: '' };
    }
  }

  // Hilfsfunktion: Icon basierend auf Temperatur
  getTemperatureIcon(temperature: number): string {
    if (temperature < 5) return '❄️';
    if (temperature < 10) return '🌡️';
    if (temperature < 15) return '🌱';
    if (temperature < 20) return '🌿';
    return '☀️';
  }

  // Hilfsfunktion: Farbe basierend auf Temperatur
  getTemperatureColor(temperature: number): string {
    if (temperature < 8) return 'text-blue-600';
    if (temperature < 10) return 'text-cyan-600';
    if (temperature < 15) return 'text-green-600';
    if (temperature < 20) return 'text-emerald-600';
    return 'text-orange-600';
  }
}

export const soilTemperatureService = new SoilTemperatureService();
