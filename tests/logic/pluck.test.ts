import { pluck } from '../../src'
import { User } from '../../Tests'

describe('pluck function', () => {
  // Sample array of users for testing
  const users = [
    {
      name: 'Alice',
      age: 30,
      data: { address: { street: '123 Main St', city: 'Metropolis' } },
    },
    {
      name: 'Bob',
      age: 25,
      data: { address: { street: '456 Elm St', city: 'Gotham' } },
    },
    {
      name: 'Charlie',
      age: 35,
      data: { address: { street: '789 Oak St', city: 'Star City' } },
    },
  ]

  // 1. Using get function
  test('get function should access values correctly', () => {
    const pluckName = pluck('name')
    const names = users.map(pluckName.get)
    expect(names).toEqual(['Alice', 'Bob', 'Charlie'])
  })

  // 2. Using map function
  test('map function should transform values correctly', () => {
    const pluckAge = pluck('age')
    const agesDoubled = users
      .map((user) => Object.assign({}, user))
      .map(pluckAge.map((age) => age * 2))
    expect(agesDoubled.map((user) => user.age)).toEqual([60, 50, 70])
  })

  // 3. Using sort function
  test('sort function should sort array correctly', () => {
    const pluckAge = pluck('age')
    const sortedByAge = [...users].sort(pluckAge.sort((a, b) => a - b))
    expect(sortedByAge.map((user) => user.name)).toEqual([
      'Bob',
      'Alice',
      'Charlie',
    ])
  })

  // 4. Using filter function
  test('filter function should filter array correctly', () => {
    const pluckAge = pluck('age')
    const over30 = users.filter(pluckAge.filter((age) => age > 30))
    expect(over30.map((user) => user.name)).toEqual(['Charlie'])
  })

  // 5. Handling edge cases
  test('should handle edge cases', () => {
    const pluckNonexistent = pluck('nonexistent', 'default')
    //@ts-expect-error
    expect(users.map(pluckNonexistent.get)).toEqual([
      'default',
      'default',
      'default',
    ])
    //@ts-expect-error
    expect(pluck('anyProperty', 'fallback').get(null)).toBe('fallback')
    //@ts-expect-error
    expect(pluck('age').get(undefined)).toBeUndefined()
  })
})

describe('pluck function with fallback', () => {
  // Sample array of users for testing, including one with missing properties
  const users = [
    {
      name: 'Alice',
      age: 30,
      data: { address: { street: '123 Main St', city: 'Metropolis' } },
    },
    {
      name: 'Bob',
      data: { address: { street: '456 Elm St', city: 'Gotham' } },
    }, // Missing age
    {
      name: 'Charlie',
      age: 35,
      data: { address: { street: '789 Oak St', city: 'Star City' } },
    },
  ]

  // 1. Using get function with fallback
  test('get function should use fallback values correctly', () => {
    const pluckAgeWithFallback = pluck('age', 20)
    const ages = users.map(pluckAgeWithFallback.get)
    expect(ages).toEqual([30, 20, 35])
  })

  test('get function should handle undefined objects with fallback', () => {
    const pluckNameWithFallback = pluck('name', 'Unknown')
    //@ts-expect-error
    expect(pluckNameWithFallback.get(undefined)).toEqual('Unknown')
  })

  // 2. Using map function with fallback
  test('map function should handle transformations with fallback values', () => {
    const pluckAgeWithFallback = pluck('age', 20)
    const agesDoubled = users
      .map((user) => Object.assign({}, user))
      .map(pluckAgeWithFallback.map((age) => age * 2))
    expect(agesDoubled.map((user) => user.age)).toEqual([60, 40, 70])
  })

  test('map function should handle empty array with fallback', () => {
    const pluckAgeWithFallback = pluck('age', 20)
    const agesDoubled = [].map(pluckAgeWithFallback.map((age) => age * 2))
    expect(agesDoubled).toEqual([])
  })

  // 3. Using sort function with fallback
  test('sort function should sort array correctly with fallback', () => {
    const pluckAgeWithFallback = pluck('age', 20)
    const sortedByAge = [...users].sort(
      pluckAgeWithFallback.sort((a, b) => a - b)
    )
    expect(sortedByAge.map((user) => user.name)).toEqual([
      'Bob',
      'Alice',
      'Charlie',
    ])
  })

  test('sort function should handle empty array with fallback', () => {
    const pluckAgeWithFallback = pluck('age', 20)
    const sortedByAge = [].sort(pluckAgeWithFallback.sort((a, b) => a - b))
    expect(sortedByAge).toEqual([])
  })

  // 4. Using filter function with fallback
  test('filter function should filter array correctly with fallback', () => {
    const pluckAgeWithFallback = pluck('age', 20)
    const over30 = users.filter(pluckAgeWithFallback.filter((age) => age > 30))
    expect(over30.map((user) => user.name)).toEqual(['Charlie'])
  })

  test('filter function should handle empty array with fallback', () => {
    const pluckAgeWithFallback = pluck('age', 20)
    const over30 = [].filter(pluckAgeWithFallback.filter((age) => age > 30))
    expect(over30).toEqual([])
  })
})
