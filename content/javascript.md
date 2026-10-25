---
name: JavaScript
icon: 🟨
category: Frontend
track: fullstack
color: #eab308
order: 1
description: JavaScript is the programming language of the web, used to make pages interactive in the browser and to build servers with Node.js.
---

## Introduction to JavaScript
video: javascript introduction for beginners
summary: What JavaScript is, where it runs, and why it is used for both frontend and backend.

JavaScript (JS) is a high-level, dynamically typed, multi-paradigm language. It supports object-oriented, functional and event-driven styles. Browsers run it natively, and with Node.js it also runs on servers, so one language can power a whole application.

Strictly speaking JS is a **prototype-based** language (classes are syntax on top of prototypes), single-threaded, and interpreted/JIT-compiled by engines such as V8.

### Advantages of JavaScript
- Less server interaction: validate input in the browser before sending it.
- Immediate feedback: no full page reload needed.
- Richer user interfaces: drag and drop, sliders, animations.
- High performance: modern engines use JIT compilation.
- Cross-platform: runs in every browser, on servers, mobile (React Native) and desktop (Electron).

```js
console.log("Hello, JavaScript!");
```

### Key Points
- Client side (browser) and server side (Node.js) are both possible.
- JS is single-threaded but handles async work through the event loop.
- Interview tip: be ready to explain "JS is single-threaded yet non-blocking".

## Data Types
video: javascript data types primitive non primitive
summary: Primitive types are immutable values copied by value; non-primitive types are mutable and copied by reference.

JavaScript has two groups of data types.

### Primitive types
Stored directly as values. They are **immutable** (you cannot change the value itself, only replace it) and are **copied by value**.

`string`, `number`, `boolean`, `null`, `undefined`, `bigint`, `symbol`

### Non-primitive types
Also called reference types. They hold **multiple values**, are **mutable**, and variables store a **reference** (memory address), so copying a variable copies the reference.

`object`, `array`, `function`

```js
let a = 10;
let b = a;
b = 20;
console.log(a); // 10 (copied by value)

const o1 = { x: 1 };
const o2 = o1;
o2.x = 99;
console.log(o1.x); // 99 (same reference)
```

Note: primitives do not have methods themselves, but JS temporarily wraps them in objects so `"abc".toUpperCase()` works.

### Key Points
- `typeof null` returns `"object"` (a historical bug); `null` is a primitive.
- `undefined` means "not assigned"; `null` means "intentionally empty".
- Interview tip: explain value vs reference with the code above.

## var vs let vs const
video: javascript var let const difference
summary: Compare the three variable keywords by scope, redeclaration, reassignment and hoisting behaviour.

| Keyword | Reassign | Redeclare | Scope |
|---------|----------|-----------|-------|
| `var` | Yes | Yes | Function |
| `let` | Yes | No | Block |
| `const` | No | No | Block |

- **Scope**: `var` is visible in the whole function; `let` and `const` only inside the `{ }` block where declared.
- **Hoisting**: all three are hoisted, but `var` is initialised as `undefined`, while `let`/`const` stay in the *Temporal Dead Zone* (TDZ) until the declaration line, so using them earlier throws a `ReferenceError`.
- **const** prevents reassignment of the variable, but an object stored in it can still be mutated.

```js
if (true) {
  var a = 1;
  let b = 2;
}
console.log(a); // 1
console.log(b); // ReferenceError

const user = { name: "Ravi" };
user.name = "Amit"; // allowed
user = {};          // TypeError
```

### Key Points
- Prefer `const` by default, `let` when you must reassign, avoid `var`.
- Interview tip: the classic `for (var i...)` with `setTimeout` prints the same value because `var` is not block scoped.

## Hoisting
video: javascript hoisting explained
summary: Declarations are moved to the top of their scope during compilation, but initialisations are not.

Before running your code, the JS engine scans it and registers declarations in memory. This is called **hoisting**: declarations behave as if they were moved to the top of their scope.

