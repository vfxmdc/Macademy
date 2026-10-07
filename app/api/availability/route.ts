import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { AvailabilityRule, BlockRule } from '@/lib/types';

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json({
      availabilityRules: db.availabilityRules,
      blockRules: db.blockRules
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch availability rules' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;
    const db = getDb();

    if (type === 'BLOCK') {
      const { resourceId, title, startDate, endDate, startTime, endTime } = data;
      if (!startDate || !endDate) {
        return NextResponse.json({ error: 'Start and end dates are required' }, { status: 400 });
      }

      const newBlock: BlockRule = {
        id: `blk-${Date.now()}`,
        resourceId: resourceId || 'ALL',
        title: title || 'Blocked Period',
        startDate,
        endDate,
        startTime: startTime || '00:00',
        endTime: endTime || '23:59',
        createdAt: new Date().toISOString()
      };

      db.blockRules.push(newBlock);
      saveDb(db);
      return NextResponse.json({ blockRule: newBlock }, { status: 201 });
    }

    if (type === 'RULE') {
      const { resourceId, dayOfWeek, startTime, endTime, isAvailable } = data;
      const newRule: AvailabilityRule = {
        id: `rule-${Date.now()}`,
        resourceId: resourceId || 'ALL',
        dayOfWeek: Number(dayOfWeek) ?? 1,
        startTime: startTime || '09:00',
        endTime: endTime || '17:00',
        isAvailable: isAvailable !== false
      };

      db.availabilityRules.push(newRule);
      saveDb(db);
      return NextResponse.json({ availabilityRule: newRule }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid availability rule type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save rule' }, { status: 500 });
  }
}
