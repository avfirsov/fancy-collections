import { Boolean, Test } from 'ts-toolbelt'
import { check, Fail, Pass } from 'ts-toolbelt/out/Test'
import { Equals } from 'ts-toolbelt/out/Any/Equals'
import { Extends } from 'ts-toolbelt/out/Any/Extends'

export type User = {
  name: string
  age: number

  deepKey: {
    deepKey: {
      goodDeepKey: number
      badDeepKey: []
    }
  }

  friend: {
    name: string
  }

  friends?: {
    boyNextDoor: string
  }

  data: {
    address: {
      street: string
      city: string
    }
  }
}

const mike: User = {
  name: 'Mike',
  age: 42,
  deepKey: {
    deepKey: {
      goodDeepKey: 42,
      badDeepKey: [],
    },
  },
  friends: {
    boyNextDoor: 'Jason',
  },
  friend: {
    name: 'Albert',
  },
  data: {
    address: {
      street: 'Park Avenue',
      city: 'New York',
    },
  },
}

const johnDoe: User = {
  name: 'John Doe',
  age: 33,
  deepKey: {
    deepKey: {
      goodDeepKey: 42,
      badDeepKey: [],
    },
  },
  friend: {
    name: 'Jane Doe',
  },
  friends: {
    boyNextDoor: 'Tom',
  },
  data: {
    address: {
      street: '123 Main St',
      city: 'Anytown',
    },
  },
}

export const janeSmith: User = {
  name: 'Jane Smith',
  age: 27,
  deepKey: {
    deepKey: {
      goodDeepKey: 24,
      badDeepKey: [],
    },
  },
  friend: {
    name: 'John Smith',
  },
  friends: {
    boyNextDoor: 'Jerry',
  },
  data: {
    address: {
      street: '456 Elm St',
      city: 'Sometown',
    },
  },
}

export const user: User = mike
export const users: User[] = [mike, johnDoe, janeSmith]

export const twoAlicesAndBob: User[] = [
  {
    name: 'Alice',
    age: 30,
    deepKey: { deepKey: { goodDeepKey: 1, badDeepKey: [] } },
    friend: { name: 'Bob' },
    friends: { boyNextDoor: 'Charlie' },
    data: { address: { street: '123 Apple St', city: 'Wonderland' } },
  },
  {
    name: 'Alice',
    age: 35,
    deepKey: { deepKey: { goodDeepKey: 2, badDeepKey: [] } },
    friend: { name: 'Dave' },
    data: { address: { street: '456 Banana Ave', city: 'Dreamland' } },
  },
  {
    name: 'Bob',
    age: 40,
    deepKey: { deepKey: { goodDeepKey: 3, badDeepKey: [] } },
    friend: { name: 'Alice' },
    data: { address: { street: '789 Cherry Blvd', city: 'Fairyland' } },
  },
]

/*
 * literally same as ts-toolbelt check, but with default Outcome === 1 (true)
 * */
export declare const checkEquals: {
  <Type, Expect, Outcome extends 1 | 0 = Test.Pass>(
    debug?: Type
  ): Equals<Equals<Type, Expect>, Outcome>
}

export declare const checkExtends: {
  //by default, expect Outcome to be 1 (true)
  <Extendable, Extended, Outcome extends 1 | 0 = Test.Pass>(
    debug?: Extendable
  ): Equals<Extends<Extendable, Extended>, Outcome>
}

export declare const isTrue: { <Cond extends Pass>(): Pass }
export declare const isFalse: { <Cond extends Fail>(): Pass }
