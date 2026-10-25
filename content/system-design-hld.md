---
name: High Level Design
icon: 🏛️
category: System Design
track: system-design
level: hld
color: #f97316
order: 30
description: The big picture - how servers, databases, caches and queues fit together to handle millions of users.
---

## What is System Design?
video: system design for beginners
summary: System design means building systems that are scalable, reliable, performant and fault-tolerant.

System design is deciding how the parts of a software system fit together so it can handle real traffic, real data and real failures. A system is **scalable** if it keeps working as load grows, **reliable** if it keeps working when parts break, and **performant** if it responds quickly.

Think of it as answering three questions:

1. What must the system do? (functional requirements)
2. How well must it do it? (scale, latency, availability)
3. What are the trade-offs of each choice?

> "System design is about handling real-world scale and failures."

### Key Points
* Scalable, reliable, performant, fault-tolerant are the four goals.
* There is no perfect design, only designs that fit the requirements and their trade-offs.

## HLD vs LLD
video: high level design vs low level design
summary: High-level design covers architecture and services, while low-level design covers classes, schemas and APIs.

| Type | Focus |
|------|-------|
| **HLD** (High-Level Design) | Architecture, services, scaling, data flow |
| **LLD** (Low-Level Design) | Classes, DB schema, APIs, algorithms |

Tip for interviews: start with **HLD**, then go deeper into any component the interviewer asks about.

### Key Points
* HLD answers "what are the big pieces?"
* LLD answers "how is each piece built?"

## Core Architecture Flow
video: system design architecture load balancer cache database
summary: A typical request flows from client through CDN, API gateway, load balancer, app servers, cache, database and queue.

This is the standard flow to draw in almost every design:

```flow
title: A request's journey
Client | browser, app or another service
CDN | static files from a server near the user
API Gateway | login check, rate limit, routing
Load Balancer | spreads requests across servers
App 1 || App 2 || App 3
Cache (Redis) | fast answers for repeated reads
Database | the source of truth
Queue | slow jobs run later (emails, videos)
```

What each layer does:

* **Client** - browser, mobile app, or another service.
* **CDN** - serves static files (images, JS, CSS) from servers close to the user.
* **API Gateway** - single entry point for APIs: authentication, rate limiting, routing.
* **Load Balancer** - spreads requests over many app servers.
* **App Servers** - run your business logic (stateless, so any server can handle any request).
* **Cache** - Redis/Memcached answers repeated reads quickly.
* **Database** - the source of truth.
* **Queue** - holds work to be done later (emails, video processing).

### Key Points
* Always walk through this flow when designing.
* Keep app servers stateless so you can add or remove them freely.

## Scalability
video: horizontal vs vertical scaling
summary: Horizontal scaling adds more machines and is preferred for high availability; vertical scaling adds power to one machine but has limits.

**Vertical scaling (scale up)** means giving one server more CPU or RAM. It is simple, but limited by the biggest machine you can buy and creates a single point of failure.

**Horizontal scaling (scale out)** means adding more servers and spreading the load with a load balancer. It is the preferred approach for high availability.

```flow
title: Two ways to scale
direction: right
One small server | 4 CPU
> scale up
One big server | 32 CPU - has a limit
> or scale out
Many servers | behind a load balancer
```

Horizontal scaling requires stateless services (session data stored in Redis or a database, not in memory).

> "I prefer horizontal scaling for high availability."

### Key Points
* Vertical = bigger machine (limited). Horizontal = more machines (preferred).
* Stateless services make horizontal scaling easy.

## Load Balancing
video: load balancing algorithms round robin
summary: A load balancer distributes incoming requests across servers using algorithms such as round robin or least response time.

A **load balancer** sits in front of your servers and decides which one handles each request. This prevents any single server from overloading and lets you remove unhealthy servers from rotation.

Common algorithms:

* **Round Robin** - sends requests to servers one by one in order.
* **Least Connections** - sends to the server with the fewest active connections.
* **Least Response Time** - chooses the server responding the fastest.
* **IP Hash** - the same client always goes to the same server (useful for sticky sessions).

```flow
title: Load balancer
Requests | from users
Load Balancer | checks which servers are healthy
App 1 || App 2 || App 3
```

Load balancers also perform **health checks**: if App 2 stops responding, traffic is routed to App 1 and 3.

> "Load balancer distributes traffic and prevents overload."

### Key Points
* Round Robin is simple; Least Response Time adapts to slow servers.
* Always pair load balancers with health checks.

## Caching Strategy
video: caching strategy cdn redis
summary: Caching happens at multiple levels - CDN, API cache and database cache - to reduce load and latency.

