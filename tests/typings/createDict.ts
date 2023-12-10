import { checkEquals, users, User } from '../../Tests'
import { createDict } from '../../src'
import { Test } from 'ts-toolbelt'

const { checks } = Test

const usersByName = createDict(users, 'name')
const usersByFriendName = createDict(users, 'friend.name')
const friendsNamesByGoodKey = createDict(users, 'deepKey.deepKey.goodDeepKey', {
  pathToMapTo: 'friend.name',
})
const usersByNameRequired = createDict(users, 'name', { isPartial: false })
const friendsNamesByGoodKeyMap = createDict(
  users,
  'deepKey.deepKey.goodDeepKey',
  {
    pathToMapTo: 'friend.name',
    useMap: true,
  }
)
const friendsByAge = createDict(users, 'age', {
  shouldGroupSameKeyValues: true,
  isPartial: false,
})
const friendsByAgeMap = createDict(users, 'age', {
  shouldGroupSameKeyValues: true,
  useMap: true,
})

//tests for ts error on wrong input
//@ts-expect-error wrong path
createDict(users, 'name2')
//@ts-expect-error wrong path
createDict(users, 'friends.boyNextDoor')
//@ts-expect-error not indexable key
createDict(users, 'friends')

checks([
  checkEquals<typeof usersByName, Partial<Record<string, User>>>(),
  checkEquals<typeof usersByFriendName, Partial<Record<string, User>>>(),
  checkEquals<typeof friendsNamesByGoodKey, Partial<Record<number, string>>>(),
  checkEquals<typeof usersByNameRequired, Record<string, User>>(),
  checkEquals<typeof friendsNamesByGoodKeyMap, Map<number, string>>(),
  checkEquals<typeof friendsByAge, Record<number, User[]>>(),
  checkEquals<typeof friendsByAgeMap, Map<number, User[]>>(),
])
