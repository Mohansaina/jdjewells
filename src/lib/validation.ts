/**
 * Shared input validation and sanitization utility functions
 * for JD Jewel Backend API routes.
 */

// Strip HTML tags to mitigate cross-site scripting (XSS)
export function sanitizeString(str: string): string {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

// Standard RFC 5322 Email regex validator
export function validateEmail(email: string): boolean {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Generic phone validation: allows numbers, spaces, plus sign, hyphens, and parenthesis
export function validatePhone(phone: string): boolean {
  if (typeof phone !== 'string') return false;
  const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/;
  // Make sure we have at least 7 digits to prevent dummy numeric spam
  const digits = phone.replace(/\D/g, '');
  return phoneRegex.test(phone) && digits.length >= 7;
}

// Set of allowed shapes to restrict arbitrary injection into diamond routes
export const ALLOWED_SHAPES = [
  'Round',
  'Oval',
  'Cushion',
  'Princess',
  'Emerald',
  'Pear',
  'Marquise',
  'Radiant',
  'Heart'
];

export function validateShape(shape: string): boolean {
  if (typeof shape !== 'string') return false;
  return ALLOWED_SHAPES.some(s => s.toLowerCase() === shape.toLowerCase());
}

// Set of allowed categories in our catalog
export const ALLOWED_CATEGORIES = [
  'engagement rings',
  'wedding bands',
  'rings',
  'earrings',
  'pendants',
  'bracelets',
  'necklaces',
  'custom'
];

export function validateCategory(category: string): boolean {
  if (typeof category !== 'string') return false;
  return ALLOWED_CATEGORIES.some(c => c.toLowerCase() === category.toLowerCase());
}
