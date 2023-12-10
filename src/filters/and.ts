import { MergeDeep } from 'type-fest'
/**
 * @description
 *   Creates a function that performs a logical AND operation on two predicates applied to an object.
 *   This function is useful for combining two conditions that need to be checked on a single or merged object.
 *
 * @param p1 - The first predicate function that takes an object of type O1 and returns a boolean.
 * @param p2 - The second predicate function that takes an object of type O2 and returns a boolean.
 * @returns A function that takes a merged object of types O1 and O2, applies both predicate functions, and returns true if both predicates are true, otherwise false.
 *
 * @example
 *   type User = { name: string; age: number; };
 *   type Address = { city: string; };
 *   const isAdult = (user: User) => user.age >= 18;
 *   const isFromNY = (address: Address) => address.city === 'New York';
 *
 *   // Combining predicates
 *   const isAdultFromNY = and<User, Address>(isAdult, isFromNY);
 *
 *   // Usage
 *   const user = { name: 'Alice', age: 30 };
 *   const address = { city: 'New York' };
 *   const result = isAdultFromNY({ ...user, ...address }); // returns true
 */
export function and<O1 extends object, O2 extends object>(
  p1: (object: O1) => boolean,
  p2: (object: O2) => boolean
): { (object: MergeDeep<O1, O2>): boolean } {
  return function (obj: MergeDeep<O1, O2>): boolean {
    return p1(obj as unknown as O1) && p2(obj as unknown as O2)
  }
}
