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

    const idx = db.students.findIndex(s => s.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    db.students[idx] = {
      ...db.students[idx],
      ...body
    };

    saveDb(db);
    return NextResponse.json({ student: db.students[idx] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update student' }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    db.students = db.students.filter(s => s.id !== id);
    saveDb(db);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete student' }, { status: 400 });
  }
}
