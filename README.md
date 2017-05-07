#Option - ([Tutorial](http://blog.codyschaaf.com/typescript/options/2017/05/07/exploring-options-in-javascript-typescript.html)) 

A TypeScript implementation of Option. Based on Scala's Option library.
 
Options force the user to always ensure they are handling for the possible null case.
By defining optional method parameters as options you can keep a more consistent syntax 
and ensure the method implementation stays compatible with both possibilities.

Options keep with the iterable api, meaning you can duck type the with arrays, streams, ect.

Options also ensure a more functional approach to programming, and help keep code cleaner and easier to read. 
   
#Bower and Npm

npm install `cs-option`
bower install `cs-option`

#How to use:

There are both helper static members and instance members listed below. Also for more information
see my [blog](http://blog.codyschaaf.com/typescript/options/2017/05/07/exploring-options-in-javascript-typescript.html)
post on the subject, where we go over example uses. 

##Static Members:


#### `isNully(possiblyUndefinedOrNullValue: any): boolean;`

Helper to check if a variable is null or undefined.

```js
Option.isNully(undefined) // => true
Option.isNully(null) // => true

Option.isNully(0) // => false
Option.isNully("") // => false
Option.isNully(1) // => false
Option.isNully([]) // => false

```

#### `fromNullable<T>(possiblyUndefinedOrNullValue: T | undefined): Option<T>`

Used to create an option out of any value, even possibly null values. Use full when calling
an untrusted api like array.pop since it could return a value or undefined. 
 
```js
Option.fromNullable(possiblyACat) // => Option[possiblyACat]
```

#### `of<T>(value: T): Option<T>`

Makes an option out of a concrete value. Use full when calling an api that expects an option,
but you have a value. 

```js
Option.of(1)

```


#### `find<T>(arr: T[], fnOrMatch?: LodashMatches<T>): Option<T>`

Wraps `array.find` so that it returns an option. 
If you have lodash included it is much more flexable with the second parameter.

```js
Option.find(arrayOfNumber, (num) => num === 1) // Option[1]

```

#### `pop<T>(arr: T[]): Option<T>`

Wraps `array.pop` in an Option.

```js
Option.pop(arr) // => Option[value] || Option[undefined]

```

#### `absent<T>(): Option<T>`

Generates an empty option.

```ts
Option.absent<number>() // Option[undefined] 

```

##Instance Members:

#### `isPresent(): boolean`

Checks if the Options has a value.

```js

Option.of(1).isPresent() // => true
Option.fromNullable(null).isPresent() // => false

```

#### `isAbsent(): boolean`

Checks if the Options does not have a value.

```js

Option.of(1).isAbsent() // => false
Option.fromNullable(null).isAbsent() // => true

```

#### `get(): T`

Gets the options value, and throws an error if absent.

```js

Option.of(1).get() // => 1
Option.fromNullable(null).get() // => throw

```

#### `or(orValue: T): T`

Returns the options value or a default value

```js
Option.of(1).or(2) // => 1
Option.fromNullable(null).or(2) // => 2

```

#### `orThrow(error: (typeof Error) | string, message?: string): T`

```js
Option.of(1).orThrow("we need a value") // => 1
Option.of(1).orThrow(Error, "we need a value") // => 1
Option.fromNullable(null).orThrow("we need a value") // => throw "we need a value"

```

#### `forEach(fn: (value: T) => any): void`

If the option is nonempty calls the callback on it, else do nothing.
"forEach" might seem odd for a singleton, but this is consistent with Scala's Option,
and keeps with the iterable terminology

```js
Option.of(1).forEach(num => console.log(num)) // => 1
Option.fromNullable(null).forEach(num => console.log(num)) //

```

#### `orCall(fn: () => T): T`

Returns the option's value if present otherwise calls the callback and returns its return

```js

Option.of(1).orCall(() => 2) // => 1
Option.fromNullable(null).orCall(() => 2) // => 2
Option.fromNullable(null).orCall(() => {throw "something"}) // throw "something"

```

#### `orElse(alternative: Option<T>): Option<T>`

If the option is nonempty return it, otherwise return the result of evaluating an alternative expression.

Use full when you need a default but the method api you are passing it to needs an option. 
 
```js

Option.of(1).orElse(Option.of(1)) // => Option[1]
Option.fromNullable(null).orElse(Option.fromNullable(undefined)) // => Option[undefined]

```

#### `filter(is: (value: T) => boolean): Option<T>`

Returns this $option if it is nonempty and applying the predicate $p to
this $option's value returns true. Otherwise, return $none.

Use full when you have an object that needs to be filtered on a value.

```js

Option.of(1).filter(n => n === 1) // => Option[1]
Option.of(2).filter(n => n === 1) // => Option[undefined]
Option.fromNullable(null).filter(n => n === 1) // => Option[undefined]

```

#### `filterValue(is: T): Option<T>`

Returns this $option if it is nonempty and is true when the predicate $p
is compared with strict equality to this $option's value returns true.
Otherwise, return $none.

```js
Option.of(1).filterValue(1) // => Option[1]
Option.of(2).filterValue(1) // => Option[undefined]
Option.fromNullable(null).filterValue(1) // => Option[undefined]

```

#### `filterNotValue(is: T): Option<T>`

Returns this $option if it is nonempty and is false when the predicate $p
is compared with strict equality to this $option's value returns true.
Otherwise, return $none.

```js

Option.of(1).filterNotValue(1) // => Option[undefined]
Option.of(2).filterNotValue(1) // => Option[1]
Option.fromNullable(null).filterNotValue(1) // => Option[undefined]

```

#### `contains(elem: T): boolean`

Tests whether the option contains a given value as an element.

```js

Option.of(1).contains(1) // => true
Option.of(2).contains(1) // => false
Option.fromNullable(null).contains(1) // => false

```

#### `exists(is: (value: T) => boolean): boolean`

Returns true if this option is nonempty and the predicate
$p returns true when applied to this $option's value.
Otherwise, returns false.

```js

Option.of(1).exists(n => n === 1) // => true
Option.of(2).exists(n => n === 1) // => false
Option.fromNullable(null).exists(n => n === 1) // => false

```

#### `map<V>(transformer: (value: T) => V): Option<V>`

Transform an option into another option

```js

Option.of(1).map(n => n * 2) // => Option[2]
Option.of(2).map(n => n * 2) // => Option[4]
Option.of({name: "Blue"}).map(n => n.name) // => Option["Blue"]
Option.fromNullable(null).map(n => n * 2) // => Option[undefined]

```

#### `flatMap<V>(transformer: (value: T) => Option<V>): Option<V>`

Transfrom an option into another option while flattening nesting.

```js

Option.of({name: Option.of("Blue")}).flatMap(n => n.name) // => Option["Blue"]
Option.fromNullable(null).flatMap(n => n.name) // => Option[undefined]

```

#### `promiseTransform<V>(q: PromiseConstructor, transformer: (value: T) => Promise<V>): Promise<Option<V>>`

Takes in a promise constructor to map an option into a promise wrapped option.

```js

Option.of(user).promiseTransform(Promise /* or $q */, saveUser) // => user saved and user data returned Promise[Option[user]]
Option.fromNullable(possibleUser /* null in this example */).promiseTransform(Promise /* or $q */, saveUser) // => user saved and user data returned Promise[Option[user]]

```

