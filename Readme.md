
# fancy-collections [🌟✨⭐]
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)


`fancy-collections` is a small library easing most common operations on collections. 100% type safe. Extremely user-friendly API

Key Features:
- **No More Type Casting**: Complex collection operations no longer require tedious and error-prone type casts. `fancy-collections` maintains type integrity throughout, making your code cleaner and safer.
- **High Reusability**: `fancy-collections` eliminates the need for collection-specific lambdas, allowing you to apply common-purpose functional-style helpers across various types of collections with ease.
## Installation

To get started with fancy-collections, simply install the package using npm:

```bash
npm install fancy-collections
```

Or, if you're a Yarn enthusiast:

```bash
yarn add fancy-collections
```
## Usage/Examples

### 🧙‍♂️ createDict()
`createDict` is the Marie Kondo of arrays, turning them into neatly indexed dictionaries, with an optional penchant for grouping like a fastidious collector.

```typescript
import { createDict } from 'fancy-collections';

// Basic usage:
const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
const usersByIdDict = createDict(users, 'id');
// Result: { 1: { id: 1, name: 'Alice' }, 2: { id: 2, name: 'Bob' } }

// Advanced usage with nested paths and multiple categories:
const products = [
  { id: 1, category: { name: 'books' }, title: 'TypeScript Handbook' },
  { id: 2, category: { name: 'books' }, title: 'JavaScript: The Good Parts' },
  { id: 3, category: { name: 'electronics' }, title: 'Smartphone' },
  { id: 4, category: { name: 'groceries' }, title: 'Organic Apples' }
];
const productsTitlesByCategoriesDict = createDict(products, 'category.name', {
  pathToMapTo: 'title',
  shouldGroupSameKeyValues: true,
  useMap: true
});
// Result: Map {
//   'books' => ['TypeScript Handbook', 'JavaScript: The Good Parts'],
//   'electronics' => ['Smartphone'],
//   'groceries' => ['Organic Apples']
// }
```

### 🔑 createGetByKey()
In `createGetByKey`, keys play a game of hide and seek; missing ones are met with a polite but firm error, akin to a raised eyebrow in text form.

```typescript
import { createGetByKey } from 'fancy-collections';

// Example with simple path:
const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 }
];
const getUsersByName = createGetByKey(users, 'name');
const userByName = getUsersByName('Alice');
// Result: { name: 'Alice', age: 30 }

// Example with nested path:
const usersWithAddress = [
  { name: 'Alice', age: 30, address: { city: 'New York' } },
  { name: 'Bob', age: 25, address: { city: 'Los Angeles' } },
  { name: 'Eve', age: 28, address: { city: 'New York' } }
];
const getUserByCity = createGetByKey(usersWithAddress, 'address.city');
const userByCity = getUserByCity('New York');
// Result: { name: 'Eve', age: 28, address: { city: 'New York' } }


// Advanced usage with additional parameters:
const getUserByNameOrError = createGetByKey(users, 'name', { errorMsg: 'User not found' });
try {
  const user = getUserByNameOrError('Charlie');
} catch (error) {
  console.log(error); // Logs 'User not found'
}

const getUsersByCity = createGetByKey(usersWithAddress, 'address.city', { shouldGroupSameKeyValues: true });
const usersByCity = getUsersByCity('New York');
// Result: [{ name: 'Alice', age: 30, address: { city: 'New York' } }, { name: 'Eve', age: 28, address: { city: 'New York' } }]
```

### 🔍 get()
`get`: The magnifying glass for object properties. It fetches values hiding in plain sight or nested deeper than a mole in its burrow. A fallback parameter stands by, like an understudy, ready to take the stage should the primary actor (the value) be missing.

```typescript
import { get } from 'fancy-collections';

const user = { name: 'Alice', data: { address: { city: 'Wonderland' } } };
const city = get(user, 'data.address.city', 'Unknown');
// Result: 'Wonderland'
```

### 🛠️ pluck()
`pluck`: The Swiss Army knife for navigating the nested neighborhoods of an object. It's a curried multi-tool, allowing you to remain comfortably at the object level while peering into its depths. When called with a `path` (and an optional `fallback`), it hands you a toolbox with four helpers: `map`, `get`, `filter`, `sort`.

#### 🧩 pluck().get()
A curried convenience store version of get(), ideal for use within Array.map().

```typescript
// utils.ts
export const pluckAge = pluck('age');
export const pluckLocation = pluck('details.location');

// Using pluck().get()
const users = [{ name: 'Alice', age: 30, details: { location: 'CityA' } }, { name: 'Bob', age: 25, details: { location: 'CityB' } }];
const ages = users.map(pluckAge.get);
// Result: [30, 25]

// Complex usage with nested path
const locations = users.map(pluckLocation.get);
// Result: ['CityA', 'CityB']

// Native TypeScript alternative
// Simple usage
const nativeAges = users.map(user => user.age);

// Complex usage with nested path
const nativeLocations = users.map(user => user.details.location);

```

