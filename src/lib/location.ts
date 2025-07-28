import { storage } from './storage';
import { WEATHER_CONFIG, COMMON_LOCATIONS } from './constants';

export interface LocationData {
  lat: number;
  lon: number;
  city: string;
  country?: string;
  state?: string;
}

class LocationService {
  
  // Get current location from GPS
  async getCurrentLocation(): Promise<LocationData | null> {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported');
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          try {
            // Reverse geocoding to get city name
            const cityName = await this.getCityFromCoordinates(lat, lon);
            resolve({
              lat,
              lon,
              city: cityName || 'Aktueller Standort',
            });
          } catch (error) {
            resolve({
              lat,
              lon,
              city: 'Aktueller Standort',
            });
          }
        },
        (error) => {
          console.warn('Geolocation error:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  // Get city name from coordinates using OpenWeatherMap
  private async getCityFromCoordinates(lat: number, lon: number): Promise<string | null> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_CONFIG.API_KEY}&lang=de`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      return data.name || null;
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return null;
    }
  }

  // Get coordinates from city name
  async getCoordinatesFromCity(cityName: string): Promise<LocationData | null> {
    // First check if it's in our common locations
    const commonLocation = COMMON_LOCATIONS.find(
      loc => loc.name.toLowerCase() === cityName.toLowerCase()
    );
    
    if (commonLocation) {
      return {
        lat: commonLocation.lat,
        lon: commonLocation.lon,
        city: commonLocation.name,
        state: commonLocation.state,
      };
    }

    // Otherwise use OpenWeatherMap geocoding
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)},DE&limit=1&appid=${WEATHER_CONFIG.API_KEY}`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      if (!data.length) return null;
      
      const location = data[0];
      return {
        lat: location.lat,
        lon: location.lon,
        city: location.name,
        country: location.country,
        state: location.state,
      };
    } catch (error) {
      console.warn('Geocoding failed:', error);
      return null;
    }
  }

  // Get current location settings
  getCurrentLocationSettings(): LocationData {
    const settings = storage.getUserSettings();
    
    return {
      lat: settings.locationLat || WEATHER_CONFIG.DEFAULT_LAT,
      lon: settings.locationLon || WEATHER_CONFIG.DEFAULT_LON,
      city: settings.weatherLocation || WEATHER_CONFIG.DEFAULT_CITY,
    };
  }

  // Update location settings
  updateLocationSettings(location: LocationData, useGPS: boolean = false): void {
    storage.updateUserSettings({
      weatherLocation: location.city,
      locationLat: location.lat,
      locationLon: location.lon,
      useGPS,
    });
  }

  // Request location permission and get current location
  async requestLocationPermission(): Promise<{ granted: boolean; location?: LocationData }> {
    if (!navigator.geolocation) {
      return { granted: false };
    }

    try {
      const location = await this.getCurrentLocation();
      if (location) {
        this.updateLocationSettings(location, true);
        return { granted: true, location };
      }
      return { granted: false };
    } catch (error) {
      return { granted: false };
    }
  }

  // Get location for weather API (respects user preferences)
  async getLocationForWeather(): Promise<LocationData> {
    const settings = storage.getUserSettings();
    
    // If GPS is enabled and permission granted, try to get current location
    if (settings.useGPS) {
      const currentLocation = await this.getCurrentLocation();
      if (currentLocation) {
        // Update settings with fresh GPS data
        this.updateLocationSettings(currentLocation, true);
        return currentLocation;
      }
    }
    
    // Fallback to saved location
    return this.getCurrentLocationSettings();
  }

  // Search for cities (for autocomplete)
  searchCities(query: string): Array<{ name: string; lat: number; lon: number; state?: string }> {
    if (query.length < 2) return [];
    
    const lowerQuery = query.toLowerCase();
    return COMMON_LOCATIONS.filter(location =>
      location.name.toLowerCase().includes(lowerQuery) ||
      location.state.toLowerCase().includes(lowerQuery)
    ).slice(0, 8); // Limit to 8 results
  }
}

export const locationService = new LocationService();