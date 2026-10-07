'use client';

import { useState, useEffect } from 'react';
import { X, Building2, DollarSign, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { Resource, ResourceCategory, BookingMode } from '@/lib/types';

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  resource?: Resource | null;
}

export default function ResourceModal({
  isOpen,
  onClose,
  onSuccess,
  resource = null
}: ResourceModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('DOCTOR');
  const [bookingMode, setBookingMode] = useState<BookingMode>('TIME_SLOT');
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(30);
  const [price, setPrice] = useState(100);
  const [priceUnit, setPriceUnit] = useState<'per_slot' | 'per_hour' | 'per_night' | 'per_day'>('per_slot');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (resource) {
      setName(resource.name);
      setCategory(resource.category);
      setBookingMode(resource.bookingMode);
      setSlotDurationMinutes(resource.slotDurationMinutes || 30);
      setPrice(resource.price || 0);
      setPriceUnit(resource.priceUnit || 'per_slot');
      setDescription(resource.description || '');
      setLocation(resource.location || '');
      setIsActive(resource.isActive);
    } else {
      setName('');
      setCategory('DOCTOR');
      setBookingMode('TIME_SLOT');
      setSlotDurationMinutes(30);
      setPrice(100);
      setPriceUnit('per_slot');
      setDescription('');
      setLocation('');
      setIsActive(true);
    }
  }, [resource, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const payload = {
      name,
      category,
      bookingMode,
      slotDurationMinutes: Number(slotDurationMinutes),
      price: Number(price),
      priceUnit,
      description,
      location,
      isActive
    };

    try {
      const url = resource ? `/api/resources/${resource.id}` : '/api/resources';
      const method = resource ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to save resource');
        setIsSubmitting(false);
        return;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">
              {resource ? 'Edit Resource' : 'Add New Resource'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-600/60 text-rose-200 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Resource Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Sarah Johnson or Tesla Model 3"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ResourceCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="DOCTOR">Doctor Appointment</option>
                <option value="CAR_RENTAL">Car Rental</option>
                <option value="APARTMENT">Apartment / Residence</option>
                <option value="HOTEL">Hotel Suite</option>
                <option value="SALON">Salon / Spa</option>
                <option value="OTHER">Other Resource</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Booking Mode
              </label>
              <select
                value={bookingMode}
                onChange={e => {
                  const mode = e.target.value as BookingMode;
                  setBookingMode(mode);
                  setPriceUnit(mode === 'TIME_SLOT' ? 'per_slot' : 'per_day');
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="TIME_SLOT">Time Slot (e.g., 10:00 - 10:30)</option>
                <option value="DATE_RANGE">Date Range (e.g., Aug 15 - Aug 20)</option>
              </select>
            </div>
          </div>

          {bookingMode === 'TIME_SLOT' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Slot Duration (Minutes)
              </label>
              <input
                type="number"
                min={5}
                max={480}
                step={5}
                value={slotDurationMinutes}
                onChange={e => setSlotDurationMinutes(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                Price ($)
              </label>
              <input
                type="number"
                min={0}
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Price Unit
              </label>
              <select
                value={priceUnit}
                onChange={e => setPriceUnit(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="per_slot">per slot</option>
                <option value="per_hour">per hour</option>
                <option value="per_day">per day</option>
                <option value="per_night">per night</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              Location / Address
            </label>
            <input
              type="text"
              placeholder="e.g. Medical Suite 405 or Downtown Hub"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief description of the service or resource..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded accent-indigo-600 bg-slate-800 border-slate-700"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-300 cursor-pointer">
              Resource is Active & Available for Booking
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{resource ? 'Save Changes' : 'Create Resource'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
