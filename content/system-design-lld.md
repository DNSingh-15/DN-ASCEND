---
name: Low Level Design
icon: 🧩
category: System Design
track: system-design
level: lld
color: #0d9488
order: 29
description: How to structure the code inside one service - classes, principles, patterns and clean design.
---

# Step 1: Object Oriented Programming

## Encapsulation
video: encapsulation in oop
summary: Encapsulation means keeping data private inside a class and letting others use it only through safe methods.

**Real-life example:** An ATM. You cannot reach into the cash box, you can only press buttons like "withdraw".

```ts
class BankAccount {
  private balance = 0;                       // hidden
  deposit(amount: number) {
    if (amount <= 0) throw new Error("Invalid amount");
    this.balance += amount;
  }
  getBalance() { return this.balance; }      // read-only access
}
```

### Key Points
* Make fields **private**, expose small public methods.
* The class protects its own rules (no negative deposits).
* You can change the inside later without breaking the users of the class.

## Abstraction
video: abstraction in oop
summary: Abstraction means showing only what an object does and hiding how it does it.

**Real-life example:** A car pedal. You press it to go faster and never think about the engine.

```ts
interface PaymentMethod { pay(amount: number): void; }   // what

class UpiPayment implements PaymentMethod {              // how
  pay(amount: number) { /* talk to UPI */ }
}
class CardPayment implements PaymentMethod {
  pay(amount: number) { /* talk to the bank */ }
}
```

### Key Points
* Use **interfaces** or **abstract classes** to define the "what".
* Callers depend on the interface, so you can swap the "how" any time.
* Encapsulation hides **data**; abstraction hides **complexity**.

## Inheritance
video: inheritance in oop
summary: Inheritance lets a child class reuse and extend the code of a parent class.

**Real-life example:** A child gets traits from their parent but can also learn new skills.

```uml
title: Inheritance
Account <<abstract>> | - balance: number | + deposit(amount): void
---
Savings | + addInterest(): void
Current | + overdraft(): void
Savings --|> Account : is a
Current --|> Account : is a
```

### Key Points
* Use it for a true **"is a"** relationship (Savings **is an** Account).
* Keep hierarchies shallow, deep ones become hard to change.
* If unsure, prefer **composition** ("has a") over inheritance.

## Polymorphism
video: polymorphism in oop
summary: Polymorphism means the same method call behaves differently depending on the object that receives it.

**Real-life example:** Pressing "play" works on a TV, a phone and a speaker, each in its own way.

```ts
abstract class Shape { abstract area(): number; }
class Circle extends Shape {
  constructor(private r: number) { super(); }
  area() { return Math.PI * this.r ** 2; }
}
class Square extends Shape {
  constructor(private s: number) { super(); }
  area() { return this.s ** 2; }
}
[new Circle(2), new Square(3)].forEach((s) => console.log(s.area())); // same call, different result
```

### Key Points
* **Overriding** (runtime): a child replaces a parent's method.
* **Overloading** (compile time): same name, different parameters.
* It removes long `if / else` chains on type.

## SOLID Principles
video: solid principles explained
summary: SOLID is a set of five rules that keep object-oriented code easy to change and hard to break.

| Letter | Principle | One-line meaning |
|---|---|---|
| **S** | Single Responsibility | A class should have only one reason to change |
| **O** | Open / Closed | Add new behaviour by adding code, not editing old code |
| **L** | Liskov Substitution | A child must work anywhere its parent works |
| **I** | Interface Segregation | Many small interfaces beat one big one |
| **D** | Dependency Inversion | Depend on interfaces, not concrete classes |

**Real-life example (D):** A lamp plugs into a socket, not directly into the power station wires.

```ts
// Dependency Inversion: OrderService depends on an interface, not on Stripe
class OrderService {
  constructor(private payment: PaymentMethod) {}
  checkout(total: number) { this.payment.pay(total); }
}
```

### Key Points
* **S**: a `User` class should not also send emails and save to the database.
* **O**: a new payment type is a new class, not another `if` in old code.
* **L**: if `Penguin extends Bird` breaks `fly()`, the hierarchy is wrong.

