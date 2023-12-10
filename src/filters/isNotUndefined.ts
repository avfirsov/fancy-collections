/**
 * Predicate function for filtering out undefined values in an array.
 * Ensures the resulting array is typed without undefined.
 *
 * @param {any} item - The item to be checked.
 * @returns {boolean} True if the item is not undefined.
 *
 * @example
 * // Filtering out undefined values from an array
 * const users: Array<{ name: string } | undefined> = [{ name: 'Bob' }, undefined];
 * const definedUsers = usersWithUndefined.filter(isNotUndefined);
 */

export function isNotUndefined<T>(item: T | undefined | void): item is T {
  return typeof item !== 'undefined'
}