Only the **declaration** is hoisted, not the assignment.

```js
console.log(x); // undefined
var x = 10;

sayHi();        // works
function sayHi() { console.log("Hi"); }

hello();        // TypeError: hello is not a function
var hello = function () {};
```

- `var` variables are hoisted and set to `undefined`.
- Function declarations are hoisted completely (name and body).
- `let`, `const` and `class` are hoisted but remain in the Temporal Dead Zone, so access before declaration throws an error.
- Function expressions and arrow functions follow the rules of the variable that holds them.

### Key Points
- Hoisting is a result of the memory-creation phase of an execution context.
- Interview tip: be able to predict the output of code mixing `var`, `let` and function declarations.

## Equality: == vs ===
video: javascript == vs === difference
summary: Loose equality converts types before comparing; strict equality compares both value and type.

```js
5 == "5";   // true  (string converted to number)
5 === "5";  // false (different types)
null == undefined;  // true
null === undefined; // false
```

- `==` (loose equality) performs **type coercion** before comparing.
- `===` (strict equality) compares **value and type** with no coercion.
- `Object.is()` is similar to `===` but treats `NaN` as equal to itself and distinguishes `+0` from `-0`.

```js
NaN === NaN;        // false
Object.is(NaN, NaN) // true
[] == false;        // true (surprising!)
```

### Key Points
- Always use `===` unless you deliberately want coercion (such as `x == null` to check null or undefined).
- Objects are compared by reference: `{} === {}` is `false`.

## String Methods
video: javascript string methods
summary: The most common built-in methods for changing, searching and slicing strings.

Strings are immutable, so every method returns a **new** string and leaves the original unchanged.

```js
const str = "  Hello World  ";

str.toUpperCase();        // "  HELLO WORLD  "
str.toLowerCase();        // "  hello world  "
str.trim();               // "Hello World"  (removes whitespace)
str.trim().slice(0, 5);   // "Hello" (part of string; end is excluded)
"Hi".concat(" there");    // "Hi there"
"a-b-c".replace("-", "+"); // "a+b-c" (only the first match)
"a-b-c".replaceAll("-", "+"); // "a+b+c"
"Hello".charAt(1);        // "e"
```

Other useful ones: `includes()`, `indexOf()`, `startsWith()`, `split()`, `padStart()`, `repeat()`.

```js
"a,b,c".split(",");   // ["a","b","c"]
"abc".includes("b");  // true
```

### Key Points
- `slice(start, end)` supports negative indexes; `end` is not included.
- `replace` with a string replaces only the first match; use a regex with `g` or `replaceAll`.
- Template literals (`` `Hi ${name}` ``) are the modern way to build strings.

## Array Methods
video: javascript array methods push pop splice slice
summary: Methods to add, remove, copy and modify arrays, and which of them mutate the original.

| Method | Description | Mutates? |
|--------|-------------|----------|
| `push()` | Add to end | Yes |
| `pop()` | Remove from end | Yes |
| `unshift()` | Add to start | Yes |
| `shift()` | Remove from start | Yes |
| `toString()` | Converts array to string | No |
| `concat()` | Joins multiple arrays | No |
| `slice(start, end)` | Returns a shallow copy of a portion | No |
| `splice(start, deleteCount, ...items)` | Adds/removes elements in place | Yes |

```js
const arr = [1, 2, 3, 4, 5];
arr.push(6);            // [1,2,3,4,5,6]
arr.slice(1, 3);        // [2,3]   original unchanged
arr.splice(1, 2);       // removes [2,3], arr is now [1,4,5,6]
arr.splice(1, 0, 10);   // inserts 10 at index 1
```

### Key Points
- Interview tip: `slice` vs `splice` is a very common question. `slice` copies (no mutation), `splice` changes the array.
- Also know `includes`, `find`, `findIndex`, `some`, `every`, `sort` and `flat`.
- `sort()` converts to strings by default; pass a comparator for numbers: `arr.sort((a, b) => a - b)`.

