import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { AdminUser } from '@/lib/types';

// GET /api/admins   → list all admins (names + ids, no codes in response)
export async function GET() {
  const db = getDb();
  // Strip codes from public list for security
  const safe = db.admins.map(({ id, name, isSuperAdmin, createdAt }) => ({
    id, name, isSuperAdmin, createdAt,
  }));
  return NextResponse.json(safe);
}

// POST /api/admins   → add a new sub-admin (super admin only)
// Body: { requesterId, name, code }
export async function POST(req: NextRequest) {
  const db = getDb();
  const body = await req.json();
  const { requesterId, name, code } = body;

  const requester = db.admins.find(a => a.id === requesterId);
  if (!requester?.isSuperAdmin) {
    return NextResponse.json({ error: 'Unauthorized. Only the super admin can add admins.' }, { status: 403 });
  }

  if (!name?.trim() || !code?.trim()) {
    return NextResponse.json({ error: 'Name and code are required.' }, { status: 400 });
  }

  if (db.admins.some(a => a.name.toLowerCase() === name.trim().toLowerCase())) {
    return NextResponse.json({ error: 'An admin with this name already exists.' }, { status: 409 });
  }

  const newAdmin: AdminUser = {
    id: `admin-${Date.now()}`,
    name: name.trim(),
    code: code.trim(),
    isSuperAdmin: false,
    createdAt: new Date().toISOString(),
  };

  db.admins.push(newAdmin);
  saveDb(db);

  return NextResponse.json({ id: newAdmin.id, name: newAdmin.name, isSuperAdmin: false, createdAt: newAdmin.createdAt }, { status: 201 });
}

// DELETE /api/admins   → remove a sub-admin (super admin only)
// Body: { requesterId, targetId }
export async function DELETE(req: NextRequest) {
  const db = getDb();
  const body = await req.json();
  const { requesterId, targetId } = body;

  const requester = db.admins.find(a => a.id === requesterId);
  if (!requester?.isSuperAdmin) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const target = db.admins.find(a => a.id === targetId);
  if (!target) {
    return NextResponse.json({ error: 'Admin not found.' }, { status: 404 });
  }
  if (target.isSuperAdmin) {
    return NextResponse.json({ error: 'Cannot remove the super admin.' }, { status: 400 });
  }

  db.admins = db.admins.filter(a => a.id !== targetId);
  saveDb(db);
  return NextResponse.json({ success: true });
}
