'use client';

import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Key, Award, CheckCircle2 } from 'lucide-react';
import { Student, Course } from '@/lib/types';

function generateAccessCode(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  let part1 = '';
  let part2 = '';
  for (let i = 0; i < 4; i++) {
    part1 += letters.charAt(Math.floor(Math.random() * letters.length));
    part2 += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return `${part1}-${part2}`;
}

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  student?: Student | null;
  courses: Course[];
}

export default function StudentModal({
  isOpen,
  onClose,
  onSuccess,
  student = null,
  courses
}: StudentModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(10);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (student) {
      setName(student.name);
      setEmail(student.email || '');
      setPhone(student.phone || '');
      setAccessCode(student.accessCode);
      setProgressPercentage(student.progressPercentage || 10);
      setEnrolledCourseIds(student.enrolledCourseIds || []);
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setAccessCode(generateAccessCode());
      setProgressPercentage(10);
      setEnrolledCourseIds(courses.slice(0, 1).map(c => c.id));
    }
  }, [student, isOpen, courses]);

  if (!isOpen) return null;

  const handleToggleCourse = (courseId: string) => {
    if (enrolledCourseIds.includes(courseId)) {
      setEnrolledCourseIds(enrolledCourseIds.filter(id => id !== courseId));
    } else {
      setEnrolledCourseIds([...enrolledCourseIds, courseId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const payload = {
      name,
      email,
      phone,
      accessCode,
      progressPercentage: Number(progressPercentage),
      enrolledCourseIds
    };

    try {
      const url = student ? `/api/students/${student.id}` : '/api/students';
      const method = student ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to save student');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto font-[family-name:var(--font-cairo)]">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-3xl shadow-2xl overflow-hidden my-8 text-[#3D2E1E] dark:text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F5EFE6] dark:bg-[#1a140e] border-b border-[#E8E0D5] dark:border-[#5C4732]/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#5C4732] text-white flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-extrabold text-[#3D2E1E] dark:text-white">
              {student ? 'Edit Student Profile & Percentage' : 'Add New Student'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-[#765C43] hover:text-[#3D2E1E] dark:hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-[#5C4732] dark:text-[#D4A359] uppercase tracking-wider mb-1">
              Student Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. John Miller or Fatima Zahra"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#FAF6F0] dark:bg-[#1a140e] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-xl px-4 py-2.5 text-sm text-[#3D2E1E] dark:text-white font-bold focus:ring-2 focus:ring-[#8B5E3C]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5C4732] dark:text-[#D4A359] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#8B5E3C]" />
                Phone Number
              </label>
              <input
                type="text"
                placeholder="e.g. 0555 12 34 56"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-[#FAF6F0] dark:bg-[#1a140e] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-xl px-4 py-2.5 text-sm text-[#3D2E1E] dark:text-white focus:ring-2 focus:ring-[#8B5E3C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C4732] dark:text-[#D4A359] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#8B5E3C]" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. student@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#FAF6F0] dark:bg-[#1a140e] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-xl px-4 py-2.5 text-sm text-[#3D2E1E] dark:text-white focus:ring-2 focus:ring-[#8B5E3C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5C4732] dark:text-[#D4A359] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#8B5E3C]" />
                Portal Access Code
              </label>
              <input
                type="text"
                required
                value={accessCode}
                onChange={e => setAccessCode(e.target.value.toUpperCase())}
                className="w-full bg-[#FAF6F0] dark:bg-[#1a140e] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-xl px-4 py-2.5 text-sm text-[#8B5E3C] dark:text-[#D4A359] font-mono font-extrabold tracking-wider uppercase focus:ring-2 focus:ring-[#8B5E3C]"
              />
            </div>

            {/* DYNAMIC PERCENTAGE PROGRESS CONTROLLER (10% -> 30% -> 100%) */}
            <div>
              <label className="block text-xs font-bold text-[#5C4732] dark:text-[#D4A359] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#8B5E3C]" />
                Student Progress Percentage ({progressPercentage}%)
              </label>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={progressPercentage}
                  onChange={e => setProgressPercentage(Number(e.target.value))}
                  className="w-full accent-[#8B5E3C] cursor-pointer"
                />
                <span className="font-mono font-extrabold text-sm text-[#8B5E3C] dark:text-[#D4A359] shrink-0 w-12 text-right">
                  {progressPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Preset Quick Buttons for 10% and 30% as specifically requested */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] text-[#765C43] font-bold">Quick Set Percentage:</span>
            <button
              type="button"
              onClick={() => setProgressPercentage(10)}
              className={`px-3 py-1 rounded-lg text-xs font-bold border ${progressPercentage === 10 ? 'bg-[#5C4732] text-white border-[#5C4732]' : 'bg-[#FAF6F0] dark:bg-[#1a140e] text-[#5C4732] dark:text-[#d4c5b3] border-[#E8E0D5]'}`}
            >
              10%
            </button>
            <button
              type="button"
              onClick={() => setProgressPercentage(30)}
              className={`px-3 py-1 rounded-lg text-xs font-bold border ${progressPercentage === 30 ? 'bg-[#5C4732] text-white border-[#5C4732]' : 'bg-[#FAF6F0] dark:bg-[#1a140e] text-[#5C4732] dark:text-[#d4c5b3] border-[#E8E0D5]'}`}
            >
              30%
            </button>
            <button
              type="button"
              onClick={() => setProgressPercentage(50)}
              className={`px-3 py-1 rounded-lg text-xs font-bold border ${progressPercentage === 50 ? 'bg-[#5C4732] text-white border-[#5C4732]' : 'bg-[#FAF6F0] dark:bg-[#1a140e] text-[#5C4732] dark:text-[#d4c5b3] border-[#E8E0D5]'}`}
            >
              50%
            </button>
            <button
              type="button"
              onClick={() => setProgressPercentage(100)}
              className={`px-3 py-1 rounded-lg text-xs font-bold border ${progressPercentage === 100 ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-[#FAF6F0] dark:bg-[#1a140e] text-[#5C4732] dark:text-[#d4c5b3] border-[#E8E0D5]'}`}
            >
              100%
            </button>
          </div>

          {/* Course Checkboxes */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-[#5C4732] dark:text-[#D4A359] uppercase tracking-wider">
              Enrolled Courses
            </label>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {courses.map(c => {
                const isEnrolled = enrolledCourseIds.includes(c.id);
                return (
                  <div
                    key={c.id}
                    onClick={() => handleToggleCourse(c.id)}
                    className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-between ${
                      isEnrolled
                        ? 'bg-[#5C4732]/10 border-[#8B5E3C] text-[#8B5E3C] dark:text-[#D4A359]'
                        : 'bg-[#FAF6F0] dark:bg-[#1a140e] border-[#E8E0D5] text-[#765C43]'
                    }`}
                  >
                    <span>{c.name}</span>
                    <input
                      type="checkbox"
                      checked={isEnrolled}
                      onChange={() => {}}
                      className="w-4 h-4 rounded accent-[#8B5E3C] pointer-events-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E0D5] dark:border-[#5C4732]/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#765C43] hover:bg-[#FAF6F0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold bg-[#5C4732] hover:bg-[#4A3826] text-white shadow-lg shadow-[#5C4732]/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{student ? 'Save Progress & Profile' : 'Add Student'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
