---
name: Low Level Design
icon: 🧩
category: System Design
track: system-design
level: lld
color: #8b5cf6
order: 29
description: How to structure the code inside one service - classes, principles, patterns and clean design.
---

## What is Low Level Design?
video: low level design lld introduction
summary: LLD is about the code inside one part of the system - its classes, methods and how they talk to each other.

High level design (HLD) answers "which big pieces do we need?". **Low level design (LLD)** answers "how is each piece built inside?".

```flow
title: From idea to code
Requirements | what must it do?
Find the objects | nouns become classes
Define behaviour | verbs become methods
Connect them | relationships and interfaces
Write clean code | SOLID + patterns
```

| HLD | LLD |
|-----|-----|
| Servers, databases, caches, queues | Classes, interfaces, methods |
| "What are the big pieces?" | "How is each piece built?" |
| Drawn as boxes and arrows | Drawn as class diagrams |

### Key Points
* Nouns in the requirements become classes. Verbs become methods.
* Good LLD is easy to read, easy to change and easy to test.

## OOP Basics
video: oop concepts explained
summary: Four ideas - encapsulation, abstraction, inheritance and polymorphism - are the base of every low level design.

* **Encapsulation** - keep data private and expose only safe methods. A `BankAccount` hides `balance` and offers `deposit()` and `withdraw()`.
* **Abstraction** - show what something does, hide how. You call `payment.pay()` without knowing how the card is charged.
* **Inheritance** - a child class reuses a parent class (`SavingsAccount` is a `BankAccount`).
* **Polymorphism** - the same call behaves differently for different objects (`shape.area()` for a circle or a square).

```ts
abstract class Shape {
  abstract area(): number;
}
class Circle extends Shape {
  constructor(private r: number) { super(); }
  area() { return Math.PI * this.r ** 2; }
}
class Square extends Shape {
  constructor(private s: number) { super(); }
  area() { return this.s ** 2; }
}
// Same call, different behaviour
[new Circle(2), new Square(3)].forEach((s) => console.log(s.area()));
```

### Key Points
* Prefer **composition** ("has a") over inheritance ("is a") when unsure.
* Inheritance is easy to overuse - keep hierarchies shallow.

## SOLID Principles
video: solid principles explained with examples
summary: SOLID is five rules that keep classes easy to maintain and easy to extend.

SOLID guides **low-level design**: how classes and modules are structured. Interviewers ask about it often.

| Principle | Plain meaning |
|-----------|---------------|
| **S** - Single Responsibility | One class has one reason to change |
| **O** - Open/Closed | Add new features by adding code, not by editing old code |
| **L** - Liskov Substitution | A child class can replace its parent without breaking anything |
| **I** - Interface Segregation | Many small interfaces beat one huge one |
| **D** - Dependency Inversion | Depend on interfaces, not on concrete classes |

Example of **Dependency Inversion** in TypeScript:

```ts
interface PaymentGateway {
  charge(amount: number): Promise<void>;
}

class Checkout {
  constructor(private gateway: PaymentGateway) {} // depends on the interface
  pay(amount: number) { return this.gateway.charge(amount); }
}
// Swap Stripe, Razorpay or a fake in tests without touching Checkout.
```

### Key Points
* SOLID = how to structure classes (LLD), not servers (HLD).
* Dependency Inversion makes code testable and easy to swap.

## Class Relationships
video: class diagram relationships association aggregation composition
summary: Classes connect in a few ways - association, aggregation, composition, inheritance and dependency.

| Relationship | Meaning | Example |
|--------------|---------|---------|
| **Association** | One class uses another | Teacher - Student |
| **Aggregation** | "Has a", parts can live alone | Team has Players |
| **Composition** | "Owns a", parts die with the owner | House owns Rooms |
| **Inheritance** | "Is a" | Dog is an Animal |
| **Dependency** | Uses temporarily | Report uses a Printer |

```flow
title: Example - Library system
Library | owns many books
Book | title, author, isbn
Member | borrows books
Loan | member + book + due date
```

### Key Points
* Draw only the relationships that matter to the requirements.
* If the child cannot exist without the parent, it is composition.

## Creational Patterns
video: singleton factory builder design pattern
summary: Singleton, Factory and Builder help you create objects in a clean and controlled way.

* **Singleton** - only one instance exists (e.g. a config or logger). Use sparingly; it is global state.
* **Factory** - one place decides which class to create, so callers do not use `new` everywhere.
* **Builder** - build a complex object step by step instead of a constructor with ten arguments.

```ts
interface Notifier { send(msg: string): void }
class EmailNotifier implements Notifier { send(m: string) { console.log("email", m); } }
class SmsNotifier implements Notifier { send(m: string) { console.log("sms", m); } }

// Factory
function createNotifier(type: "email" | "sms"): Notifier {
  return type === "email" ? new EmailNotifier() : new SmsNotifier();
}
createNotifier("sms").send("Your OTP is 4821");
```

