import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// POST /api/admins/login
// Body: { name, code }
// Returns the admin object (without code) if credentials match
export async function POST(req: NextRequest) {
  const db = getDb();
  const body = await req.json();
  const { name, code } = body;

  if (!name?.trim() || !code?.trim()) {
    return NextResponse.json({ error: 'Name and code are required.' }, { status: 400 });
  }

  const found = db.admins.find(
    a => a.name.toLowerCase() === name.trim().toLowerCase() && a.code === code.trim()
  );

  if (!found) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  // Never send code back to client
  return NextResponse.json({
    id: found.id,
    name: found.name,
    isSuperAdmin: found.isSuperAdmin,
    createdAt: found.createdAt,
  });
}
