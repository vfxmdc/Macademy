import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { validateBookingAvailability } from '@/lib/availability';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDb();

    const bookingIndex = db.bookings.findIndex(b => b.id === id);
    if (bookingIndex === -1) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const currentBooking = db.bookings[bookingIndex];
    const targetResourceId = body.resourceId || currentBooking.resourceId;
    const targetStart = body.startDateTime || currentBooking.startDateTime;
    const targetEnd = body.endDateTime || currentBooking.endDateTime;
    const targetStatus = body.status || currentBooking.status;

    // If changing dates, resource, or changing status to non-cancelled, validate double booking
    if (
      targetStatus !== 'CANCELLED' &&
      (body.startDateTime || body.endDateTime || body.resourceId || (currentBooking.status === 'CANCELLED' && targetStatus !== 'CANCELLED'))
    ) {
      const availabilityCheck = validateBookingAvailability(
        targetResourceId,
        targetStart,
        targetEnd,
        id // exclude current booking ID
      );

      if (!availabilityCheck.isAvailable) {
        return NextResponse.json(
          { error: availabilityCheck.reason || 'Requested new date/time slot is not available.' },
          { status: 409 }
        );
      }
    }

    // Update names if resource or client changed
    let resourceName = currentBooking.resourceName;
    if (body.resourceId) {
      const resObj = db.resources.find(r => r.id === body.resourceId);
      if (resObj) resourceName = resObj.name;
    }

    let clientName = currentBooking.clientName;
    let clientPhone = currentBooking.clientPhone;
    if (body.clientId) {
      const cliObj = db.clients.find(c => c.id === body.clientId);
      if (cliObj) {
        clientName = cliObj.name;
        clientPhone = cliObj.phone;
      }
    }

    let serviceName = currentBooking.serviceName;
    if (body.serviceId) {
      const srvObj = db.services.find(s => s.id === body.serviceId);
      serviceName = srvObj ? srvObj.name : null;
    }

    db.bookings[bookingIndex] = {
      ...currentBooking,
      ...body,
      resourceName,
      clientName,
      clientPhone,
      serviceName,
      updatedAt: new Date().toISOString()
    };

    saveDb(db);

    return NextResponse.json({ booking: db.bookings[bookingIndex] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    // Soft cancel or remove
    const index = db.bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      // Set to CANCELLED to immediately release availability
      db.bookings[index].status = 'CANCELLED';
      db.bookings[index].updatedAt = new Date().toISOString();
      saveDb(db);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
  }
}
