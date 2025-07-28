'use client';

import React, { useState } from 'react';
import { Calculator as CalcIcon, Droplets, Sprout } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { FERTILIZER_DEFAULTS, SEED_DEFAULTS } from '@/lib/constants';

export const Calculator: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<'fertilizer' | 'seeds'>('fertilizer');
  
  // Fertilizer Calculator State
  const [fertilizerData, setFertilizerData] = useState({
    plant: '',
    area: '',
    customRate: '',
  });

  // Seeds Calculator State
  const [seedsData, setSeedsData] = useState({
    plant: '',
    area: '',
    customRate: '',
  });

  const plantOptions = [
    { value: '', label: 'Pflanze auswählen' },
    { value: 'Rasen', label: 'Rasen' },
    { value: 'Gemüse', label: 'Gemüse' },
    { value: 'Blumen', label: 'Blumen' },
    { value: 'Obstbäume', label: 'Obstbäume' },
    { value: 'Sträucher', label: 'Sträucher' },
    { value: 'Rosen', label: 'Rosen' },
    { value: 'Tomaten', label: 'Tomaten' },
    { value: 'Gurken', label: 'Gurken' },
    { value: 'Kartoffeln', label: 'Kartoffeln' },
  ];

  const seedPlantOptions = [
    { value: '', label: 'Pflanze auswählen' },
    { value: 'Rasen', label: 'Rasen' },
    { value: 'Karotten', label: 'Karotten' },
    { value: 'Radieschen', label: 'Radieschen' },
    { value: 'Salat', label: 'Salat' },
    { value: 'Spinat', label: 'Spinat' },
    { value: 'Bohnen', label: 'Bohnen' },
    { value: 'Erbsen', label: 'Erbsen' },
    { value: 'Petersilie', label: 'Petersilie' },
    { value: 'Basilikum', label: 'Basilikum' },
    { value: 'Schnittlauch', label: 'Schnittlauch' },
  ];

  const calculateFertilizerAmount = () => {
    const area = parseFloat(fertilizerData.area);
    const customRate = parseFloat(fertilizerData.customRate);
    const defaultRate = FERTILIZER_DEFAULTS[fertilizerData.plant];

    if (!area || area <= 0) return 0;
    
    const rate = customRate || defaultRate || 25;
    return Math.round(area * rate);
  };

  const calculateSeedsAmount = () => {
    const area = parseFloat(seedsData.area);
    const customRate = parseFloat(seedsData.customRate);
    const defaultRate = SEED_DEFAULTS[seedsData.plant];

    if (!area || area <= 0) return 0;
    
    const rate = customRate || defaultRate || 1;
    return Math.round(area * rate * 10) / 10; // Round to 1 decimal
  };

  const getFertilizerRecommendations = () => {
    if (!fertilizerData.plant) return [];

    const recommendations = [];
    const plant = fertilizerData.plant;

    if (plant === 'Rasen') {
      recommendations.push('ProNatura Frühjahr: März-Mai und Juli');
      recommendations.push('ProNatura Herbst: Mai-Juni und September-November');
      recommendations.push('Nie bei Temperaturen unter 10°C düngen');
      recommendations.push('Am besten vor Regentagen ausbringen');
    } else if (plant === 'Gemüse') {
      recommendations.push('Organische Dünger bevorzugen');
      recommendations.push('In der Hauptwachstumszeit alle 2-3 Wochen');
      recommendations.push('Vor der Blüte stickstoffbetont düngen');
    } else if (plant === 'Tomaten') {
      recommendations.push('Kaliumreiche Dünger für bessere Fruchtbildung');
      recommendations.push('Regelmäßig alle 2 Wochen in der Wachstumszeit');
      recommendations.push('Nicht zu viel Stickstoff - fördert nur Blattmasse');
    }

    return recommendations;
  };

  const getSeedRecommendations = () => {
    if (!seedsData.plant) return [];

    const recommendations = [];
    const plant = seedsData.plant;

    if (plant === 'Rasen') {
      recommendations.push('Beste Saatzeit: Mai und September');
      recommendations.push('Boden vorher lockern und planieren');
      recommendations.push('Nach der Aussaat gut wässern und feucht halten');
      recommendations.push('Erste 4 Wochen nicht betreten');
    } else if (plant === 'Karotten') {
      recommendations.push('Direktsaat von März bis Juli');
      recommendations.push('Lockeren, sandigen Boden bevorzugen');
      recommendations.push('Reihenabstand: 25-30cm');
    } else if (plant === 'Salat') {
      recommendations.push('Aussaat von März bis September möglich');
      recommendations.push('Halbschatten wird gut vertragen');
      recommendations.push('Nur oberflächlich mit Erde bedecken');
    }

    return recommendations;
  };

  return (
    <div className="space-y-6">
      {/* Calculator Toggle */}
      <Card>
        <div className="flex space-x-2">
          <Button
            variant={activeCalculator === 'fertilizer' ? 'primary' : 'secondary'}
            onClick={() => setActiveCalculator('fertilizer')}
            className="flex items-center"
          >
            <Droplets className="w-4 h-4 mr-2" />
            Dünger-Rechner
          </Button>
          <Button
            variant={activeCalculator === 'seeds' ? 'primary' : 'secondary'}
            onClick={() => setActiveCalculator('seeds')}
            className="flex items-center"
          >
            <Sprout className="w-4 h-4 mr-2" />
            Saat-Rechner
          </Button>
        </div>
      </Card>

      {/* Fertilizer Calculator */}
      {activeCalculator === 'fertilizer' && (
        <div className="space-y-4">
          <Card title="Dünger-Rechner" subtitle="Berechnen Sie die optimale Düngermenge">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Pflanze"
                  value={fertilizerData.plant}
                  onChange={(e) => setFertilizerData(prev => ({ ...prev, plant: e.target.value }))}
                  options={plantOptions}
                />
                
                <Input
                  type="number"
                  label="Fläche (m²)"
                  value={fertilizerData.area}
                  onChange={(e) => setFertilizerData(prev => ({ ...prev, area: e.target.value }))}
                  placeholder="z.B. 50"
                  min="0"
                  step="0.1"
                />
              </div>

              <Input
                type="number"
                label="Eigene Dosierung (g/m²) - optional"
                value={fertilizerData.customRate}
                onChange={(e) => setFertilizerData(prev => ({ ...prev, customRate: e.target.value }))}
                placeholder={fertilizerData.plant ? `Standard: ${FERTILIZER_DEFAULTS[fertilizerData.plant] || 25}g/m²` : ''}
                min="0"
                step="1"
                helperText="Lassen Sie leer für Standardwerte"
              />

              {/* Results */}
              {fertilizerData.plant && fertilizerData.area && (
                <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <CalcIcon className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-primary-800">Berechnungsergebnis</h3>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary-600">
                      {calculateFertilizerAmount()}g
                    </p>
                    <p className="text-sm text-primary-700 mt-1">
                      Gesamtmenge für {fertilizerData.area}m² {fertilizerData.plant}
                    </p>
                    <p className="text-xs text-primary-600 mt-2">
                      Dosierung: {fertilizerData.customRate || FERTILIZER_DEFAULTS[fertilizerData.plant] || 25}g/m²
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Fertilizer Recommendations */}
          {fertilizerData.plant && (
            <Card title="Dünge-Empfehlungen" subtitle={`Für ${fertilizerData.plant}`}>
              <div className="space-y-2">
                {getFertilizerRecommendations().map((tip, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Seeds Calculator */}
      {activeCalculator === 'seeds' && (
        <div className="space-y-4">
          <Card title="Saat-Rechner" subtitle="Berechnen Sie die optimale Saatmenge">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Pflanze"
                  value={seedsData.plant}
                  onChange={(e) => setSeedsData(prev => ({ ...prev, plant: e.target.value }))}
                  options={seedPlantOptions}
                />
                
                <Input
                  type="number"
                  label="Fläche (m²)"
                  value={seedsData.area}
                  onChange={(e) => setSeedsData(prev => ({ ...prev, area: e.target.value }))}
                  placeholder="z.B. 10"
                  min="0"
                  step="0.1"
                />
              </div>

              <Input
                type="number"
                label="Eigene Dosierung (g/m²) - optional"
                value={seedsData.customRate}
                onChange={(e) => setSeedsData(prev => ({ ...prev, customRate: e.target.value }))}
                placeholder={seedsData.plant ? `Standard: ${SEED_DEFAULTS[seedsData.plant] || 1}g/m²` : ''}
                min="0"
                step="0.1"
                helperText="Lassen Sie leer für Standardwerte"
              />

              {/* Results */}
              {seedsData.plant && seedsData.area && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <Sprout className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">Berechnungsergebnis</h3>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {calculateSeedsAmount()}g
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Saatgut für {seedsData.area}m² {seedsData.plant}
                    </p>
                    <p className="text-xs text-green-600 mt-2">
                      Dosierung: {seedsData.customRate || SEED_DEFAULTS[seedsData.plant] || 1}g/m²
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Seeds Recommendations */}
          {seedsData.plant && (
            <Card title="Aussaat-Empfehlungen" subtitle={`Für ${seedsData.plant}`}>
              <div className="space-y-2">
                {getSeedRecommendations().map((tip, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Quick Reference */}
      <Card title="Richtwerte Übersicht">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Droplets className="w-4 h-4 mr-2 text-blue-500" />
              Dünger (g/m²)
            </h4>
            <div className="space-y-1 text-sm">
              {Object.entries(FERTILIZER_DEFAULTS).map(([plant, amount]) => (
                <div key={plant} className="flex justify-between">
                  <span className="text-gray-600">{plant}:</span>
                  <span className="font-medium">{amount}g/m²</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Sprout className="w-4 h-4 mr-2 text-green-500" />
              Saatgut (g/m²)
            </h4>
            <div className="space-y-1 text-sm">
              {Object.entries(SEED_DEFAULTS).map(([plant, amount]) => (
                <div key={plant} className="flex justify-between">
                  <span className="text-gray-600">{plant}:</span>
                  <span className="font-medium">{amount}g/m²</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};