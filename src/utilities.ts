/**
 * Creates a new record with all keys converted to lowercase.
 * @param obj The input record.
 * @returns A new record with lowercase keys.
 */
export function lowercaseKeys<T>(obj: Record<string, T>): Record<string, T> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key.toLowerCase(), value]),
  );
}