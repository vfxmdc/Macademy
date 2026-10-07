import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { Quiz } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');
  const db = getDb();

  let quizzes = db.quizzes;
  if (courseId) {
    quizzes = quizzes.filter(q => q.courseId === courseId);
  }

  return NextResponse.json({ quizzes });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();

    const newQuiz: Quiz = {
      id: `qz-${Date.now()}`,
      courseId: body.courseId,
      title: body.title,
      description: body.description || '',
      questions: body.questions || [],
      createdAt: new Date().toISOString()
    };

    db.quizzes.push(newQuiz);
    saveDb(db);

    return NextResponse.json({ quiz: newQuiz }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create quiz' }, { status: 400 });
  }
}
