'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { Navigation } from '@/components/ui/Navigation';
import { WeatherCard } from '@/components/cards/WeatherCard';
import { ActivityOverview } from '@/components/cards/ActivityOverview';
import { PerfectGreenCalendar } from '@/components/cards/PerfectGreenCalendar';
import { Calculator } from '@/components/cards/Calculator';
import { LocationSettings } from '@/components/cards/LocationSettings';
import { NotificationSettings } from '@/components/cards/NotificationSettings';
import { WeatherCheck } from '@/components/cards/WeatherCheck';
import { SoilTemperatureCard } from '@/components/cards/SoilTemperatureCard';
import { FertilizerForm } from '@/components/forms/FertilizerForm';
import { SeedingForm } from '@/components/forms/SeedingForm';
import { EntryList } from '@/components/forms/EntryList';
import { Button } from '@/components/ui/Button';
import { weatherService } from '@/lib/weather';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <WeatherCard />
      <SoilTemperatureCard />
      <WeatherCheck />
      <ActivityOverview />
      <PerfectGreenCalendar />
    </div>
  );
};

const GardenDiary: React.FC = () => {
  const [activeForm, setActiveForm] = useState<'list' | 'fertilizer' | 'seeding'>('list');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFormSuccess = () => {
    setActiveForm('list');
    setRefreshTrigger(prev => prev + 1);
    // Trigger storage event for components listening to changes
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="space-y-6">
      {activeForm === 'list' && (
        <>
          <div className="flex space-x-3">
            <Button
              onClick={() => setActiveForm('fertilizer')}
              className="flex items-center flex-1"
            >
              <Plus className="w-4 h-4 mr-2" />
              Düngung
            </Button>
            <Button
              onClick={() => setActiveForm('seeding')}
              variant="secondary"
              className="flex items-center flex-1"
            >
              <Plus className="w-4 h-4 mr-2" />
              Aussaat
            </Button>
          </div>
          <EntryList key={refreshTrigger} />
        </>
      )}
      
      {activeForm === 'fertilizer' && (
        <>
          <Button
            onClick={() => setActiveForm('list')}
            variant="secondary"
            size="sm"
          >
            ← Zurück zur Übersicht
          </Button>
          <FertilizerForm onSuccess={handleFormSuccess} />
        </>
      )}
      
      {activeForm === 'seeding' && (
        <>
          <Button
            onClick={() => setActiveForm('list')}
            variant="secondary"
            size="sm"
          >
            ← Zurück zur Übersicht
          </Button>
          <SeedingForm onSuccess={handleFormSuccess} />
        </>
      )}
    </div>
  );
};

const WeatherPage: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLocationUpdate = () => {
    // Force weather card to refresh when location changes
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <LocationSettings onLocationUpdate={handleLocationUpdate} />
      <WeatherCard key={refreshTrigger} />
      <PerfectGreenCalendar />
    </div>
  );
};

const CalculatorPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <Calculator />
    </div>
  );
};

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <NotificationSettings />
    </div>
  );
};

export default function Home() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [headerLocation, setHeaderLocation] = useState('Happurg');
  
  useEffect(() => {
    const loadHeaderLocation = async () => {
      try {
        const location = await weatherService.getCurrentLocation();
        setHeaderLocation(location.city);
      } catch (error) {
        console.error('Failed to load header location:', error);
      }
    };
    
    loadHeaderLocation();
  }, []);
  
  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tagebuch':
        return <GardenDiary />;
      case 'wetter':
        return <WeatherPage />;
      case 'rechner':
        return <CalculatorPage />;
      case 'einstellungen':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Native iOS-style Header */}
      <header className="flex-shrink-0 pt-safe">
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Mein Garten
                </h1>
                <div className="flex items-center text-sm text-gray-500 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  {headerLocation}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with native scroll */}
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="px-4 py-6 pb-24 space-y-4 animate-fade-in">
          {renderContent()}
        </div>
      </main>

      {/* Native Bottom Navigation */}
      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}