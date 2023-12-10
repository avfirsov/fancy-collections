import { Get, LiteralToPrimitive, MergeDeep, Paths } from 'type-fest'
import { ReconstructObjByPath, ValidPathToValue } from './types'
import { Cast } from 'ts-toolbelt/out/Any/Cast'
import { get } from './get'
import _set from 'lodash.set'
import { Equals } from 'ts-toolbelt/out/Any/Equals'

/**
 * @description
 *   Retrieves the value at a specified path from the provided object.
 * @param object - The object from which the value is plucked.
 * @returns The value at the specified path in the object.
 * @example
 *   const pluckName = pluck('name', 'Unknown');
 *   const userName = pluckName.get(user); // Retrieves 'name' from user, or 'Unknown' if not present.
 */
type PluckReturnsGet<P extends string, Fallback> = {
  <O extends object>(
    object: P extends ValidPathToValue<O, Fallback | undefined> ? O : never
  ): Equals<Fallback, any> extends 1
    ? Get<O, Cast<P, string>>
    : //passing objects to LiteralToPrimitive leads to errors
      Fallback extends object
      ? Fallback
      : //otherwise Fallback is interpreted as literal and it leads to P equals never
        LiteralToPrimitive<Fallback>
}

type _ValidObjOrNever<
  P extends string,
  Fallback,
  T extends Fallback,
  O extends object,
> = Equals<Fallback, any> extends 1
  ? P extends ValidPathToValue<O, T>
    ? O
    : never
  : P extends ValidPathToValue<O, T | undefined>
    ? O
    : never

type _ReconstructObj<P extends string, Fallback, T extends Fallback> = Equals<
  Fallback,
  any
> extends 1
  ? ReconstructObjByPath<P, T>
  : ReconstructObjByPath<P, T | undefined>

type PluckReturnsSortReturns<P extends string, Fallback, T extends Fallback> = {
  <O extends object>(
    o1: _ValidObjOrNever<P, Fallback, T, O>,
    o2: _ValidObjOrNever<P, Fallback, T, O>
  ): number

  (
    o1: _ReconstructObj<P, Fallback, T>,
    o2: _ReconstructObj<P, Fallback, T>
  ): number
}

/**
 * @description
 *   Creates a comparator function to sort objects based on the value at the specified path.
 * @param comparatorFunction - The function to determine the order of the elements based on the plucked value.
 * @returns A comparator function that, when applied to two objects, sorts them based on the value at the plucked path.
 * @example
 *   const sortByAge = pluck('age', 0).sort((a, b) => a - b);
 *   const sortedUsers = users.sort(sortByAge); // Sorts users by 'age'.
 */
type PluckReturnsSort<P extends string, Fallback> = {
  <T extends Fallback = Fallback>(
    sorter: (prev: T, next: T) => number
  ): PluckReturnsSortReturns<P, Fallback, T>
}

type PluckReturnsFilterReturns<
  P extends string,
  Fallback,
  T extends Fallback = Fallback,
> = {
  <O extends object>(object: _ValidObjOrNever<P, Fallback, T, O>): boolean

  (object: _ReconstructObj<P, Fallback, T>): boolean
}

/**
 * @description
 *   Creates a predicate function to filter objects based on the value at the specified path.
 * @param predicateFunction - The function to determine if an element should be included based on the plucked value.
 * @returns A predicate function that, when applied to an object, evaluates the provided predicate function against the value at the plucked path.
 * @example
 *   const pluckCity = pluck<User, 'address.city'>('address.city', '');
 *   const isInNewYork = pluckCity.filter(city => city === 'New York');
 *   const newYorkUsers = users.filter(isInNewYork); // Filters users in 'New York'.
 */
type PluckReturnsFilter<P extends string, Fallback> = {
  <T extends Fallback = Fallback>(
    predicate: (value: T, object: _ReconstructObj<P, Fallback, T>) => boolean
  ): PluckReturnsFilterReturns<P, Fallback, T>
}

type PluckReturnsMapReturns<
  P extends string,
  Fallback,
  R,
  T extends Fallback = Fallback,
> = {
  <O extends object>(
    object: _ValidObjOrNever<P, Fallback, T, O>
  ): MergeDeep<O, ReconstructObjByPath<P, R>>

  (
    object: _ReconstructObj<P, Fallback, T>
  ): MergeDeep<_ReconstructObj<P, Fallback, T>, ReconstructObjByPath<P, R>>
}

/**
 * @description
 *   Transforms the value at the specified path in the object using the provided transformation function.
 * @param transformationFunction - The function to apply to the value.
 * @returns A transformation function that, when applied to an object, sets the result of the transformation function to the plucked path in the original object.
 * @example
 *   const pluckAge = pluck<User, 'age'>('age', 0);
 *   const doubleAge = pluckAge.map(age => age * 2);
 *   const updatedUser = doubleAge(user); // Applies doubleAge to 'age' in user.
 */
type PluckReturnsMap<P extends string, Fallback> = {
  <R, T extends Fallback = Fallback>(
    mapFn: (value: T, object: _ReconstructObj<P, Fallback, T>) => R
  ): PluckReturnsMapReturns<P, Fallback, R, T>
}

