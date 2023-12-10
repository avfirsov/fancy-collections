import { get } from '../../src'
import { checkEquals, User, user } from '../../Tests'
import { Test } from 'ts-toolbelt'

const { checks } = Test

const name = get(user, 'name')
const street = get(user, 'data.address.street')
const age = get(user, 'age')
const ageWithNumberFallback = get(user, 'age', 42)
const addressWithFallback = get(user, 'data.address', {
  city: 'Moscow',
  street: 'Filevskaya',
})
const boyNextDoor = get(user, 'friends.boyNextDoor')
//If fallback is set, return's value type equals the type of fallback
const boyNextDoorWithFallback = get(user, 'friends.boyNextDoor', 'Mike')

// @ts-expect-error type mismatch between fallback and paths' value
get(user, 'data.address.city', 42)
// @ts-expect-error invalid path
get(user, 'invalid.path')
// @ts-expect-error fallback doesn't prevent throwing error in case of wrong path
get(user, 'invalid.path', 'foo')

checks([
  checkEquals<typeof name, string>(),
  checkEquals<typeof street, string>(),
  checkEquals<typeof age, number>(),
  checkEquals<typeof ageWithNumberFallback, number>(),
  checkEquals<
    typeof addressWithFallback,
    {
      city: string
      street: string
    }
  >(),
  checkEquals<typeof boyNextDoor, string | undefined>(),
  checkEquals<typeof boyNextDoorWithFallback, string>(),
])
