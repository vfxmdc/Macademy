'use client';

import { useState, useEffect } from 'react';
import { Award, Plus, Trash2, BookOpen, CheckCircle2, HelpCircle } from 'lucide-react';
import { Quiz, Course } from '@/lib/types';
import { useApp } from '@/app/context/AppContext';

export default function AdminQuizzesPage() {
  const { t } = useApp();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // New Quiz form
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    { question: 'What is the main topic covered in Module 1?', options: ['Basics & Setup', 'Advanced Concepts', 'Deployment', 'Testing'], correctOptionIndex: 0 }
  ]);

  const fetchData = () => {
    fetch('/api/quizzes')
      .then(res => res.json())
      .then(data => setQuizzes(data.quizzes || []));

    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data.courses || []);
        if (data.courses?.length > 0 && !courseId) {
          setCourseId(data.courses[0].id);
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], correctOptionIndex: 0 }
    ]);
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !courseId) return;

    const payload = {
      courseId,
      title,
      description,
      questions: questions.map((q, idx) => ({
        id: `q-${idx}-${Date.now()}`,
        ...q
      }))
    };

    await fetch('/api/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setIsCreating(false);
    setTitle('');
    setDescription('');
    fetchData();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 p-6 rounded-3xl shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-[#3D2E1E] dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-[#8B5E3C]" />
            <span>Course Tests & Examinations Creator</span>
          </h1>
          <p className="text-xs text-[#765C43] dark:text-[#d4c5b3] mt-1">
            Create online multiple-choice tests for courses. Passed tests automatically increase student progress percentages.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold bg-[#5C4732] hover:bg-[#4A3826] text-white shadow-lg shadow-[#5C4732]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Cancel' : 'Create New Test'}</span>
        </button>
      </div>

      {/* New Quiz Form */}
      {isCreating && (
        <form onSubmit={handleCreateQuiz} className="bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-[#3D2E1E] dark:text-white">New Exam / Quiz Setup</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5C4732] dark:text-[#D4A359] uppercase mb-1">Target Course</label>
              <select
                value={courseId}
                onChange={e => setCourseId(e.target.value)}
                className="w-full bg-[#FAF6F0] dark:bg-[#1a140e] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-xl px-3 py-2.5 text-xs font-bold text-[#3D2E1E] dark:text-white"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C4732] dark:text-[#D4A359] uppercase mb-1">Quiz Title</label>
              <input
                type="text"
                required
                placeholder="e.g. JavaScript Core Knowledge Test"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-[#FAF6F0] dark:bg-[#1a140e] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-xl px-3 py-2.5 text-xs font-bold text-[#3D2E1E] dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C4732] dark:text-[#D4A359] uppercase mb-1">Description / Instructions</label>
            <input
              type="text"
              placeholder="e.g. 3 Questions testing fundamental functions & async logic"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-[#FAF6F0] dark:bg-[#1a140e] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-xl px-3 py-2.5 text-xs font-bold text-[#3D2E1E] dark:text-white"
            />
          </div>

          {/* Dynamic Questions List */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-[#765C43]">Questions ({questions.length})</span>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="text-xs font-bold text-[#8B5E3C] hover:underline"
              >
                + Add Another Question
              </button>
            </div>

            {questions.map((q, qIdx) => (
              <div key={qIdx} className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#1a140e] border border-[#E8E0D5] dark:border-[#5C4732]/30 space-y-3">
                <input
                  type="text"
                  required
                  placeholder={`Question ${qIdx + 1} text...`}
                  value={q.question}
                  onChange={e => {
                    const updated = [...questions];
                    updated[qIdx].question = e.target.value;
                    setQuestions(updated);
                  }}
                  className="w-full bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-xl px-3 py-2 text-xs font-bold text-[#3D2E1E] dark:text-white"
                />

                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qIdx}`}
                        checked={q.correctOptionIndex === optIdx}
                        onChange={() => {
                          const updated = [...questions];
                          updated[qIdx].correctOptionIndex = optIdx;
                          setQuestions(updated);
                        }}
                        className="accent-[#8B5E3C]"
                      />
                      <input
                        type="text"
                        required
                        placeholder={`Option ${optIdx + 1}`}
                        value={opt}
                        onChange={e => {
                          const updated = [...questions];
                          updated[qIdx].options[optIdx] = e.target.value;
                          setQuestions(updated);
                        }}
                        className="w-full bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-lg px-2.5 py-1.5 text-xs text-[#3D2E1E] dark:text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#5C4732] hover:bg-[#4A3826] text-white font-extrabold text-xs shadow-lg"
          >
            Publish Exam to Student Portal
          </button>
        </form>
      )}

      {/* Existing Quizzes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {quizzes.map(quiz => {
          const courseObj = courses.find(c => c.id === quiz.courseId);
          return (
            <div key={quiz.id} className="bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-3xl p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF6F0] dark:bg-[#1a140e] text-[#8B5E3C] border border-[#E8E0D5] dark:border-[#5C4732]/30 uppercase">
                  {courseObj ? courseObj.name : 'Academy Exam'}
                </span>
                <span className="text-[10px] font-mono text-[#765C43]">{quiz.questions.length} Questions</span>
              </div>

              <h3 className="text-base font-extrabold text-[#3D2E1E] dark:text-white">{quiz.title}</h3>
              <p className="text-xs text-[#765C43] dark:text-[#d4c5b3]">{quiz.description}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
}
