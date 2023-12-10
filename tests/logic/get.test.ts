import { User } from '../../Tests'
import { get } from '../../src'

describe('get function', () => {
  // Sample user object for testing
  const user: User = {
    name: 'Alice',
    age: 30,
    deepKey: {
      deepKey: {
        goodDeepKey: 100,
        badDeepKey: [],
      },
    },
    friend: {
      name: 'Bob',
    },
    data: {
      address: {
        street: '123 Main St',
        city: 'Metropolis',
      },
    },
  }

  // 1. Accessing a top-level property
  test('should access a top-level property', () => {
    expect(get(user, 'name')).toBe('Alice')
    expect(get(user, 'age')).toBe(30)
  })

  // 2. Accessing a nested property
  test('should access a nested property', () => {
    expect(get(user, 'data.address.city')).toBe('Metropolis')
  })

  // 3. Accessing a deeply nested property
  test('should access a deeply nested property', () => {
    expect(get(user, 'deepKey.deepKey.goodDeepKey')).toBe(100)
  })

  // 4. Handling optional properties
  test('should handle optional properties', () => {
    //@ts-expect-error
    expect(get(user, 'friends?.boyNextDoor')).toBeUndefined()
  })

  // 5. Providing a fallback value for a missing property
  test('should provide a fallback value for missing properties', () => {
    //@ts-expect-error
    expect(get(user, 'nonexistentProperty', 'default')).toBe('default')
  })

  // 6. Ensuring type correctness
  test('should ensure type correctness', () => {
    const age = get(user, 'age')
    expect(typeof age).toBe('number')
  })

  // 7. Testing invalid paths
  test('should handle invalid paths', () => {
    //@ts-expect-error
    expect(get(user, 'invalid.path')).toBeUndefined()
  })

  // 8. Handling edge cases
  test('should handle other edge cases', () => {
    //@ts-expect-error
    expect(get({}, 'anyProperty')).toBeUndefined()
    //@ts-expect-error
    expect(get(null, 'anyProperty', 'fallback')).toBe('fallback')
  })
})
