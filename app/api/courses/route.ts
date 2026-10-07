import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { Course } from '@/lib/types';

export async function GET() {
  const db = getDb();
  return NextResponse.json({ courses: db.courses });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();

    const newCourse: Course = {
      id: `crs-${Date.now()}`,
      name: body.name,
      category: body.category || 'DEVELOPMENT',
      price: Number(body.price) || 0,
      description: body.description || '',
      driveUrl: body.driveUrl || '',
      instructor: body.instructor || 'Academy Instructor',
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdAt: new Date().toISOString()
    };

    db.courses.push(newCourse);
    saveDb(db);

    return NextResponse.json({ course: newCourse }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create course' }, { status: 400 });
  }
}
