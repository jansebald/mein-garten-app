'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, Check, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { locationService, LocationData } from '@/lib/location';
import { storage } from '@/lib/storage';
import { COMMON_LOCATIONS } from '@/lib/constants';

interface LocationSettingsProps {
  onLocationUpdate?: (location: LocationData) => void;
}

export const LocationSettings: React.FC<LocationSettingsProps> = ({ onLocationUpdate }) => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ name: string; lat: number; lon: number; state?: string }>>([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(storage.getUserSettings());

  useEffect(() => {
    loadCurrentLocation();
  }, []);

  const loadCurrentLocation = async () => {
    const location = locationService.getCurrentLocationSettings();
    setCurrentLocation(location);
  };

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const result = await locationService.requestLocationPermission();
      if (result.granted && result.location) {
        setCurrentLocation(result.location);
        onLocationUpdate?.(result.location);
      } else {
        alert('Standort-Berechtigung wurde verweigert oder ist nicht verfügbar.');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      alert('Fehler beim Abrufen des Standorts.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length >= 2) {
      const results = locationService.searchCities(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleLocationSelect = async (location: { name: string; lat: number; lon: number; state?: string }) => {
    const locationData: LocationData = {
      lat: location.lat,
      lon: location.lon,
      city: location.name,
      state: location.state,
    };
    
    locationService.updateLocationSettings(locationData, false);
    setCurrentLocation(locationData);
    setSearchQuery('');
    setSearchResults([]);
    onLocationUpdate?.(locationData);
  };

  const handleManualLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const location = await locationService.getCoordinatesFromCity(searchQuery.trim());
      if (location) {
        locationService.updateLocationSettings(location, false);
        setCurrentLocation(location);
        setSearchQuery('');
        setSearchResults([]);
        onLocationUpdate?.(location);
      } else {
        alert('Ort nicht gefunden. Bitte versuchen Sie einen anderen Namen.');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      alert('Fehler bei der Ortssuche.');
    }
  };

  const toggleGPSMode = () => {
    const newUseGPS = !settings.useGPS;
    const newSettings = { ...settings, useGPS: newUseGPS };
    
    storage.updateUserSettings({ useGPS: newUseGPS });
    setSettings(newSettings);
    
    if (newUseGPS) {
      handleGetCurrentLocation();
    }
  };

  return (
    <div className="space-y-4">
      <Card title="Standort-Einstellungen">
        {/* Current Location Display */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-primary-600" />
            <div>
              <p className="font-medium text-gray-900">
                {currentLocation?.city || 'Unbekannt'}
              </p>
              <p className="text-sm text-gray-500">
                {currentLocation?.lat.toFixed(4)}, {currentLocation?.lon.toFixed(4)}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowSettings(!showSettings)}
          >
            Ändern
          </Button>
        </div>

        {showSettings && (
          <div className="space-y-4">
            {/* GPS Toggle */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Navigation className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">GPS verwenden</p>
                  <p className="text-sm text-gray-500">Automatischer Standort</p>
                </div>
              </div>
              <button
                onClick={toggleGPSMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  settings.useGPS ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.useGPS ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* GPS Button */}
            {!settings.useGPS && (
              <Button
                onClick={handleGetCurrentLocation}
                disabled={isGettingLocation}
                variant="secondary"
                className="w-full flex items-center justify-center"
              >
                <Navigation className="w-4 h-4 mr-2" />
                {isGettingLocation ? 'Standort wird ermittelt...' : 'Aktuellen Standort verwenden'}
              </Button>
            )}

            {/* Manual Location Search */}
            {!settings.useGPS && (
              <div className="space-y-3">
                <form onSubmit={handleManualLocationSubmit}>
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Stadt eingeben (z.B. Happurg, Nürnberg...)"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="flex-1"
                    />
                    <Button type="submit" size="sm">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </form>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="border rounded-lg max-h-60 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => handleLocationSelect(result)}
                        className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{result.name}</p>
                          {result.state && (
                            <p className="text-sm text-gray-500">{result.state}</p>
                          )}
                        </div>
                        <MapPin className="w-4 h-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Common Locations */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Häufige Orte:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {COMMON_LOCATIONS.slice(0, 6).map((location, index) => (
                      <button
                        key={index}
                        onClick={() => handleLocationSelect(location)}
                        className="text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border"
                      >
                        <div className="font-medium">{location.name}</div>
                        <div className="text-xs text-gray-500">{location.state}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowSettings(false)}
              >
                <X className="w-4 h-4 mr-1" />
                Schließen
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};