# Step 2: Design Patterns

## Creational Patterns (Singleton, Factory etc.)
video: creational design patterns singleton factory builder
summary: Creational patterns decide how objects are created, so the rest of the code does not depend on how.

| Pattern | One-line meaning | Example |
|---|---|---|
| **Singleton** | Only one instance exists | Config, logger |
| **Factory** | One method decides which class to create | `createPayment("upi")` |
| **Builder** | Build a complex object step by step | Building an HTTP request |
| **Prototype** | Create a new object by copying an existing one | Cloning a document template |

```ts
// Factory
function createPayment(type: "upi" | "card"): PaymentMethod {
  return type === "upi" ? new UpiPayment() : new CardPayment();
}

// Singleton
class Config {
  private static instance: Config;
  private constructor() {}
  static get() { return (Config.instance ??= new Config()); }
}
```

### Key Points
* Use **Factory** when the exact class depends on input.
* Use **Builder** when a constructor would have many optional parameters.
* Singleton is easy to overuse, it is hidden global state and hard to test.

## Structural Patterns (Proxy, Bridge etc.)
video: structural design patterns proxy adapter decorator facade
summary: Structural patterns show how to connect classes and objects into bigger structures without making them tightly tied.

| Pattern | One-line meaning | Example |
|---|---|---|
| **Proxy** | A stand-in that controls access to the real object | Cache or access check in front of a service |
| **Bridge** | Split "what" from "how" so both can change separately | Shape (what) + Color (how) |
| **Adapter** | Make an incompatible class fit an expected interface | Old payment API behind a new interface |
| **Decorator** | Add behaviour to an object without changing its class | Coffee + milk + sugar |
| **Facade** | One simple door to a complex system | `VideoConverter.convert(file)` |

```uml
title: Proxy
Image <<interface>> | + display(): void
---
RealImage | + display(): void
ImageProxy | - real: RealImage | + display(): void
RealImage ..|> Image
ImageProxy ..|> Image
ImageProxy --> RealImage : loads lazily
```

### Key Points
* **Proxy** and **Decorator** look alike: proxy controls access, decorator adds features.
* **Adapter** fixes a mismatch after the fact; **Bridge** avoids it by design.

## Behavioral Patterns (Strategy, Command, Observer etc.)
video: behavioral design patterns strategy observer command
summary: Behavioral patterns describe how objects talk to each other and share responsibility.

| Pattern | One-line meaning | Example |
|---|---|---|
| **Strategy** | Swap the algorithm at runtime | Sort by price or by rating |
| **Command** | Turn a request into an object | Undo / redo, task queue |
| **Observer** | When one object changes, others are told | Notifications, event listeners |
| **State** | Behaviour changes with the object's state | Order: placed, shipped, delivered |
| **Template Method** | Fixed steps in a parent, details in children | Data import: read, parse, save |

```uml
title: Strategy
Cart | - strategy: PricingStrategy | + total(): number
---
PricingStrategy <<interface>> | + price(amount): number
---
Regular | + price(amount): number
Festival | + price(amount): number
Cart o-- PricingStrategy : uses
Regular ..|> PricingStrategy
Festival ..|> PricingStrategy
```

### Key Points
* **Strategy** replaces long `if / else` chains with swappable classes.
* **Observer** is the base of pub/sub and UI events.
* **Command** makes undo possible, because each action is an object you can reverse.

# Step 3: Concurrency & Thread Safety

## Thread-Safe Injection
video: thread safe singleton dependency injection
summary: Thread-safe injection means creating and sharing objects so that many threads can use them at once without breaking anything.

**Real-life example:** One shared printer for the office. Everyone can send jobs, but the printer must not mix two jobs into one page.

```ts
// Thread-safe lazy singleton in Java style (double-checked locking)
class Service {
  private static volatile Service instance;
  static Service get() {
    if (instance == null) {
      synchronized (Service.class) {
        if (instance == null) instance = new Service();
      }
    }
    return instance;
  }
}
```

