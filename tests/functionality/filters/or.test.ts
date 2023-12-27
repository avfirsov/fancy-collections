import { or, pluck } from '../../../src' // Assuming pluck function is available

describe('or function', () => {
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
    const isFromGotham = (user: {
      data: { address: { street: string; city: string } }
    }) => user.data.address.city === 'Gotham'
    const combinedPredicate = or(isOver30, isFromGotham)
    const filteredUsers = users.filter(combinedPredicate)
    expect(filteredUsers.map((user) => user.name)).toEqual(['Bob', 'Charlie'])
  })

  // 2. Using predicates for plucking deep properties
  test('should combine pluck filter predicates correctly', () => {
    const isOver25 = pluck('age').filter((age) => age > 25)
    const isFromMetropolis = pluck('data.address.city').filter(
      (city) => city === 'Metropolis'
    )
    const combinedPredicate = or(isOver25, isFromMetropolis)
    const filteredUsers = users.filter(combinedPredicate)
    expect(filteredUsers.map((user) => user.name)).toEqual(['Alice', 'Charlie'])
  })
})
