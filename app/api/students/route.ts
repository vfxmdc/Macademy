import { NextResponse } from 'next/server';
import { getDb, saveDb, generateAccessCode } from '@/lib/db';
import { Student } from '@/lib/types';

export async function GET() {
  const db = getDb();
  return NextResponse.json({ students: db.students });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();

    const newStudent: Student = {
      id: `std-${Date.now()}`,
      name: body.name,
      email: body.email || '',
      phone: body.phone || '',
      accessCode: body.accessCode || generateAccessCode(),
      progressPercentage: Number(body.progressPercentage) || 10,
      enrolledCourseIds: body.enrolledCourseIds || [],
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    db.students.push(newStudent);
    saveDb(db);

    return NextResponse.json({ student: newStudent }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create student' }, { status: 400 });
  }
}