### Key Points
* Inject **stateless** or **immutable** objects, they are safe to share by default.
* Create shared objects once at startup (a DI container does this), not lazily on many threads.
* If an object holds changing state, give each thread its own copy or protect it with a lock.

## Locking Mechanisms
video: locks mutex semaphore explained
summary: A lock lets only one thread (or a limited number) enter a critical section at a time.

**Real-life example:** A single-person toilet with a key. Only the person with the key can enter, everyone else waits.

| Mechanism | One-line meaning |
|---|---|
| **Mutex / synchronized** | Only one thread inside at a time |
| **Semaphore** | Up to N threads inside at a time |
| **Read-write lock** | Many readers together, but a writer needs to be alone |
| **Atomic variable** | Lock-free counter or flag using a CPU instruction |
| **Optimistic lock** | Do the work, check the version before saving, retry on conflict |

### Key Points
* Keep the locked part **as small as possible**.
* **Deadlock**: two threads each wait for the other's lock forever. Fix by always taking locks in the same order.
* Prefer atomics or immutable data when you can, they avoid locks.

## Producer-Consumer
video: producer consumer problem
summary: Producers add work to a shared queue and consumers take work out of it, so both sides can run at their own speed.

**Real-life example:** A restaurant. Waiters put orders on the counter (producers), cooks pick them up (consumers).

```flow
title: Producer-consumer
Producers | create tasks
> put
Bounded queue | holds waiting tasks
> take
Consumers | process tasks
```

### Key Points
* Use a **bounded blocking queue**: producers wait when it is full, consumers wait when it is empty.
* It smooths out traffic spikes and keeps the two sides independent.
* This is the same idea as message queues (Kafka, RabbitMQ) in system design.

## Race Conditions & Synchronization
video: race condition and synchronization
summary: A race condition happens when the result depends on which thread runs first, and synchronization makes threads take turns.

**Real-life example:** Two people withdraw the last 100 from the same account at the same moment, and both succeed.

```flow
title: Race condition on a counter
Thread A reads | count = 5
Thread B reads | count = 5
> both add 1
Both write | count = 6, but it should be 7
```

### Key Points
* The bug is in **read, change, write** done as separate steps.
* Fix by making that block **atomic**: use a lock, an atomic variable, or a database transaction.
* Race bugs are random and hard to reproduce, so design them out early.

# Step 4: UML Diagrams

## UML Class Diagram
video: uml class diagram tutorial
summary: A class diagram is a picture of your classes, what each one holds and does, and how they connect.

Each class is a box with three parts: **name**, **attributes** (data) and **methods** (actions).

| Symbol | Meaning |
|---|---|
| `+` | public |
| `-` | private |
| `#` | protected |
| *italic name* | abstract class |
| `«interface»` | interface |

```uml
title: A small online shop
Customer | - name: string | - email: string | + placeOrder(): Order
Order | - id: number | - total: number | + addItem(item): void | + pay(method): void
---
Product | - name: string | - price: number
PaymentMethod <<interface>> | + pay(amount): void
Customer --> Order : places
Order o-- Product : contains
Order ..> PaymentMethod : uses
```

### Key Points
* Show only the **important** members, not every getter.
* Read it as sentences: "Customer **places** Order", "Order **contains** Products".
* Draw it before you code, it is the quickest way to spot a bad design.

## UML Relationships
video: uml relationships association aggregation composition
summary: The arrow between two classes tells how they are related, from loosely connected to completely owned.

| Arrow | Name | One-line meaning | Example |
|---|---|---|---|
| `--\|>` solid, hollow triangle | Inheritance | "is a" | Savings is an Account |
| `..\|>` dashed, hollow triangle | Implementation | Class follows an interface | UpiPayment implements PaymentMethod |
| `-->` solid arrow | Association | "knows / uses" for a long time | Customer has Orders |
| `o--` hollow diamond | Aggregation | "has a", parts can live alone | Team has Players |
| `*--` filled diamond | Composition | "owns", parts die with the owner | House owns Rooms |
| `..>` dashed arrow | Dependency | uses it briefly | Order uses a Logger |

