import {Get, Paths} from "type-fest";

type Cast<A1 extends any, A2 extends any> =
    A1 extends A2
        ? A1
        : A2

declare function get<O extends object, P extends Paths<O>>(
    object: O, path: P
): Get<O, Cast<P, string>>

//TODO: Fallback
declare function pluck<P extends string | readonly string[]>(path: P): {<O extends object>(object: P extends Paths<O> ? O : never): Get<O, Cast<P, string>>}

//TODO: pluckFrom *easy*

pluck('name')(user)

declare const user: User

type User = {
    name: string;
    goodDeepKey: {
        goodDeepKey: {
            goodDeepKey: 42
        }
    }
    friends?: {
        boyNextDoor: 'Mike'
    };
}

// works
const userName = get(user, 'name')
const notValidPath = get(user, 'name2')
const friendName = get(user, 'friends.boyNextDoor')
const friendFriendName = get(user, 'friends.40.friends.12.name')

const userName2 = pluck( 'name')(user)
const notValidPath2 = pluck( 'name2')(user)
const friendName2 = pluck( 'friends.boyNextDoor')(user)
const friendFriendName2 = pluck( 'friends.40.friends.12.name')(user)



//TODO: make generic - abstract away keyof any
type ValidPathToKey<O extends object> = {
    [Path in Paths<O>]: Get<O, Cast<Path, string>> extends keyof any ? Path : never;
}[Paths<O>]

//TODO: pathToMapTo
//TODO: finish
declare function createDict<O extends object, PathToKey extends ValidPathToKey<O>>(
    object: O, pathToKey: PathToKey
): Get<O, Cast<PathToKey, string>>

const userName3 = createDict(user, 'name')
const notValidPath3 = createDict(user, 'name2')
const friendName3 = createDict(user, 'friends.boyNextDoor')
const friendFriendName3 = createDict(user, 'friends')
const goodKey3 = createDict(user, 'goodDeepKey.goodDeepKey.goodDeepKey')


declare const object: O

const foo = get(object, 'h.b.c.d.a' as const)

type O = {

    h: {
        b: {
            c: {
                d: {
                    a: 42,
                    e: {
                        f: null
                    }
                }
            }
        }
    },
    b: {
        b: {
            c: {
                d: {
                    e: {
                        f: null
                    }
                }
            }
        }
    },
    c: {
        b: {
            c: {
                d: {
                    e: {
                        f: null
                    }
                }
            }
        }
    },
    d: {
        b: {
            c: {
                d: {
                    e: {
                        f: null
                    }
                }
            }
        }
    }
}


// import {I, M} from 'ts-toolbelt'

/**
 * Отсюда можно взять ограничение рекурсии
 */
// type _PathsDot<O, Paths extends string = '', Limit extends I.Iteration = I.IterationOf<'0'>> =
//     11 extends I.Pos<Limit> ? Paths :
//         O extends M.BuiltIn ? Paths :
//             O extends object ? Paths | {
//                 [K in keyof O]: _PathsDot<O[K], `${Paths}.${K & string}`, I.Next<Limit>>
//             }[keyof O]
//                 : Paths
//
// export type PathsDot<O extends object> =
//     _PathsDot<O> extends `.${infer P}` | infer _
//         ? P
//         : ''

