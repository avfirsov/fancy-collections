import { pluck } from '../../src'
import { checkEquals, user, users } from '../../Tests'
import { checks } from 'ts-toolbelt/out/Test'

const pluckName = pluck('name')
const pluckDeepDeepGoodDeepKey = pluck('deepKey.deepKey.goodDeepKey')
const pluckAddress = pluck('data.address')

//pluck.get
const name = pluckName.get(user)
const name1 = users.map(pluckName.get)
const nameWithFallback = users.map(pluck('name', '').get)
const deepDeepGoodDeepKey = users.map(pluckDeepDeepGoodDeepKey.get)
const address = users.map(pluckAddress.get)
const boyNextDoor = users.map(pluck('friends.boyNextDoor').get)
const boyNextDoorWithFallback = users.map(
  pluck('friends.boyNextDoor', 'Mike').get
)

//@ts-expect-error
users.map(pluck('name', 42).get)
//@ts-expect-error
users.map(pluck('invalid.key').get)

checks([
  checkEquals<typeof name, string>(),
  checkEquals<typeof name1, string[]>(),
  checkEquals<typeof nameWithFallback, string[]>(),
  checkEquals<typeof deepDeepGoodDeepKey, number[]>(),
  checkEquals<typeof address, { street: string; city: string }[]>(),
  checkEquals<typeof boyNextDoor, (string | undefined)[]>(),
  checkEquals<typeof boyNextDoorWithFallback, string[]>(),
])

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//pluck.sort
users.sort(pluckName.sort((name1, name2) => 42))
users.sort(pluckDeepDeepGoodDeepKey.sort((name1, name2) => 42))
users.sort(
  pluck('friends.boyNextDoor', 'Mike').sort(
    (name1: string, name2: string) => 42
  )
)
users.sort(pluck('friends.boyNextDoor', 'Mike').sort((name1, name2) => 42))
const worksWithoutFallbackOnOptionalPath = users.sort(
  pluck('friends.boyNextDoor').sort((name1, name2) => 42)
)
const worksWithoutFallbackOnOptionalPath2 = users.sort(
  pluck('friends.boyNextDoor').sort(
    (name1: string | undefined, name2: string | undefined) => 42
  )
)

//@ts-expect-error sorter args should have the same types as plucked value
users.sort(pluckName.sort((name1: 42, name2) => 42))
users.sort(
  //@ts-expect-error sorter args should have the same types as plucked value
  pluckDeepDeepGoodDeepKey.sort((name1: string, name2) => 42)
)
users.sort(
  //@ts-expect-error for optional paths without fallbacks, sorter args should have optional types
  pluck('friends.boyNextDoor').sort((name1: string, name2: string) => 42)
)
//@ts-expect-error expect to be applied on
users.sort(pluckName.sort((name1: number, name2) => 42))
//@ts-expect-error sorter fn should return number
users.sort(pluckName.sort((name1, name2) => 'foo'))
//@ts-expect-error doesn't work on invalid paths
users.sort(pluck('invalid.path').sort((name1, name2) => 42))
//@ts-expect-error doesn't work on invalid paths, even with fallback
users.sort(pluck('invalid.path', 'sdf').sort((name1, name2) => 42))

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//pluck.filter
users.filter(
  pluckName.filter((value: string, { name: string }) => value === 'Mike')
)
users.filter(
  pluckDeepDeepGoodDeepKey.filter(
    (
      value: number,
      {
        deepKey: {
          deepKey: { goodDeepKey: number },
        },
      }
    ) => value === 42
  )
)
users.filter(
  pluck('friends.boyNextDoor', 'Mike').filter(
    (value, obj: { friends?: { boyNextDoor?: string } }) => value === 'Mike'
  )
)
users.filter(
  pluck('friends.boyNextDoor', 'Mike').filter(
    (value: string, obj: { friends?: { boyNextDoor?: string } }) =>
      value === 'Mike'
  )
)
users.filter(
  pluck('friends.boyNextDoor').filter(
    (value: string | undefined, obj: { friends?: { boyNextDoor?: string } }) =>
      value === 'Mike'
  )
)
users.filter(
  pluck('friends.boyNextDoor').filter(
    (value, obj: { friends?: { boyNextDoor?: string } }) => value === 'Mike'
  )
)

//@ts-expect-error cb should return boolean
users.filter(pluckName.filter((value) => 42))
//@ts-expect-error type mismatch
users.filter(pluckName.filter((value: number) => value === 42))
//@ts-expect-error optional path leads to optional type of cb's args
users.filter(pluck('friends.boyNextDoor').filter((name: string) => true))
//@ts-expect-error doesn't work on invalid paths
users.sort(pluck('invalid.path').filter((name) => true))
//@ts-expect-error doesn't work on invalid paths, even with fallback
users.sort(pluck('invalid.path', 'sdf').filter((name) => true))

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//pluck.filter
const usersWithStringAge = users.map(
  pluck('age').map((value: number, obj: { age: number }) => value.toString())
)
const usersWithBoyNextDoor = users.map(
  pluck('friends.boyNextDoor').map(
    (value: string | undefined, obj: { friends?: { boyNextDoor?: string } }) =>
      'Mike'
  )
)
const usersWithBoyNextDoorFallbacked = users.map(
  pluck('friends.boyNextDoor', 'Mike').map(
    (value: string, obj: { friends?: { boyNextDoor?: string } }) => value
  )
)

checks([
  checkEquals<typeof usersWithStringAge, { age: string }[]>(),
  checkEquals<
    typeof usersWithBoyNextDoor,
    { friends: { boyNextDoor: string } }[]
  >(),
  checkEquals<
    typeof usersWithBoyNextDoorFallbacked,
    { friends: { boyNextDoor: string } }[]
  >(),
])

users.map(
  //@ts-expect-error type mismatch
  pluck('age').map((value: string, obj: { age: string }) => parseInt(value))
)
users.map(
  //@ts-expect-error type mismatch
  pluck('age', '42').map((value: number, obj: { age: number }) =>
    value.toString()
  )
)
users.map(
  //@ts-expect-error optional paths should lead to optional types of cb's args
  pluck('friends.boyNextDoor').map(
    (value: string, obj: { friends: { boyNextDoor: string } }) => 'Mike'
  )
)
