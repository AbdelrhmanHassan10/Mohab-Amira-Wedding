// Firebase Realtime Database + Auth over their REST APIs (no SDK needed for this small site).

const DB_URL = import.meta.env.VITE_FIREBASE_DB_URL?.replace(/\/$/, '');
const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

export type Attending = 'yes' | 'no';

export interface Rsvp {
  id: string;
  name: string;
  attending: Attending;
  message?: string;
  createdAt: number;
}

export const isRsvpConfigured = Boolean(DB_URL);

/** Adds one RSVP under /rsvps (anyone may create; database rules validate the fields). */
export async function submitRsvp(data: { name: string; attending: Attending; message: string }) {
  if (!DB_URL) throw new Error('RSVP database is not configured');
  const res = await fetch(`${DB_URL}/rsvps.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, createdAt: { '.sv': 'timestamp' } }),
  });
  if (!res.ok) throw new Error(`RSVP was not saved (${res.status})`);
}

export interface Session {
  idToken: string;
  email: string;
  expiresAt: number;
}

/** Email/password sign-in (Firebase Authentication). */
export async function signIn(email: string, password: string): Promise<Session> {
  if (!API_KEY) throw new Error('VITE_FIREBASE_API_KEY is missing in .env');
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );
  const body = await res.json();
  if (!res.ok) {
    const code: string = body?.error?.message ?? '';
    throw new Error(
      code.includes('INVALID') || code.includes('EMAIL_NOT_FOUND') || code.includes('PASSWORD')
        ? 'Wrong email or password.'
        : `Sign-in failed (${code || res.status})`
    );
  }
  return {
    idToken: body.idToken,
    email: body.email,
    expiresAt: Date.now() + Number(body.expiresIn) * 1000,
  };
}

export class UnauthorizedError extends Error {}

/** Reads every RSVP, newest first (only the owner account is allowed by the rules). */
export async function fetchRsvps(idToken: string): Promise<Rsvp[]> {
  if (!DB_URL) throw new Error('RSVP database is not configured');
  const res = await fetch(`${DB_URL}/rsvps.json?auth=${encodeURIComponent(idToken)}`);
  if (res.status === 401 || res.status === 403) throw new UnauthorizedError('Not allowed to read responses');
  if (!res.ok) throw new Error(`Could not load responses (${res.status})`);
  const data: Record<string, Omit<Rsvp, 'id'>> | null = await res.json();
  return Object.entries(data ?? {})
    .map(([id, r]) => ({ id, ...r }))
    .sort((a, b) => b.createdAt - a.createdAt);
}
