'use client';

import React, { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { Navigation } from '@/components/ui/Navigation';
import { WeatherCard } from '@/components/cards/WeatherCard';
import { ActivityOverview } from '@/components/cards/ActivityOverview';
import { PerfectGreenCalendar } from '@/components/cards/PerfectGreenCalendar';
import { Calculator } from '@/components/cards/Calculator';
import { FertilizerForm } from '@/components/forms/FertilizerForm';
import { SeedingForm } from '@/components/forms/SeedingForm';
import { EntryList } from '@/components/forms/EntryList';
import { Button } from '@/components/ui/Button';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <WeatherCard />
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
  return (
    <div className="space-y-6">
      <WeatherCard />
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

export default function Home() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  
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
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-primary-500 text-white shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Mein Garten</h1>
            <div className="flex items-center text-sm opacity-90">
              <MapPin className="w-4 h-4 mr-1" />
              Kulmbach
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20">
        {renderContent()}
      </main>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0">
        <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
      </div>
    </div>
  );
}