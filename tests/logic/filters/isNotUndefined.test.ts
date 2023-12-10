import { isNotUndefined } from '../../../src'

describe('isNotUndefined function', () => {
  // Test with an array of mixed undefined and defined values
  const mixedArray = [undefined, 'Hello', undefined, 'World', undefined]

  test('should filter out undefined values from an array', () => {
    const filteredArray = mixedArray.filter(isNotUndefined)
    expect(filteredArray).toEqual(['Hello', 'World'])
  })

  // Test with an array of only defined values
  const definedArray = [1, 2, 3, 4, 5]

  test('should keep all values if none are undefined', () => {
    const filteredArray = definedArray.filter(isNotUndefined)
    expect(filteredArray).toEqual(definedArray)
  })

  // Test with an array of only undefined values
  const undefinedArray = [undefined, undefined, undefined]

  test('should result in an empty array if all values are undefined', () => {
    const filteredArray = undefinedArray.filter(isNotUndefined)
    expect(filteredArray).toHaveLength(0)
  })
})