## Higher-Order Array Methods
video: javascript map filter reduce foreach
summary: map, filter, reduce and forEach let you process arrays declaratively with callbacks.

These methods take a callback function and apply it to every element.

```js
const arr = [1, 2, 3, 4];

// map: returns a new array of transformed values
let doubled = arr.map(val => val * 2);          // [2,4,6,8]

// filter: keeps elements for which callback returns true
let evens = arr.filter(val => val % 2 === 0);   // [2,4]

// reduce: folds the array into a single value
let sum = arr.reduce((acc, val) => acc + val, 0); // 10

// forEach: runs a function for each item, returns undefined
arr.forEach(val => console.log(val));
```

| Method | Returns | Use when |
|--------|---------|----------|
| `map` | New array, same length | Transform each item |
| `filter` | New array, shorter or equal | Select items |
| `reduce` | Single value | Sum, group, flatten |
| `forEach` | `undefined` | Side effects only |

### Key Points
- `map`, `filter` and `reduce` do not mutate the original array, and they can be chained: `arr.filter(...).map(...)`.
- Always give `reduce` an initial value to avoid errors on empty arrays.
- `forEach` cannot be stopped with `break`; use a `for...of` loop if you need that.

## Functions
video: javascript functions arrow function declaration
summary: Reusable blocks of code, written as declarations, expressions or arrow functions.

A function is a reusable block of code that performs a specific task.

```js
// Function Declaration (hoisted)
function greet() {
  console.log("Hello");
}

// Function Expression
const greet2 = function () { console.log("Hello"); };

// Arrow Function
const greet3 = () => console.log("Hello");
```

### Arrow functions vs normal functions
- Shorter syntax; implicit return for single expressions: `x => x * 2`.
- They have **no own `this`**: they take `this` from the surrounding scope.
- They have no `arguments` object and cannot be used as constructors with `new`.

```js
function add(a, b = 0, ...rest) { // default and rest parameters
  return a + b + rest.length;
}
```

### Key Points
- Functions are first-class citizens: they can be stored in variables, passed as arguments and returned.
- Interview tip: know when NOT to use arrows (object methods, constructors).

## Callback Functions
video: javascript callback function
summary: A callback is a function passed into another function to be executed later.

A **callback** is a function passed as an argument to another function, which calls it at the right time, often after an async task finishes. This works because functions are first-class values in JS.

```js
function fetchData(callback) {
  setTimeout(() => {
    callback("Data received");
  }, 1000);
}

fetchData(result => console.log(result)); // after 1s: Data received
```

Callbacks can be **synchronous** (such as the function passed to `map`) or **asynchronous** (such as in `setTimeout`, event listeners).

```js
setTimeout(() => console.log("Task done"), 1000);
```

### Key Points
- Callbacks were the original way to handle async operations.
- Too many nested callbacks lead to "callback hell" (see that topic).
- Error-first convention in Node.js: `callback(err, data)`.

## Callback Hell
video: javascript callback hell promises solution
summary: Deeply nested callbacks make code hard to read; Promises and async/await flatten it.

When several async operations depend on each other and each is nested in the previous callback, the code forms a "pyramid of doom".

```js
getUser(1, (user) => {
  getOrders(user.id, (orders) => {
    getPayment(orders[0], (payment) => {
      console.log(payment); // hard to read, hard to handle errors
    });
  });
});
```

### Problems
- Poor readability and maintenance.
- Error handling must be repeated at every level.
- Hard to run steps in parallel.

### Fix it with Promises or async/await
```js
const user = await getUser(1);
const orders = await getOrders(user.id);
const payment = await getPayment(orders[0]);
```

### Key Points
- Avoid it by using Promises, `async/await`, or by splitting code into named functions.
- Interview tip: also mention "inversion of control", where you trust another function to call your callback correctly.

## Promises
video: javascript promises then catch
summary: A Promise represents a value that will be available later and has three states: pending, fulfilled, rejected.

