export interface GardenEntry {
  id: string;
  type: 'fertilizer' | 'seeding' | 'mowing' | 'watering' | 'maintenance';
  date: string;
  timestamp: string;
  plant: string;
  amount?: number; // für Dünger in Gramm
  seeds?: number;  // für Aussaat
  area?: number;   // in m²
  fertilizer?: string; // ProNatura Frühjahr/Herbst
  variety?: string;
  notes?: string;
  // Mähroboter spezifisch
  mowingHours?: number;
  bladeChange?: boolean;
  cuttingHeight?: number; // 25-50mm
}

export interface RasenpflegePlan {
  month: string;
  duengen: boolean;
  maehen: boolean;
  laufzeitProWoche: string;
  klingenwechselProMonat: number;
  waessern: boolean;
  lueften: boolean;
  nachsaeen: boolean;
  duengerTyp?: 'ProNatura Frühjahr' | 'ProNatura Herbst';
  duengerMenge?: number; // g/m²
}

export interface Weather {
  current: {
    temp: number;
    condition: string;
    humidity: number;
    precipitation: number;
    description: string;
  };
  forecast: Array<{
    day: string;
    temp_high: number;
    temp_low: number;
    rain: number;
    condition: string;
    description: string;
  }>;
}

export interface PerfectGreenSchedule {
  week: number;
  month: string;
  fertilizer: 'ProNatura Frühjahr' | 'ProNatura Herbst';
  amount: number; // g/m²
  description: string;
}

export interface RasentypenConfig {
  [key: string]: {
    name: string;
    pflegeaufwand: 'gering' | 'mittel' | 'hoch';
    wasserbedarf: 'gering' | 'mittel' | 'hoch';
    belastbarkeit: 'gering' | 'mittel' | 'hoch' | 'sehr hoch';
    eigenschaften: string[];
  };
}

export interface FertilizerDefaults {
  [key: string]: number; // g/m²
}

export interface SeedDefaults {
  [key: string]: number; // g/m²
}