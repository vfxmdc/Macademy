'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, Edit, Trash2, Clock, MapPin, DollarSign, CheckCircle2, XCircle } from 'lucide-react';
import { Resource } from '@/lib/types';
import ResourceModal from '@/app/components/ResourceModal';

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchResources = () => {
    fetch('/api/resources')
      .then(res => res.json())
      .then(data => setResources(data.resources || []));
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await fetch(`/api/resources/${id}`, { method: 'DELETE' });
      fetchResources();
    } catch (err) {}
  };

  const handleToggleActive = async (resource: Resource) => {
    try {
      await fetch(`/api/resources/${resource.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !resource.isActive })
      });
      fetchResources();
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Resource & Service Assets</h1>
          <p className="text-sm text-slate-400">
            Create and manage doctors, car rentals, apartments, hotels, salons, or any bookable resource.
          </p>
        </div>

        <button
          onClick={() => { setSelectedResource(null); setIsModalOpen(true); }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Resource</span>
        </button>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {resources.map(r => (
          <div
            key={r.id}
            className={`bg-slate-900 border rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition-all ${
              r.isActive ? 'border-slate-800' : 'border-rose-900/40 bg-slate-950/60 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {r.category}
                </span>
                <button
                  onClick={() => handleToggleActive(r)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                    r.isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {r.isActive ? 'ACTIVE' : 'INACTIVE'}
                </button>
              </div>

              <h3 className="text-base font-bold text-white mt-2">{r.name}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{r.description}</p>
            </div>

            <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Booking Mode:</span>
                <span className="font-semibold text-white font-mono">{r.bookingMode}</span>
              </div>

              {r.bookingMode === 'TIME_SLOT' && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Slot Duration:</span>
                  <span className="font-semibold text-white">{r.slotDurationMinutes} mins</span>
                </div>
              )}

              {r.location && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{r.location}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">Standard Price:</span>
                <span className="text-base font-extrabold text-indigo-300">
                  ${r.price} <span className="text-xs font-normal text-slate-400">/ {r.priceUnit}</span>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => { setSelectedResource(r); setIsModalOpen(true); }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(r.id)}
                className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-semibold border border-rose-800/50 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <ResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchResources}
        resource={selectedResource}
      />
    </div>
  );
}
