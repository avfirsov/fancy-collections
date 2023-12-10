import { matchesPluckedStrings } from '../../../src'
import { User } from '../../../Tests' // Assuming a User type is available for testing

describe('matchesPluckedStrings function - Expanded Tests', () => {
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
      name: 'Orlean',
      age: 35,
      data: { address: { street: '789 Oak St', city: 'Orlean' } },
    },
  ] as const

  // 1. Filtering multiple paths simultaneously
  test('should filter on multiple paths simultaneously', () => {
    const matchNameAndCity = matchesPluckedStrings([
      'name',
      'data.address.city',
    ] as const)
    const filteredUsers = users.filter(matchNameAndCity('Orlean'))
    expect(filteredUsers.map((user) => user.name)).toEqual(['Orlean'])
  })

  // 2. Different modes (isOrMode)
  test('should handle OR mode for filtering', () => {
    const matchNameOrCity = matchesPluckedStrings([
      'name',
      'data.address.city',
    ] as const)
    const filteredUsers = users.filter(matchNameOrCity('Alice'))
    expect(filteredUsers.map((user) => user.name)).toEqual(['Alice'])
  })

  // 3. Working without fallback and with fallback
  test('should work with and without fallback', () => {
    const matchCityNoFallback = matchesPluckedStrings([
      'data.address.city',
    ] as const)
    const matchInvalidPathWithFallback = matchesPluckedStrings(
      ['invalid.path', 'invalid.path.second', 'invalid.path.third'] as const,
      {
        fallback: 'Unknown',
      }
    )
    expect(users.filter(matchCityNoFallback('Unknown'))).toHaveLength(0)
    //@ts-expect-error
    expect(users.filter(matchInvalidPathWithFallback('Unknown'))).toHaveLength(
      users.length
    )
  })

  // 4. Different filtering params (opts)
  test('should handle different filtering options', () => {
    const matchCaseSensitive = matchesPluckedStrings(['name'] as const, {
      opts: { caseSensitive: true },
      fallback: '',
    })
    const matchFullString = matchesPluckedStrings(['name'] as const, {
      opts: { matchFull: true },
      fallback: '',
    })
    expect(users.filter(matchCaseSensitive('alice'))).toHaveLength(0)
    expect(users.filter(matchFullString('Ali'))).toHaveLength(0)
  })

  // Cross-tests
  test('cross-test: filtering on multiple paths with fallback and different options', () => {
    const matchComplex = matchesPluckedStrings(
      ['name', 'data.address.city'] as const,
      {
        opts: { caseSensitive: false },
        fallback: 'Unknown',
      }
    )
    const filteredUsers = users.filter(matchComplex('orlean'))
    expect(filteredUsers.map((user) => user.name)).toEqual(['Orlean'])
  })
})
