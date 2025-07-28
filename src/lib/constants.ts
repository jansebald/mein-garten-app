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
  DEFAULT_CITY: 'Happurg',
  DEFAULT_LAT: 49.5181,
  DEFAULT_LON: 11.5167
};

export const COMMON_LOCATIONS = [
  { name: 'Happurg', lat: 49.5181, lon: 11.5167, state: 'Bayern' },
  { name: 'Kulmbach', lat: 50.1047, lon: 11.3563, state: 'Bayern' },
  { name: 'Nürnberg', lat: 49.4521, lon: 11.0767, state: 'Bayern' },
  { name: 'Bamberg', lat: 49.8988, lon: 10.9027, state: 'Bayern' },
  { name: 'Erlangen', lat: 49.5897, lon: 11.0040, state: 'Bayern' },
  { name: 'Fürth', lat: 49.4771, lon: 10.9906, state: 'Bayern' },
  { name: 'Bayreuth', lat: 49.9429, lon: 11.5764, state: 'Bayern' },
  { name: 'München', lat: 48.1351, lon: 11.5820, state: 'Bayern' },
  { name: 'Berlin', lat: 52.5200, lon: 13.4050, state: 'Berlin' },
  { name: 'Hamburg', lat: 53.5511, lon: 9.9937, state: 'Hamburg' },
];