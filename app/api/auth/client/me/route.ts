import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const accessCode = request.cookies.get('client_access_code')?.value || 
                       request.headers.get('x-client-access-code');

    if (!accessCode) {
      return NextResponse.json({ client: null });
    }

    const db = getDb();
    const client = db.clients.find(
      c => c.accessCode.toUpperCase() === accessCode.trim().toUpperCase() && c.status === 'ACTIVE'
    );

    return NextResponse.json({ client: client || null });
  } catch (error) {
    return NextResponse.json({ client: null });
  }
}