```uml
title: All the arrows
Vehicle <<abstract>> | + move(): void
Car | + move(): void
Engine | - power: number
---
Team | - name: string
Player | - name: string
Garage | + park(car): void
Car --|> Vehicle : inheritance
Car *-- Engine : composition
Team o-- Player : aggregation
Garage ..> Car : dependency
```

### Key Points
* **Aggregation vs composition**: if deleting the whole also deletes the parts, it is composition.
* When unsure between the arrows, use a plain association.

## Sequence Diagram
video: uml sequence diagram tutorial
summary: A sequence diagram shows the order of messages between objects for one scenario, from top to bottom.

**Real-life example:** The steps of ordering at a restaurant: customer calls waiter, waiter tells kitchen, kitchen sends food back.

```flow
title: Checkout sequence
Customer | clicks "Pay"
> pay(order)
OrderService | validates the order
> charge(amount)
PaymentService | talks to the bank
> success
OrderService | marks order as paid
> confirmation
Customer | sees "Order placed"
```

### Key Points
* Use a **class diagram** for structure and a **sequence diagram** for behaviour over time.
* Each arrow is a method call, each box is an object.
* Draw one for the main flow and one for the main failure case.

# Step 5: APIs

## API Design
video: rest api design best practices
summary: Good API design means clear names, predictable behaviour and simple rules that another developer can guess without reading the docs.

**Real-life example:** A restaurant menu. Clear item names and prices, so you order without asking the waiter.

| Do | Example |
|---|---|
| Use **nouns** for resources | `/users/42/orders` |
| Use the right **method** | GET read, POST create, PUT/PATCH update, DELETE remove |
| Return proper **status codes** | 200 OK, 201 Created, 400 Bad Request, 404 Not Found |
| Support **pagination** | `?page=2&limit=20` |
| Be **idempotent** where possible | Repeating a PUT gives the same result |

### Key Points
* Be consistent: same naming, same error format everywhere.
* Never expose internal database structure directly.
* Always validate input and return clear error messages.

## Request / Response Object Modeling
video: dto data transfer object request response model
summary: Use separate request and response objects (DTOs) so your API shape stays independent from your database and domain classes.

**Real-life example:** A bank form. You fill in only the fields the bank asks for, and the receipt shows only what you need to see.

```ts
// What the client sends
type CreateUserRequest = { name: string; email: string; password: string };

// What the client gets back (no password!)
type UserResponse = { id: number; name: string; email: string };

// The internal model can be different again
class User { id!: number; name!: string; email!: string; passwordHash!: string; }
```

### Key Points
* Never return the database entity directly, you may leak private fields.
* Keep a separate type for create, update and read if they differ.
* Wrap lists in an object (`{ items, total }`) so you can add fields later.

## Versioning & Extensibility
video: api versioning strategies
summary: Versioning lets you change an API without breaking existing users, and extensibility means designing it so new features fit in easily.

**Real-life example:** A phone charger port. New phones can add features, but old chargers must keep working for a while.

| Way | Example |
|---|---|
| **URL** | `/v1/users`, `/v2/users` |
| **Header** | `Accept: application/vnd.app.v2+json` |
| **Query** | `/users?version=2` |

### Key Points
* **Adding** a field is safe; **removing or renaming** one is a breaking change.
* Ignore unknown fields so old clients keep working.
* Announce a deprecation date and keep the old version alive until then.
* Prefer extension points (new subclasses, new strategies) over editing old code, this is the Open / Closed principle.

## Clean Code Principles: DRY, SRP etc.
video: clean code principles dry kiss yagni
summary: Clean code principles are simple habits that make code easy to read, change and trust.

| Principle | One-line meaning |
|---|---|
| **DRY** | Don't Repeat Yourself, write each piece of logic once |
| **SRP** | A class or function does one thing |
| **KISS** | Keep it simple, the simplest solution that works |
| **YAGNI** | Don't build it until you actually need it |
| **Meaningful names** | `getActiveUsers()` beats `getData()` |

