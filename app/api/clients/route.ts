import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, generateAccessCode } from '@/lib/db';
import { Client } from '@/lib/types';

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json({ clients: db.clients });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, accessCode } = body;

    if (!name) {
      return NextResponse.json({ error: 'Client name is required' }, { status: 400 });
    }

    const db = getDb();

    // Use provided accessCode or generate new unique one
    let finalCode = accessCode ? accessCode.trim().toUpperCase() : generateAccessCode();
    
    // Ensure code uniqueness
    let attempts = 0;
    while (db.clients.some(c => c.accessCode.toUpperCase() === finalCode) && attempts < 10) {
      finalCode = generateAccessCode();
      attempts++;
    }

    const newClient: Client = {
      id: `cli-${Date.now()}`,
      name,
      email: email || '',
      phone: phone || '',
      accessCode: finalCode,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    db.clients.push(newClient);
    saveDb(db);

    return NextResponse.json({ client: newClient }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}