#### 🔍 pluck().filter()
For sieving collections by nested field values, tailor-made for Array.filter(), Array.every(), Array.some().

```typescript
//utils.ts
export const isGreaterThan = (compareWith: number) => (x: number): boolean => x > compareWith;
export const isGreateThan25 = isGreaterThan(25);
export const isEqualToString = (needle: string) => (x: string): boolean => needle === x;
export const isInCityA = isEqualToString('CityA');

// Using pluck().filter()
const filteredUsers = users.filter(pluckAge.filter(isGreateThan25));
// Result: [{ name: 'Alice', age: 30, details: { location: 'CityA' } }]

// Complex usage with nested path
const filteredByLocation = users.filter(pluckLocation.filter(isInCityA));
// Result: [{ name: 'Alice', age: 30, details: { location: 'CityA' } }]

// Native TypeScript alternative
// Simple usage
const nativeFiltered = users.filter(user => user.age > 25);

// Complex usage with nested path
const nativeFilteredByLocation = users.filter(user => user.details.location === 'CityA');
```

#### ⚖️ pluck().sort()
A sorting wizard, ready to bring order to collections within Array.sort().

```typescript
//utils.ts
export const compareStrings = (a: string, b: string): number => a.localeCompare(b);
export const pluckName = pluck('name');

// Using pluck().sort()
const sortedUsers = [...users].sort(pluckName.sort(compareNames));
// Result: [{ name: 'Alice', age: 30, details: { location: 'CityA' } }, { name: 'Bob', age: 25, details: { location: 'CityB' } }]

// Complex usage with nested path
const sortedByLocation = [...users].sort(pluckLocation.sort(compareStrings));
// Result: sorted array by location

// Native TypeScript alternative
// Simple usage
const nativeSorted = [...users].sort((a, b) => a.name.localeCompare(b.name));

// Complex usage with nested path
const nativeSortedByLocation = [...users].sort((a, b) => a.details.location.localeCompare(b.details.location));
```

#### 🎨 pluck().map()
The precision artist for object transformation, ideal for surgical edits within Array.map().

```typescript
//utils.ts
export const incrementBy = (a: number) => (b: number): number => a + b;
export const incrementBy1 = incrementBy(1);
export const toUpperCase = (str: string): string => str.toUpperCase();

// Using pluck().map()
const updatedUsers = users.map(pluckAge.map(incrementBy1));
// Result: [{ name: 'Alice', age: 31, details: { location: 'CityA' } }, { name: 'Bob', age: 26, details: { location: 'CityB' } }]

// Complex usage with nested path
const updatedLocations = users.map(pluckLocation.map(toUpperCase));
// Result: [{ name: 'Alice', age: 30, details: { location: 'CITYA' } }, { name: 'Bob', age: 25, details: { location: 'CITYB' } }]

// Native TypeScript alternative
// Simple usage
const nativeUpdated = users.map(user => ({ ...user, age: user.age + 1 }));

// Complex usage with nested path
const nativeUpdatedLocations = users.map(user => ({ ...user, details: { ...user.details, location: user.details.location.toUpperCase() } }));
```

#### 🔤mathesString()
`mathesString`: A precision tool in your string-matching toolbox, turning every character comparison into an amusing game of 'spot the difference'.

```typescript
import { matchesString } from 'fancy-collections';

// The standard approach, for the non-fussy types
const matchHello = matchesString('Hello');
console.log(matchHello('Hello World'));  // true
console.log(matchHello('Hi there'));     // false

// For the case-sensitive, detail-oriented folks
const matchHelloCaseSensitive = matchesString('hello', { caseSensitive: true });
console.log(matchHelloCaseSensitive('Hello')); // false
console.log(matchHelloCaseSensitive('hello')); // true

// When you demand an exact match, because close enough isn't good enough
const matchFullString = matchesString('Hello', { matchFull: true });
console.log(matchFullString('Hello World'));   // false
console.log(matchFullString('Hello'));         // true

```

#### 🧩 matchesPluckedStrings()
A master key for nested treasures, `matchesPluckedStrings` delves into the depths of data structures, unearthing matches with the finesse of an archaeologist. Craft your own universal decoders like `matchesNameIdDescription` and watch complex data structures yield their secrets with ease.
```typescript
import { matchesPluckedStrings } from 'fancy-collections';

const products = [
  { id: '123', name: 'SuperWidget', description: 'The ultimate widget', details: { category: 'Widgets' } },
  { id: '456', name: 'MegaGadget', description: 'A revolutionary gadget', details: { category: 'Gadgets' } }
];

// Filtering products based on multiple fields
const matchProductFields = matchesPluckedStrings(
  ['id', 'name', 'description', 'details.category'] as const
);

// Case-insensitive partial match by default
const matchCaseInsensitive = matchProductFields('widget');
const caseInsensitiveMatches = products.filter(matchCaseInsensitive);
console.log(caseInsensitiveMatches); // [{ id: '123', name: 'SuperWidget', description: 'The ultimate widget', details: { category: 'Widgets' } }, { id: '456', name: 'MegaGadget', description: 'A revolutionary gadget', details: { category: 'Gadgets' } }]

// Case-sensitive full match
const matchCaseSensitiveFull = matchProductFields('SuperWidget', { opts: { caseSensitive: true, matchFull: true } });
const caseSensitiveFullMatches = products.filter(matchCaseSensitiveFull);
console.log(caseSensitiveFullMatches); // { id: '123', name: 'SuperWidget', description: 'The ultimate widget', details: { category: 'Widgets' } }
```

