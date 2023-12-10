import { ReconstructObjByPaths, ValidPathToValue } from '../types'
import { FilterStringOptions, matchesString } from './matchesString'
import { Equals } from 'ts-toolbelt/out/Any/Equals'
import { pluck } from '../pluck'

/**
 * Creates a function for filtering objects based on specified nested string fields.
 * The returned function can be used to filter collections where at least one of the specified fields matches the provided needle.
 *
 * @param {readonly [string, ...string[]]} paths - An array of strings representing the nested paths to be matched.
 * @param {FilterStringOptions} [opts] - Optional settings for case sensitivity and full/partial string matching.
 * @returns {(needle: string) => (item: any) => boolean} A function that takes a needle and returns a predicate function.
 *
 * @example
 * // Filtering products based on multiple fields
 * const products = [{ id: '123', name: 'SuperWidget', description: 'The ultimate widget' }];
 * const matchProductFields = matchesPluckedStrings(['id', 'name', 'description'] as const);
 * const matchCaseInsensitive = matchProductFields('widget', { caseSensitive: false });
 * const caseInsensitiveMatches = products.filter(matchCaseInsensitive);
 */

export function matchesPluckedStrings<
  Paths extends readonly string[],
  Fallback extends string = string,
>(
  paths: Paths,
  params?: {
    opts?: FilterStringOptions
    //default: false
    isAndMode?: boolean
    fallback?: Fallback
  }
): {
  (needle: string): {
    (
      obj: Equals<Fallback, string> extends 1
        ? ReconstructObjByPaths<Paths, string>
        : ReconstructObjByPaths<Paths, string | undefined>
    ): boolean
  }
} {
  return function (needle: string): {
    (obj: object): boolean
  } {
    const matchesNeedle = matchesString(needle, params?.opts)

    return function <O extends object>(obj: O): boolean {
      const haystacks = paths.map((path) =>
        pluck(
          path as Extract<ValidPathToValue<O, string>, string>,
          params?.fallback
        ).get(
          obj as Paths[number] extends ValidPathToValue<O, Fallback | undefined>
            ? O
            : never
        )
      ) as string[]
      return !!params?.isAndMode
        ? haystacks.every(matchesNeedle)
        : haystacks.some(matchesNeedle)
    }
  } as any
}
