'use client';

import { useState, useEffect } from 'react';
import { X, BookOpen, DollarSign, ExternalLink, User, CheckCircle2 } from 'lucide-react';
import { Course, CourseCategory } from '@/lib/types';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  course?: Course | null;
}

export default function CourseModal({
  isOpen,
  onClose,
  onSuccess,
  course = null
}: CourseModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CourseCategory>('DEVELOPMENT');
  const [price, setPrice] = useState(20000);
  const [description, setDescription] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [instructor, setInstructor] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (course) {
      setName(course.name);
      setCategory(course.category);
      setPrice(course.price || 0);
      setDescription(course.description || '');
      setDriveUrl(course.driveUrl || '');
      setInstructor(course.instructor || '');
      setIsActive(course.isActive);
    } else {
      setName('');
      setCategory('DEVELOPMENT');
      setPrice(20000);
      setDescription('');
      setDriveUrl('');
      setInstructor('');
      setIsActive(true);
    }
  }, [course, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const payload = {
      name,
      category,
      price: Number(price),
      description,
      driveUrl,
      instructor,
      isActive
    };

    try {
      const url = course ? `/api/courses/${course.id}` : '/api/courses';
      const method = course ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to save course');
        setIsSubmitting(false);
        return;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-extrabold text-white">
              {course ? 'Edit Academy Course' : 'Add New Course'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-600/60 text-rose-200 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Course Title / Product Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Full-Stack Web Development Bootcamp"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CourseCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="DEVELOPMENT">Software Development</option>
                <option value="DESIGN">UI/UX & Design</option>
                <option value="BUSINESS">Business & Finance</option>
                <option value="MARKETING">Digital Marketing</option>
                <option value="OTHER">Other Category</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                Course Price (DZD)
              </label>
              <input
                type="number"
                min={0}
                required
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white font-mono font-bold focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              Google Drive Folder / Video Link
            </label>
            <input
              type="url"
              required
              placeholder="https://drive.google.com/drive/folders/..."
              value={driveUrl}
              onChange={e => setDriveUrl(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-indigo-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              Instructor Name
            </label>
            <input
              type="text"
              placeholder="e.g. Eng. Sofiane Barka"
              value={instructor}
              onChange={e => setInstructor(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Course Description
            </label>
            <textarea
              rows={3}
              placeholder="Overview of syllabus, prerequisites, and learning outcomes..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded accent-indigo-600 bg-slate-800 border-slate-700"
            />
            <label htmlFor="isActive" className="text-xs font-bold text-slate-300 cursor-pointer">
              Course is Active & Available for Enrollment
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{course ? 'Save Changes' : 'Create Course'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