Caching stores results closer to where they are needed. There are three common levels:

1. **CDN** - caches static and some dynamic content at edge locations worldwide.
2. **API cache** - caches responses of API endpoints (e.g. HTTP `Cache-Control`, gateway cache).
3. **DB cache (Redis)** - caches query results and computed values.

Cache patterns:

* **Cache-aside** - app reads cache first; on miss, reads DB and fills the cache.
* **Write-through** - writes go to cache and DB together; cache is always fresh.
* **Write-back** - writes go to cache first and are flushed to DB later; fast but risky.

Eviction and expiry: set a **TTL** (time to live) and use an eviction policy such as LRU (least recently used) when memory is full.

The hard problem is **cache invalidation**: keeping the cache correct when data changes.

> "Caching reduces DB load and improves latency."

### Key Points
* Caching trades freshness for speed - decide how stale data may be.
* Always set TTLs and plan invalidation.

## CDN
video: what is cdn content delivery network
summary: A CDN stores copies of static content on edge servers near users to reduce latency and origin load.

A **Content Delivery Network (CDN)** is a network of servers spread across the world. It stores copies of your static files (images, videos, CSS, JS) and, in some cases, dynamic responses at **edge locations**.

```flow
title: CDN cache hit vs miss
User in Mumbai
CDN edge (Mumbai) | has the file? Answer in about 20 ms
> cache miss
Origin server (US-East) | slower, about 250 ms
```

Benefits: lower latency for users far from your server, less load and bandwidth on your origin, and protection against traffic spikes.

Use a CDN for anything static, and for large video or file downloads. Set correct `Cache-Control` headers so the CDN knows what to cache and for how long.

### Key Points
* CDN = caching at the network edge, close to users.
* Static assets are the first thing to put behind a CDN.

## API Gateway
video: api gateway microservices explained
summary: An API gateway is the single entry point for APIs that handles authentication, rate limiting and routing to backend services.

An **API Gateway** sits between clients and your backend services. Clients call one URL, and the gateway forwards each request to the right service.

Responsibilities:

* **Routing** - `/users/*` goes to the user service, `/orders/*` to the order service.
* **Authentication** - verify JWT/API keys once, at the edge.
* **Rate limiting** - protect services from abuse.
* **Request transformation, logging and caching.**

```flow
title: API Gateway
Client | calls one URL
API Gateway | auth, rate limit, routing
User Service || Order Service
```

Benefits: clients do not need to know your internal service layout, and cross-cutting concerns live in one place.

### Key Points
* One entry point, many services behind it.
* Typical tools: AWS API Gateway, Azure API Management, Kong, NGINX.

## Database Design
video: database design sql vs nosql
summary: Choose between relational SQL databases with ACID guarantees and flexible NoSQL databases based on the data and consistency needs.

Database choice is one of the most important design decisions.

| SQL (Relational) | NoSQL |
|------------------|-------|
| ACID transactions | Often eventual consistency (BASE) |
| Structured, fixed schema | Flexible schema |
| Joins across tables | Data stored denormalized, joins done in app |
| Scales up well; sharding is harder | Designed to scale out horizontally |
| Examples: PostgreSQL, MySQL | Examples: MongoDB, DynamoDB, Cassandra |

Use **SQL** when data is relational and correctness matters (payments, bookings, inventory). Use **NoSQL** for huge scale, simple access patterns, or flexible documents (sessions, activity logs, catalogs).

### Key Points
* SQL = strong consistency and relationships.
* NoSQL = flexible schema and easy horizontal scaling.
* Many real systems use both.

## ACID Transactions
video: acid properties database transactions
summary: ACID guarantees that transactions are atomic, consistent, isolated and durable, so data stays reliable.

**ACID** is the set of guarantees that SQL databases give for transactions:

* **Atomicity** - all or nothing. If one step fails, everything is rolled back.
* **Consistency** - data always follows the rules (constraints, foreign keys).
* **Isolation** - concurrent transactions do not interfere with each other.
* **Durability** - once committed, data survives crashes (written to disk/log).

```flow
title: Transfer 500 from A to B
Debit A | take 500 from A
Credit B | give 500 to B
COMMIT or ROLLBACK | both steps happen, or neither does
```

> One-liner: ACID ensures reliable and consistent database transactions.

### Key Points
* ACID is what SQL databases promise; many NoSQL databases relax it for scale.
* Atomicity protects money transfers; isolation protects concurrent updates.

## Eventual Consistency
video: eventual consistency distributed systems
summary: Eventual consistency means replicas may briefly disagree but converge to the same value over time.

