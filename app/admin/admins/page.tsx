'use client';

import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/app/context/AppContext';
import { useRouter } from 'next/navigation';
import {
  UserCheck, UserPlus, Trash2, Shield, ShieldOff, Loader2,
  AlertTriangle, CheckCircle, Star, RefreshCw
} from 'lucide-react';

interface AdminItem { id: string; name: string; isSuperAdmin: boolean; createdAt: string; }

export default function AdminsManagementPage() {
  const { adminUser } = useApp();
  const router = useRouter();

  const [admins, setAdmins] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [adding, setAdding] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminItem | null>(null);

  const showToast = (type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admins');
    const data = await res.json();
    setAdmins(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!adminUser?.isSuperAdmin) {
      router.replace('/admin');
      return;
    }
    fetchAdmins();
  }, [adminUser, fetchAdmins, router]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCode.trim()) return;
    setAdding(true);
    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requesterId: adminUser?.id, name: newName.trim(), code: newCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { showToast('err', data.error); return; }
      showToast('ok', `تمت إضافة المسؤول "${data.name}" بنجاح.`);
      setNewName(''); setNewCode('');
      fetchAdmins();
    } catch { showToast('err', 'حدث خطأ في الشبكة.'); }
    finally { setAdding(false); }
  };

  const handleDelete = async (target: AdminItem) => {
    setDeletingId(target.id);
    setConfirmDelete(null);
    try {
      const res = await fetch('/api/admins', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requesterId: adminUser?.id, targetId: target.id }),
      });
      const data = await res.json();
      if (!res.ok) { showToast('err', data.error); return; }
      showToast('ok', `تم حذف المسؤول "${target.name}".`);
      fetchAdmins();
    } catch { showToast('err', 'حدث خطأ.'); }
    finally { setDeletingId(null); }
  };

  if (!adminUser?.isSuperAdmin) {
    return (
      <div className="flex items-center justify-center py-20 text-[#765C43] dark:text-[#d4c5b3]">
        <ShieldOff className="w-6 h-6 mr-2" /> غير مصرح لك بالوصول.
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl text-sm font-semibold transition-all animate-bounce-in ${toast.type === 'ok' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
          {toast.type === 'ok' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          {toast.msg}
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-3xl shadow-2xl p-8 max-w-sm w-full space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7 text-rose-500" />
            </div>
            <h3 className="text-xl font-black text-[#3D2E1E] dark:text-white">حذف مسؤول</h3>
            <p className="text-sm text-[#765C43] dark:text-[#d4c5b3]">
              هل أنت متأكد من حذف <span className="font-bold text-[#3D2E1E] dark:text-white">"{confirmDelete.name}"</span>؟<br />لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#E8E0D5] dark:border-[#5C4732]/40 text-sm font-bold text-[#5C4732] dark:text-[#d4c5b3] hover:bg-[#FAF6F0] dark:hover:bg-[#1a140e] transition-colors"
              >إلغاء</button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold transition-colors"
              >حذف</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#5C4732] to-[#8B5E3C] flex items-center justify-center text-white shadow-md">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#3D2E1E] dark:text-white">إدارة المسؤولين</h2>
            <p className="text-xs text-[#765C43] dark:text-[#d4c5b3]">أنت المسؤول الأعلى — يمكنك إضافة وحذف المسؤولين الفرعيين</p>
          </div>
        </div>
        <button onClick={fetchAdmins} title="Refresh" className="p-2 rounded-xl hover:bg-[#FAF6F0] dark:hover:bg-[#1a140e] text-[#8B5E3C] transition-colors border border-[#E8E0D5] dark:border-[#5C4732]/30">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Add admin form */}
      <div className="bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <UserPlus className="w-5 h-5 text-[#8B5E3C]" />
          <h3 className="font-extrabold text-[#3D2E1E] dark:text-white text-sm">إضافة مسؤول فرعي جديد</h3>
        </div>
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <label className="block text-xs font-bold text-[#5C4732] dark:text-[#D4A359] uppercase tracking-wider mb-1.5">الاسم</label>
            <input
              id="new-admin-name"
              type="text"
              required
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="مثال: Admin Youssef"
              className="w-full bg-[#FAF6F0] dark:bg-[#1a140e] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-xl px-4 py-2.5 text-sm text-[#3D2E1E] dark:text-white focus:ring-2 focus:ring-[#8B5E3C] focus:outline-none"
            />
          </div>
          <div className="sm:col-span-1">
            <label className="block text-xs font-bold text-[#5C4732] dark:text-[#D4A359] uppercase tracking-wider mb-1.5">رمز الدخول (Secret Code)</label>
            <input
              id="new-admin-code"
              type="text"
              required
              value={newCode}
              onChange={e => setNewCode(e.target.value)}
              placeholder="مثال: Admin@8812"
              className="w-full bg-[#FAF6F0] dark:bg-[#1a140e] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-xl px-4 py-2.5 text-sm font-mono text-[#8B5E3C] dark:text-[#D4A359] focus:ring-2 focus:ring-[#8B5E3C] focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              id="add-admin-btn"
              disabled={adding}
              className="w-full py-2.5 rounded-xl bg-[#5C4732] hover:bg-[#4A3826] disabled:opacity-60 text-white text-sm font-extrabold transition-all flex items-center justify-center gap-2"
            >
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              إضافة
            </button>
          </div>
        </form>
      </div>

      {/* Admin list */}
      <div className="bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#8B5E3C]" />
            <h3 className="font-extrabold text-[#3D2E1E] dark:text-white text-sm">قائمة المسؤولين</h3>
          </div>
          <span className="text-xs font-bold text-[#8B5E3C] bg-[#FAF6F0] dark:bg-[#1a140e] border border-[#E8E0D5] dark:border-[#5C4732]/30 px-3 py-1 rounded-full">
            {admins.length} مسؤول
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-[#765C43] dark:text-[#d4c5b3] gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> جارٍ التحميل…
          </div>
        ) : (
          <div className="space-y-3">
            {admins.map(admin => (
              <div
                key={admin.id}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${admin.isSuperAdmin
                  ? 'border-[#8B5E3C]/50 bg-gradient-to-r from-[#8B5E3C]/10 to-transparent'
                  : 'border-[#E8E0D5] dark:border-[#5C4732]/30 hover:border-[#8B5E3C]/30'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black shadow ${admin.isSuperAdmin ? 'bg-gradient-to-br from-[#5C4732] to-[#D4A359]' : 'bg-[#5C4732]/70'}`}>
                    {admin.isSuperAdmin ? <Star className="w-5 h-5" /> : admin.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#3D2E1E] dark:text-white flex items-center gap-1.5">
                      {admin.name}
                      {admin.isSuperAdmin && (
                        <span className="text-[9px] font-extrabold uppercase tracking-widest bg-[#8B5E3C] text-white px-2 py-0.5 rounded-full">Super Admin</span>
                      )}
                    </p>
                    <p className="text-[11px] text-[#765C43] dark:text-[#a89070]">
                      أُضيف: {new Date(admin.createdAt).toLocaleDateString('ar-DZ')}
                    </p>
                  </div>
                </div>

                {!admin.isSuperAdmin && (
                  <button
                    onClick={() => setConfirmDelete(admin)}
                    disabled={deletingId === admin.id}
                    className="p-2 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-colors border border-transparent hover:border-rose-500/30 disabled:opacity-40"
                    title="حذف"
                  >
                    {deletingId === admin.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