#### 🔗 and()
The grand unifier, `and` wields logic like a conductor with an orchestra, orchestrating complex symphonies of conditions. Combine it with matchesPluckedStrings for a performance that makes even the most intricate data dance to your tune.
```typescript
import { and, matchesPluckedStrings } from 'fancy-collections';

const products = [
  { id: '123', name: 'SuperWidget', description: 'The ultimate widget', details: { category: 'Widgets' } },
  { id: '456', name: 'MegaGadget', description: 'A revolutionary gadget', details: { category: 'Gadgets' } }
];

const matchWidget = matchesPluckedStrings(['name'] as const)('widget');
const matchGadgetsCategory = matchesPluckedStrings(['details.category'] as const)('Gadgets');

const widgetAndGadgetsCategory = products.filter(and(matchWidget, matchGadgetsCategory));
console.log(widgetAndGadgetsCategory); // Filters products that are widgets and in the Gadgets category
```

#### 🚫 not()
The contrarian of the group, `not` turns your conditions on their head with a mischievous wink. It's the twist in your logical tale, ensuring that what you don't want is as clear as what you do.
```typescript
import { not, matchesPluckedStrings } from 'fancy-collections';

const products = [
  { id: '123', name: 'SuperWidget', description: 'The ultimate widget', details: { category: 'Widgets' } },
  { id: '456', name: 'MegaGadget', description: 'A revolutionary gadget', details: { category: 'Gadgets' } }
];

const matchGadget = matchesPluckedStrings(['name'] as const)('gadget');

const notGadget = products.filter(not(matchGadget));
console.log(notGadget); // Filters products that are not gadgets
```

#### ➕ or()
The inclusive friend, or invites all possibilities to the party. Perfect for when you're not picky, it's the open-minded ally that plays well with `matchesPluckedStrings`, embracing a wide array of conditions with a welcoming grin.
```typescript
import { or, matchesPluckedStrings } from 'fancy-collections';

const products = [
  { id: '123', name: 'SuperWidget', description: 'The ultimate widget', details: { category: 'Widgets' } },
  { id: '456', name: 'MegaGadget', description: 'A revolutionary gadget', details: { category: 'Gadgets' } }
];

const matchWidget = matchesPluckedStrings(['name'] as const)('widget');
const matchGadgetsCategory = matchesPluckedStrings(['details.category'] as const)('Gadgets');

const widgetOrGadgetsCategory = products.filter(or(matchWidget, matchGadgetsCategory));
console.log(widgetOrGadgetsCategory); // Filters products that are either widgets or in the Gadgets category

```

#### ✅ isNotNull()
Like a bouncer at the club, `isNotNull` ensures that nulls don't crash your array's party. Post-filter, your array struts confidently, free of nulls and full of possibilities, typed with the assurance of a VIP list.
```typescript
import { isNotNull } from 'fancy-collections';

const users: Array<{ name: string } | null> = [
  { name: 'Alice' },
  null
];
const onlyUsers = users.filter(isNotNull);
console.log(onlyUsers); // Filters out null, array is typed without null
```

#### 🚀 isNotUndefined()
The meticulous librarian, `isNotUndefined` sifts through your array with a discerning eye, removing any undefined elements. What remains is a well-curated collection, typed and tidy, like books neatly arranged on a shelf.
```typescript
import { isNotUndefined } from 'fancy-collections';

const usersWithUndefined: Array<{ name: string } | undefined> = [
  { name: 'Bob' },
  undefined
];
const definedUsers = usersWithUndefined.filter(isNotUndefined);
console.log(definedUsers); // Filters out undefined, array is typed without undefined
```
## Running Tests

To run tests, run the following command

```bash
  npm run test
```

Or to run typing tests

```bash
npm run typing-tests
```
## Contributing
Got an idea to make `fancy-collections` even more awesome? Don't hesitate to contribute. Contributions are always welcome.

## License

[MIT](https://choosealicense.com/licenses/mit/)


## Acknowledgements
Created with ❤️ by [@avfirsov](https://github.com/avfirsov) with assistance of [ChatGPT](https://chat.openai.com/) and [Pieces For Developers](https://pieces.app/) (tests, description and readme)
