'use client';

import { useState, useEffect } from 'react';
import CalendarView from '@/app/components/CalendarView';
import BookingModal from '@/app/components/BookingModal';
import { Booking, BlockRule, Resource } from '@/lib/types';
import { Plus } from 'lucide-react';

export default function AdminCalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockRules, setBlockRules] = useState<BlockRule[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = () => {
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => setBookings(data.bookings || []));

    fetch('/api/availability')
      .then(res => res.json())
      .then(data => setBlockRules(data.blockRules || []));

    fetch('/api/resources')
      .then(res => res.json())
      .then(data => setResources(data.resources || []));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">System Calendar</h1>
          <p className="text-sm text-slate-400">
            Interactive month schedule across all resources and blocked times.
          </p>
        </div>
        <button
          onClick={() => { setSelectedBooking(null); setIsModalOpen(true); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Reservation</span>
        </button>
      </div>

      <CalendarView
        bookings={bookings}
        blockRules={blockRules}
        resources={resources}
        onSelectBooking={booking => {
          setSelectedBooking(booking);
          setIsModalOpen(true);
        }}
        onSelectSlot={dateStr => {
          setSelectedBooking(null);
          setIsModalOpen(true);
        }}
      />

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        existingBooking={selectedBooking}
        isAdmin={true}
      />
    </div>
  );
}