A **Promise** is an object representing the eventual result of an asynchronous operation. It has three states:

- **pending**: initial state
- **fulfilled**: finished successfully (`resolve`)
- **rejected**: failed (`reject`)

```js
const promise = new Promise((resolve, reject) => {
  resolve("Success");
});
promise.then(console.log).catch(console.error);
```

`.then()` runs on success, `.catch()` on failure, and `.finally()` always runs. They can be chained because each returns a new promise.

### Promise combinators
```js
Promise.all([p1, p2]);        // waits for all, rejects if any rejects
Promise.allSettled([p1, p2]); // waits for all, never rejects
Promise.race([p1, p2]);       // first to settle wins
Promise.any([p1, p2]);        // first to fulfil wins
```

### Key Points
- `fetch()` returns a promise.
- Promise callbacks go into the **microtask queue**, which has higher priority than `setTimeout`.
- Interview tip: be ready to write a simple `new Promise` and explain chaining.

## Async/Await
video: javascript async await tutorial
summary: Async/await is cleaner syntax built on Promises that makes async code look synchronous.

An `async` function always returns a Promise. Inside it, `await` pauses that function until the promise settles, without blocking the rest of the program.

```js
async function getData() {
  try {
    const res = await fetch("https://api.example.com/data");
    if (!res.ok) throw new Error("Request failed");
    console.log(await res.json());
  } catch (err) {
    console.error(err);
  }
}
```

### Running in parallel
Awaiting one by one makes requests sequential. For independent calls use `Promise.all`:

```js
const [users, posts] = await Promise.all([
  fetch("/api/users").then(r => r.json()),
  fetch("/api/posts").then(r => r.json()),
]);
```

### Key Points
- Use `try/catch` for errors.
- `fetch` does not reject on HTTP errors like 404; check `res.ok`.
- Top-level `await` works in ES modules.

## Event Loop
video: javascript event loop call stack
summary: The event loop lets single-threaded JavaScript run async code by coordinating the call stack and task queues.

JavaScript has one **call stack** and runs one thing at a time. Async work (timers, network, DOM events) is handled by the browser or Node APIs; when finished, callbacks are queued and the **event loop** moves them onto the stack whenever it is empty.

### Parts
- **Call stack**: where functions execute.
- **Web APIs**: timers, fetch, DOM events.
- **Microtask queue**: promise callbacks, `queueMicrotask`. Runs first.
- **Macrotask (callback) queue**: `setTimeout`, `setInterval`, UI events.

```js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
// Output: 1 4 3 2
```

After the stack empties, all microtasks run, then one macrotask, and the cycle repeats.

### Key Points
- `setTimeout(fn, 0)` does not run immediately; it waits for the stack and microtasks.
- A long synchronous loop blocks the whole page.
- Interview tip: predict output like the example above.

## Execution Context and Scope
video: javascript execution context scope chain
summary: Every piece of running code lives in an execution context that holds variables, the scope chain and this.

When JavaScript runs code, it creates an **Execution Context**. The first is the **Global Execution Context**; each function call creates a new one and pushes it on the call stack.

Each context contains:
1. **Variable Environment**: variables and function declarations.
2. **Scope Chain**: access to variables of outer scopes (lexical environment).
3. **This Binding**: the value of `this`.

### Two phases
1. **Creation (memory) phase**: variables are set to `undefined`, functions stored (this causes hoisting).
2. **Execution phase**: code runs line by line.

```js
const g = "global";
function outer() {
  const o = "outer";
  function inner() {
    console.log(g, o); // looks up the scope chain
  }
  inner();
}
outer();
```

### Key Points
- Scope is **lexical**: decided by where code is written, not where it is called.
- Lookup goes inner to outer until the global scope; if not found, `ReferenceError`.

## Closures
video: javascript closures explained
summary: A closure is a function that remembers variables from its outer scope even after the outer function has finished.

A **closure** is created when an inner function keeps access to the variables and arguments of its outer function, even after the outer function has returned.

