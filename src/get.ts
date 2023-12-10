import { Get, LiteralToPrimitive } from 'type-fest'
import { Cast } from 'ts-toolbelt/out/Any/Cast'
import { ValidPathToValue } from './types'
import _get from 'lodash.get'
import { If } from 'ts-toolbelt/out/Any/If'
import { Equals } from 'ts-toolbelt/out/Any/Equals'

/**
 * @description Typed version of lodash.get
 *
 * @example
 * type User = {
 *   name: string
 *   age: number
 *
 *   deepKey: {
 *     deepKey: {
 *       goodDeepKey: number
 *       badDeepKey: []
 *     }
 *   }
 *
 *   friend: {
 *     name: string
 *   }
 *
 *   friends?: {
 *     boyNextDoor: string
 *   }
 *
 *   data: {
 *     address: {
 *       street: string
 *       city: string
 *     }
 *   }
 * }
 *
 * declare const users: User[];
 *
 * const name = get(user, 'name') // string
 * const street = get(user, 'data.address.street') //string
 * const age = get(user, 'age') // number
 * const ageWithNumberFallback = get(user, 'age', 42) // number
 * const addressWithFallback = get(user, 'data.address', {
 *   city: 'Moscow',
 *   street: 'Filevskaya',
 * }) // { city: string; street: string; }
 *
 * // @ts-expect-error type mismatch between fallback and paths' value
 * const nameWithNumberFallback = get(user, 'data.address.city', 42)
 * // @ts-expect-error invalid path
 * const invalid = get(user, 'invalid.path')
 */
export function get<
  O extends object,
  P extends If<
    Equals<Fallback, any>,
    ValidPathToValue<O, Fallback>,
    //if Fallback is set, path can be optional
    ValidPathToValue<O, Fallback | undefined>
  >,
  Fallback = any,
>(
  obj: O,
  path: P,
  fallback?: Fallback
): Equals<Fallback, any> extends 1
  ? Get<O, Cast<P, string>>
  : //passing objects to LiteralToPrimitive leads to errors
    Fallback extends object
    ? Fallback
    : //otherwise Fallback is interpreted as literal and it leads to P equals never
      LiteralToPrimitive<Fallback> {
  return _get(obj, path, fallback)
}
