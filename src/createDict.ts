import { ValidPathToIndexableKey, ValidPathToValue } from './types'
import { Cast } from 'ts-toolbelt/out/Any/Cast'
import { Get, IsEqual, Paths } from 'type-fest'
import { get } from './get'
import { isNotNull } from './filters'
import { pluck } from './pluck'

export type _TypeOfKey<
  O extends object,
  PathToKey extends ValidPathToIndexableKey<O>,
> = Cast<Get<O, Cast<PathToKey, string>>, keyof any>

export type _TypeOfSingleValue<
  O extends object,
  PathToMapTo extends '' | Paths<O>,
> = IsEqual<PathToMapTo, ''> extends true
  ? O
  : Get<O, Cast<PathToMapTo, string>>

export type _TypeOfValue<
  O extends object,
  PathToMapTo extends '' | Paths<O>,
  IsGroupMode extends boolean,
> = IsGroupMode extends true
  ? _TypeOfSingleValue<O, PathToMapTo>[]
  : _TypeOfSingleValue<O, PathToMapTo>

export type Returns<
  O extends object,
  PathToKey extends ValidPathToIndexableKey<O>,
  IsPartial extends boolean,
  UseMap extends boolean,
  PathToMapTo extends '' | Paths<O>,
  IsGroupMode extends boolean,
> = UseMap extends true
  ? Map<_TypeOfKey<O, PathToKey>, _TypeOfValue<O, PathToMapTo, IsGroupMode>>
  : IsPartial extends true
    ? Partial<
        Record<
          _TypeOfKey<O, PathToKey>,
          _TypeOfValue<O, PathToMapTo, IsGroupMode>
        >
      >
    : Record<
        _TypeOfKey<O, PathToKey>,
        _TypeOfValue<O, PathToMapTo, IsGroupMode>
      >

/**
 * @description
 *   Creates a dictionary-like object or a Map from an array of objects. The keys for the dictionary or Map are
 *   determined by the `pathToKey` parameter, which specifies the path to the desired key in the objects of the array.
 *   Additional parameters allow for further customization of the output, such as grouping same-key values or choosing
 *   between a plain object and a Map.
 *
 * @param collection - The array of objects to transform into a dictionary or Map.
 * @param pathToKey - The path to the property in the objects that will serve as the key in the dictionary or Map.
 * @param params - An optional object containing additional parameters:
 *                 - `useMap`: Determines whether to return a plain object or a Map (defaults to false).
 *                 - `isPartial`: When true, the dictionary's type is Partial (defaults to true, ignored if `useMap` is true).
 *                 - `pathToMapTo`: The path to the property whose value will be mapped in the dictionary.
 *                 - `shouldGroupSameKeyValues`: When true, groups values with the same key into an array (defaults to false).
 * @returns The dictionary-like object or Map created from the collection.
 *
 * @example
 *   type User = { name: string; age: number; address: { city: string; } };
 *   const users: User[] = [{ name: 'Alice', age: 30, address: { city: 'New York' } }, { name: 'Bob', age: 25, address: { city: 'Los Angeles' } }];
 *
 *   // Basic usage with a simple path
 *   const usersByName = createDict(users, 'name');
 *   // Returns: { 'Alice': { name: 'Alice', age: 30, address: { city: 'New York' } }, 'Bob': { name: 'Bob', age: 25, address: { city: 'Los Angeles' } } }
 *
 *   // Using a nested path for keys
 *   const usersByCity = createDict(users, 'address.city');
 *   // Returns: { 'New York': { name: 'Alice', age: 30, address: { city: 'New York' } }, 'Los Angeles': { name: 'Bob', age: 25, address: { city: 'Los Angeles' } } }
 *
 *   // Using pathToMapTo to map to a specific nested property
 *   const agesByCity = createDict(users, 'address.city', { pathToMapTo: 'age' });
 *   // Returns: { 'New York': 30, 'Los Angeles': 25 }
 *
 *   // Grouping values with the same key
 *   const usersGroupedByCity = createDict(users, 'address.city', { shouldGroupSameKeyValues: true });
 *   // Returns: { 'New York': [{ name: 'Alice', age: 30, address: { city: 'New York' } }], 'Los Angeles': [{ name: 'Bob', age: 25, address: { city: 'Los Angeles' } }] }
 *
 *   // Using a Map with nested paths
 *   const usersByCityMap = createDict(users, 'address.city', { useMap: true });
 *   // Returns a Map with city names as keys and user objects as values
 */
export function createDict<
  O extends object,
  PathToKey extends ValidPathToIndexableKey<O>,
  IsPartial extends boolean = true,
  UseMap extends boolean = false,
  PathToMapTo extends '' | Paths<O> = '',
  IsGroupMode extends boolean = false,
>(
  collection: O[],
  pathToKey: PathToKey,
  params?: {
    //influences only on types
    isPartial?: IsPartial
    pathToMapTo?: PathToMapTo
    //whether should collect same key values in array
    shouldGroupSameKeyValues?: IsGroupMode
    //if set, isPartial will be ignored
    useMap?: UseMap
  }
): Returns<O, PathToKey, IsPartial, UseMap, PathToMapTo, IsGroupMode> {
  const keyValue = collection
    //works only with objects
    .filter(
      (item) =>
        typeof item === 'object' && !Array.isArray(item) && isNotNull(item)
    )
    .map((item) => ({
      key: get(item, pathToKey),
      value: !!params?.pathToMapTo
        ? get(item, params.pathToMapTo as ValidPathToValue<O, any>)
        : item,
    }))

  const blank = !!params?.useMap
    ? new Map()
    : ({} as Returns<O, PathToKey, IsPartial, UseMap, PathToMapTo, IsGroupMode>)

  return (
    keyValue
      //non-valid keys are ignored
      .filter(pluck('key').filter(isValidKey))
      .reduce((acc, cur) => {
        if (!!params?.useMap) {
          const newVal = !!params?.shouldGroupSameKeyValues
            ? //@ts-expect-error too complex typing
              appendToExistingArrayOrCreateNew(acc.get(cur.key), cur.value)
            : cur.value
          //@ts-expect-error too complex typing
          acc.set(cur.key, newVal)
          return acc
        }
        const newVal = !!params?.shouldGroupSameKeyValues
          ? //@ts-expect-error too complex typing
            appendToExistingArrayOrCreateNew(acc[cur.key], cur.value)
          : cur.value
        //@ts-expect-error too complex typing
        acc[cur.key] = newVal
        return acc
      }, blank) as Returns<
      O,
      PathToKey,
      IsPartial,
      UseMap,
      PathToMapTo,
      IsGroupMode
    >
  )
}

const appendToExistingArrayOrCreateNew = <T>(
  existingValue: T[] | undefined,
  newItem: T
): T[] =>
  Array.isArray(existingValue) ? [...existingValue, newItem] : [newItem]

const isValidKey = (item: unknown): item is keyof any =>
  typeof item === 'string' ||
  typeof item === 'number' ||
  typeof item === 'symbol'
