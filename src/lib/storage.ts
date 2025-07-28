import { GardenEntry } from '@/types/garden';

const STORAGE_KEYS = {
  GARDEN_ENTRIES: 'mein-garten-entries',
  USER_SETTINGS: 'mein-garten-settings',
  WEATHER_CACHE: 'mein-garten-weather',
} as const;

export interface UserSettings {
  lawnArea: number; // m²
  lawnType: string;
  reminderEnabled: boolean;
  weatherLocation: string;
}

class StorageManager {
  private isClient = typeof window !== 'undefined';

  private getItem<T>(key: string, defaultValue: T): T {
    if (!this.isClient) return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (!this.isClient) return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  // Garden Entries
  getGardenEntries(): GardenEntry[] {
    return this.getItem(STORAGE_KEYS.GARDEN_ENTRIES, []);
  }

  addGardenEntry(entry: Omit<GardenEntry, 'id' | 'timestamp'>): GardenEntry {
    const newEntry: GardenEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    const entries = this.getGardenEntries();
    entries.push(newEntry);
    entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    this.setItem(STORAGE_KEYS.GARDEN_ENTRIES, entries);
    return newEntry;
  }

  updateGardenEntry(id: string, updates: Partial<GardenEntry>): boolean {
    const entries = this.getGardenEntries();
    const index = entries.findIndex(entry => entry.id === id);
    
    if (index === -1) return false;
    
    entries[index] = { ...entries[index], ...updates };
    this.setItem(STORAGE_KEYS.GARDEN_ENTRIES, entries);
    return true;
  }

  deleteGardenEntry(id: string): boolean {
    const entries = this.getGardenEntries();
    const filteredEntries = entries.filter(entry => entry.id !== id);
    
    if (filteredEntries.length === entries.length) return false;
    
    this.setItem(STORAGE_KEYS.GARDEN_ENTRIES, filteredEntries);
    return true;
  }

  getEntriesByType(type: GardenEntry['type']): GardenEntry[] {
    return this.getGardenEntries().filter(entry => entry.type === type);
  }

  getRecentEntries(limit: number = 5): GardenEntry[] {
    return this.getGardenEntries().slice(0, limit);
  }

  getEntriesInDateRange(startDate: string, endDate: string): GardenEntry[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.getGardenEntries().filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= start && entryDate <= end;
    });
  }

  // Statistics
  getStatistics() {
    const entries = this.getGardenEntries();
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentEntries = entries.filter(entry => new Date(entry.timestamp) >= thirtyDaysAgo);
    const weeklyEntries = entries.filter(entry => new Date(entry.timestamp) >= sevenDaysAgo);

    const typeStats = entries.reduce((acc, entry) => {
      acc[entry.type] = (acc[entry.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const lastFertilizer = entries
      .filter(entry => entry.type === 'fertilizer')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    const lastMowing = entries
      .filter(entry => entry.type === 'mowing')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    return {
      totalEntries: entries.length,
      recentEntries: recentEntries.length,
      weeklyEntries: weeklyEntries.length,
      typeStats,
      lastFertilizer: lastFertilizer?.date,
      lastMowing: lastMowing?.date,
      daysSinceLastFertilizer: lastFertilizer 
        ? Math.floor((now.getTime() - new Date(lastFertilizer.date).getTime()) / (24 * 60 * 60 * 1000))
        : null,
      daysSinceLastMowing: lastMowing
        ? Math.floor((now.getTime() - new Date(lastMowing.date).getTime()) / (24 * 60 * 60 * 1000))
        : null,
    };
  }

  // User Settings
  getUserSettings(): UserSettings {
    return this.getItem(STORAGE_KEYS.USER_SETTINGS, {
      lawnArea: 0,
      lawnType: 'sportrasen',
      reminderEnabled: true,
      weatherLocation: 'Kulmbach',
    });
  }

  updateUserSettings(settings: Partial<UserSettings>): void {
    const currentSettings = this.getUserSettings();
    this.setItem(STORAGE_KEYS.USER_SETTINGS, { ...currentSettings, ...settings });
  }

  // Weather Cache
  cacheWeatherData(data: any): void {
    const cacheData = {
      data,
      timestamp: Date.now(),
      expiresIn: 10 * 60 * 1000, // 10 minutes
    };
    this.setItem(STORAGE_KEYS.WEATHER_CACHE, cacheData);
  }

  getCachedWeatherData(): any | null {
    const cached = this.getItem<any>(STORAGE_KEYS.WEATHER_CACHE, null);
    if (!cached || !cached.timestamp || !cached.expiresIn) return null;

    const isExpired = Date.now() - cached.timestamp > cached.expiresIn;
    if (isExpired) {
      this.clearWeatherCache();
      return null;
    }

    return cached.data;
  }

  clearWeatherCache(): void {
    if (this.isClient) {
      localStorage.removeItem(STORAGE_KEYS.WEATHER_CACHE);
    }
  }

  // Export/Import
  exportData(): string {
    const data = {
      entries: this.getGardenEntries(),
      settings: this.getUserSettings(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      
      if (!data.entries || !Array.isArray(data.entries)) {
        throw new Error('Ungültiges Datenformat');
      }

      // Validate entries
      const validEntries = data.entries.filter((entry: any) => 
        entry.id && entry.type && entry.date && entry.plant
      );

      if (validEntries.length === 0) {
        throw new Error('Keine gültigen Einträge gefunden');
      }

      this.setItem(STORAGE_KEYS.GARDEN_ENTRIES, validEntries);
      
      if (data.settings) {
        this.setItem(STORAGE_KEYS.USER_SETTINGS, data.settings);
      }

      return {
        success: true,
        message: `${validEntries.length} Einträge erfolgreich importiert`
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Import fehlgeschlagen'
      };
    }
  }

  // Clear all data
  clearAllData(): void {
    if (!this.isClient) return;
    
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const storage = new StorageManager();