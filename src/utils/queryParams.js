/**
 * Query param helpers for controllers.
 * Keep controllers clean and consistent.
 */

/**
 * Parse boolean query params safely.
 * Accepts: true/false/1/0 (case-insensitive).
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function parseBoolean(value) {
  if (typeof value !== 'string') return false;
  const v = value.trim().toLowerCase();
  return v === 'true' || v === '1';
}

/**
 * Parse a CSV string like "comments,author" into a Set.
 *
 * @param {unknown} value
 * @returns {Set<string>}
 */
export function parseCsvSet(value) {
  if (typeof value !== 'string') return new Set();
  return new Set(
    value
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}
