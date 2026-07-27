import crypto from 'crypto';

/**
 * Secure password hashing using PBKDF2 (SHA-512)
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify password against stored PBKDF2 hash (salt:hash)
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    if (!storedHash || !storedHash.includes(':')) {
      // Legacy or mock fallback check
      return password === storedHash;
    }
    const [salt, originalHash] = storedHash.split(':');
    const hashToVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(originalHash, 'hex'), Buffer.from(hashToVerify, 'hex'));
  } catch {
    return false;
  }
}

/**
 * Generate a simple secure random session token
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