### Key Points
* Small functions with clear names need fewer comments.
* Don't over-apply DRY: two things that only look alike today may change differently tomorrow.
* Write code for the next person who has to read it.

## Avoiding God Classes
video: god class anti pattern
summary: A god class is one huge class that knows and does too much, which makes it hard to read, test and change.

**Real-life example:** One employee who handles sales, accounts, cleaning and IT. When they are away, everything stops.

```uml
title: Split a god class
OrderManager <<god class>> | + createOrder(): void | + chargeCard(): void | + sendEmail(): void | + updateStock(): void
---
OrderService | + create(): Order
---
PaymentService | + charge(): void
EmailService | + send(): void
InventoryService | + reduce(): void
OrderManager ..> OrderService : split into
OrderService --> PaymentService : uses
OrderService --> EmailService : uses
OrderService --> InventoryService : uses
```

### Key Points
* Warning signs: very long file, many unrelated methods, and a name like `Manager`, `Helper` or `Utils`.
* Fix by applying **SRP**: split by responsibility, then connect the parts.
* Each small class is easier to test on its own.

# Step 6: Practice, Practice, Practice

## Design Tic-Tac-Toe / Chess
video: design tic tac toe low level design
summary: A two-player board game where the design must separate the board, the players, the pieces and the rules.

```uml
title: Tic-Tac-Toe
Game | - board: Board | - players: Player[] | + play(row, col): void | + isWinner(): boolean
---
Board | - cells: Symbol[][] | + place(row, col, s): boolean | + isFull(): boolean
Player | - name: string | - symbol: Symbol
Game *-- Board
Game o-- Player
```

### Key Points
* **Tic-tac-toe**: `Game`, `Board`, `Player`. Check win after every move.
* **Chess**: make `Piece` abstract, and each piece (King, Queen, Pawn) overrides `canMove()`. This is polymorphism.
* Use the **Strategy** pattern for rules and **Command** for undo.

## Design Splitwise
video: design splitwise low level design
summary: An expense-sharing app that records who paid, splits the cost and tells everyone who owes whom.

```uml
title: Splitwise
User | - id: string | - name: string
Group | - members: User[] | + addExpense(e): void
Expense | - paidBy: User | - amount: number | + split(): Split[]
---
SplitStrategy <<interface>> | + split(amount, users): Split[]
---
EqualSplit | + split(amount, users): Split[]
PercentSplit | + split(amount, users): Split[]
Group o-- User
Group *-- Expense
Expense --> SplitStrategy : uses
EqualSplit ..|> SplitStrategy
PercentSplit ..|> SplitStrategy
```

### Key Points
* **Strategy** pattern for split types: equal, exact amount, percentage.
* Keep a balance sheet of who owes whom, then **simplify debts** to fewer payments.
* Use a decimal or integer paise type for money, never floating point.

## Design a Parking Lot
video: design parking lot low level design
summary: A parking system that finds a free spot for each vehicle, issues a ticket and charges on exit.

```uml
title: Parking lot
ParkingLot | - floors: Floor[] | + park(v): Ticket | + exit(t): number
Floor | - spots: Spot[] | + findSpot(type): Spot
Spot | - type: SpotType | - free: boolean
---
Ticket | - entryTime: Date | - spot: Spot
Vehicle <<abstract>> | - plate: string
---
Car | + size(): string
Bike | + size(): string
ParkingLot *-- Floor
Floor *-- Spot
ParkingLot ..> Ticket : issues
Car --|> Vehicle
Bike --|> Vehicle
```

### Key Points
* Vehicle types are children of an abstract `Vehicle`; spots match by size.
* Use **Strategy** for pricing (hourly, daily) and for spot choice (nearest, cheapest).
* The `ParkingLot` can be a **Singleton**.
* Handle concurrency: two cars must never get the same spot.

## Design a Notification System
video: design notification system low level design
summary: A service that sends messages to users through email, SMS or push, without the caller caring which one.

