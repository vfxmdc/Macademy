'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Search, Plus, Edit, Trash2, ExternalLink, Award, DollarSign } from 'lucide-react';
import { Course } from '@/lib/types';
import CourseModal from '@/app/components/CourseModal';
import { useApp } from '@/app/context/AppContext';

export default function AdminCoursesPage() {
  const { t } = useApp();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCourses = () => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data.courses || []));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      fetchCourses();
    } catch (err) {}
  };

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.instructor && c.instructor.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-[family-name:var(--font-cairo)]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 p-6 rounded-3xl shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-[#3D2E1E] dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#8B5E3C]" />
            <span>كتالوج الدورات والمنتجات (M Academy Products)</span>
          </h1>
          <p className="text-xs text-[#765C43] dark:text-[#d4c5b3] mt-1">
            إدارة أسماء الدورات، الأسعار، ورابط Google Drive لكل مادة تعليمية.
          </p>
        </div>

        <button
          onClick={() => { setSelectedCourse(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold bg-[#5C4732] hover:bg-[#4A3826] text-white shadow-lg shadow-[#5C4732]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة دورة/منتج جديد</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 p-4 rounded-2xl shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="البحث باسم الدورة أو المحاضر..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border-none text-sm text-[#3D2E1E] dark:text-white focus:outline-none placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div
            key={course.id}
            className="bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#8B5E3C] transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#FAF6F0] dark:bg-[#1a140e] text-[#8B5E3C] border border-[#E8E0D5] dark:border-[#5C4732]/30 uppercase">
                  {course.category}
                </span>
                <span className="text-base font-extrabold text-[#8B5E3C] dark:text-[#D4A359] font-mono">
                  {course.price.toLocaleString()} دج
                </span>
              </div>

              <h3 className="text-base font-extrabold text-[#3D2E1E] dark:text-white mt-3">
                {course.name}
              </h3>
              <p className="text-xs text-[#765C43] dark:text-[#d4c5b3] mt-1 line-clamp-3 leading-relaxed">
                {course.description}
              </p>
              
              <div className="mt-3 text-xs font-semibold text-[#8B5E3C]">
                المحاضر: {course.instructor || 'أكاديمية M'}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8E0D5] dark:border-[#5C4732]/30 space-y-3">
              <a
                href={course.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#1a140e] text-[#8B5E3C] dark:text-[#D4A359] border border-[#E8E0D5] dark:border-[#5C4732]/30 hover:border-[#8B5E3C] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>معاينة Google Drive</span>
              </a>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => { setSelectedCourse(course); setIsModalOpen(true); }}
                  className="p-2 rounded-xl bg-[#FAF6F0] dark:bg-[#1a140e] text-[#5C4732] dark:text-[#D4A359] hover:bg-[#E8E0D5] transition-colors"
                  title="تعديل الدورة"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors"
                  title="حذف الدورة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCourses}
        course={selectedCourse}
      />
    </div>
  );
}
