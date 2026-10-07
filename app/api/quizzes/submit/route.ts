import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { QuizSubmission } from '@/lib/types';

export async function GET() {
  const db = getDb();
  return NextResponse.json({ submissions: db.submissions });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();

    const quiz = db.quizzes.find(q => q.id === body.quizId);
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const answers: number[] = body.answers || []; // indices chosen by student
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] !== undefined && answers[idx] === q.correctOptionIndex) {
        score += 1;
      }
    });

    const totalQuestions = quiz.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    const submission: QuizSubmission = {
      id: `sub-${Date.now()}`,
      studentId: body.studentId || 'std-1',
      studentName: body.studentName || 'Student',
      quizId: quiz.id,
      courseId: quiz.courseId,
      score,
      totalQuestions,
      percentage,
      submittedAt: new Date().toISOString()
    };

    db.submissions.push(submission);

    // Optionally update student percentage progress if score is good!
    const stdIdx = db.students.findIndex(s => s.id === submission.studentId);
    if (stdIdx !== -1) {
      // Increase progress percentage if quiz passed!
      const current = db.students[stdIdx].progressPercentage || 10;
      if (percentage >= 50) {
        db.students[stdIdx].progressPercentage = Math.min(100, current + 15);
      }
    }

    saveDb(db);

    return NextResponse.json({ submission, quizResult: { score, totalQuestions, percentage } }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to submit quiz' }, { status: 400 });
  }
}
