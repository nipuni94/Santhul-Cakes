import { cookies } from 'next/headers';
import { randomBytes, createHmac } from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'santhul-dev-secret-change-in-prod';
const SESSION_COOKIE = 'admin_session';

/**
 * Creates a signed session token = payload.signature
 */
function signToken(payload: string): string {
    const signature = createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
    return `${payload}.${signature}`;
}

/**
 * Verifies a signed session token
 */
function verifyToken(token: string): boolean {
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [payload, signature] = parts;
    const expected = createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
    return signature === expected;
}

/**
 * Creates an admin session cookie with a signed token
 */
export async function createAdminSession(): Promise<void> {
    const cookieStore = await cookies();
    const payload = randomBytes(32).toString('hex');
    const token = signToken(payload);
    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });
}

/**
 * Destroys the admin session cookie
 */
export async function destroyAdminSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}

/**
 * Returns true if the current request has a valid admin session
 */
export async function isAdminAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE);
    if (!session?.value) return false;
    return verifyToken(session.value);
}

/**
 * Throws an error if the current request is not authenticated as admin.
 * Call at the top of every admin-only server action.
 */
export async function ensureAdmin(): Promise<void> {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
        throw new Error('Unauthorized: Admin access required');
    }
}