type PluckReturns<P extends string, Fallback> = {
  sort: PluckReturnsSort<P, Fallback>

  filter: PluckReturnsFilter<P, Fallback>

  map: PluckReturnsMap<P, Fallback>

  get: PluckReturnsGet<P, Fallback>
}
/**
 * @description The `pluck` function is a comprehensive utility that enables operations like get, map, filter, and sort
 * on object properties specified by a path. It leverages TypeScript's type inference for enhanced type safety and utility.
 *
 * The function returns an object containing four curried methods: `get`, `map`, `filter`, and `sort`. Each method
 * operates on the specified path within an object or a collection of objects. The function can be used in a variety of
 * scenarios, such as data transformation, querying, and aggregation in a type-safe manner.
 *
 * @param path The path to the property within an object. The path is specified as a string and can represent nested properties.
 * @param fallback A default value to return if the specified path does not exist in the object.
 *
 * Curried Functions:
 * - `get`: Retrieves the value at the specified path. If the path does not exist, the fallback value is returned.
 * - `map`: Applies a transformation function to the value at the specified path.
 * - `filter`: Filters an array of objects based on a predicate function applied to the value at the specified path.
 * - `sort`: Sorts an array of objects based on a comparator function applied to the value at the specified path.
 *
 * @example
 * type User = {
 *   name: string;
 *   age: number;
 *   address: {
 *     city: string;
 *   };
 * };
 *
 * const users: User[] = [
 *   { name: 'Alice', age: 30, address: { city: 'New York' } },
 *   { name: 'Bob', age: 25, address: { city: 'Los Angeles' } },
 * ];
 *
 * // Using `get` to retrieve nested property values
 * const pluckName = pluck<User, 'name'>('name');
 * const name = pluckName.get(users[0]); // Alice
 *
 * // Using `map` to transform property values
 * const pluckAge = pluck<User, 'age'>('age');
 * const agesDoubled = users.map(pluckAge.map(age => age * 2)); // [60, 50]
 *
 * // Using `filter` to filter based on nested property values
 * const pluckCity = pluck<User, 'address.city'>('address.city');
 * const usersInNewYork = users.filter(pluckCity.filter(city => city === 'New York')); // [User where city is New York]
 *
 * // Using `sort` to sort based on property values
 * const sortByAge = pluck<User, 'age'>('age').sort((a, b) => a - b);
 * const sortedUsers = [...users].sort(sortByAge); // Sorted users by age
 *
 * @returns An object containing the methods `get`, `map`, `filter`, and `sort` for the specified path and fallback value.
 */
export function pluck<P extends string, Fallback = any>(
  path: P,
  fallback?: Fallback
): PluckReturns<P, Fallback> {
  const pluckGet: PluckReturnsGet<P, Fallback> = function <O extends object>(
    object: P extends ValidPathToValue<O, Fallback | undefined> ? O : never
  ): Equals<Fallback, any> extends 1
    ? Get<O, Cast<P, string>>
    : //passing objects to LiteralToPrimitive leads to errors
      Fallback extends object
      ? Fallback
      : //otherwise Fallback is interpreted as literal and it leads to P equals never
        LiteralToPrimitive<Fallback> {
    return get(object as object, path as Paths<object>, fallback)
  }

  const sort: PluckReturnsSort<P, Fallback> = function <
    T extends Fallback = Fallback,
  >(
    sorter: (prev: T, next: T) => number
  ): PluckReturnsSortReturns<P, Fallback, T> {
    return function <O extends object>(
      o1: P extends ValidPathToValue<O, T> ? O : never,
      o2: P extends ValidPathToValue<O, T> ? O : never
    ): number {
      return sorter(
        get(o1, path as any, fallback) as T,
        get(o2, path as any, fallback) as T
      )
    } as PluckReturnsSortReturns<P, Fallback, T>
  }

  const filter: PluckReturnsFilter<P, Fallback> = function <
    T extends Fallback = Fallback,
  >(
    predicate: (value: T, object: _ReconstructObj<P, Fallback, T>) => boolean
  ): PluckReturnsFilterReturns<P, Fallback, T> {
    return function <O extends object>(
      obj: _ValidObjOrNever<P, Fallback, T, O>
    ): boolean {
      return predicate(
        get(obj as object, path as Paths<object>, fallback) as T,
        obj as _ReconstructObj<P, Fallback, T>
      )
    } as PluckReturnsFilterReturns<P, Fallback, T>
  }

  const map: PluckReturnsMap<P, Fallback> = function <
    R,
    T extends Fallback = Fallback,
    Obj extends ReconstructObjByPath<P, T> = ReconstructObjByPath<P, T>,
  >(
    mapFn: (value: T, object: Obj) => R
  ): PluckReturnsMapReturns<P, Fallback, R, T> {
    return function <O extends Obj>(
      obj: P extends ValidPathToValue<Cast<O, object>, T> ? O : never
    ): MergeDeep<O, ReconstructObjByPath<P, R>> {
      return _set(
        obj as object,
        path,
        mapFn(get(obj as object, path as Paths<object>, fallback) as T, obj)
      ) as MergeDeep<O, ReconstructObjByPath<P, R>>
    } as PluckReturnsMapReturns<P, Fallback, R, T>
  } as PluckReturnsMap<P, Fallback>

  return { get: pluckGet, sort, filter, map }
}
