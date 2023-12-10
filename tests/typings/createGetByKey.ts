import { checkEquals, User, users } from '../../Tests'
import { createGetByKey } from '../../src'
import { Test } from 'ts-toolbelt'

const { checks } = Test

const getUsersByName = createGetByKey(users, 'name')
const userByName = getUsersByName('Mike')
const getUserByFriendName = createGetByKey(users, 'friend.name')
const userByFriendName = getUserByFriendName('Van Darkholme')
const getFriendsNamesByGoodKey = createGetByKey(
  users,
  'deepKey.deepKey.goodDeepKey',
  {
    pathToMapTo: 'friend.name',
  }
)
const friendsNamesByGoodKey = getFriendsNamesByGoodKey(42)
const getUsersByNameRequired = createGetByKey(users, 'name', {
  isPartial: false,
})
const usersByNameRequired = getUsersByNameRequired('Billy Harrington')
const getFriendsNamesByGoodKeyWithMsg = createGetByKey(
  users,
  'deepKey.deepKey.goodDeepKey',
  {
    pathToMapTo: 'friend.name',
    errorMsg: 'Boo!',
  }
)
const friendsNamesByGoodKeyWithMsg = getFriendsNamesByGoodKeyWithMsg(42)
const getUsersByAge = createGetByKey(users, 'age', {
  shouldGroupSameKeyValues: true,
})
const usersByAge = getUsersByAge(42)
const getUsersByAgeStrict = createGetByKey(users, 'age', {
  shouldGroupSameKeyValues: true,
  isPartial: false,
})
const usersByAgeStrict = getUsersByAgeStrict(42)

//tests for ts error on wrong input
//@ts-expect-error wrong path
createGetByKey(users, 'name2')
//@ts-expect-error wrong path
createGetByKey(users, 'friends.boyNextDoor')
//@ts-expect-error not indexable key
createGetByKey(users, 'friends')

checks([
  checkEquals<typeof userByName, User | undefined>(),
  checkEquals<typeof userByFriendName, User | undefined>(),
  checkEquals<typeof friendsNamesByGoodKey, string | undefined>(),
  checkEquals<typeof usersByNameRequired, User>(),
  checkEquals<typeof friendsNamesByGoodKeyWithMsg, string>(),
  checkEquals<typeof usersByAge, User[] | undefined>(),
  checkEquals<typeof usersByAgeStrict, User[]>(),
])
