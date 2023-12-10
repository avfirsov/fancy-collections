import { Test } from 'ts-toolbelt'
import {
  ReconstructObjByPath,
  ValidPathToIndexableKey,
  ValidPathToValue,
} from '../../src'
import { checkEquals, checkExtends, User } from '../../Tests'
import { Get } from 'type-fest'
import { Extends } from 'ts-toolbelt/out/Any/Extends'

const { checks } = Test

const isTrue: Extends<
  Get<User, 'friends.boyNextDoor'>,
  string | undefined
> extends 1
  ? true
  : false = true

const fop: ValidPathToValue<User, string | undefined> = 'friends.boyNextDoor'
const fop54: ValidPathToValue<User, string | undefined, 'extends'> =
  'friends.boyNextDoor'

//ValidPathToValue
checks([
  checkEquals<
    ValidPathToValue<User, string>,
    'name' | 'data.address.street' | 'data.address.city' | 'friend.name'
  >(),
  checkEquals<
    ValidPathToValue<User, string>,
    | 'name'
    | 'data.address.street'
    | 'data.address.city'
    | 'friend.name'
    //optional paths are not returned
    | 'friends.boyNextDoor',
    Test.Fail
  >(),
  checkEquals<
    //by default, values are checked via ts-toolbelt.Extends
    //string extends string | undefined, so it returns union of all string paths, including optional
    ValidPathToValue<User, string | undefined>,
    | 'name'
    | 'data.address.street'
    | 'data.address.city'
    | 'friend.name'
    //to include optional paths, just pass Value | undefined
    | 'friends.boyNextDoor'
  >(),
  checkEquals<
    //to use Equals comparison, use isStrict: true
    ValidPathToValue<User, string | undefined, 'equals'>,
    //to restrict return type to optional paths only, use Value | undefined w\ 'equals' comparison mode
    'friends.boyNextDoor'
  >(),
  checkEquals<
    ValidPathToValue<User, number>,
    'age' | 'deepKey.deepKey.goodDeepKey'
  >(),
  checkEquals<
    ValidPathToValue<User, number>,
    'age' | 'deepKey.deepKey.badDeepKey',
    Test.Fail
  >(),
])

// ValidPathToIndexableKey
checks([
  checkEquals<
    ValidPathToIndexableKey<User>,
    | 'name'
    | 'age'
    | 'data.address.street'
    | 'data.address.city'
    | 'friend.name'
    | 'deepKey.deepKey.goodDeepKey'
  >(),
  checkEquals<
    ValidPathToIndexableKey<User>,
    | 'name'
    | 'age'
    | 'data.address.street'
    | 'data.address.city'
    | 'friend.name',
    Test.Fail
  >(),
  checkEquals<
    ValidPathToIndexableKey<User>,
    | 'name'
    | 'age'
    | 'data.address.street'
    | 'data.address.city'
    | 'friend.name'
    | 'deepKey.deepKey.badDeepKey',
    Test.Fail
  >(),
])

// ReconstructObjByPath
checks([
  checkExtends<User, ReconstructObjByPath<'name', string>>(),
  //optional paths can be reconstructed via Value | undefined
  checkExtends<
    User,
    ReconstructObjByPath<'friends.boyNextDoor', string | undefined>
  >(),
  //optional paths doesn't match strict reconstruction
  checkExtends<
    User,
    ReconstructObjByPath<'friends.boyNextDoor', string>,
    Test.Fail
  >(),
  checkExtends<User, ReconstructObjByPath<'data.address.street', string>>(),
  checkExtends<User, ReconstructObjByPath<'age', number>>(),
  checkExtends<User, ReconstructObjByPath<'age', string>, Test.Fail>(),
  checkExtends<
    User,
    ReconstructObjByPath<'data.address.zip', string>,
    Test.Fail
  >(),
])
