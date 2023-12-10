export interface FilterStringOptions {
  //default: false
  caseSensitive?: boolean
  //default: false
  matchFull?: boolean
}

/**
 * Creates a function to check if a string (haystack) contains or matches another string (needle).
 * The function can be customized for case sensitivity and full or partial string matching.
 *
 * @param {string} needle - The string to match against the haystack.
 * @param {FilterStringOptions} [opts] - Optional settings for case sensitivity and full/partial string matching.
 * @returns {(haystack: string) => boolean} A function that takes a haystack string and returns true if it matches the needle according to specified options.
 *
 * @example
 * // Standard case-insensitive partial match
 * const matchHello = matchesString('Hello');
 * console.log(matchHello('Hello World'));  // true (partial match)
 * console.log(matchHello('Hi there'));     // false (no match)
 *
 * @example
 * // Case-sensitive match
 * const matchHelloCaseSensitive = matchesString('hello', { caseSensitive: true });
 * console.log(matchHelloCaseSensitive('Hello')); // false (case mismatch)
 * console.log(matchHelloCaseSensitive('hello')); // true (exact match)
 *
 * @example
 * // Full string match
 * const matchFullString = matchesString('Hello', { matchFull: true });
 * console.log(matchFullString('Hello World'));   // false (partial match)
 * console.log(matchFullString('Hello'));         // true (full match)
 */

export function matchesString(
  needle: string,
  opts?: FilterStringOptions
): { (haystack: string): boolean } {
  const compareNeedle = !!opts?.caseSensitive ? needle : needle.toLowerCase()
  return function (haystack: string): boolean {
    const compareHaystack = !!opts?.caseSensitive
      ? haystack
      : haystack.toLowerCase()
    const haystackIncludesNeedle = compareHaystack.includes(compareNeedle)
    return !!opts?.matchFull
      ? haystackIncludesNeedle && compareNeedle.includes(compareHaystack)
      : haystackIncludesNeedle
  }
}
