import { isNotNull } from '../../../src'

describe('isNotNull function', () => {
  // Test with an array of mixed null and non-null values
  const mixedArray = [null, 'Hello', null, 'World', null]

  test('should filter out null values from an array', () => {
    const filteredArray = mixedArray.filter(isNotNull)
    expect(filteredArray).toEqual(['Hello', 'World'])
  })

  // Test with an array of only non-null values
  const nonNullArray = [1, 2, 3, 4, 5]

  test('should keep all values if none are null', () => {
    const filteredArray = nonNullArray.filter(isNotNull)
    expect(filteredArray).toEqual(nonNullArray)
  })

  // Test with an array of only null values
  const nullArray = [null, null, null]

  test('should result in an empty array if all values are null', () => {
    const filteredArray = nullArray.filter(isNotNull)
    expect(filteredArray).toHaveLength(0)
  })
})
