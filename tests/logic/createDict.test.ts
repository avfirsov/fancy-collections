import { createDict } from '../../src'
import { twoAlicesAndBob, User } from '../../Tests'

describe('createDict simple tests', () => {
  const alice: User = {
    name: 'Alice',
    age: 25,
    deepKey: { deepKey: { goodDeepKey: 1, badDeepKey: [] } },
    friend: { name: 'Bob' },
    friends: { boyNextDoor: 'Charlie' },
    data: { address: { street: '123 Main St', city: 'Anytown' } },
  }

  const bob: User = {
    name: 'Bob',
    age: 30,
    deepKey: { deepKey: { goodDeepKey: 2, badDeepKey: [] } },
    friend: { name: 'Alice' },
    friends: { boyNextDoor: 'David' },
    data: { address: { street: '456 Oak St', city: 'Anytown' } },
  }

  const users: User[] = [alice, bob]

  it('does not mutate the original array', () => {
    const originalUsers = [...users] // Create a copy of the original array
    createDict(users, 'name')
    // Check that the original array has not been mutated
    expect(users).toEqual(originalUsers)
  })

  it('should create a dictionary with user names as keys', () => {
    const result = createDict(users, 'name')
    expect(result).toHaveProperty('Alice', alice)
    expect(result).toHaveProperty('Bob', bob)
  })

  it('should create a dictionary with friend names as keys', () => {
    const result = createDict(users, 'friend.name')
    expect(result).toHaveProperty('Bob', alice)
    expect(result).toHaveProperty('Alice', bob)
  })

  it('handles an empty array', () => {
    const result = createDict<User, 'name'>([], 'name')
    expect(result).toEqual({})
  })

  it('handles an empty path', () => {
    //@ts-expect-error
    const result = createDict<User, 'name'>(users, '')
    expect(result).toEqual({})
  })

  it('handles non-object elements in the array', () => {
    //@ts-expect-error
    const result = createDict<any, 'name'>([1, 'string', null], 'name')
    expect(result).toEqual({})
  })

  it('handles a non-existent path', () => {
    //@ts-expect-error
    const result = createDict(users, 'nonexistent')
    expect(result).toEqual({})
  })

  it('handles a path that leads to a non-indexable key', () => {
    //@ts-expect-error
    const result = createDict(users, 'friend')
    expect(result).toEqual({})
  })

  it('handles a path that leads to an undefined or null value', () => {
    const users = [{ name: 'John', age: 30, friend: { name: null } }]
    //@ts-expect-error
    const result = createDict(users, 'friend.name')
    expect(result).toEqual({})
  })

  it('handles a params object that contains invalid options', () => {
    const result = createDict(users, 'name', { invalidOption: true } as any)
    expect(result).toStrictEqual({ Alice: users[0], Bob: users[1] })
  })

  it('handles an empty pathToMapTo', () => {
    const result = createDict(users, 'name', { pathToMapTo: '' })
    expect(result).toEqual({ Alice: alice, Bob: bob })
  })

  it('handles a pathToMapTo that points to a non-existent path', () => {
    //@ts-expect-error
    const result = createDict(users, 'name', { pathToMapTo: 'nonexistent' })
    expect(result).toEqual({ Alice: undefined, Bob: undefined })
  })

  it('handles a pathToMapTo that points to an undefined or null value', () => {
    const users = [{ name: 'John', age: 30, friend: { name: null } }]
    const result = createDict(users, 'name', { pathToMapTo: 'friend.name' })
    expect(result).toStrictEqual({ John: null })
  })

  it('returns a Map when useMap is set to true', () => {
    const result = createDict(users, 'name', { useMap: true })
    expect(result).toBeInstanceOf(Map)
    expect(result.get('Alice')).toStrictEqual(users[0])
  })

  it('should group values with the same key when shouldGroupSameKeyValues is true', () => {
    const result = createDict(twoAlicesAndBob, 'name', {
      shouldGroupSameKeyValues: true,
      pathToMapTo: 'age',
    })

    expect(result).toEqual({
      Alice: [30, 35],
      Bob: [40],
    })
  })

  it('should handle non-valid pathToMapTo with shouldGroupSameKeyValues true', () => {
    const result = createDict(twoAlicesAndBob, 'name', {
      shouldGroupSameKeyValues: true,
      //@ts-expect-error
      pathToMapTo: 'invalidPath',
    })

    expect(result).toEqual({
      Alice: [undefined, undefined],
      Bob: [undefined],
    })
  })

  it('should group values with the same key and use Map when both shouldGroupSameKeyValues and useMap are true', () => {
    const result = createDict(twoAlicesAndBob, 'name', {
      shouldGroupSameKeyValues: true,
      useMap: true,
      pathToMapTo: 'age',
    })

    expect(result instanceof Map).toBeTruthy()
    expect(result.get('Alice')).toEqual([30, 35])
    expect(result.get('Bob')).toEqual([40])
  })
})