### Key Points
* Factory hides which concrete class is created.
* Singleton makes testing harder - prefer passing the object in.

## Behavioural Patterns
video: strategy observer design pattern
summary: Strategy and Observer let objects change behaviour and react to events without tight coupling.

* **Strategy** - swap an algorithm at runtime (pay by card, UPI or wallet).
* **Observer** - when one object changes, all its subscribers are told (a YouTube channel and its subscribers).

```flow
title: Observer in action
Subject | Order changes status
Observer 1 | Send email || Observer 2 | Update dashboard || Observer 3 | Notify warehouse
```

```ts
interface PayStrategy { pay(amount: number): string }
class Upi implements PayStrategy { pay(a: number) { return `Paid ${a} by UPI`; } }
class Card implements PayStrategy { pay(a: number) { return `Paid ${a} by card`; } }

class Cart {
  constructor(private strategy: PayStrategy) {}
  checkout(total: number) { return this.strategy.pay(total); }
}
new Cart(new Upi()).checkout(499);
```

### Key Points
* Strategy replaces long `if / else` chains.
* Observer is the base idea behind events and pub/sub.

## Structural Patterns
video: adapter decorator facade design pattern
summary: Adapter, Decorator and Facade help you combine and wrap classes without changing them.

* **Adapter** - makes an old or third-party class fit the interface you need (like a plug adapter).
* **Decorator** - adds extra behaviour by wrapping (coffee + milk + sugar).
* **Facade** - one simple class in front of a complex group of classes.

```flow
title: Facade
Client | calls one method
Facade | OrderService.placeOrder()
Inventory || Payment || Shipping
```

### Key Points
* Wrap, do not rewrite. These patterns keep old code untouched.
* Facade is what most "service" classes really are.

## Designing a Database Schema
video: database schema design tables relationships
summary: Turn the objects into tables with primary keys, foreign keys and the right relationships.

Each class usually becomes a table, and each relationship becomes a key.

```flow
title: One-to-many example
users | id, name, email
orders | id, user_id, total
order_items | id, order_id, product_id, qty
```

* **One-to-many** - `orders.user_id` points to `users.id`.
* **Many-to-many** - needs a middle table (`student_courses`).
* Add an **index** on columns you search or join on.

### Key Points
* Primary key = unique id. Foreign key = link to another table.
* Normalise first; denormalise only when reads are slow.

## Designing APIs
video: rest api design best practices
summary: Good APIs use clear nouns, the right HTTP verbs, sensible status codes and versioning.

| Action | Verb and URL | Success code |
|--------|--------------|--------------|
| List orders | `GET /orders` | 200 |
| Get one | `GET /orders/42` | 200 |
| Create | `POST /orders` | 201 |
| Update | `PUT /orders/42` | 200 |
| Delete | `DELETE /orders/42` | 204 |

* Use nouns in URLs, not verbs (`/orders`, not `/getOrders`).
* Return clear errors: `400` bad input, `401` not logged in, `404` not found.
* Add pagination (`?page=2&limit=20`) to list endpoints and version the API (`/v1/orders`).

### Key Points
* Be consistent - same naming and error shape everywhere.
* Never break an existing version; add `/v2` instead.

## Worked Example - Parking Lot
video: parking lot low level design
summary: A classic LLD question - find the objects, give each one a job, then wire them together.

**Requirements:** many floors, different spot sizes, issue a ticket on entry, charge on exit.

```flow
title: Parking lot objects
ParkingLot | has many floors
Floor | has many spots
Spot | size + free / taken
Ticket | vehicle + spot + entry time
Payment | amount from time parked
```

```ts
type Size = "bike" | "car" | "truck";

class Spot {
  taken = false;
  constructor(public id: string, public size: Size) {}
}

class Ticket {
  constructor(public spot: Spot, public vehicle: string, public entry = new Date()) {}
}

class ParkingLot {
  constructor(private spots: Spot[]) {}
  park(vehicle: string, size: Size): Ticket {
    const spot = this.spots.find((s) => !s.taken && s.size === size);
    if (!spot) throw new Error("Lot full");
    spot.taken = true;
    return new Ticket(spot, vehicle);
  }
}
```

### Key Points
* Start from the nouns, then add behaviour.
* Use a Strategy for pricing so rates can change without editing `ParkingLot`.

## How to Answer an LLD Interview
video: how to approach low level design interview
summary: Clarify, list the objects, draw the relationships, write the core code, then discuss how it can grow.

```flow
title: Your 5 steps
Clarify requirements | ask questions first
List objects | classes and their jobs
Draw relationships | class diagram
Write core code | the main method well
Explain extensions | patterns and trade-offs
```

### Key Points
* Do not jump to code - clarify first.
* Say which principle or pattern you used and why.
