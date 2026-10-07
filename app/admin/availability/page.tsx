'use client';

import { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Calendar, Coffee, AlertTriangle, UserCheck } from 'lucide-react';
import { AvailabilityRule, BlockRule, Resource } from '@/lib/types';
import BlockModal from '@/app/components/BlockModal';
import { useApp } from '@/app/context/AppContext';

export default function AdminAvailabilityPage() {
  const { t } = useApp();
  const [availabilityRules, setAvailabilityRules] = useState<AvailabilityRule[]>([]);
  const [blockRules, setBlockRules] = useState<BlockRule[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  // New rule form states
  const [selectedResourceId, setSelectedResourceId] = useState<string>('ALL');
  const [dayOfWeek, setDayOfWeek] = useState<number>(1); // 1 = Mon
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:00');

  const daysName = [
    { id: 0, name: 'Sunday / الأحد' },
    { id: 1, name: 'Monday / الإثنين' },
    { id: 2, name: 'Tuesday / الثلاثاء' },
    { id: 3, name: 'Wednesday / الأربعاء' },
    { id: 4, name: 'Thursday / الخميس' },
    { id: 5, name: 'Friday / الجمعة' },
    { id: 6, name: 'Saturday / السبت' },
  ];

  const fetchData = () => {
    fetch('/api/availability')
      .then(res => res.json())
      .then(data => {
        setAvailabilityRules(data.availabilityRules || []);
        setBlockRules(data.blockRules || []);
      });

    fetch('/api/resources')
      .then(res => res.json())
      .then(data => setResources(data.resources || []));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      type: 'RULE',
      resourceId: selectedResourceId,
      dayOfWeek: Number(dayOfWeek),
      startTime,
      endTime,
      isAvailable: true
    };

    await fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    fetchData();
  };

  const handleDeleteBlock = async (id: string) => {
    if (!confirm('Are you sure you want to remove this block rule?')) return;
    await fetch(`/api/availability/blocks/${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <div className="space-y-6">
      
      {/* Page Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {t('availabilityAndBlocked')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure working hours, lunch breaks, and block out holidays or doctor absences.
          </p>
        </div>

        <button
          onClick={() => setIsBlockModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ {t('holidays')}</span>
        </button>
      </div>

      {/* Grid: Working Hours Rule & Blocked Out Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Weekly Working Hours */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Weekly Work Schedule & Hours</span>
          </h2>

          <form onSubmit={handleAddRule} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Add Daily Shift Hours</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Resource</label>
                <select
                  value={selectedResourceId}
                  onChange={e => setSelectedResourceId(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="ALL">All Resources / Doctors</option>
                  {resources.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Day of Week</label>
                <select
                  value={dayOfWeek}
                  onChange={e => setDayOfWeek(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
                >
                  {daysName.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('startWork')}</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('endWork')}</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
            >
              + Add Work Shift
            </button>
          </form>

          {/* Active Rules List */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {availabilityRules.map(rule => {
              const dayName = daysName.find(d => d.id === rule.dayOfWeek)?.name;
              const resObj = resources.find(r => r.id === rule.resourceId);
              return (
                <div
                  key={rule.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{dayName}</span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                      {resObj ? resObj.name : 'All Resources'}
                    </span>
                  </div>
                  <span className="font-mono font-extrabold text-blue-700 dark:text-blue-300">
                    {rule.startTime} - {rule.endTime}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Blocked Dates, Holidays & Breaks */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <span>{t('holidays')} & Maintenance Blocks</span>
          </h2>

          {blockRules.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No blocked dates or holidays configured.
            </div>
          ) : (
            <div className="space-y-3">
              {blockRules.map(block => {
                const resObj = resources.find(r => r.id === block.resourceId);
                return (
                  <div
                    key={block.id}
                    className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 flex items-center justify-between text-xs space-y-1"
                  >
                    <div>
                      <h4 className="font-bold text-rose-900 dark:text-rose-200">{block.title}</h4>
                      <p className="text-[11px] text-rose-700 dark:text-rose-300 font-mono">
                        {block.startDate} to {block.endDate} ({block.startTime || '00:00'} - {block.endTime || '23:59'})
                      </p>
                      <span className="text-[10px] font-semibold text-slate-500 block">
                        Target: {resObj ? resObj.name : 'All Resources'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteBlock(block.id)}
                      className="p-2 rounded-xl bg-white dark:bg-slate-800 text-rose-600 hover:bg-rose-100 transition-colors"
                      title="Remove Block"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      <BlockModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onSuccess={fetchData}
        resources={resources}
      />

    </div>
  );
}
