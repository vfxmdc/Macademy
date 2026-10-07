'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Plus, Key, Phone, Mail, CheckCircle2, Copy } from 'lucide-react';
import { Client } from '@/lib/types';
import ClientModal from '@/app/components/ClientModal';
import { useApp } from '@/app/context/AppContext';

export default function AdminClientsPage() {
  const { t } = useApp();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchClients = () => {
    fetch('/api/clients')
      .then(res => res.json())
      .then(data => setClients(data.clients || []));
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filter clients by search query
  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.accessCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone && c.phone.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      
      {/* Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {t('clientsAndCodes')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage clients, generate unique AB12 access codes, and view reservation history.
          </p>
        </div>

        <button
          onClick={() => { setSelectedClient(null); setIsModalOpen(true); }}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{t('newClient')}</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder={t('searchClients')}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border-none text-sm text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map(c => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between hover:border-blue-400 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  ID: {c.id}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {c.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-3">
                {c.name}
              </h3>
              
              <div className="space-y-1.5 mt-2 text-xs text-slate-600 dark:text-slate-400">
                {c.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>{c.phone}</span>
                  </div>
                )}
                {c.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>{c.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* AB12 ACCESS CODE DISPLAY BOX */}
            <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 block">
                  {t('generateCode')}
                </span>
                <span className="text-lg font-mono font-extrabold text-blue-700 dark:text-blue-300 tracking-wider">
                  {c.accessCode}
                </span>
              </div>

              <button
                onClick={() => handleCopyCode(c.accessCode)}
                className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:scale-105 transition-all text-xs font-bold flex items-center gap-1"
                title="Copy Access Code"
              >
                {copiedCode === c.accessCode ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

          </div>
        ))}
      </div>

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchClients}
        client={selectedClient}
      />
    </div>
  );
}
