'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Filter, AlertTriangle, User, Tag } from 'lucide-react';
import { Booking, BlockRule, Resource } from '@/lib/types';

interface CalendarViewProps {
  bookings: Booking[];
  blockRules: BlockRule[];
  resources: Resource[];
  onSelectBooking?: (booking: Booking) => void;
  onSelectSlot?: (dateStr: string) => void;
}

export default function CalendarView({
  bookings,
  blockRules,
  resources,
  onSelectBooking,
  onSelectSlot
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of current month
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Month navigation
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to format date string YYYY-MM-DD
  const formatDateKey = (dayNum: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(dayNum).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Filter resources by category
  const filteredResourceIds = categoryFilter === 'ALL'
    ? resources.map(r => r.id)
    : resources.filter(r => r.category === categoryFilter).map(r => r.id);

  // Filter bookings
  const filteredBookings = bookings.filter(b => 
    filteredResourceIds.includes(b.resourceId) && b.status !== 'CANCELLED'
  );

  // Get bookings for a specific day
  const getBookingsForDay = (dayNum: number) => {
    const dateKey = formatDateKey(dayNum);
    return filteredBookings.filter(b => {
      const bStartStr = b.startDateTime.split('T')[0];
      const bEndStr = b.endDateTime.split('T')[0];
      return dateKey >= bStartStr && dateKey <= bEndStr;
    });
  };

  // Get blocks for a specific day
  const getBlocksForDay = (dayNum: number) => {
    const dateKey = formatDateKey(dayNum);
    return blockRules.filter(b => {
      return dateKey >= b.startDate && dateKey <= b.endDate;
    });
  };

  // Build calendar matrix
  const totalGridCells = Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7;
  const daysArray = Array.from({ length: totalGridCells }, (_, i) => {
    const dayNum = i - startingDayOfWeek + 1;
    return dayNum > 0 && dayNum <= daysInMonth ? dayNum : null;
  });

  const categoryColors: Record<string, string> = {
    DOCTOR: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    CAR_RENTAL: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    APARTMENT: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    HOTEL: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    SALON: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    OTHER: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-400">
              Showing active bookings & blocked periods
            </p>
          </div>
        </div>

        {/* Filter & Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Categories</option>
              <option value="DOCTOR" className="bg-slate-900">Doctors</option>
              <option value="CAR_RENTAL" className="bg-slate-900">Car Rentals</option>
              <option value="APARTMENT" className="bg-slate-900">Apartments</option>
              <option value="HOTEL" className="bg-slate-900">Hotels</option>
              <option value="SALON" className="bg-slate-900">Salons</option>
            </select>
          </div>

          {/* Month Steppers */}
          <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToday}
              className="px-3 py-1 text-xs font-bold text-indigo-300 hover:bg-indigo-600/30 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-extrabold text-slate-400 uppercase tracking-wider">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {daysArray.map((dayNum, idx) => {
          if (!dayNum) {
            return (
              <div
                key={idx}
                className="h-28 rounded-xl bg-slate-950/40 border border-slate-800/40 opacity-30"
              />
            );
          }

          const dayBookings = getBookingsForDay(dayNum);
          const dayBlocks = getBlocksForDay(dayNum);
          const dateStr = formatDateKey(dayNum);
          const isToday =
            new Date().toDateString() === new Date(year, month, dayNum).toDateString();

          return (
            <div
              key={idx}
              onClick={() => onSelectSlot && onSelectSlot(dateStr)}
              className={`h-28 rounded-xl border p-2 flex flex-col justify-between transition-all group hover:border-indigo-500/60 cursor-pointer overflow-hidden ${
                isToday
                  ? 'bg-indigo-950/30 border-indigo-500/80 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80'
              }`}
            >
              {/* Day Header Number */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    isToday
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-300 group-hover:text-white'
                  }`}
                >
                  {dayNum}
                </span>

                {(dayBookings.length > 0 || dayBlocks.length > 0) && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-700/80 text-slate-300 font-semibold">
                    {dayBookings.length + dayBlocks.length}
                  </span>
                )}
              </div>

              {/* Day Events Stack */}
              <div className="space-y-1 overflow-y-auto max-h-16 pr-0.5">
                
                {/* Blocked events */}
                {dayBlocks.map(block => (
                  <div
                    key={block.id}
                    className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 truncate flex items-center gap-1"
                    title={`Blocked: ${block.title}`}
                  >
                    <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{block.title}</span>
                  </div>
                ))}

                {/* Bookings */}
                {dayBookings.map(booking => {
                  const resourceObj = resources.find(r => r.id === booking.resourceId);
                  const colorClass = categoryColors[resourceObj?.category || 'OTHER'];
                  const startTime = booking.startDateTime.includes('T')
                    ? booking.startDateTime.split('T')[1].slice(0, 5)
                    : '';

                  return (
                    <div
                      key={booking.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectBooking) onSelectBooking(booking);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium border truncate transition-transform hover:scale-[1.02] flex items-center justify-between ${colorClass}`}
                      title={`${booking.resourceName} - ${booking.clientName} (${booking.startDateTime.replace('T', ' ').slice(0, 16)})`}
                    >
                      <span className="truncate font-semibold">{booking.resourceName}</span>
                      {startTime && <span className="text-[9px] opacity-75 font-mono ml-1">{startTime}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
