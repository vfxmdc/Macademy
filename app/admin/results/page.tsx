'use client';

import { useState, useEffect } from 'react';
import { FileSpreadsheet, Award, User, CheckCircle2, XCircle } from 'lucide-react';
import { QuizSubmission, Student, Course } from '@/lib/types';

export default function AdminResultsPage() {
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch('/api/quizzes/submit')
      .then(res => res.json())
      .then(data => setSubmissions(data.submissions || []));

    fetch('/api/students')
      .then(res => res.json())
      .then(data => setStudents(data.students || []));

    fetch('/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data.courses || []));
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 p-6 rounded-3xl shadow-sm">
        <h1 className="text-2xl font-extrabold text-[#3D2E1E] dark:text-white flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-[#8B5E3C]" />
          <span>Student Examination Results & Audit Log</span>
        </h1>
        <p className="text-xs text-[#765C43] dark:text-[#d4c5b3] mt-1">
          Real-time record of completed quizzes, student test scores, and percentage advancements.
        </p>
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead>
              <tr className="bg-[#FAF6F0] dark:bg-[#1a140e] text-[#765C43] dark:text-[#d4c5b3] uppercase font-bold border-b border-[#E8E0D5] dark:border-[#5C4732]/30">
                <th className="py-4 px-6">Student Name</th>
                <th className="py-4 px-6">Course</th>
                <th className="py-4 px-6">Score</th>
                <th className="py-4 px-6">Percentage Grade</th>
                <th className="py-4 px-6">Date Submitted</th>
                <th className="py-4 px-6 text-right rtl:text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D5] dark:divide-[#5C4732]/30 font-medium text-[#3D2E1E] dark:text-slate-200">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#765C43]">
                    No student exam submissions recorded yet.
                  </td>
                </tr>
              ) : (
                submissions.map(sub => {
                  const courseObj = courses.find(c => c.id === sub.courseId);
                  const isPassed = sub.percentage >= 50;

                  return (
                    <tr key={sub.id} className="hover:bg-[#FAF6F0]/60 dark:hover:bg-[#1a140e]/60 transition-colors">
                      
                      <td className="py-4 px-6 font-bold text-[#3D2E1E] dark:text-white">
                        <div className="text-sm font-extrabold">{sub.studentName}</div>
                      </td>

                      <td className="py-4 px-6 text-[#8B5E3C] dark:text-[#D4A359] font-bold">
                        {courseObj ? courseObj.name : 'Academy Course'}
                      </td>

                      <td className="py-4 px-6 font-mono font-bold text-[#3D2E1E] dark:text-white">
                        {sub.score} / {sub.totalQuestions}
                      </td>

                      <td className="py-4 px-6 font-mono font-extrabold">
                        <span className={`px-2.5 py-1 rounded-lg text-xs border ${
                          isPassed
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                        }`}>
                          {sub.percentage}%
                        </span>
                      </td>

                      <td className="py-4 px-6 text-[#765C43] font-mono text-[11px]">
                        {sub.submittedAt ? sub.submittedAt.slice(0, 16).replace('T', ' ') : 'Just now'}
                      </td>

                      <td className="py-4 px-6 text-right rtl:text-left">
                        {isPassed ? (
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>Passed (+Progress)</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 inline-flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-rose-500" />
                            <span>Needs Retake</span>
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