```js
function greeting() {
  let message = 'Hi';
  return function sayHi() {
    console.log(message);
  };
}
const hi = greeting();
hi(); // Hi
```

### Practical uses
- Data privacy (private variables)
- Function factories, currying
- Debounce/throttle, memoization
- Event handlers that remember state

```js
function counter() {
  let count = 0;
  return () => ++count;
}
const c = counter();
c(); // 1
c(); // 2
```

### Key Points
- The closure keeps the variable alive (not a copy of its value).
- Overuse can cause memory leaks if big objects stay referenced.
- Interview tip: the `var` in a loop with `setTimeout` problem is solved with `let` or a closure.

## The this Keyword
video: javascript this keyword call apply bind
summary: The value of this depends on how a function is called, and can be set with call, apply and bind.

`this` refers to the object that is "calling" the function. It is decided at call time (except in arrow functions).

| Situation | Value of `this` |
|-----------|-----------------|
| Global / plain function (non-strict) | `window` / `globalThis` |
| Plain function (strict mode) | `undefined` |
| Object method | The object |
| `new Fn()` | The newly created object |
| Arrow function | `this` of surrounding scope |
| `call` / `apply` / `bind` | The value you pass |

```js
const user = {
  name: "Asha",
  hi() { console.log(this.name); },
};
user.hi(); // Asha

const fn = user.hi;
fn();      // undefined (lost context)

fn.call({ name: "Ravi" });   // Ravi
const bound = user.hi.bind(user);
bound();   // Asha
```

### Key Points
- `call(thisArg, a, b)` and `apply(thisArg, [a, b])` invoke immediately; `bind` returns a new function.
- Arrow functions are ideal for callbacks inside methods because they keep the outer `this`.

## Prototype and Inheritance
video: javascript prototype prototypal inheritance
summary: Every object links to a prototype object, which enables inheritance and method sharing.

Every JavaScript object has a hidden property called **[[Prototype]]** (accessible via `Object.getPrototypeOf(obj)` or `__proto__`), which points to another object: its **prototype**. When you access a property, JS looks on the object first, then walks up the **prototype chain** until `null`.

```js
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function() {
  console.log(`Hi, I'm ${this.name}`);
};

