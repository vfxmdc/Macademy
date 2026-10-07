import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { validateBookingAvailability } from '@/lib/availability';
import { Booking } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const resourceId = searchParams.get('resourceId');
    const status = searchParams.get('status');

    const db = getDb();
    let bookings = db.bookings;

    if (clientId) {
      bookings = bookings.filter(b => b.clientId === clientId);
    }
    if (resourceId) {
      bookings = bookings.filter(b => b.resourceId === resourceId);
    }
    if (status) {
      bookings = bookings.filter(b => b.status === status);
    }

    // Sort newest first
    bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ bookings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientId,
      clientName,
      clientPhone,
      resourceId,
      serviceId,
      bookingMode,
      startDateTime,
      endDateTime,
      notes,
      price,
      createdByAdmin
    } = body;

    if (!clientId || !resourceId || !startDateTime || !endDateTime) {
      return NextResponse.json(
        { error: 'Client, Resource, Start Time, and End Time are required' },
        { status: 400 }
      );
    }

    // Availability validation check
    const validation = validateBookingAvailability(
      resourceId,
      startDateTime,
      endDateTime
    );

    if (!validation.isAvailable) {
      return NextResponse.json(
        { error: validation.reason || 'Requested slot is not available' },
        { status: 409 }
      );
    }

    const db = getDb();
    const clientObj = db.clients.find(c => c.id === clientId);
    const resource = db.resources.find(r => r.id === resourceId);
    const service = serviceId ? db.services.find(s => s.id === serviceId) : null;

    const finalClientName = clientName || (clientObj ? clientObj.name : 'Walk-in Client');
    const finalClientPhone = clientPhone || (clientObj ? clientObj.phone : '');

    const newBooking: Booking = {
      id: `bk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      clientId,
      clientName: finalClientName,
      clientPhone: finalClientPhone,
      resourceId,
      resourceName: resource ? resource.name : 'Unknown Resource',
      serviceId: serviceId || null,
      serviceName: service ? service.name : null,
      bookingMode: bookingMode || (resource ? resource.bookingMode : 'TIME_SLOT'),
      startDateTime,
      endDateTime,
      status: 'CONFIRMED',
      notes: notes || '',
      price: price !== undefined ? price : (service ? service.price : resource ? resource.price : 0),
      createdByAdmin: createdByAdmin || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.bookings.push(newBooking);
    saveDb(db);

    return NextResponse.json({ success: true, booking: newBooking }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

