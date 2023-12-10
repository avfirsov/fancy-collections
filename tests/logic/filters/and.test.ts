import { and, pluck } from '../../../src' // Assuming pluck function is available
import { User } from '../../../Tests'

describe('and function', () => {
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

  // 1. Using simple arrow-function lambda predicates
  test('should combine simple lambda predicates correctly', () => {
    const isOver30 = (user: { age: number }) => user.age > 30
    const isFromMetropolis = (user: {
      data: { address: { street: string; city: string } }
    }) => user.data.address.city === 'Metropolis'
    const combinedPredicate = and(isOver30, isFromMetropolis)
    const filteredUsers = users.filter(combinedPredicate)
    expect(filteredUsers.length).toBe(0) // No user is over 30 and from Metropolis
  })

  // 2. Using predicates for plucking deep properties
  test('should combine pluck filter predicates correctly', () => {
    const isOver30 = pluck('age').filter((age) => age > 30)
    const isFromStarCity = pluck('data.address.city').filter(
      (city) => city === 'Star City'
    )
    const combinedPredicate = and(isOver30, isFromStarCity)
    const filteredUsers = users.filter(combinedPredicate)
    expect(filteredUsers.map((user) => user.name)).toEqual(['Charlie']) // Charlie is over 30 and from Star City
  })
})