const user = new Person('John');
user.sayHi(); // Hi, I'm John
```

The method `sayHi` exists once on `Person.prototype` and is shared by all instances, saving memory.

### ES6 classes
`class` is syntactic sugar over the same mechanism:

```js
class Animal {
  constructor(name) { this.name = name; }
  speak() { console.log(`${this.name} makes a sound`); }
}
class Dog extends Animal {
  speak() { console.log(`${this.name} barks`); }
}
new Dog("Tommy").speak();
```

### Key Points
- `prototype` is a property on functions; `__proto__` is the link on instances.
- `Object.create(proto)` makes an object with a chosen prototype.

## Currying
video: javascript currying function
summary: Currying turns a function of many arguments into a chain of single-argument functions.

**Currying** transforms `f(a, b, c)` into `f(a)(b)(c)`. It relies on closures: each inner function remembers the earlier arguments.

```js
function add(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

console.log(add(1)(2)(3)); // 6
```

### Arrow version
```js
const addArrow = a => b => c => a + b + c;
```

### Why use it?
- Create specialised functions from general ones (partial application).
- Reuse logic: `const add5 = add(5)`.
- Fits functional programming and function composition.

### Key Points
- Currying = one argument at a time. Partial application = fix some arguments, take the rest together.
- Interview tip: you may be asked to write a generic `curry(fn)` using `fn.length`.

## Generator Functions
video: javascript generator function yield
summary: Generators are functions that can be paused and resumed using yield.

A generator function is declared with `function*`. Calling it does not run the body; it returns an **iterator**. Each call to `next()` runs until the next `yield`, then pauses and returns `{ value, done }`.

```js
function* generator() {
  yield 1;
  yield 2;
  yield 3;
}
for (let val of generator()) console.log(val); // 1 2 3

const it = generator();
it.next(); // { value: 1, done: false }
```

### Uses
- Lazy sequences (e.g. infinite ID generators)
- Custom iterators
- Foundation of async/await (historically) and libraries like redux-saga

```js
function* ids() {
  let i = 1;
  while (true) yield i++;
}
```

### Key Points
- State is kept between calls.
- Values can also be sent into a generator via `next(value)`.

## Event Delegation
video: javascript event delegation bubbling
summary: Attach one listener to a parent and use event bubbling to handle events from many children.

When an event happens on an element, it **bubbles** up through its ancestors. Event delegation uses this: instead of adding a listener to every child, add one to the parent and check `e.target`.

```js
document.getElementById("list").addEventListener("click", (e) => {
  if (e.target.tagName === "LI") console.log("Item clicked");
});
```

### Benefits
- Fewer listeners, better memory use.
- Works for elements added dynamically later.

### Event phases
1. **Capturing** (top to bottom), 2. **Target**, 3. **Bubbling** (bottom to top; default for listeners).

### Key Points
- `e.target` is the element clicked; `e.currentTarget` is where the listener is attached.
- `e.stopPropagation()` stops bubbling; `e.preventDefault()` stops the default action (like form submit).

## Cookies, localStorage and sessionStorage
video: javascript cookies localstorage sessionstorage
summary: Three ways to store data in the browser, differing in lifetime, size and whether the server sees them.

### Cookies
Small pieces of data stored in the browser and sent to the server with every request.

```js
document.cookie = "username=John Doe; max-age=3600; path=/";
```

### Local Storage
Persistent browser storage with no expiry; it stays until cleared.

```js
localStorage.setItem("name", "John");
localStorage.getItem("name");
```

### Session Storage
Per-tab storage; cleared when that tab is closed.

```js
sessionStorage.setItem("token", "abc123");
```

| Feature | Cookie | localStorage | sessionStorage |
|---------|--------|--------------|----------------|
| Size | ~4 KB | ~5 MB | ~5 MB |
| Lifetime | Set by expiry | Permanent | Until tab closes |
| Sent to server | Yes, automatically | No | No |

### Key Points
- Values are strings only: use `JSON.stringify` / `JSON.parse` for objects.
- Do not store sensitive tokens in localStorage (XSS risk); prefer `HttpOnly` cookies.

## Strict Mode
video: javascript use strict mode
summary: Strict mode enables stricter parsing and turns silent mistakes into errors.

Adding `"use strict";` at the top of a script or function enables strict mode. ES modules and classes are strict automatically.

```js
"use strict";
x = 10; // Error: x is not defined (variable not declared)
```

### What changes
- Assigning to undeclared variables throws an error.
- Duplicate parameter names are not allowed.
- `this` in a plain function is `undefined` instead of the global object.
- Deleting non-deletable properties and assigning to read-only properties throws.

### Key Points
- Helps catch bugs early and allows better engine optimisation.
- Interview tip: mention that `this` becomes `undefined` in plain functions.

## Shallow Copy vs Deep Copy
video: javascript shallow copy deep copy structuredClone
summary: Shallow copies share nested references; deep copies create fully independent data.

- **Shallow copy**: copies only top-level values. Nested objects are still shared by reference.
- **Deep copy**: creates new copies of everything, so nested objects are fully separate.

```js
const obj = { a: 1, b: { c: 2 } };

// Shallow Copy
const shallow = { ...obj };
shallow.b.c = 100;
console.log(obj.b.c); // 100 (original changed!)

// Deep Copy
const deep = structuredClone(obj);
deep.b.c = 200;
console.log(obj.b.c); // still 100 (the deep copy did not affect the original)
```

### Ways to copy
| Method | Type |
|--------|------|
| `{ ...obj }`, `Object.assign`, `arr.slice()`, `[...arr]` | Shallow |
| `structuredClone(obj)` | Deep |
| `JSON.parse(JSON.stringify(obj))` | Deep, but loses functions, `undefined`, `Date` |

### Key Points
- `const b = a` is not a copy at all; both point to the same object.
- `structuredClone` cannot copy functions.

## ES6 Features
video: javascript es6 features
summary: Key modern syntax added in ES6: let/const, arrows, destructuring, spread, classes, modules and more.

```js
// 1. let and const        -> block scoped variables
// 2. Arrow functions
const sq = x => x * x;

// 3. Template literals
const name = "Asha";
console.log(`Hello ${name}`);

// 4. Default parameters
function hi(n = "Guest") { return n; }

// 5. Destructuring
const { a, b } = { a: 1, b: 2 };
const [first, second] = [10, 20];

// 6. Spread and Rest
const merged = [...[1, 2], ...[3, 4]];
function sum(...nums) { return nums.reduce((x, y) => x + y, 0); }

// 7. Classes
class A { constructor() { this.x = 1; } }

// 8. Promises  (see Promises topic)

// 9. Modules
// export const pi = 3.14;   import { pi } from "./math.js";

// 10. Map and Set
const m = new Map([["k", 1]]);
const s = new Set([1, 1, 2]); // {1, 2}
```

### Key Points
- Spread expands (`...arr`); rest collects (`...args`). Same syntax, different position.
- Later versions added optional chaining `a?.b`, nullish coalescing `a ?? b`, `async/await`, and `Array.at()`.

## Debouncing and Throttling
video: javascript debounce throttle
summary: Two techniques to limit how often a function runs during rapid events like typing or scrolling.

- **Debouncing**: the function runs only after a delay has passed since the *last* event. Good for search boxes and window resize end.
- **Throttling**: the function runs at most once per time interval. Good for scroll and mouse move.

```js
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
```

```js
function throttle(fn, limit) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}
```

```js
const onSearch = debounce((q) => fetchResults(q), 300);
input.addEventListener("input", e => onSearch(e.target.value));
```

### Key Points
- Both use **closures** to remember the timer or last call time.
- Interview tip: debounce = wait for pause; throttle = fixed rate.

## Higher-Order Functions
video: javascript higher order functions
summary: Functions that take other functions as arguments or return functions.

A **higher-order function (HOF)** either accepts a function as an argument, returns a function, or both. This is possible because functions are first-class values.

```js
function higherOrder(fn) {
  fn();
}

