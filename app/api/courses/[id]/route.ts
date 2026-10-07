import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDb();

    const idx = db.courses.findIndex(c => c.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    db.courses[idx] = {
      ...db.courses[idx],
      ...body
    };

    saveDb(db);
    return NextResponse.json({ course: db.courses[idx] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update course' }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    db.courses = db.courses.filter(c => c.id !== id);
    saveDb(db);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete course' }, { status: 400 });
  }
}
