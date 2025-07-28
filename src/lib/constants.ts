import { RasenpflegePlan, PerfectGreenSchedule, RasentypenConfig, FertilizerDefaults, SeedDefaults } from '@/types/garden';

export const PERFECT_GREEN_SCHEDULE: PerfectGreenSchedule[] = [
  // ProNatura Frühjahr
  { week: 1, month: 'März', fertilizer: 'ProNatura Frühjahr', amount: 40, description: 'Startdüngung für kräftiges Wachstum' },
  { week: 2, month: 'März', fertilizer: 'ProNatura Frühjahr', amount: 35, description: 'Nachfolgedüngung' },
  { week: 1, month: 'April', fertilizer: 'ProNatura Frühjahr', amount: 35, description: 'Wachstumsunterstützung' },
  { week: 1, month: 'Mai', fertilizer: 'ProNatura Frühjahr', amount: 30, description: 'Frühjahrsabschluss' },
  { week: 2, month: 'Juli', fertilizer: 'ProNatura Frühjahr', amount: 30, description: 'Sommerdüngung' },
  
  // ProNatura Herbst
  { week: 2, month: 'Mai', fertilizer: 'ProNatura Herbst', amount: 40, description: 'Übergang zur Herbstdüngung' },
  { week: 1, month: 'Juni', fertilizer: 'ProNatura Herbst', amount: 40, description: 'Vorbereitung auf Hitze' },
  { week: 1, month: 'September', fertilizer: 'ProNatura Herbst', amount: 40, description: 'Herbststart' },
  { week: 3, month: 'September', fertilizer: 'ProNatura Herbst', amount: 40, description: 'Herbstverstärkung' },
  { week: 1, month: 'Oktober', fertilizer: 'ProNatura Herbst', amount: 40, description: 'Wintervorbereitung' },
  { week: 1, month: 'November', fertilizer: 'ProNatura Herbst', amount: 20, description: 'Abschlussdüngung' },
];

export const MONTHLY_LAWN_CARE: RasenpflegePlan[] = [
  {
    month: 'März',
    duengen: true,
    maehen: true,
    laufzeitProWoche: '1-2 Tage',
    klingenwechselProMonat: 1,
    waessern: false,
    lueften: false,
    nachsaeen: false,
    duengerTyp: 'ProNatura Frühjahr',
    duengerMenge: 40
  },
  {
    month: 'April',
    duengen: true,
    maehen: true,
    laufzeitProWoche: '3-4 Tage',
    klingenwechselProMonat: 2,
    waessern: false,
    lueften: false,
    nachsaeen: false,
    duengerTyp: 'ProNatura Frühjahr',
    duengerMenge: 35
  },
  {
    month: 'Mai',
    duengen: true,
    maehen: true,
    laufzeitProWoche: '5-7 Tage',
    klingenwechselProMonat: 2,
    waessern: false,
    lueften: true,
    nachsaeen: true,
    duengerTyp: 'ProNatura Frühjahr',
    duengerMenge: 30
  },
  {
    month: 'Juni',
    duengen: true,
    maehen: true,
    laufzeitProWoche: '2-3 Tage',
    klingenwechselProMonat: 2,
    waessern: true,
    lueften: false,
    nachsaeen: false,
    duengerTyp: 'ProNatura Herbst',
    duengerMenge: 40
  },
  {
    month: 'Juli',
    duengen: true,
    maehen: true,
    laufzeitProWoche: '2-3 Tage',
    klingenwechselProMonat: 1,
    waessern: true,
    lueften: false,
    nachsaeen: false,
    duengerTyp: 'ProNatura Frühjahr',
    duengerMenge: 30
  },
  {
    month: 'August',
    duengen: false,
    maehen: true,
    laufzeitProWoche: '3-4 Tage',
    klingenwechselProMonat: 2,
    waessern: true,
    lueften: false,
    nachsaeen: false
  },
  {
    month: 'September',
    duengen: true,
    maehen: true,
    laufzeitProWoche: '5-7 Tage',
    klingenwechselProMonat: 2,
    waessern: false,
    lueften: true,
    nachsaeen: false,
    duengerTyp: 'ProNatura Herbst',
    duengerMenge: 40
  },
  {
    month: 'Oktober',
    duengen: true,
    maehen: true,
    laufzeitProWoche: '3-5 Tage',
    klingenwechselProMonat: 2,
    waessern: false,
    lueften: false,
    nachsaeen: false,
    duengerTyp: 'ProNatura Herbst',
    duengerMenge: 40
  },
  {
    month: 'November',
    duengen: true,
    maehen: true,
    laufzeitProWoche: '2-3 Tage',
    klingenwechselProMonat: 1,
    waessern: false,
    lueften: false,
    nachsaeen: false,
    duengerTyp: 'ProNatura Herbst',
    duengerMenge: 20
  }
];

export const RASENTYPEN: RasentypenConfig = {
  sportrasen: {
    name: 'Sportrasen',
    pflegeaufwand: 'mittel',
    wasserbedarf: 'mittel',
    belastbarkeit: 'hoch',
    eigenschaften: ['Perfekt für Mähroboter', 'Mittlere Pflege', 'Hohe Belastbarkeit']
  },
  trockenrasen: {
    name: 'Trockenrasen',
    pflegeaufwand: 'gering',
    wasserbedarf: 'gering',
    belastbarkeit: 'mittel',
    eigenschaften: ['Geringer Wasserbedarf', 'Hitzebeständig', 'Pflegeleicht']
  },
  schattenrasen: {
    name: 'Schattenrasen',
    pflegeaufwand: 'mittel',
    wasserbedarf: 'mittel',
    belastbarkeit: 'mittel',
    eigenschaften: ['Hohe Schattenverträglichkeit', 'Mittlere Pflege', 'Für schattige Bereiche']
  },
  supina: {
    name: 'Supina Premium',
    pflegeaufwand: 'hoch',
    wasserbedarf: 'hoch',
    belastbarkeit: 'sehr hoch',
    eigenschaften: ['Maximale Belastbarkeit', 'Sehr hoher Pflegeaufwand', 'Premium-Qualität']
  }
};

export const FERTILIZER_DEFAULTS: FertilizerDefaults = {
  'Rasen': 25,
  'Gemüse': 65,
  'Blumen': 40,
  'Obstbäume': 125,
  'Sträucher': 50,
  'Rosen': 60,
  'Tomaten': 80,
  'Gurken': 70,
  'Kartoffeln': 90
};

export const SEED_DEFAULTS: SeedDefaults = {
  'Rasen': 25,
  'Karotten': 1,
  'Radieschen': 2,
  'Salat': 0.5,
  'Spinat': 3,
  'Bohnen': 6,
  'Erbsen': 15,
  'Petersilie': 0.5,
  'Basilikum': 0.3,
  'Schnittlauch': 1
};

export const WEATHER_CONFIG = {
  API_KEY: '56264ccb35096bfc39b5c7d42544283f',
  CITY: 'Kulmbach',
  LAT: 50.1047,
  LON: 11.3563
};