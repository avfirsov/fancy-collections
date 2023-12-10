import { ValidPathToIndexableKey } from './types'
import { IsEqual, Paths } from 'type-fest'
import { _TypeOfKey, _TypeOfValue, createDict } from './createDict'

/**
 * @description
 *   Creates a getter function for retrieving items from a collection of objects based on a specified key.
 *   The key is determined by the `pathToKey` parameter, which specifies the path to the desired key in the objects of the collection.
 *   Optional parameters `isPartial`, `errorMsg`, `pathToMapTo`, and `shouldGroupSameKeyValues` allow for custom behavior.
 *
 * @param collection - The array of objects from which the getter will retrieve items.
 * @param pathToKey - The path to the property in the objects that will serve as the key for retrieval.
 * @param params - An optional object containing additional parameters:
 *                 - `isPartial`: Determines the behavior when a non-existent key is used (defaults to true).
 *                 - `errorMsg`: Custom error message or function for error handling when a key is not found.
 *                 - `pathToMapTo`: The path to the property whose value will be retrieved.
 *                 - `shouldGroupSameKeyValues`: Groups values with the same key into an array (defaults to false).
 * @returns A getter function that retrieves items based on the specified key.
 *
 * @example
 *   type User = { name: string; age: number; address: { city: string; } };
 *   const users: User[] = [{ name: 'Alice', age: 30, address: { city: 'New York' } }, { name: 'Bob', age: 25, address: { city: 'Los Angeles' } }];
 *
 *   // Basic usage with a simple path
 *   const getUsersByName = createGetByKey(users, 'name');
 *   const userByName = getUsersByName('Alice'); // Retrieves Alice's user object
 *
 *   // Using a nested path for keys
 *   const getUserByCity = createGetByKey(users, 'address.city');
 *   const userByCity = getUserByCity('New York'); // Retrieves Alice's user object
 *
 *   // Using pathToMapTo for mapping to a specific nested property
 *   const getAgeByCity = createGetByKey(users, 'address.city', { pathToMapTo: 'age' });
 *   const ageByCity = getAgeByCity('New York'); // Retrieves age 30
 *
 *   // Handling non-existent keys with custom error message
 *   const getUserByNameOrError = createGetByKey(users, 'name', { errorMsg: 'User not found' });
 *   try {
 *     const user = getUserByNameOrError('Charlie');
 *   } catch (error) {
 *     console.log(error); // Logs 'User not found'
 *   }
 *
 *   // Grouping values with the same key
 *   const getUsersByCity = createGetByKey(users, 'address.city', { shouldGroupSameKeyValues: true });
 *   const usersByCity = getUsersByCity('New York'); // Returns an array of users in 'New York'
 */
export function createGetByKey<
  O extends object,
  PathToKey extends ValidPathToIndexableKey<O>,
  IsPartial extends boolean = true,
  PathToMapTo extends '' | Paths<O> = '',
  CustomErrorMsg extends
    | {
        (key: _TypeOfKey<O, PathToKey>): string
      }
    | string
    | undefined = undefined,
  IsGroupMode extends boolean = false,
>(
  collection: O[],
  pathToKey: PathToKey,
  params?: {
    isPartial?: IsPartial
    pathToMapTo?: PathToMapTo
    //overrides isPartial to false
    errorMsg?: CustomErrorMsg
    //whether should collect same key values in array
    shouldGroupSameKeyValues?: IsGroupMode
  }
): {
  (
    key: _TypeOfKey<O, PathToKey>
  ): IsEqual<CustomErrorMsg, undefined> extends false
    ? _TypeOfValue<O, PathToMapTo, IsGroupMode>
    : IsPartial extends false
      ? _TypeOfValue<O, PathToMapTo, IsGroupMode>
      : _TypeOfValue<O, PathToMapTo, IsGroupMode> | undefined
} {
  const dict = createDict(collection, pathToKey, params)

  return function (key): _TypeOfValue<O, PathToMapTo, IsGroupMode> {
    const hasKey = key in dict

    if (!hasKey) {
      if (!params?.errorMsg && !!params?.isPartial) {
        //@ts-expect-error
        return
      }

      const customErrorMsg =
        typeof params?.errorMsg === 'function'
          ? params.errorMsg(key)
          : params?.errorMsg

      const errorMsg = customErrorMsg || `Key not found: ${key}`

      throw new Error(errorMsg as string)
    }

    //@ts-expect-error
    return dict[key]
  }
}
