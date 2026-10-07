import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessCode } = body;

    if (!accessCode || typeof accessCode !== 'string') {
      return NextResponse.json(
        { error: 'Access code is required' },
        { status: 400 }
      );
    }

    const cleanCode = accessCode.trim().toUpperCase();
    const db = getDb();

    const client = db.clients.find(
      c => c.accessCode.toUpperCase() === cleanCode
    );

    if (!client) {
      return NextResponse.json(
        { error: 'Invalid access code. Please check and try again.' },
        { status: 401 }
      );
    }

    if (client.status === 'DISABLED') {
      return NextResponse.json(
        { error: 'This access code has been disabled by the administrator.' },
        { status: 403 }
      );
    }

    const response = NextResponse.json({
      success: true,
      client
    });

    // Set cookie for authentication
    response.cookies.set('client_access_code', client.accessCode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
