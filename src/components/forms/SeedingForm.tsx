'use client';

import React, { useState } from 'react';
import { Sprout } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { storage } from '@/lib/storage';
import { SEED_DEFAULTS } from '@/lib/constants';

interface SeedingFormProps {
  onSuccess?: () => void;
}

export const SeedingForm: React.FC<SeedingFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    plant: '',
    area: '',
    seeds: '',
    variety: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const plantOptions = [
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

  const handlePlantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const plant = e.target.value;
    setFormData(prev => ({
      ...prev,
      plant,
      seeds: plant && SEED_DEFAULTS[plant] 
        ? (SEED_DEFAULTS[plant] * (parseFloat(prev.area) || 1)).toString()
        : prev.seeds
    }));
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const area = e.target.value;
    setFormData(prev => ({
      ...prev,
      area,
      seeds: prev.plant && SEED_DEFAULTS[prev.plant] 
        ? (SEED_DEFAULTS[prev.plant] * (parseFloat(area) || 1)).toString()
        : prev.seeds
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.plant) newErrors.plant = 'Pflanze ist erforderlich';
    if (!formData.area) newErrors.area = 'Fläche ist erforderlich';
    if (!formData.seeds) newErrors.seeds = 'Saatmenge ist erforderlich';
    if (!formData.date) newErrors.date = 'Datum ist erforderlich';

    if (formData.area && parseFloat(formData.area) <= 0) {
      newErrors.area = 'Fläche muss größer als 0 sein';
    }

    if (formData.seeds && parseFloat(formData.seeds) <= 0) {
      newErrors.seeds = 'Saatmenge muss größer als 0 sein';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

      storage.addGardenEntry({
        type: 'seeding',
        date: formData.date,
        plant: formData.plant,
        area: parseFloat(formData.area),
        seeds: parseFloat(formData.seeds),
        variety: formData.variety || undefined,
        notes: formData.notes || undefined,
      });

      // Reset form
      setFormData({
        plant: '',
        area: '',
        seeds: '',
        variety: '',
        notes: '',
        date: new Date().toISOString().split('T')[0],
      });

      setErrors({});
      onSuccess?.();
    } catch (error) {
      console.error('Failed to add seeding entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title="Aussaat eintragen">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Datum"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            error={errors.date}
          />
          
          <Select
            label="Pflanze"
            value={formData.plant}
            onChange={handlePlantChange}
            options={plantOptions}
            error={errors.plant}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            label="Fläche (m²)"
            value={formData.area}
            onChange={handleAreaChange}
            placeholder="z.B. 5"
            min="0"
            step="0.1"
            error={errors.area}
          />
          
          <Input
            type="number"
            label="Saatmenge (g)"
            value={formData.seeds}
            onChange={(e) => setFormData(prev => ({ ...prev, seeds: e.target.value }))}
            placeholder="z.B. 25"
            min="0"
            step="0.1"
            error={errors.seeds}
            helperText={formData.plant && formData.area ? 
              `Empfohlen: ${SEED_DEFAULTS[formData.plant] || 1}g/m²` : undefined}
          />
        </div>

        <Input
          type="text"
          label="Sorte (optional)"
          value={formData.variety}
          onChange={(e) => setFormData(prev => ({ ...prev, variety: e.target.value }))}
          placeholder="z.B. Cherry-Tomaten, Eichblatt-Salat..."
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notizen (optional)
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="z.B. In Reihen gesät, 2cm tief, gut gewässert..."
          />
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting}
          className="flex items-center justify-center"
        >
          {isSubmitting ? (
            'Wird gespeichert...'
          ) : (
            <>
              <Sprout className="w-4 h-4 mr-2" />
              Aussaat eintragen
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};