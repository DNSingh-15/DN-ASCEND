---
name: TypeScript
icon: 🔷
category: Frontend
track: fullstack
color: #3b82f6
order: 2
description: TypeScript adds static types to JavaScript so many bugs are caught while coding instead of at runtime.
---

## Introduction to TypeScript
video: typescript tutorial for beginners
summary: TypeScript is JavaScript with static types, compiled down to plain JavaScript.

TypeScript (TS) is a superset of JavaScript developed by Microsoft. Every valid JS file is valid TS, and you add type annotations on top. The TypeScript compiler (`tsc`) checks the types and then removes them, producing ordinary JavaScript that runs in any browser or Node.js.

```ts
let name: string = "John";
name = 42; // Error at compile time: Type 'number' is not assignable to type 'string'
```

### Why TypeScript?
- Detects errors before runtime.
- Provides IntelliSense and autocompletion in editors.
- Supports modern ES features and compiles them for older browsers.
- Improves scalability, safe refactoring and documentation of code.

### Key Points
- TypeScript = JavaScript + static typing + better tooling.
- Types exist only at compile time; they do not exist in the output JavaScript.
- Interview tip: be ready to explain the difference between TypeScript and JavaScript (see below).

## Basic Types
video: typescript basic types string number boolean array
summary: The core built-in types: string, number, boolean, arrays, tuples, enums, any and void.

| Type | Example |
|------|---------|
| `string` | `let name: string = "John";` |
| `number` | `let age: number = 25;` |
| `boolean` | `let isActive: boolean = true;` |
| `array` | `let nums: number[] = [1, 2, 3];` |
| `tuple` | `let user: [string, number] = ["John", 25];` |
| `enum` | `enum Direction { Up, Down }` |
| `any` | `let data: any = "anything";` |
| `void` | Used for functions returning nothing |

TypeScript usually infers types from the assigned value, so `let age = 25` is already a `number`. Annotate when the type is not obvious or for function parameters.

```ts
enum Status { Active = "ACTIVE", Inactive = "INACTIVE" }
```

### Key Points
- Avoid `any`: it turns off type checking for that value.
- A tuple is a fixed-length array where each position has its own type.
- Use `unknown` instead of `any` when the type is truly not known yet, because it forces you to check before use.

## Functions with Types
video: typescript functions parameters return type
summary: Annotate parameters and return values, and use optional and default parameters.

```ts
function add(a: number, b: number): number {
  return a + b;
}

const greet = (name: string = "Guest"): void => {
  console.log(`Hello, ${name}`);
};

function log(msg: string, level?: "info" | "error") {
  console.log(level ?? "info", msg);
}
```

- Parameters are typed; the return type is optional but recommended.
- `?` marks a parameter as optional. It must come after required parameters.
- A default value makes the parameter optional and gives it a type automatically.

### Key Points
- A function with no `return` has the return type `void`.
- Calling a function with wrong argument types is a compile-time error.

## Interfaces
video: typescript interface tutorial
summary: Interfaces describe the shape of an object and can be extended and merged.

An **interface** describes the structure an object must have. It is mainly used for object shapes and as a contract for classes.

```ts
interface User {
  id: number;
  name: string;
  email?: string;   // optional
  readonly createdAt: Date; // cannot be changed after creation
}

const u: User = { id: 1, name: "Asha", createdAt: new Date() };
```

### Extending interfaces
```ts
interface Admin extends User {
  role: "admin";
}
```

### Key Points
- Extra properties not in the interface cause an error when using an object literal.
- Interfaces can be merged: two declarations with the same name combine into one.

## Type Alias
video: typescript type alias union type
summary: A type alias gives a name to any type, including unions and intersections.

A **type alias** gives a name to any type: primitives, unions, tuples, functions or objects.

```ts
type ID = string | number;
type Status = "active" | "inactive";
type Point = { x: number; y: number };
type Handler = (event: string) => void;
```

### Interface vs Type Alias

| Feature | Interface | Type Alias |
|---------|-----------|------------|
| Extension | `extends` other interfaces | Combine with `&` |
| Declaration merging | Yes | No |
| Can name unions/primitives | No | Yes |
| Usage | Mostly objects and classes | Any data type |

