import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, generateAccessCode } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, ...updateData } = body;

    const db = getDb();
    const index = db.clients.findIndex(c => c.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    if (action === 'REGENERATE_CODE') {
      let newCode = generateAccessCode();
      while (db.clients.some(c => c.accessCode.toUpperCase() === newCode)) {
        newCode = generateAccessCode();
      }
      db.clients[index].accessCode = newCode;
    } else {
      db.clients[index] = {
        ...db.clients[index],
        ...updateData
      };
    }

    saveDb(db);
    return NextResponse.json({ client: db.clients[index] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    db.clients = db.clients.filter(c => c.id !== id);
    saveDb(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
  }
}