In **eventually consistent** systems, after a write, different replicas may return different values for a short time. Given no new writes, all replicas eventually converge.

Example: you post a comment; a friend on a different replica does not see it for 200 ms. That is acceptable for a social feed but not for a bank balance.

This trade-off buys higher availability and speed. It is common in NoSQL and in systems using asynchronous replication.

### Key Points
* Eventual consistency = temporary disagreement, eventual agreement.
* Acceptable for feeds, likes, counters; not for money.

## Scaling the Database
video: database replication partitioning sharding
summary: Scale a database first with read replicas, then partitioning, and finally sharding when data is very large.

Scaling a database follows the same ladder covered in the PostgreSQL notes:

* **Read replicas** - copies of the database that serve read queries.
* **Partitioning** - split a big table inside one database (e.g. by date).
* **Sharding** - split data across multiple database servers by a shard key.

> "I scale reads using replicas and large data using partitioning."

### Key Points
* Replicas scale reads; partitioning manages big tables; sharding scales writes and storage.
* Start with the simplest option that solves the bottleneck.

## Consistent Hashing
video: consistent hashing explained
summary: Consistent hashing maps keys and servers onto a ring so adding or removing a server moves only a small share of keys.

Plain modulo hashing (`hash(key) % N`) breaks when N changes: adding one server remaps almost every key, flushing caches and moving data everywhere.

**Consistent hashing** places servers (and keys) on a circular hash ring. A key belongs to the first server clockwise from its position. When a server is added or removed, only the keys between it and its neighbour move.

```flow
title: Consistent hashing
Hash the key | key K1 becomes a point on the ring
Walk clockwise | first server found owns the key
Server A || Server B || Server C
Add Server D | only the keys next to D move
```

Virtual nodes (several points per server) spread load more evenly. Used by Cassandra, DynamoDB, and many caches.

### Key Points
* Solves the "adding a server remaps everything" problem.
* Common in distributed caches and sharded databases.

## Messaging and Queues
video: message queue kafka producer consumer
summary: Message queues decouple services and absorb traffic spikes by processing work asynchronously.

A **message queue** holds messages between a producer (sender) and a consumer (worker). The producer does not wait for the work to finish, so services are **decoupled** and traffic spikes are absorbed.

```flow
title: Queue in action
User signs up
API | replies fast
Queue | holds the job
Email worker | sends the welcome mail later
```

Example: **Kafka** (a distributed event log):

* **Producer** - sends messages.
* **Consumer** - reads messages.
* **Topic** - a named category of messages (e.g. `orders`).
* **Partition** - splits a topic so it can be processed in parallel and scaled.

Other options: RabbitMQ, AWS SQS/SNS, Azure Service Bus.

### Key Points
* Queues make slow work asynchronous and protect services from spikes.
* Kafka partitions give ordering per partition and parallelism across them.

## Event-Driven Design (Pub/Sub)
video: publish subscribe pattern event driven architecture
summary: Publish/subscribe lets one event notify many independent services without the sender knowing who listens.

In **publish/subscribe**, a publisher emits an event (e.g. `OrderPlaced`) to a topic, and any number of subscribers react independently: inventory updates stock, billing charges the card, notifications send an email.

```flow
title: Publish / subscribe
Order Service | publishes OrderPlaced
Topic | every subscriber gets a copy
Inventory || Billing || Notifications
```

A queue usually delivers each message to one worker; pub/sub delivers each event to every subscriber.

### Key Points
* Publisher does not know its subscribers - easy to add new features.
* Pair with idempotent consumers, since messages can be delivered more than once.

## CAP Theorem
video: cap theorem system design
summary: CAP says a distributed system must choose between consistency and availability when a network partition happens.

The **CAP theorem** says that a distributed data system can guarantee at most two of these three properties at the same time:

| Letter | Meaning |
|--------|---------|
| **C** - Consistency | Every read returns the most recent write |
| **A** - Availability | Every request gets a (non-error) response |
| **P** - Partition tolerance | System keeps working when network messages between nodes are lost |

The key point: network partitions happen in real distributed systems, so you must tolerate them (P is not optional). That means **during a partition you must choose between C and A**:

* **CP** - refuse or delay some requests to stay consistent (e.g. a bank, HBase, MongoDB in default mode).
* **AP** - keep answering, possibly with stale data (e.g. DNS, Cassandra, DynamoDB default reads).

When there is no partition, a system can offer both consistency and availability; the trade-off applies only during failures.

### Key Points
* It is not "pick any 2" - partitions are unavoidable, so the real choice is C vs A during a partition.
* Say: "In distributed systems, trade-offs are unavoidable."

