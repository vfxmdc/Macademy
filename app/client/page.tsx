'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft, X, FileText } from 'lucide-react';
import { Resource, Service, TimeSlot, Client } from '@/lib/types';
import { useApp } from '../context/AppContext';

export default function ClientPage() {
  const { t, addNotification, language } = useApp();

  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [daySlotsCount, setDaySlotsCount] = useState<{ total: number; available: number }>({ total: 0, available: 0 });

  const [client, setClient] = useState<Client | null>(null);

  // Stepper state: 'SELECT_SLOT' | 'SUCCESS'
  const [step, setStep] = useState<'SELECT_SLOT' | 'SUCCESS'>('SELECT_SLOT');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch logged in client
  useEffect(() => {
    fetch('/api/auth/client/me')
      .then(res => res.json())
      .then(data => {
        if (data.client) {
          setClient(data.client);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch resources
  useEffect(() => {
    fetch('/api/resources')
      .then(res => res.json())
      .then(data => {
        const activeRes = (data.resources || []).filter((r: Resource) => r.isActive);
        setResources(activeRes);
        if (activeRes.length > 0) {
          setSelectedResource(activeRes[0]);
        }
      });
  }, []);

  // Fetch services for selected resource
  useEffect(() => {
    if (!selectedResource) return;
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        const resServices = (data.services || []).filter(
          (s: Service) => !s.resourceId || s.resourceId === selectedResource.id
        );
        setServices(resServices);
        setSelectedService(null);
      });
  }, [selectedResource]);

  // Fetch available slots for selected date and resource (Real-time sync)
  const fetchSlots = useCallback(() => {
    if (!selectedResource || !selectedDate) return;
    setLoadingSlots(true);
    fetch(`/api/availability/slots?resourceId=${selectedResource.id}&date=${selectedDate}`)
      .then(res => res.json())
      .then(data => {
        const slots: TimeSlot[] = data.slots || [];
        setTimeSlots(slots);
        const available = slots.filter(s => s.isAvailable).length;
        setDaySlotsCount({ total: slots.length, available });
        setLoadingSlots(false);
      })
      .catch(() => setLoadingSlots(false));
  }, [selectedResource, selectedDate]);

  useEffect(() => {
    fetchSlots();
    // Real-time polling every 5 seconds for instant slot updates across sessions
    const interval = setInterval(fetchSlots, 5000);
    return () => clearInterval(interval);
  }, [fetchSlots]);

  const handleOpenConfirmModal = () => {
    if (!selectedSlot) return;
    setShowConfirmModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedResource || !selectedSlot) return;
    setSubmitting(true);
    setErrorMsg(null);

    const effectiveClientId = client ? client.id : 'cli-1'; // Default fallback if guest
    const calculatedPrice = selectedService ? selectedService.price : selectedResource.price;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: effectiveClientId,
          clientName: client ? client.name : 'Client',
          clientPhone: client ? client.phone : '',
          resourceId: selectedResource.id,
          serviceId: selectedService ? selectedService.id : null,
          bookingMode: selectedResource.bookingMode,
          startDateTime: selectedSlot.start,
          endDateTime: selectedSlot.end,
          price: calculatedPrice,
          notes: ''
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to complete reservation. Slot may already be taken.');
        setSubmitting(false);
        return;
      }

      addNotification(`${t('newBookingNotification')} (${selectedSlot.startTimeStr})`);
      setShowConfirmModal(false);
      setStep('SUCCESS');
      fetchSlots();
    } catch (err: any) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner / Welcome */}
      <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
            {t('clientPortal')}
          </span>
          <h1 className="text-2xl font-black text-stone-900 dark:text-white mt-1">
            {client ? `${t('clientPortal')}: ${client.name}` : t('chooseBookingDate')}
          </h1>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
            {language === 'ar' 
              ? 'اختر موعدك وتأكد من تأكيده بسهولة. الدفع يتم مباشرة في العيادة.' 
              : 'Select your preferred date and time slot. Payment is made directly upon arrival.'}
          </p>
        </div>

        {client && (
          <div className="px-4 py-2 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-right">
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block uppercase">
              {t('generateCode')}
            </span>
            <span className="text-lg font-mono font-extrabold text-blue-700 dark:text-blue-300">
              {client.accessCode}
            </span>
          </div>
        )}
      </div>

      {/* Step 1: Select Resource, Date & Time Slot */}
      {step === 'SELECT_SLOT' && (
        <div className="space-y-6">
          
          {/* Resource Selector Cards */}
          <div className="glass-panel rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">1</span>
              <span>{language === 'ar' ? 'اختر الطبيب / المورد' : 'Select Doctor / Resource'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {resources.map(res => {
                const isSelected = selectedResource?.id === res.id;
                return (
                  <button
                    key={res.id}
                    onClick={() => setSelectedResource(res)}
                    className={`p-4 rounded-2xl border text-left rtl:text-right transition-all flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-500/10 text-blue-900 dark:text-blue-100 shadow-md ring-2 ring-blue-500/30'
                        : 'border-stone-200/80 dark:border-white/10 hover:border-blue-400 text-stone-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                        {res.category}
                      </span>
                      <h3 className="text-sm font-bold text-stone-900 dark:text-white mt-0.5">{res.name}</h3>
                      <p className="text-xs text-stone-500 dark:text-slate-400 mt-1 line-clamp-2">{res.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 dark:border-white/10 text-xs">
                      <span className="font-bold text-blue-700 dark:text-blue-300">
                        {res.price} {t('dzd')}
                      </span>
                      <span className="text-[11px] text-stone-400">{res.slotDurationMinutes} mins</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Service / Package Selector if available */}
          {services.length > 0 && (
            <div className="glass-panel rounded-3xl p-6 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-stone-700 dark:text-slate-300 uppercase tracking-wider">
                {language === 'ar' ? 'اختر باقة الخدمة (اختياري)' : 'Select Service Package (Optional)'}
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedService(null)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    selectedService === null
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-stone-200 dark:border-white/10'
                  }`}
                >
                  Standard Consultation ({selectedResource?.price} {t('dzd')})
                </button>
                {services.map(srv => (
                  <button
                    key={srv.id}
                    onClick={() => setSelectedService(srv)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedService?.id === srv.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-stone-200 dark:border-white/10'
                    }`}
                  >
                    {srv.name} ({srv.price} {t('dzd')})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date Selector & Available Time Slots */}
          <div className="glass-panel rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                <span>{t('chooseBookingDate')}</span>
              </h2>

              <input
                type="date"
                value={selectedDate}
                onChange={e => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot(null);
                }}
                className="bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-stone-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Capacity Indicator Banner */}
            <div className="p-4 rounded-2xl bg-stone-100/70 dark:bg-slate-800/60 border border-stone-200 dark:border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-stone-800 dark:text-slate-200">
                  {selectedDate} Availability Status
                </span>
              </div>
              <span className="px-3 py-1 rounded-full font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                {t('slotsAvailable')}: {daySlotsCount.available} / {daySlotsCount.total}
              </span>
            </div>

            {/* Time Slots Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-stone-700 dark:text-slate-300 uppercase tracking-wider">
                {t('availableSlots')}
              </h3>

              {loadingSlots ? (
                <div className="py-8 text-center text-xs text-stone-400">Checking slot availability...</div>
              ) : timeSlots.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-400 bg-stone-100/50 dark:bg-slate-800/40 rounded-2xl border border-stone-200 dark:border-white/10">
                  {t('noSlots')}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {timeSlots.map(slot => {
                    const isSelected = selectedSlot?.start === slot.start;
                    return (
                      <button
                        key={slot.start}
                        disabled={!slot.isAvailable}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/30'
                            : slot.isAvailable
                            ? 'bg-stone-100/80 dark:bg-slate-800/80 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-900 dark:text-white border-stone-200/80 dark:border-white/10'
                            : 'bg-stone-200/40 dark:bg-slate-950/60 text-stone-400 dark:text-slate-600 border-stone-200 dark:border-slate-900 cursor-not-allowed line-through'
                        }`}
                      >
                        <span className="font-mono text-sm font-extrabold">{slot.startTimeStr}</span>
                        <span className="text-[10px] font-semibold opacity-80">
                          {slot.isAvailable ? 'Available' : slot.reason === 'BOOKED' ? 'Booked' : 'Blocked'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Next Step Button */}
            <div className="pt-4 border-t border-stone-200/60 dark:border-white/10 flex justify-end">
              <button
                disabled={!selectedSlot}
                onClick={handleOpenConfirmModal}
                className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <span>{t('bookNow')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* POPUP CONFIRMATION MODAL CARD WITH ELEGANT LAYOUT & POLICIES */}
      {showConfirmModal && selectedResource && selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg glass-panel rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-200/60 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-900 dark:text-white">
                    {t('confirmBooking')}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-slate-400">
                    Review summary & clinic terms before confirmation.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Information Grid */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-stone-100/70 dark:bg-slate-800/60 border border-stone-200/80 dark:border-white/10 flex justify-between items-center text-xs">
                <span className="text-stone-500 dark:text-slate-400 font-bold uppercase">{t('clientName')}</span>
                <span className="font-extrabold text-stone-900 dark:text-white text-sm">
                  {client ? client.name : 'Walk-in Client'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-100/70 dark:bg-slate-800/60 border border-stone-200/80 dark:border-white/10 flex justify-between items-center text-xs">
                <span className="text-stone-500 dark:text-slate-400 font-bold uppercase">{t('selectedSlot')}</span>
                <div className="text-right">
                  <div className="font-extrabold text-stone-900 dark:text-white">{selectedResource.name}</div>
                  <div className="font-mono text-blue-600 dark:text-blue-400 font-bold mt-0.5">
                    {selectedDate} at {selectedSlot.startTimeStr}
                  </div>
                </div>
              </div>

              {/* Total Payable Box */}
              <div className="p-4.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider block">
                    {t('totalPayable')}
                  </span>
                  <span className="text-[11px] text-blue-700 dark:text-blue-300 font-medium">
                    {language === 'ar' ? '2000 دج تدفع في العيادة' : '2000 DZD payable at clinic'}
                  </span>
                </div>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                  {selectedService ? selectedService.price : selectedResource.price} {t('dzd')}
                </div>
              </div>
            </div>

            {/* ELEGANT & CLEAN WARNING CARD */}
            <div className="p-4.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{language === 'ar' ? 'تنبيه هام للجمهور' : 'IMPORTANT CLINIC NOTICE'}</span>
              </div>
              <p className="text-xs leading-relaxed font-medium text-stone-800 dark:text-stone-200">
                {language === 'ar' 
                  ? 'يرجى الحضور قبل الموعد بـ 30 دقيقة على الأقل. في حالة التأخر يتحمل الحارص كافة المسؤولية.'
                  : 'Please arrive at least 30 minutes prior to your slot. Arriving late may result in forfeiture of your appointment.'}
              </p>
            </div>

            {/* Confirm Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                disabled={submitting}
                onClick={handleConfirmBooking}
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                {submitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('confirmBooking')}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Step 3: Success Screen */}
      {step === 'SUCCESS' && (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-stone-900 dark:text-white">
              {t('bookingSuccess')}
            </h2>
            <p className="text-xs text-stone-500 dark:text-slate-400 max-w-md mx-auto">
              {language === 'ar'
                ? 'تم تسجيل موعدك بنجاح في قاعدة البيانات. يرجى الحضور قبل 30 دقيقة ودفع المبلغ في العيادة.'
                : 'Your reservation is recorded. Please arrive 30 minutes prior to your time slot and pay at the clinic.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-100 dark:bg-slate-800/60 max-w-sm mx-auto border border-stone-200 dark:border-white/10 text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
            {selectedDate} at {selectedSlot?.startTimeStr}
          </div>

          <button
            onClick={() => {
              setStep('SELECT_SLOT');
              setSelectedSlot(null);
            }}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg"
          >
            + Make Another Booking
          </button>
        </div>
      )}

    </div>
  );
}
