import { Get, IsEqual, Join, MergeDeep, Paths, Split } from 'type-fest'
import { Head } from 'ts-toolbelt/out/List/Head'
import { Tail } from 'ts-toolbelt/out/List/Tail'
import { IsZero } from 'ts-toolbelt/out/Number/IsZero'
import { Length } from 'ts-toolbelt/out/List/Length'
import { Cast } from 'ts-toolbelt/out/Any/Cast'
import { Equals } from 'ts-toolbelt/out/Any/Equals'
import { Extends } from 'ts-toolbelt/out/Any/Extends'

type _IsValidPath<ObjValue, Value, Mode extends CheckMode> = Equals<
  Mode,
  'equals'
> extends 1
  ? Equals<ObjValue, Value>
  : Extends<ObjValue, Value>

type CheckMode = 'extends' | 'equals'

/**
 * @description Returns a union of the keys of an object O where the values are of a specified type Value.
 * @example
 *
 * type Person = {
 *   name: string;
 *   age: number;
 *   address: {
 *     street: string;
 *     city: string;
 *   };
 * };
 *
 * type StringPaths = ValidPathToValue<Person, string>; // "name" | "address.street" | "address.city"
 */
export type ValidPathToValue<
  O extends object,
  Value,
  Mode extends CheckMode = 'extends',
> = {
  [Path in Paths<O>]: _IsValidPath<
    Get<O, Cast<Path, string>>,
    Value,
    Mode
  > extends 1
    ? Path
    : never
}[Paths<O>]

/**
 * @description returns a union of the indexable keys of an object O
 * @example
 *
 * type Person = {
 *   name: string;
 *   age: number;
 *   address: {
 *     street: string;
 *     city: string;
 *   };
 * };
 *
 * type IndexableKeys = ValidPathToIndexableKey<Person, string>; // "name" | "address.street" | "address.city" | "age"
 *
 */
export type ValidPathToIndexableKey<O extends object> = ValidPathToValue<
  O,
  keyof any
>

/**
 * @description Reconstructs an object type based on the provided path and value.
 * It takes two type parameters, P and Value. P is a string that represents a path within an object, and Value is the type of the value at that path.
 * If the path is an empty string, it returns the Value type directly. Otherwise, it recursively constructs an object
 * type where each key is a segment of the path and the value is the result of the recursive call with the rest of the path and the Value type.
 * This type is useful for creating types that represent a specific structure within a larger object type.
 *
 * @example
 *
 * type Address =  {
 *     street: string;
 *     city: string;
 *   };
 *
 * type HasDataAddress = ReconstructObjByPath<'data.address', Address>;
 *
 * type User = {
 *   name: string;
 *   age: number;
 *   data: {
 *      address: Address;
 *   }
 * };
 *
 * type IsTrue = User extends HasDataAddress ? true : false //true
 *
 */

const isTrue: undefined extends string | undefined ? true : false = true
export type ReconstructObjByPath<P extends string, Value> = IsEqual<
  P,
  ''
> extends true
  ? Value
  : //if Value is optional, then path can be optional too
    undefined extends Value
    ? {
        [Segment in Head<Split<P, '.'>>]?: ReconstructObjByPath<
          Join<Tail<Split<P, '.'>>, '.'>,
          Value
        >
      }
    : {
        [Segment in Head<Split<P, '.'>>]: ReconstructObjByPath<
          Join<Tail<Split<P, '.'>>, '.'>,
          Value
        >
      }

/**
 * @description Multi-path version of ReconstructObjByPath
 *
 * @example
 *
 * type User = {
 *   name: string;
 *   age: number;
 *   data: {
 *      address: {
 *          street: string;
 *          city: string;
 *      };
 *   }
 * };
 *
 * type HasStringNameStreetCity = ReconstructObjByPaths<['name', 'data.address.street', 'data.address.city'], string>
 * type IsTrue = User extends HasStringNameStreetCity ? true : false //true
 *
 */
export type ReconstructObjByPaths<P extends readonly string[], Value> = IsZero<
  Length<P>
> extends 1
  ? {}
  : IsEqual<Length<P>, 1> extends true
    ? ReconstructObjByPath<Head<P>, Value>
    : MergeDeep<
        ReconstructObjByPath<Head<P>, Value>,
        ReconstructObjByPaths<Tail<P>, Value>
      >