### Key Points
- Both are often interchangeable for plain object shapes; pick one style and be consistent.
- Interview tip: the common answer is "use interface for object shapes that may be extended, type for unions, tuples and complex types".

## Union and Intersection Types
video: typescript union intersection types
summary: A union means "one of these types"; an intersection means "all of these types combined".

```ts
// Union (A or B)
let value: string | number;
value = "hello";
value = 10;

// Intersection (A and B)
interface A { a: number }
interface B { b: number }
type AB = A & B;

const x: AB = { a: 1, b: 2 }; // must have both
```

- A union value can only use members that exist in every possible type until you narrow it.
- An intersection combines the properties of all types.

### Key Points
- Union = flexible input; intersection = combined object.
- Combine unions with literal types for safe string options: `"small" | "medium" | "large"`.

## Type Narrowing
video: typescript type narrowing typeof
summary: Checks like typeof and in let TypeScript know the exact type inside a branch.

**Narrowing** means reducing a broad type (like a union) to a specific type inside an `if` block. TypeScript tracks these checks automatically.

```ts
function printId(id: string | number) {
  if (typeof id === "string") console.log(id.toUpperCase());
  else console.log(id.toFixed(2));
}
```

Other narrowing tools:
- `typeof` for primitives
- `instanceof` for classes
- `in` for properties (`"email" in user`)
- Equality checks (`===`) and truthiness
- Discriminated unions with a shared literal field such as `kind`

```ts
type Shape = { kind: "circle"; r: number } | { kind: "square"; s: number };
function area(sh: Shape) {
  switch (sh.kind) {
    case "circle": return Math.PI * sh.r ** 2;
    case "square": return sh.s * sh.s;
  }
}
```

### Key Points
- Narrowing is what makes unions useful.
- Interview tip: explain discriminated unions, they are a common follow-up.

## Type Assertion
video: typescript type assertion as keyword
summary: A type assertion tells the compiler to treat a value as a specific type, without any runtime check.

A **type assertion** overrides the inferred type using `as` (or the angle-bracket syntax, not allowed in `.tsx` files). It does not convert or check the value at runtime.

```ts
let val: any = "Hello";
let len = (val as string).length;
```

### Key Points
- Use assertions only when you know more than the compiler.
- A wrong assertion compiles but can fail at runtime, so prefer narrowing when possible.
- `as const` makes a value deeply readonly with literal types.

## Generics
video: typescript generics tutorial
summary: Generics let you write reusable, type-safe functions and types that work with any type.

**Generics** are placeholders for types. They let one function or type work with many types while keeping type safety, instead of using `any`.

```ts
function identity<T>(value: T): T {
  return value;
}

let num = identity(10);     // T is number
let str = identity("TS");   // T is string
```

### Generic constraints
```ts
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}
getLength("hello"); // 5
getLength([1, 2]);  // 2
```

### Generics with interfaces
```ts
interface Box<T> {
  content: T;
}
const box: Box<string> = { content: "Books" };
```

### Key Points
- The `T` is inferred from the argument in most cases.
- Interview tip: explain "why generics": reuse plus type safety, instead of `any`.
- Common built-ins: `Array<T>`, `Promise<T>`, `Map<K, V>`.

## Utility Types
video: typescript utility types partial pick omit
summary: Built-in helper types such as Partial, Pick, Omit and Readonly that transform existing types.

Utility types create new types from existing ones.

| Utility | Description |
|---------|-------------|
| `Partial<T>` | Makes all properties optional |
| `Required<T>` | Makes all properties required |
| `Pick<T, K>` | Keeps only the listed properties |
| `Omit<T, K>` | Removes the listed properties |
| `Readonly<T>` | Makes all properties read-only |
| `Record<K, V>` | Object type with keys K and values V |

```ts
interface User { id: number; name: string; email: string; }

type PartialUser = Partial<User>;             // all fields optional
type NoEmail = Omit<User, "email">;           // without email
type IdName = Pick<User, "id" | "name">;      // only id and name
type Roles = Record<string, boolean>;
```

### Key Points
- `Partial` is common for update (PATCH) payloads.
- Utility types keep one source of truth: change `User` and the derived types update automatically.

