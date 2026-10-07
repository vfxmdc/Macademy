'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Plus, Edit, Trash2, Key, Award, BookOpen } from 'lucide-react';
import { Student, Course } from '@/lib/types';
import StudentModal from '@/app/components/StudentModal';
import { useApp } from '@/app/context/AppContext';

export default function AdminStudentsPage() {
  const { t } = useApp();
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = () => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => setStudents(data.students || []));

    fetch('/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data.courses || []));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student record?')) return;
    try {
      await fetch(`/api/students/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {}
  };

  const handleUpdateProgress = async (student: Student, newPercentage: number) => {
    try {
      await fetch(`/api/students/${student.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progressPercentage: newPercentage })
      });
      fetchData();
    } catch (err) {}
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.accessCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.phone && s.phone.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 p-6 rounded-3xl shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-[#3D2E1E] dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-[#8B5E3C]" />
            <span>Student Management & Progress Tracker</span>
          </h1>
          <p className="text-xs text-[#765C43] dark:text-[#d4c5b3] mt-1">
            Keep an eye on every student. Upgrade progress percentage from 10% to 30% upon course completion.
          </p>
        </div>

        <button
          onClick={() => { setSelectedStudent(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold bg-[#5C4732] hover:bg-[#4A3826] text-white shadow-lg shadow-[#5C4732]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t('newStudent')}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 p-4 rounded-2xl shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder={t('searchStudents')}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border-none text-sm text-[#3D2E1E] dark:text-white focus:outline-none placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead>
              <tr className="bg-[#FAF6F0] dark:bg-[#1a140e] text-[#765C43] dark:text-[#d4c5b3] uppercase font-bold border-b border-[#E8E0D5] dark:border-[#5C4732]/30">
                <th className="py-4 px-6">{t('studentName')}</th>
                <th className="py-4 px-6">Access Code</th>
                <th className="py-4 px-6">Enrolled Courses</th>
                <th className="py-4 px-6">Progress Percentage (%)</th>
                <th className="py-4 px-6 text-right rtl:text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D5] dark:divide-[#5C4732]/30 font-medium text-[#3D2E1E] dark:text-slate-200">
              {filteredStudents.map(s => (
                <tr key={s.id} className="hover:bg-[#FAF6F0]/60 dark:hover:bg-[#1a140e]/60 transition-colors">
                  
                  {/* Name & Contact */}
                  <td className="py-4 px-6 font-bold text-[#3D2E1E] dark:text-white">
                    <div className="text-sm font-extrabold">{s.name}</div>
                    <div className="text-[11px] text-[#765C43] dark:text-[#d4c5b3] font-normal">{s.phone || s.email || 'No contact'}</div>
                  </td>

                  {/* Access Code */}
                  <td className="py-4 px-6 font-mono font-extrabold text-[#8B5E3C] dark:text-[#D4A359]">
                    <span className="px-2.5 py-1 rounded-lg bg-[#FAF6F0] dark:bg-[#1a140e] border border-[#E8E0D5] dark:border-[#5C4732]/40 inline-flex items-center gap-1.5">
                      <Key className="w-3 h-3 text-[#8B5E3C]" />
                      <span>{s.accessCode}</span>
                    </span>
                  </td>

                  {/* Enrolled Courses */}
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {s.enrolledCourseIds.map(cId => {
                        const c = courses.find(item => item.id === cId);
                        return c ? (
                          <span key={cId} className="px-2 py-0.5 rounded-md bg-[#FAF6F0] dark:bg-[#1a140e] text-[#5C4732] dark:text-[#D4A359] border border-[#E8E0D5] dark:border-[#5C4732]/30 text-[10px] font-bold">
                            {c.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </td>

                  {/* Progress Tracker (Percentage Pill + Quick Upgrade Buttons 10% -> 30%) */}
                  <td className="py-4 px-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <div className="w-28 bg-[#E8E0D5] dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#8B5E3C] to-[#5C4732] h-full transition-all duration-300"
                            style={{ width: `${s.progressPercentage}%` }}
                          />
                        </div>
                        <span className="font-mono font-extrabold text-[#3D2E1E] dark:text-white text-xs">
                          {s.progressPercentage}%
                        </span>
                      </div>

                      {/* Quick progress milestone adjustment buttons as requested */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleUpdateProgress(s, 10)}
                          title="Set 10%"
                          className={`px-2 py-0.5 rounded text-[9px] font-bold border ${s.progressPercentage === 10 ? 'bg-[#5C4732] text-white' : 'bg-[#FAF6F0] dark:bg-[#1a140e] text-[#765C43]'}`}
                        >
                          10%
                        </button>
                        <button
                          onClick={() => handleUpdateProgress(s, 30)}
                          title="Set 30%"
                          className={`px-2 py-0.5 rounded text-[9px] font-bold border ${s.progressPercentage === 30 ? 'bg-[#5C4732] text-white' : 'bg-[#FAF6F0] dark:bg-[#1a140e] text-[#765C43]'}`}
                        >
                          30%
                        </button>
                        <button
                          onClick={() => handleUpdateProgress(s, 50)}
                          title="Set 50%"
                          className={`px-2 py-0.5 rounded text-[9px] font-bold border ${s.progressPercentage === 50 ? 'bg-[#5C4732] text-white' : 'bg-[#FAF6F0] dark:bg-[#1a140e] text-[#765C43]'}`}
                        >
                          50%
                        </button>
                        <button
                          onClick={() => handleUpdateProgress(s, 100)}
                          title="Set 100%"
                          className={`px-2 py-0.5 rounded text-[9px] font-bold border ${s.progressPercentage === 100 ? 'bg-emerald-700 text-white' : 'bg-[#FAF6F0] dark:bg-[#1a140e] text-[#765C43]'}`}
                        >
                          100%
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right rtl:text-left">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setSelectedStudent(s); setIsModalOpen(true); }}
                        className="p-2 rounded-xl bg-[#FAF6F0] dark:bg-[#1a140e] text-[#5C4732] dark:text-[#D4A359] hover:bg-[#E8E0D5] transition-colors"
                        title="Edit Student"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors"
                        title="Delete Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        student={selectedStudent}
        courses={courses}
      />
    </div>
  );
}
