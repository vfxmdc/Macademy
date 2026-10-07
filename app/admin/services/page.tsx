'use client';

import { useState, useEffect } from 'react';
import { Tag, Plus, Edit, Trash2, Clock, DollarSign, Building2 } from 'lucide-react';
import { Service, Resource } from '@/lib/types';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  // Form states
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [resourceId, setResourceId] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [price, setPrice] = useState(100);
  const [description, setDescription] = useState('');

  const fetchData = () => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => setServices(data.services || []));

    fetch('/api/resources')
      .then(res => res.json())
      .then(data => setResources(data.resources || []));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      resourceId: resourceId || null,
      durationMinutes: Number(durationMinutes),
      price: Number(price),
      description
    };

    const url = editingId ? `/api/services/${editingId}` : '/api/services';
    const method = editingId ? 'PATCH' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setIsCreating(false);
    setEditingId(null);
    setName('');
    setDescription('');
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    await fetch(`/api/services/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const startEdit = (srv: Service) => {
    setEditingId(srv.id);
    setName(srv.name);
    setResourceId(srv.resourceId || '');
    setDurationMinutes(srv.durationMinutes);
    setPrice(srv.price);
    setDescription(srv.description);
    setIsCreating(true);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Specific Services Catalog</h1>
          <p className="text-sm text-slate-400">
            Define specific consultation packages, rental terms, or spa treatments.
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={() => { setEditingId(null); setName(''); setDescription(''); setIsCreating(true); }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        )}
      </div>

      {/* Form Drawer / Box */}
      {isCreating && (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <h3 className="text-base font-bold text-white">
            {editingId ? 'Edit Service' : 'Create New Service'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Service Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cardiology Follow-up Checkup"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Assigned Resource
              </label>
              <select
                value={resourceId}
                onChange={e => setResourceId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Resources / Standalone</option>
                {resources.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min={5}
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
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
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Description
            </label>
            <input
              type="text"
              placeholder="Brief summary of service..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg"
            >
              Save Service
            </button>
          </div>
        </form>
      )}

      {/* Services List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-800/80 text-slate-400 uppercase font-semibold border-b border-slate-700/80">
              <th className="py-3.5 px-4">Service Name</th>
              <th className="py-3.5 px-4">Resource</th>
              <th className="py-3.5 px-4">Duration</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
            {services.map(srv => {
              const resObj = resources.find(r => r.id === srv.resourceId);
              return (
                <tr key={srv.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    {srv.name}
                    {srv.description && <p className="text-[11px] font-normal text-slate-400">{srv.description}</p>}
                  </td>
                  <td className="py-3.5 px-4 text-indigo-400">
                    {resObj ? resObj.name : 'All Resources'}
                  </td>
                  <td className="py-3.5 px-4">{srv.durationMinutes} mins</td>
                  <td className="py-3.5 px-4 text-indigo-300 font-extrabold text-sm">${srv.price}</td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => startEdit(srv)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-indigo-300 hover:bg-slate-700"
                    >
                      <Edit className="w-3.5 h-3.5 inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(srv.id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-950/60 text-rose-300 hover:bg-rose-900"
                    >
                      <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
