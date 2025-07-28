'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { storage } from '@/lib/storage';
import { FERTILIZER_DEFAULTS } from '@/lib/constants';

interface FertilizerFormProps {
  onSuccess?: () => void;
}

export const FertilizerForm: React.FC<FertilizerFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    plant: '',
    area: '',
    amount: '',
    fertilizer: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const fertilizerOptions = [
    { value: '', label: 'Düngertyp auswählen' },
    { value: 'ProNatura Frühjahr', label: 'ProNatura Frühjahr' },
    { value: 'ProNatura Herbst', label: 'ProNatura Herbst' },
    { value: 'Universaldünger', label: 'Universaldünger' },
    { value: 'Rasendünger', label: 'Rasendünger' },
    { value: 'Gemüsedünger', label: 'Gemüsedünger' },
    { value: 'Kompost', label: 'Kompost' },
    { value: 'Hornspäne', label: 'Hornspäne' },
  ];

  const handlePlantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const plant = e.target.value;
    setFormData(prev => ({
      ...prev,
      plant,
      amount: plant && FERTILIZER_DEFAULTS[plant] 
        ? (FERTILIZER_DEFAULTS[plant] * (parseFloat(prev.area) || 1)).toString()
        : prev.amount
    }));
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const area = e.target.value;
    setFormData(prev => ({
      ...prev,
      area,
      amount: prev.plant && FERTILIZER_DEFAULTS[prev.plant] 
        ? (FERTILIZER_DEFAULTS[prev.plant] * (parseFloat(area) || 1)).toString()
        : prev.amount
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.plant) newErrors.plant = 'Pflanze ist erforderlich';
    if (!formData.area) newErrors.area = 'Fläche ist erforderlich';
    if (!formData.amount) newErrors.amount = 'Menge ist erforderlich';
    if (!formData.date) newErrors.date = 'Datum ist erforderlich';

    if (formData.area && parseFloat(formData.area) <= 0) {
      newErrors.area = 'Fläche muss größer als 0 sein';
    }

    if (formData.amount && parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Menge muss größer als 0 sein';
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
        type: 'fertilizer',
        date: formData.date,
        plant: formData.plant,
        area: parseFloat(formData.area),
        amount: parseFloat(formData.amount),
        fertilizer: formData.fertilizer || undefined,
        notes: formData.notes || undefined,
      });

      // Reset form
      setFormData({
        plant: '',
        area: '',
        amount: '',
        fertilizer: '',
        notes: '',
        date: new Date().toISOString().split('T')[0],
      });

      setErrors({});
      onSuccess?.();
    } catch (error) {
      console.error('Failed to add fertilizer entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title="Düngung eintragen">
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
            label="Pflanze/Bereich"
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
            placeholder="z.B. 50"
            min="0"
            step="0.1"
            error={errors.area}
          />
          
          <Input
            type="number"
            label="Menge (g)"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            placeholder="z.B. 1250"
            min="0"
            step="1"
            error={errors.amount}
            helperText={formData.plant && formData.area ? 
              `Empfohlen: ${FERTILIZER_DEFAULTS[formData.plant] || 25}g/m²` : undefined}
          />
        </div>

        <Select
          label="Düngertyp (optional)"
          value={formData.fertilizer}
          onChange={(e) => setFormData(prev => ({ ...prev, fertilizer: e.target.value }))}
          options={fertilizerOptions}
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
            placeholder="z.B. Nach dem Regen gedüngt, gleichmäßig verteilt..."
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
              <Plus className="w-4 h-4 mr-2" />
              Düngung eintragen
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};