// Returns a function
function multiplier(factor) {
  return n => n * factor;
}
const triple = multiplier(3);
triple(4); // 12
```

Built-in examples: `map`, `filter`, `reduce`, `forEach`, `setTimeout`, `addEventListener`.

### Why they matter
- Reusable, declarative code.
- Basis for currying, composition, debounce, middleware.

### Key Points
- A callback is the function you pass; the HOF is the function that receives it.
- Interview tip: be able to name both kinds (takes a function, returns a function).

## Composition vs Inheritance
video: javascript composition vs inheritance
summary: Composition builds behaviour by combining small pieces; inheritance reuses behaviour by extending a parent.

- **Inheritance** ("is-a"): a child acquires properties and methods from a parent (`Dog extends Animal`). It can create deep, rigid hierarchies.
- **Composition** ("has-a" / "can-do"): build complex objects or functions by combining simple ones. More flexible and favoured in modern JS and React.

```js
// Inheritance
class Animal { eat() {} }
class Dog extends Animal { bark() {} }

// Composition with functions
const canEat  = (s) => ({ eat: () => console.log(`${s.name} eats`) });
const canBark = (s) => ({ bark: () => console.log(`${s.name} barks`) });

const createDog = (name) => {
  const state = { name };
  return { ...state, ...canEat(state), ...canBark(state) };
};
createDog("Tommy").bark();

// Function composition
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
```

### Key Points
- "Favour composition over inheritance" is a well-known design principle.
- React components are composed (children, props) rather than inherited.