## Classes and Access Modifiers
video: typescript class access modifiers public private protected
summary: TypeScript classes support public, private and protected members plus constructor shorthand.

```ts
class Person {
  constructor(public name: string, private age: number) {}

  greet() {
    console.log(`Hi, I'm ${this.name}`);
  }
}
```

The `public name` in the constructor is a shorthand that declares and assigns the property.

| Modifier | Meaning |
|----------|---------|
| `public` | Accessible anywhere (default) |
| `private` | Accessible only within the class |
| `protected` | Accessible in the class and its subclasses |
| `readonly` | Can be set only in the constructor |

### Key Points
- Access modifiers are checked at compile time only. Use the `#name` syntax for true runtime privacy.
- Interview tip: list the three modifiers and what each allows.

## Abstract Classes and Inheritance
video: typescript abstract class inheritance
summary: Abstract classes are base classes that cannot be instantiated and force subclasses to implement certain methods.

An **abstract class** is a base class you cannot create objects from directly. It can declare **abstract methods** that subclasses must implement.

```ts
abstract class Animal {
  abstract sound(): void;

  move() {
    console.log("Moving...");
  }
}

class Dog extends Animal {
  sound() {
    console.log("Woof!");
  }
}

const d = new Dog();
d.sound();
// new Animal(); // Error: cannot create an instance of an abstract class
```

### Key Points
- Use abstract classes for shared logic plus required methods.
- Interfaces describe shapes; abstract classes can also contain implementation.
- A class can implement many interfaces but extend only one class.

## Generics with Interfaces and Classes
video: typescript generic interface class
summary: Generic interfaces and classes let you describe data containers that work with any type.

Generics are not only for functions. You can build reusable containers.

```ts
interface Repository<T> {
  getAll(): T[];
  add(item: T): void;
}

class UserRepo implements Repository<{ id: number; name: string }> {
  private items: { id: number; name: string }[] = [];
  getAll() { return this.items; }
  add(item: { id: number; name: string }) { this.items.push(item); }
}
```

### Key Points
- `implements` checks that a class follows an interface.
- Generic defaults are possible: `interface Box<T = string>`.

## TypeScript with React Props
video: typescript react props interface tsx
summary: Describe React component props with an interface or type alias for safe, self-documenting components.

In React with TypeScript, props are typed so that the editor and compiler check how components are used.

```tsx
interface GreetingProps {
  name: string;
  age?: number;
}

function Greeting({ name, age }: GreetingProps) {
  return <h1>Hello {name} {age}</h1>;
}

<Greeting name="Asha" />;     // ok
// <Greeting />;              // Error: name is required
```

### Key Points
- Optional props use `?`.
- Use `React.ReactNode` for `children`.

## Compiling and tsconfig
video: typescript tsconfig tsc compile
summary: The tsc compiler turns TypeScript into JavaScript, configured by tsconfig.json.

- `tsc` is the TypeScript compiler. `tsc --init` creates a `tsconfig.json`.
- `tsconfig.json` controls options such as `target` (output JS version), `strict` (strict type checks) and `outDir`.
- `strict: true` is strongly recommended. It enables `noImplicitAny`, `strictNullChecks` and more.

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "outDir": "dist"
  }
}
```

### Key Points
- Types are erased at compile time, so runtime checks (like `zod`) are needed for external data such as API responses.

## Common Interview Topics
video: typescript interview questions
summary: A quick review checklist of the TypeScript questions asked most often in interviews.

- Difference between **TypeScript and JavaScript**: TS adds static types and compiles to JS; types disappear at runtime.
- **Interface vs Type Alias**: see the comparison above.
- **Generics** and why they are used: reusable, type-safe code.
- **Access modifiers** (`public`, `private`, `protected`).
- **Union and intersection** types.
- **Utility types** such as `Partial`, `Pick`, `Omit`.
- **Type narrowing** and **type assertion**.
- **Abstract classes** and inheritance.
- **Advantages of TypeScript**: early error detection, better tooling, easier refactoring, safer large codebases.

### Key Points
- Practise writing a small generic function and a discriminated union from memory.
