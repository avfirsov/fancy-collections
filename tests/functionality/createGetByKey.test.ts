import { createGetByKey } from '../../src'
import { twoAlicesAndBob, User } from '../../Tests'

describe('createGetByKey', () => {
  const users = [
    {
      name: 'John',
      age: 30,
      friend: {
        name: 'Mike',
      },
      data: {
        address: {
          street: 'Main St',
          city: 'NYC',
        },
      },
    },
    {
      name: 'Jane',
      age: 25,
      friend: {
        name: 'Emma',
      },
      data: {
        address: {
          street: 'Broadway',
          city: 'LA',
        },
      },
    },
  ]

  it('should handle empty collection', () => {
    const getUsers = createGetByKey<User, 'name'>([], 'name', {
      isPartial: true,
    })
    expect(getUsers('John')).toBeUndefined()
  })

  it('should handle empty pathToKey', () => {
    //@ts-expect-error
    const getUsers = createGetByKey(users, '', { isPartial: true })
    expect(getUsers('')).toBeUndefined()
  })

  it('handles non-object elements in the array', () => {
    //@ts-expect-error
    const result = createGetByKey<User, 'name'>([1, 'string', null], 'name', {
      isPartial: true,
    })
    expect(result('Mike')).toBeUndefined()
  })

  it('handles non-existent path', () => {
    const users = [{ name: 'Mike', age: 30 }]
    //@ts-expect-error
    const result = createGetByKey(users, 'nonExistentPath', { isPartial: true })
    expect(result('Mike')).toBeUndefined()
  })

  it('should return the correct item based on the key', () => {
    const users = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ]
    const getUserByName = createGetByKey(users, 'name')
    expect(getUserByName('Alice')).toEqual({ name: 'Alice', age: 30 })
  })

  it('should not mutate the original collection', () => {
    const users = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ]
    const originalUsers = [...users]
    const getUserByName = createGetByKey(users, 'name')
    getUserByName('Alice')
    expect(users).toEqual(originalUsers)
  })

  it('handles path that leads to non-indexable key', () => {
    const users = [{ name: { first: 'Mike', last: 'Smith' }, age: 30 }]
    //@ts-expect-error
    const result = createGetByKey(users, 'name', { isPartial: true })
    //@ts-expect-error
    expect(result({ first: 'Mike', last: 'Smith' })).toBeUndefined()
  })

  it('handles path that leads to undefined or null value', () => {
    const users = [{ name: 'Mike', age: 30, friend: null }]
    //@ts-expect-error
    const result = createGetByKey(users, 'friend.name', { isPartial: true })
    expect(result('Mike')).toBeUndefined()
  })

  it('handles params object that contains invalid options', () => {
    const users = [{ name: 'Mike', age: 30 }]
    //@ts-expect-error
    const result = createGetByKey(users, 'name', { invalidOption: true })
    expect(result('Mike')).toBeDefined()
  })

  it('handles pathToMapTo that points to non-existent path', () => {
    const users = [{ name: 'Mike', age: 30 }]
    const result = createGetByKey(users, 'name', {
      //@ts-expect-error
      pathToMapTo: 'nonExistentPath',
    })
    expect(result('Mike')).toBeUndefined()
  })

  it('handles pathToMapTo that points to undefined or null value', () => {
    const users = [{ name: 'Mike', age: 30, friend: null }]
    //@ts-expect-error
    const result = createGetByKey(users, 'name', { pathToMapTo: 'friend.name' })
    expect(result('Mike')).toBeUndefined()
  })

  it('returns a dictionary where all keys are required when isPartial is unset', () => {
    const users = [
      { name: 'Mike', age: 30 },
      { name: 'John', age: 40 },
    ]
    const result = createGetByKey(users, 'name')
    expect(result('Mike')).toBeDefined()
    expect(result('John')).toBeDefined()
    expect(() => result('NonExistentName')).toThrow()
  })

  it('should handle nested key', () => {
    const getUsers = createGetByKey(users, 'data.address.city')
    expect(getUsers('LA')).toEqual(users[1])
  })

  it('should handle no params provided', () => {
    const getUsers = createGetByKey(users, 'name')
    expect(getUsers('John')).toEqual(users[0])
  })

  it('should handle pathToMapTo key', () => {
    const getUsers = createGetByKey(users, 'name', {
      pathToMapTo: 'data.address.city',
    })
    expect(getUsers('John')).toEqual('NYC')
  })

  it('should handle errorMsg key', () => {
    const getUsers = createGetByKey(users, 'name', {
      errorMsg: 'User not found',
    })
    expect(() => getUsers('NonExistentName')).toThrow('User not found')
  })

  it('should handle different types in collection', () => {
    const mixedCollection = [...users, { differentKey: 'value' }]
    //@ts-expect-error
    const getUsers = createGetByKey<User, 'name'>(mixedCollection, 'name')
    expect(getUsers('John')).toEqual(users[0])
  })

  it('should throw error when isPartial is false and item not found', () => {
    const getUsers = createGetByKey(users, 'name', { isPartial: false })
    expect(() => getUsers('NonExistentName')).toThrow()
  })

  it('grouping same-key values with custom error message function', () => {
    const customErrorMsg = (key: string) => `No user found with key: ${key}`
    const getUsersByName = createGetByKey(twoAlicesAndBob, 'name', {
      shouldGroupSameKeyValues: true,
      errorMsg: customErrorMsg,
    })

    const usersByName = getUsersByName('Alice')
    expect(usersByName).toHaveLength(2)
    usersByName.forEach((user) => expect(user.name).toEqual('Alice'))

    expect(() => {
      getUsersByName('NonExistentName')
    }).toThrow('No user found with key: NonExistentName')
  })
})
