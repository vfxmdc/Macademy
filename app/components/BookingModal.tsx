'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertTriangle, CheckCircle2, User, Building2, Tag, FileText, DollarSign } from 'lucide-react';
import { Resource, Service, Client, Booking, TimeSlot } from '@/lib/types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingBooking?: Booking | null;
  preselectedClientId?: string;
  preselectedResourceId?: string;
  isAdmin?: boolean;
}

export default function BookingModal({
  isOpen,
  onClose,
  onSuccess,
  existingBooking = null,
  preselectedClientId,
  preselectedResourceId,
  isAdmin = true
}: BookingModalProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  // Form states
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedResourceId, setSelectedResourceId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Time slot resource state
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // Date range resource state
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );

  const [notes, setNotes] = useState<string>('');
  const [status, setStatus] = useState<'CONFIRMED' | 'CANCELLED' | 'PENDING'>('CONFIRMED');
  const [price, setPrice] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch reference data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setErrorMsg(null);

    // Fetch resources
    fetch('/api/resources?active=true')
      .then(res => res.json())
      .then(data => {
        setResources(data.resources || []);
        if (!selectedResourceId && data.resources?.length > 0) {
          const defaultRes = preselectedResourceId 
            ? data.resources.find((r: Resource) => r.id === preselectedResourceId) 
            : data.resources[0];
          if (defaultRes) {
            setSelectedResourceId(defaultRes.id);
          }
        }
      });

    // Fetch clients if admin
    if (isAdmin) {
      fetch('/api/clients')
        .then(res => res.json())
        .then(data => {
          setClients(data.clients || []);
          if (!selectedClientId && data.clients?.length > 0) {
            const defaultCli = preselectedClientId 
              ? data.clients.find((c: Client) => c.id === preselectedClientId) 
              : data.clients[0];
            if (defaultCli) setSelectedClientId(defaultCli.id);
          }
        });
    } else if (preselectedClientId) {
      setSelectedClientId(preselectedClientId);
    }

    // Populate existing booking if editing
    if (existingBooking) {
      setSelectedClientId(existingBooking.clientId);
      setSelectedResourceId(existingBooking.resourceId);
      setSelectedServiceId(existingBooking.serviceId || '');
      setNotes(existingBooking.notes || '');
      setStatus(existingBooking.status);
      setPrice(existingBooking.price);

      if (existingBooking.bookingMode === 'TIME_SLOT') {
        const startDt = new Date(existingBooking.startDateTime);
        setSelectedDate(startDt.toISOString().split('T')[0]);
      } else {
        setStartDate(existingBooking.startDateTime.split('T')[0]);
        setEndDate(existingBooking.endDateTime.split('T')[0]);
      }
    }
  }, [isOpen, existingBooking, preselectedClientId, preselectedResourceId, isAdmin]);

  // Fetch services whenever resource changes
  useEffect(() => {
    if (!selectedResourceId) return;
    fetch(`/api/services?resourceId=${selectedResourceId}`)
      .then(res => res.json())
      .then(data => {
        setServices(data.services || []);
      });
  }, [selectedResourceId]);

  const selectedResource = resources.find(r => r.id === selectedResourceId);

  // Fetch available slots when resource or selectedDate changes for TIME_SLOT resources
  useEffect(() => {
    if (!selectedResource || selectedResource.bookingMode !== 'TIME_SLOT' || !selectedDate) {
      setAvailableSlots([]);
      return;
    }

    setLoadingSlots(true);
    fetch(`/api/availability/slots?resourceId=${selectedResourceId}&date=${selectedDate}`)
      .then(res => res.json())
      .then(data => {
        setAvailableSlots(data.slots || []);
        setLoadingSlots(false);
      })
      .catch(() => setLoadingSlots(false));
  }, [selectedResourceId, selectedDate, selectedResource]);

  // Update calculated price
  useEffect(() => {
    if (!selectedResource) return;
    const service = services.find(s => s.id === selectedServiceId);
    if (service) {
      setPrice(service.price);
    } else if (selectedResource.bookingMode === 'DATE_RANGE') {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const diffDays = Math.max(1, Math.ceil((e.getTime() - s.getTime()) / (1000 * 3600 * 24)));
      setPrice(selectedResource.price * diffDays);
    } else {
      setPrice(selectedResource.price);
    }
  }, [selectedResource, selectedServiceId, services, startDate, endDate]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    let startDateTimeIso = '';
    let endDateTimeIso = '';

    if (selectedResource?.bookingMode === 'TIME_SLOT') {
      if (!selectedSlot && !existingBooking) {
        setErrorMsg('Please select an available time slot.');
        setIsSubmitting(false);
        return;
      }
      if (selectedSlot) {
        startDateTimeIso = selectedSlot.start;
        endDateTimeIso = selectedSlot.end;
      } else if (existingBooking) {
        startDateTimeIso = existingBooking.startDateTime;
        endDateTimeIso = existingBooking.endDateTime;
      }
    } else {
      // DATE_RANGE mode
      if (!startDate || !endDate) {
        setErrorMsg('Please select valid start and end dates.');
        setIsSubmitting(false);
        return;
      }
      startDateTimeIso = `${startDate}T00:00:00.000Z`;
      endDateTimeIso = `${endDate}T23:59:59.000Z`;
    }

    const payload = {
      clientId: selectedClientId,
      resourceId: selectedResourceId,
      serviceId: selectedServiceId || null,
      startDateTime: startDateTimeIso,
      endDateTime: endDateTimeIso,
      notes,
      price,
      status
    };

    try {
      const url = existingBooking ? `/api/bookings/${existingBooking.id}` : '/api/bookings';
      const method = existingBooking ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        // Show DOUBLE BOOKING conflict error from backend
        setErrorMsg(data.error || 'Failed to complete booking.');
        setIsSubmitting(false);
        return;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {existingBooking ? 'Edit Booking' : 'New Reservation'}
              </h2>
              <p className="text-xs text-slate-400">
                {selectedResource ? `${selectedResource.name} (${selectedResource.category})` : 'Select a resource'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conflict / Double Booking Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-4 rounded-xl bg-rose-950/80 border border-rose-600/60 text-rose-200 flex items-start gap-3 shadow-lg animate-shake">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold block text-rose-300">Availability Conflict!</span>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Client & Resource Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Client selector (Admin only) */}
            {isAdmin ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  Client
                </label>
                <select
                  value={selectedClientId}
                  onChange={e => setSelectedClientId(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">Select Client...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.accessCode})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Booking Client
                </label>
                <div className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-slate-300">
                  {clients.find(c => c.id === selectedClientId)?.name || 'Current Client'}
                </div>
              </div>
            )}

            {/* Resource Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                Resource / Asset
              </label>
              <select
                value={selectedResourceId}
                onChange={e => setSelectedResourceId(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">Select Resource...</option>
                {resources.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} [{r.bookingMode}]
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Service Selector */}
          {services.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                Service (Optional)
              </label>
              <select
                value={selectedServiceId}
                onChange={e => setSelectedServiceId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">Standard Resource Package</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} (${s.price} - {s.durationMinutes}m)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* DATE & TIME PICKER ACCORDING TO BOOKING MODE */}
          {selectedResource?.bookingMode === 'TIME_SLOT' ? (
            <div className="space-y-3 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  Select Date & Time Slot
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Time Slots Grid */}
              <div>
                <p className="text-xs text-slate-400 mb-2">Available Slots for {selectedDate}:</p>
                {loadingSlots ? (
                  <div className="py-6 text-center text-xs text-slate-400">Loading available time slots...</div>
                ) : availableSlots.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400 bg-slate-800/60 rounded-xl">
                    No available time slots found for this date. Please pick another date.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                    {availableSlots.map((slot, idx) => {
                      const isSelected = selectedSlot?.start === slot.start;
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={!slot.isAvailable}
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-2.5 py-2 rounded-lg text-xs font-medium border transition-all flex flex-col items-center justify-center ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/40 ring-2 ring-indigo-300'
                              : slot.isAvailable
                              ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-slate-500'
                              : 'bg-slate-900/80 border-slate-800 text-slate-600 line-through cursor-not-allowed'
                          }`}
                        >
                          <span className="font-bold">{slot.startTimeStr}</span>
                          <span className="text-[10px] opacity-75">{slot.endTimeStr}</span>
                          {!slot.isAvailable && (
                            <span className="text-[9px] text-rose-400 no-underline font-semibold mt-0.5">
                              {slot.reason === 'BOOKED' ? 'Booked' : 'Blocked'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // DATE RANGE MODE
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  Check-in / Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setStartDate(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  Check-out / End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={e => setEndDate(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Notes & Status (Admin only for status) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                Notes / Special Requests
              </label>
              <input
                type="text"
                placeholder="Optional comments or requirements..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {isAdmin && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            )}
          </div>

          {/* Price Summary */}
          <div className="flex items-center justify-between p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-white">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-semibold text-slate-300">Total Price:</span>
            </div>
            <span className="text-xl font-extrabold text-indigo-300">${price}</span>
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Checking & Saving...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{existingBooking ? 'Save Changes' : 'Confirm Reservation'}</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
