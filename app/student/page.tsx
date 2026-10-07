'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, Award, BookOpen, CheckCircle2, PlayCircle } from 'lucide-react';
import { Course, Student, Quiz, QuizSubmission } from '@/lib/types';
import { useApp } from '@/app/context/AppContext';

export default function StudentDashboardPage() {
  const router = useRouter();
  const { t, addNotification } = useApp();

  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);

  // Active quiz modal state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [lastQuizResult, setLastQuizResult] = useState<{ score: number; totalQuestions: number; percentage: number } | null>(null);

  const fetchStudentData = () => {
    fetch('/api/auth/student/me')
      .then(res => res.json())
      .then(data => {
        if (!data.student) {
          router.push('/student/login');
        } else {
          setStudent(data.student);
        }
      })
      .catch(() => router.push('/student/login'));

    fetch('/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data.courses || []));

    fetch('/api/quizzes')
      .then(res => res.json())
      .then(data => setQuizzes(data.quizzes || []));

    fetch('/api/quizzes/submit')
      .then(res => res.json())
      .then(data => setSubmissions(data.submissions || []));
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const enrolledCourses = courses.filter(c => student?.enrolledCourseIds.includes(c.id));

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setQuizAnswers(new Array(quiz.questions.length).fill(-1));
    setLastQuizResult(null);
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    const updated = [...quizAnswers];
    updated[qIdx] = optIdx;
    setQuizAnswers(updated);
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz || !student) return;
    setSubmittingQuiz(true);

    try {
      const res = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          studentName: student.name,
          quizId: activeQuiz.id,
          answers: quizAnswers
        })
      });

      const data = await res.json();
      if (res.ok) {
        setLastQuizResult(data.quizResult);
        addNotification(`تم إكمال الامتحان بنجاح! النتيجة: ${data.quizResult.percentage}%`);
        fetchStudentData();
      }
    } catch (err) {}
    finally {
      setSubmittingQuiz(false);
    }
  };

  if (!student) {
    return <div className="p-8 text-center text-xs text-[#765C43]">جاري تحميل حساب الطالب...</div>;
  }

  return (
    <div dir="rtl" className="max-w-6xl mx-auto space-y-8 font-[family-name:var(--font-cairo)]">
      
      {/* Student Welcome Banner */}
      <div className="bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#F5EFE6] dark:bg-[#1a140e] text-[#8B5E3C] dark:text-[#D4A359] border border-[#E8E0D5] dark:border-[#5C4732]/30 uppercase">
              بوابة الطالب
            </span>
            <span className="font-mono text-xs font-bold text-[#8B5E3C] dark:text-[#D4A359]">رمز الدخول: {student.accessCode}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#3D2E1E] dark:text-white">
            مرحباً بك، {student.name}! 👋
          </h1>
          <p className="text-xs text-[#765C43] dark:text-[#d4c5b3] max-w-xl leading-relaxed">
            الوصول المباشر للدورات المسجلة، فتح ملفات وفيديوهات Google Drive، ومتابعة تقدمك ونسبة إنجازك.
          </p>
        </div>

        {/* Progress Percentage Badge (10% -> 30% -> 50%+) */}
        <div className="w-full md:w-auto bg-[#FAF6F0] dark:bg-[#1a140e] border border-[#E8E0D5] dark:border-[#5C4732]/40 p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#5C4732] text-white flex items-center justify-center font-black text-xl shadow-md">
            {student.progressPercentage}%
          </div>
          <div>
            <span className="text-xs font-extrabold text-[#3D2E1E] dark:text-white block">
              نسبة تقدم الطالب في الدورة
            </span>
            <div className="w-36 bg-[#E8E0D5] dark:bg-slate-700 h-2.5 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-[#8B5E3C] h-full transition-all duration-500"
                style={{ width: `${student.progressPercentage}%` }}
              />
            </div>
            <span className="text-[10px] text-[#765C43] dark:text-[#d4c5b3] mt-1 block">
              مستوى الطالب الحالي: {student.progressPercentage < 20 ? '10% مبتدئ' : student.progressPercentage < 40 ? '30% متوسط' : 'متقدم 🏆'}
            </span>
          </div>
        </div>

      </div>

      {/* Enrolled Courses & Google Drive Links */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-[#3D2E1E] dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#8B5E3C]" />
          <span>الدورات المسجلة ومواد الدراسة ({enrolledCourses.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrolledCourses.map(course => (
            <div
              key={course.id}
              className="bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-4 hover:border-[#8B5E3C] transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F5EFE6] dark:bg-[#1a140e] text-[#8B5E3C] dark:text-[#D4A359] border border-[#E8E0D5] dark:border-[#5C4732]/30">
                    {course.category}
                  </span>
                  <span className="text-xs font-extrabold text-[#8B5E3C] font-mono">
                    {course.price} دج
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-[#3D2E1E] dark:text-white mt-3">
                  {course.name}
                </h3>
                <p className="text-xs text-[#765C43] dark:text-[#d4c5b3] mt-1 line-clamp-3 leading-relaxed">
                  {course.description}
                </p>
                <span className="text-[11px] font-semibold text-[#8B5E3C] dark:text-[#D4A359] block mt-2">
                  المحاضر: {course.instructor}
                </span>
              </div>

              {/* Google Drive Link Button */}
              <div className="pt-3 border-t border-[#E8E0D5] dark:border-[#5C4732]/30">
                <a
                  href={course.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-[#5C4732] hover:bg-[#4A3826] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 group"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>فتح رابط Google Drive للدورة</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quizzes Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-[#3D2E1E] dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-[#8B5E3C]" />
          <span>الاختبارات والامتحانات التفاعلية</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {quizzes.map(quiz => {
            const courseObj = courses.find(c => c.id === quiz.courseId);
            const mySubmissions = submissions.filter(s => s.studentId === student.id && s.quizId === quiz.id);
            const bestSubmission = mySubmissions.length > 0
              ? mySubmissions.reduce((max, cur) => cur.percentage > max.percentage ? cur : max, mySubmissions[0])
              : null;

            return (
              <div
                key={quiz.id}
                className="bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#8B5E3C]">
                      {courseObj ? courseObj.name : 'امتحان الأكاديمية'}
                    </span>
                    {bestSubmission && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                        تم الاجتياز ({bestSubmission.percentage}%)
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-[#3D2E1E] dark:text-white mt-2">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-[#765C43] dark:text-[#d4c5b3] mt-1 leading-relaxed">
                    {quiz.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8E0D5] dark:border-[#5C4732]/30 flex items-center justify-between">
                  <span className="text-xs text-[#765C43] font-medium">
                    {bestSubmission ? `آخر نتيجة: ${bestSubmission.score}/${bestSubmission.totalQuestions}` : 'لم يتم تقديم الامتحان بعد'}
                  </span>
                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5E3C] to-[#5C4732] text-white font-extrabold text-xs shadow-md flex items-center gap-1.5"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>{bestSubmission ? 'إعادة الاختبار' : 'بدء الاختبار'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUIZ MODAL */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 text-[#3D2E1E] dark:text-white">
            
            <div className="flex items-center justify-between border-b border-[#E8E0D5] dark:border-[#5C4732]/30 pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#8B5E3C]">تقديم الاختبار</span>
                <h3 className="text-lg font-black text-[#3D2E1E] dark:text-white">{activeQuiz.title}</h3>
              </div>
              <button
                onClick={() => setActiveQuiz(null)}
                className="px-3 py-1.5 rounded-xl bg-[#FAF6F0] dark:bg-slate-800 text-xs font-bold text-[#765C43]"
              >
                إغلاق
              </button>
            </div>

            {lastQuizResult ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-black">تم إكمال الامتحان بنجاح!</h4>
                <p className="text-xs text-[#765C43]">
                  النتيجة: <span className="font-bold text-emerald-600">{lastQuizResult.score}</span> من <span className="font-bold">{lastQuizResult.totalQuestions}</span> ({lastQuizResult.percentage}%)
                </p>
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="px-6 py-3 rounded-xl bg-[#5C4732] text-white font-extrabold text-xs shadow-md"
                >
                  العودة لبوابة الطالب
                </button>
              </div>
            ) : (
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pl-2">
                {activeQuiz.questions.map((q, qIdx) => (
                  <div key={q.id} className="p-5 rounded-2xl bg-[#FAF6F0] dark:bg-[#1a140e] border border-[#E8E0D5] dark:border-[#5C4732]/30 space-y-3">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#5C4732] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {qIdx + 1}
                      </span>
                      <span>{q.question}</span>
                    </h4>

                    <div className="space-y-2 pr-8">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = quizAnswers[qIdx] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(qIdx, optIdx)}
                            className={`w-full p-3 rounded-xl text-xs font-semibold border text-right transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-[#5C4732] text-white border-[#8B5E3C]'
                                : 'bg-white dark:bg-[#231b13] text-[#3D2E1E] dark:text-slate-200 border-[#E8E0D5] dark:border-[#5C4732]/30'
                            }`}
                          >
                            <span>{opt}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-[#E8E0D5] dark:border-[#5C4732]/30 flex justify-end">
                  <button
                    disabled={submittingQuiz || quizAnswers.includes(-1)}
                    onClick={handleSubmitQuiz}
                    className="px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-extrabold text-xs shadow-md transition-all"
                  >
                    {submittingQuiz ? 'جاري تصحيح الاختبار...' : 'تسليم الإجابات 📦'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
