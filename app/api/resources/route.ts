import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { Resource } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const db = getDb();
    let resources = db.resources;

    if (activeOnly) {
      resources = resources.filter(r => r.isActive);
    }

    return NextResponse.json({ resources });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, bookingMode, slotDurationMinutes, price, priceUnit, description, location, imageUrl } = body;

    if (!name || !category || !bookingMode) {
      return NextResponse.json({ error: 'Name, category, and booking mode are required' }, { status: 400 });
    }

    const db = getDb();
    const newResource: Resource = {
      id: `res-${Date.now()}`,
      name,
      category,
      bookingMode,
      slotDurationMinutes: Number(slotDurationMinutes) || 30,
      price: Number(price) || 0,
      priceUnit: priceUnit || (bookingMode === 'TIME_SLOT' ? 'per_slot' : 'per_day'),
      description: description || '',
      location: location || '',
      imageUrl: imageUrl || '',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    db.resources.push(newResource);
    saveDb(db);

    return NextResponse.json({ resource: newResource }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 });
  }
}