## Fault Tolerance
video: fault tolerance retry circuit breaker
summary: Fault tolerance uses retries, circuit breakers and multi-AZ deployment so systems keep working when components fail.

Failures are normal: servers crash, networks drop packets, third-party APIs time out. Fault-tolerant systems expect this and degrade gracefully.

* **Retry mechanism** - retry failed calls with **exponential backoff** and jitter (wait 1s, 2s, 4s, with random delay), and only for idempotent operations.
* **Circuit breaker** - after too many failures, stop calling the failing service for a while and return a fallback. This prevents cascading failures.
* **Multi-AZ deployment** - run copies of your system in multiple availability zones (separate data centres), so one zone failing does not take you down.
* **Timeouts and fallbacks** - never wait forever; return cached or default data when possible.

```flow
title: Circuit breaker
CLOSED | normal, calls go through
> too many failures
OPEN | calls blocked, fallback returned
> after a timeout
HALF-OPEN | try one request
> it works? go back to CLOSED
```

> "System should handle failures gracefully."

### Key Points
* Retry only safe (idempotent) operations.
* Circuit breakers stop cascading failures.
* Multi-AZ protects against a whole data centre failing.

## Security
video: system design security jwt oauth https
summary: Secure systems with JWT or OAuth authentication, HTTPS everywhere, rate limiting and least-privilege IAM roles.

Security must be designed in from the start:

* **Authentication** - who are you? Use **OAuth 2.0 / OpenID Connect** for login, and **JWT** (JSON Web Tokens) to carry signed identity between services.
* **Authorization** - what may you do? Role-based access control (RBAC) and least privilege.
* **HTTPS (TLS)** - encrypt data in transit.
* **Rate limiting** - stop abuse and brute-force attacks.
* **IAM roles** - give services only the permissions they need (cloud).
* **Secrets management** - store keys in a vault (AWS Secrets Manager, Azure Key Vault), never in code.

```flow
title: Secure request
Client | sends over HTTPS
API Gateway | verifies JWT, rate limits
Service | checks the user's role
```

> "Security is critical, especially for sensitive systems."

### Key Points
* JWT proves identity; authorization decides permissions.
* Never store secrets in source code.

## Monitoring and Observability
video: logging metrics alerting monitoring system design
summary: Monitoring uses logs, metrics and alerts to show system health and warn you before users notice problems.

You cannot run what you cannot see. Observability has three pillars:

* **Logs** - detailed records of events ("payment failed for order 42").
* **Metrics** - numbers over time (requests per second, error rate, p95 latency, CPU).
* **Alerts** - notifications when a metric crosses a threshold (error rate above 2% for 5 minutes).

Add **tracing** (e.g. OpenTelemetry) to follow one request across many services.

Tools: CloudWatch (AWS), Azure Monitor, Prometheus + Grafana, Datadog.

> "Without monitoring, system reliability cannot be ensured."

### Key Points
* Measure the user experience (latency, errors), not only server CPU.
* Good alerts are actionable; too many alerts get ignored.

## Rate Limiting
video: rate limiting algorithms token bucket
summary: Rate limiting caps how many requests a client can make in a time window to prevent abuse and protect backends.

**Rate limiting** restricts how many requests a user, IP or API key can make in a period (e.g. 100 requests per minute). Requests over the limit get HTTP `429 Too Many Requests`.

Common algorithms:

* **Fixed window** - count requests per clock minute. Simple, but allows bursts at window edges.
* **Sliding window** - smoother counting over the last N seconds.
* **Token bucket** - a bucket refills at a steady rate; each request takes a token. Allows short bursts.
* **Leaky bucket** - requests drain at a constant rate.

Counters are usually stored in Redis so all servers share the same limit.

```flow
title: Token bucket (5 tokens, refills 1 per second)
Request arrives
Token available? | yes, take one and let it through
> no tokens left
Reject with 429 | too many requests
```

> "Rate limiting protects system from overload."

### Key Points
* Protects backends, controls cost, and blocks abuse.
* Typically enforced at the API gateway, with Redis for shared counters.

## Deployment Strategies
video: blue green canary rolling deployment
summary: Blue-green, rolling and canary deployments release new versions with zero or minimal downtime and easy rollback.

Deploying carelessly causes downtime. Safer strategies:

* **Rolling** - replace servers a few at a time. Some old and new versions run together briefly.
* **Blue-Green** - run two identical environments. Deploy to *green*, test, then switch the router from *blue* (old) to *green* (new). Rollback = switch back.
* **Canary** - send 1-5% of traffic to the new version first; if metrics look good, increase gradually.

