import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/db';

export async function GET() {
  const cookieStore = await cookies();
  const code = cookieStore.get('student_access_code')?.value;

  if (!code) {
    return NextResponse.json({ student: null });
  }

  const db = getDb();
  const student = db.students.find(s => s.accessCode === code);

  return NextResponse.json({ student: student || null });
}
