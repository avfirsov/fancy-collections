import { MergeDeep } from 'type-fest'

/**
 * @description
 *   Creates a function that performs a logical OR operation on two predicates applied to an object.
 *   This function is useful for checking if at least one of two conditions is met on a single or merged object.
 *
 * @param p1 - The first predicate function that takes an object of type O1 and returns a boolean.
 * @param p2 - The second predicate function that takes an object of type O2 and returns a boolean.
 * @returns A function that takes a merged object of types O1 and O2, applies both predicate functions, and returns true if either predicate is true, otherwise false.
 *
 * @example
 *   type User = { name: string; age: number; };
 *   type Address = { city: string; };
 *   const isMinor = (user: User) => user.age < 18;
 *   const isFromLA = (address: Address) => address.city === 'Los Angeles';
 *
 *   // Combining predicates
 *   const isMinorOrFromLA = or<User, Address>(isMinor, isFromLA);
 *
 *   // Usage
 *   const user = { name: 'Bob', age: 20 };
 *   const address = { city: 'Los Angeles' };
 *   const result = isMinorOrFromLA({ ...user, ...address }); // returns true (user is from Los Angeles)
 */
export function or<O1 extends object, O2 extends object>(
  p1: (object: O1) => boolean,
  p2: (object: O2) => boolean
): { (object: MergeDeep<O1, O2>): boolean } {
  return function (obj: MergeDeep<O1, O2>): boolean {
    return p1(obj as unknown as O1) || p2(obj as unknown as O2)
  }
}
