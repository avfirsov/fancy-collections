import { checkEquals, User, users } from '../../Tests'
import {
  and,
  isNotNull,
  isNotUndefined,
  matchesPluckedStrings,
  not,
  or,
  pluck,
} from '../../src'
import { checks } from 'ts-toolbelt/out/Test'

const usersOrNot: (User | undefined | null)[] = []
const usersFiltered = usersOrNot.filter(isNotUndefined).filter(isNotNull)
checks([checkEquals<typeof usersFiltered, User[]>()])

const matchesNameOrFriendName = matchesPluckedStrings([
  'name',
  'friend.name',
] as const)
const nameAndFriendNameIsMike = matchesNameOrFriendName('Mike')
const nameAndFriendNameIsAlex = matchesNameOrFriendName('Alex')
const nameAndFriendNameIsJoe = matchesNameOrFriendName('Joe')

const filtered = users.filter(
  not(
    or(
      and(nameAndFriendNameIsMike, nameAndFriendNameIsAlex),
      nameAndFriendNameIsJoe
    )
  )
)
checks([checkEquals<typeof filtered, User[]>()])

const matchesBoyNextDoor = matchesPluckedStrings([
  'friends.boyNextDoor',
] as const)
const matchesBoyNextDoorFallbacked = matchesPluckedStrings(
  ['friends.boyNextDoor'] as const,
  { fallback: 'Mike' }
)
const boyNextDoorIsMike = matchesBoyNextDoor('Mike')
const boyNextDoorIsMikeFallbacked = matchesBoyNextDoorFallbacked('Mike')
//@ts-expect-error can't be applied to optional paths
users.filter(boyNextDoorIsMike)
//but works when fallbacked
users.filter(boyNextDoorIsMikeFallbacked)
//and when optional path is made not optional, can be applied
users
  .map(pluck('friends.boyNextDoor', 'Mike').map((x) => x))
  .filter(boyNextDoorIsMike)
//@ts-expect-error doesn't work for invalid paths
users.filter(matchesPluckedStrings(['invalid.path'] as const)('foo'))
