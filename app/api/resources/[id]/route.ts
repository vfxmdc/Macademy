import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDb();
    
    const index = db.resources.findIndex(r => r.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    db.resources[index] = {
      ...db.resources[index],
      ...body
    };

    saveDb(db);
    return NextResponse.json({ resource: db.resources[index] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    db.resources = db.resources.filter(r => r.id !== id);
    saveDb(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 });
  }
}