```flow
title: Blue-green deploy
Router | sends users to BLUE (v1)
Deploy GREEN (v2) | test it while BLUE is live
Switch the router | users now see GREEN
Keep BLUE | instant rollback if needed
```

> "I prefer zero-downtime deployment strategies."

### Key Points
* Blue-green gives instant rollback; canary limits blast radius.
* Keep database changes backward-compatible so old and new code can run together.

## Microservices vs Monolith
video: monolith vs microservices architecture
summary: A monolith is one simple deployable unit, while microservices are independent services that scale separately but add complexity.

| Monolith | Microservices |
|----------|---------------|
| One codebase, one deployable | Many small services, each deployable alone |
| Simple to build and debug | Complex: networking, tracing, data consistency |
| Tight coupling | Loose coupling |
| Scale the whole app | Scale only the hot services |

Start with a well-structured **monolith** for most products. Move to microservices when teams, scale or release frequency demand independent services.

> "Microservices improve scalability but add complexity."

### Key Points
* Microservices solve organisational and scaling problems; they are not automatically better.
* Avoid microservices before you have the team and tooling for them.

## Capacity Estimation
video: system design back of envelope estimation
summary: Back-of-the-envelope math converts users and traffic into requests per second, storage and bandwidth before you design.

Interviewers expect you to estimate scale before designing. Use round numbers and show your work.

Example:

```flow
title: Capacity math
10M requests per day
Divide by 86,400 seconds | about 115 requests/sec
Peak is about 3x | about 350 requests/sec
```

Estimate storage too:

```text
1M new users/day × 1 KB each = 1 GB/day ≈ 365 GB/year
```

Useful numbers: 1 day = 86,400 s; 1 million/day ≈ 12 per second; 1 KB × 1M = 1 GB.

> "I always estimate scale before designing."

### Key Points
* Average vs peak matters - design for peak.
* Estimates decide whether you need sharding, caching or a single database.

## Performance Optimization
video: system design performance optimization caching async
summary: Speed up systems with caching, indexing, asynchronous processing and CDNs.

The main levers for performance:

* **Caching** - serve repeated reads from memory.
* **Indexing** - let the database find rows quickly.
* **Async processing** - move slow work (emails, reports, image resizing) to queues so the user does not wait.
* **CDN** - serve static content from close to the user.

### Key Points
* Measure first; optimize the actual bottleneck.
* Move anything the user does not need immediately into async processing.

## How to Answer in an Interview
video: how to answer system design interview questions
summary: Follow a fixed structure - requirements, high-level design, scaling, trade-offs and bottlenecks - to stay organised.

Always structure your answer the same way:

1. **Requirements** - clarify functional needs and scale (users, read/write ratio, latency, availability).
2. **High-Level Design** - draw the main components and the request flow.
3. **Scaling** - show how each component grows (replicas, sharding, load balancers).
4. **Trade-offs** - explain why you chose each option and what you gave up.
5. **Bottlenecks** - name the weakest point and how you would monitor or fix it.

```flow
title: Interview flow (about 45 min)
direction: right
Requirements | 5 min
HLD | 10 min
Deep dive | 20 min
Scaling and bottlenecks | 10 min
```

### Key Points
* Talk through trade-offs out loud - that is what interviewers grade.
* Ask clarifying questions before drawing anything.

## Common Design Questions
video: system design interview common questions
summary: Typical design problems map to a small set of building blocks such as load balancers, caches, CDNs, auto-scaling and queues.

| Question | Typical answer |
|----------|----------------|
| Design a scalable system | Load balancer + stateless app servers + cache + DB scaling |
| Handle high traffic | CDN + auto scaling + queue |
| Avoid a DB bottleneck | Cache + read replicas |
| Send notifications to millions | Queue + workers + pub/sub |

### Key Points
* Most designs reuse the same handful of building blocks.
* Know the trade-off behind each building block.

## Golden Rule for Answers
video: system design interview tips
summary: Explain the reason and the measurable benefit behind each technology choice instead of just naming it.

Do not just name a tool. Explain the problem it solves and the result you expect.

Weak answer:

> "Use Redis."

Strong answer:

> "Use Redis to reduce DB load and improve latency under high read traffic."

### Key Points
* Name the problem, the tool, and the expected outcome.
* Mention the trade-off you accept.

## One-Line Summary
video: system design summary
summary: System design is about scalability, reliability, trade-offs and real-world thinking.

**System design = scalability + reliability + trade-offs + real-world thinking.**

### Key Points
* Start simple, scale the bottleneck, and always justify the trade-offs.
