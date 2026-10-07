import { cookies } from 'next/headers';
import { getDb } from './db';
import { Client } from './types';

export async function getCurrentClient(): Promise<Client | null> {
  try {
    const cookieStore = await cookies();
    const accessCode = cookieStore.get('client_access_code')?.value;
    if (!accessCode) return null;

    const db = getDb();
    const client = db.clients.find(
      c => c.accessCode.toUpperCase() === accessCode.toUpperCase() && c.status === 'ACTIVE'
    );
    return client || null;
  } catch (error) {
    return null;
  }
}
