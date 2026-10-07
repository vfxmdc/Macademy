import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { accessCode } = await request.json();
    const db = getDb();

    const student = db.students.find(
      s => s.accessCode.trim().toUpperCase() === accessCode.trim().toUpperCase()
    );

    if (!student) {
      return NextResponse.json({ error: 'Invalid access code.' }, { status: 401 });
    }

    if (student.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Account is deactivated.' }, { status: 403 });
    }

    const cookieStore = await cookies();
    cookieStore.set('student_access_code', student.accessCode, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return NextResponse.json({ student });
  } catch (err: any) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
