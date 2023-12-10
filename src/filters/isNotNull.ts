/**
 * Predicate function for filtering out null values in an array.
 * Ensures the resulting array is typed without null.
 *
 * @param {any} item - The item to be checked.
 * @returns {boolean} True if the item is not null.
 *
 * @example
 * // Filtering out null values from an array
 * const users: Array<{ name: string } | null> = [{ name: 'Alice' }, null];
 * const onlyUsers = users.filter(isNotNull);
 */

export function isNotNull<T>(item: T | null): item is T {
  return item !== null
}
