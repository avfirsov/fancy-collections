/**
 * @description
 *   Creates a function that negates the result of a given predicate function.
 *   This is useful for creating the inverse of an existing condition or validation function.
 *
 * @param predicate - The predicate function whose result will be negated.
 * @returns A function that takes the same arguments as the predicate and returns the negated boolean result.
 *
 * @example
 *   // Example predicate function
 *   const isEven = (num: number) => num % 2 === 0;
 *
 *   // Using `not` to create the inverse function
 *   const isOdd = not(isEven);
 *
 *   // Usage
 *   const result = isOdd(3); // returns true, since 3 is odd
 */
export function not<P extends (...args: any[]) => boolean>(
  predicate: P
): { (...args: Parameters<P>): boolean } {
  return function (...args): boolean {
    return !predicate(...args)
  }
}
