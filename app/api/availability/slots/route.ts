import { NextRequest, NextResponse } from 'next/server';
import { generateTimeSlotsForDate } from '@/lib/availability';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get('resourceId');
    const date = searchParams.get('date');

    if (!resourceId || !date) {
      return NextResponse.json(
        { error: 'resourceId and date (YYYY-MM-DD) are required' },
        { status: 400 }
      );
    }

    const slots = generateTimeSlotsForDate(resourceId, date);
    return NextResponse.json({ slots });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate time slots' }, { status: 500 });
  }
}
