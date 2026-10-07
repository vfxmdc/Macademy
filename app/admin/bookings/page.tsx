'use client';

import { useState, useEffect } from 'react';
import { Bookmark, Search, Calendar, Clock, CheckCircle2, UserCheck, Tag, Filter } from 'lucide-react';
import { Booking, Resource } from '@/lib/types';
import { useApp } from '@/app/context/AppContext';

export default function AdminBookingsPage() {
  const { t } = useApp();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResourceId, setSelectedResourceId] = useState<string>('ALL');

  const fetchBookings = () => {
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => setBookings(data.bookings || []));

    fetch('/api/resources')
      .then(res => res.json())
      .then(data => setResources(data.resources || []));
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 4000);
    return () => clearInterval(interval);
  }, []);

  const filteredBookings = bookings.filter(b => {
    const matchesSearch =
      b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.createdByAdmin && b.createdByAdmin.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesResource = selectedResourceId === 'ALL' || b.resourceId === selectedResourceId;
    return matchesSearch && matchesResource;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {t('recentBookings')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete audit trail showing which admin created or modified each booking.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedResourceId}
            onChange={e => setSelectedResourceId(e.target.value)}
            className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
          >
            <option value="ALL">All Doctors & Resources</option>
            {resources.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by client name, resource or admin who booked..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border-none text-sm text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Bookings List Table with ADMIN AUDIT LOG */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                <th className="py-4 px-6">Client & Phone</th>
                <th className="py-4 px-6">Doctor / Resource</th>
                <th className="py-4 px-6">Date & Time Slot</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Admin Audit Log</th>
                <th className="py-4 px-6 text-right rtl:text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {filteredBookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  
                  {/* Client */}
                  <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                    <div className="text-sm font-extrabold">{b.clientName}</div>
                    <div className="text-[11px] font-mono text-slate-400">{b.clientPhone || 'No Phone'}</div>
                  </td>

                  {/* Resource */}
                  <td className="py-4 px-6">
                    <div className="font-bold text-blue-600 dark:text-blue-400">{b.resourceName}</div>
                    {b.serviceName && <div className="text-[11px] text-slate-500">{b.serviceName}</div>}
                  </td>

                  {/* Date & Time */}
                  <td className="py-4 px-6 font-mono font-bold text-slate-900 dark:text-white">
                    <div>{b.startDateTime.slice(0, 10)}</div>
                    <div className="text-blue-600 dark:text-blue-400">
                      {b.startDateTime.replace('T', ' ').slice(11, 16)} - {b.endDateTime.replace('T', ' ').slice(11, 16)}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white font-mono text-sm">
                    {b.price} {t('dzd')}
                  </td>

                  {/* ADMIN AUDIT TRACKING */}
                  <td className="py-4 px-6">
                    {b.createdByAdmin ? (
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-bold inline-flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Booked by: {b.createdByAdmin}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Self-booked by Client</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6 text-right rtl:text-left">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {b.status}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
