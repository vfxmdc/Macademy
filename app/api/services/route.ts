import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { Service } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get('resourceId');

    const db = getDb();
    let services = db.services;

    if (resourceId) {
      services = services.filter(s => s.resourceId === resourceId || s.resourceId === null);
    }

    return NextResponse.json({ services });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, resourceId, durationMinutes, price, description } = body;

    if (!name) {
      return NextResponse.json({ error: 'Service name is required' }, { status: 400 });
    }

    const db = getDb();
    const newService: Service = {
      id: `srv-${Date.now()}`,
      name,
      resourceId: resourceId || null,
      durationMinutes: Number(durationMinutes) || 30,
      price: Number(price) || 0,
      description: description || '',
      createdAt: new Date().toISOString()
    };

    db.services.push(newService);
    saveDb(db);

    return NextResponse.json({ service: newService }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