```uml
title: Notification system
NotificationService | - channels: Channel[] | + send(user, msg): void
---
Channel <<interface>> | + send(user, msg): void
---
EmailChannel | + send(user, msg): void
SmsChannel | + send(user, msg): void
PushChannel | + send(user, msg): void
NotificationService o-- Channel
EmailChannel ..|> Channel
SmsChannel ..|> Channel
PushChannel ..|> Channel
```

### Key Points
* **Strategy / Factory** for channels, adding WhatsApp is just a new class.
* **Observer**: events like "order shipped" trigger notifications.
* Put sending on a **queue** with retries, so a slow email provider doesn't block the app.
* Respect user preferences (mute, only email).

## Design a Food Delivery App
video: design food delivery app low level design
summary: An app where customers order from restaurants and a delivery partner brings the food, with the order moving through clear states.

```uml
title: Food delivery
Customer | - name: string | + placeOrder(cart): Order
Restaurant | - menu: MenuItem[] | + accept(order): void
DeliveryPartner | - location: Point | + pickUp(order): void
---
Order | - status: OrderStatus | - items: MenuItem[] | + next(): void
MenuItem | - name: string | - price: number
Customer --> Order : places
Restaurant --> Order : prepares
DeliveryPartner --> Order : delivers
Order o-- MenuItem
```

### Key Points
* **State** pattern for the order: placed, accepted, preparing, picked up, delivered.
* **Strategy** for choosing the delivery partner (nearest, least busy).
* **Observer** to update the customer at each state change.

## Design a URL Shortener
video: design url shortener low level design
summary: A service that turns a long link into a short code and redirects the short code back to the long link.

```uml
title: URL shortener
UrlService | + shorten(longUrl): string | + resolve(code): string
---
CodeGenerator <<interface>> | + next(): string
UrlRepository | + save(code, url): void | + find(code): string
---
Base62Generator | + next(): string
UrlService --> CodeGenerator
UrlService --> UrlRepository
Base62Generator ..|> CodeGenerator
```

### Key Points
* Make the code from an auto-increment id turned into **Base62** (a-z, A-Z, 0-9).
* Store `code -> longUrl` in a database and cache hot links in Redis.
* Handle expiry, custom aliases and the same URL submitted twice.

## Design a Logging Framework
video: design logging framework low level design
summary: A library that lets code write log messages at different levels and send them to different places like console or file.

```uml
title: Logging framework
Logger | - level: Level | - appenders: Appender[] | + info(msg): void | + error(msg): void
---
Appender <<interface>> | + write(entry): void
---
ConsoleAppender | + write(entry): void
FileAppender | + write(entry): void
Logger o-- Appender
ConsoleAppender ..|> Appender
FileAppender ..|> Appender
```

### Key Points
* Levels: DEBUG, INFO, WARN, ERROR, a message is logged only if its level is high enough.
* **Singleton** for the logger, **Observer / Strategy** for appenders (where to write).
* **Chain of Responsibility** can pass an entry through filters and formatters.
* Make it **thread-safe** and write asynchronously so logging never slows the app.

## Design a Rate Limiter
video: design rate limiter low level design
summary: A component that allows only a fixed number of requests per user in a time window and rejects the extra ones.

```uml
title: Rate limiter
RateLimiter | - strategy: LimitStrategy | + allow(userId): boolean
---
LimitStrategy <<interface>> | + allow(userId): boolean
---
TokenBucket | - tokens: number | - refillRate: number | + allow(userId): boolean
SlidingWindow | - timestamps: number[] | + allow(userId): boolean
RateLimiter o-- LimitStrategy
TokenBucket ..|> LimitStrategy
SlidingWindow ..|> LimitStrategy
```

### Key Points
* **Strategy** pattern lets you switch between token bucket, fixed window and sliding window.
* Keep one counter per user (or IP) in a map; in a real system store it in Redis.
* Needs **thread safety**, because many requests hit the same counter at once.
* Return `false` and send HTTP **429 Too Many Requests** when blocked.
