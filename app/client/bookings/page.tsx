'use client';

import { useState, useEffect } from 'react';
import { Bookmark, Calendar, Clock, DollarSign, XCircle, CheckCircle2, Building2, AlertTriangle } from 'lucide-react';
import { Booking, Client } from '@/lib/types';
import Link from 'next/link';

export default function MyBookingsPage() {
  const [client, setClient] = useState<Client | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBookings = () => {
    fetch('/api/auth/client/me')
      .then(res => res.json())
      .then(data => {
        if (data.client) {
          setClient(data.client);
          fetch(`/api/bookings?clientId=${data.client.id}`)
            .then(bRes => bRes.json())
            .then(bData => {
              setBookings(bData.bookings || []);
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this reservation? The slot will immediately become available again.')) return;
    try {
      await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
      fetchMyBookings();
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">My Reservations & History</h1>
          <p className="text-sm text-slate-400">
            View your upcoming and past bookings. Managed in real-time with the central database.
          </p>
        </div>

        <Link
          href="/client"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
        >
          + Make New Booking
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading your reservations...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No Reservations Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You don't have any active bookings yet. Explore available resources and dates to book your first slot.
          </p>
          <Link
            href="/client"
            className="inline-block px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg"
          >
            Browse Available Slots
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {bookings.map(b => (
            <div
              key={b.id}
              className={`bg-slate-900 border rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between ${
                b.status === 'CONFIRMED'
                  ? 'border-slate-800'
                  : b.status === 'PENDING'
                  ? 'border-amber-500/40'
                  : 'border-rose-900/40 bg-slate-950/60 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                      {b.bookingMode}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{b.resourceName}</h3>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                      b.status === 'CONFIRMED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : b.status === 'PENDING'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 line-through'
                    }`}
                  >
                    {b.status === 'CONFIRMED' && <CheckCircle2 className="w-3 h-3" />}
                    {b.status}
                  </span>
                </div>

                {b.serviceName && (
                  <p className="text-xs font-semibold text-emerald-400 mt-1">
                    Service: {b.serviceName}
                  </p>
                )}
              </div>

              {/* Date & Time details */}
              <div className="space-y-2 text-xs text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    Start Time:
                  </span>
                  <span className="font-mono font-bold text-white">
                    {b.startDateTime.replace('T', ' ').slice(0, 16)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    End Time:
                  </span>
                  <span className="font-mono font-bold text-white">
                    {b.endDateTime.replace('T', ' ').slice(0, 16)}
                  </span>
                </div>

                {b.notes && (
                  <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-300">
                    <strong className="text-slate-400">Notes:</strong> {b.notes}
                  </div>
                )}
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Total Price</span>
                  <span className="text-lg font-extrabold text-emerald-300">${b.price}</span>
                </div>

                {b.status !== 'CANCELLED' && (
                  <button
                    onClick={() => handleCancelBooking(b.id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-semibold border border-rose-800/50 transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Booking</span>
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
