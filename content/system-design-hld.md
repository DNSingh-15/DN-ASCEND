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

# Step 1: Fundamentals

## Serverless vs Serverful
video: serverless vs serverful architecture
summary: Serverful means you run and manage the servers yourself; serverless means the cloud runs your code only when needed and you pay per use.

**Real-life example:** Serverful is owning a car (always yours, you pay for fuel, parking and repairs). Serverless is taking a taxi (you pay only for the ride).

| | Serverful | Serverless |
|---|---|---|
| Who manages servers | You | Cloud provider |
| Cost | Pay even when idle | Pay per request |
| Scaling | You set it up | Automatic |
| Good for | Steady, heavy traffic | Spiky or small workloads |
| Example | EC2, your own VM | AWS Lambda, Azure Functions |

### Key Points
* Serverless still uses servers, you just do not manage them.
* Watch out for cold starts (the first request can be slow).

## Horizontal vs Vertical Scaling
video: horizontal vs vertical scaling
summary: Vertical scaling makes one machine bigger; horizontal scaling adds more machines.

**Real-life example:** If one cook cannot handle the rush, you can buy him a faster stove (vertical) or hire more cooks (horizontal).

```flow
title: Two ways to scale
direction: right
Vertical | one bigger server (more CPU and RAM)
Horizontal | many normal servers behind a load balancer
```

### Key Points
* Vertical is simple but has a hard limit and a single point of failure.
* Horizontal has no real limit and survives failures, but needs a load balancer and stateless servers.
* Big systems almost always scale horizontally.

## What are Threads
video: threads and processes explained
summary: A thread is the smallest unit of work a CPU can run, and one program can run many threads at the same time.

**Real-life example:** A restaurant (process) has many waiters (threads) serving different tables at once, all sharing the same kitchen (memory).

### Key Points
* A **process** has its own memory; threads inside it **share** memory.
* Sharing memory is fast but needs locks to avoid two threads changing the same data at once.
* Web servers use a thread (or an event loop) per request to serve many users.

## What are Pages
video: paging in operating system virtual memory
summary: A page is a small fixed-size block of memory (usually 4 KB) that the OS moves between RAM and disk.

**Real-life example:** A big book is split into pages, so you keep only the pages you are reading on your desk and the rest on the shelf.

### Key Points
* Databases also store data in pages (for example 8 KB), and read or write a whole page at a time.
* If a needed page is not in RAM, it is loaded from disk, which is called a **page fault** and is slow.
* This is why keeping hot data in memory makes systems fast.

## How Does the Internet Work
video: how does the internet work
summary: The internet is a global network of computers that send each other small packets of data using agreed rules like IP, TCP and HTTP.

```flow
title: Opening a website
Browser | you type www.example.com
DNS | turns the name into an IP address
> IP address
TCP connection | browser and server shake hands
HTTP request | "give me the page"
Server | sends the page back as packets
```

### Key Points
* **DNS** is the phone book (name to IP address).
* **IP** gets packets to the right machine, **TCP** makes sure they all arrive in order.
* Data travels through many routers and is often served from a nearby CDN.

# Step 2: Databases

## SQL vs NoSQL
video: sql vs nosql database
summary: SQL databases store data in tables with fixed structure and strong rules; NoSQL databases store flexible data and scale out more easily.

**Real-life example:** SQL is an Excel sheet with fixed columns. NoSQL is a folder of notes where every note can look different.

| | SQL | NoSQL |
|---|---|---|
| Structure | Tables, fixed schema | Flexible (documents, key-value, graph) |
| Strength | Joins, transactions (ACID) | Easy horizontal scaling, speed |
| Examples | PostgreSQL, MySQL | MongoDB, Cassandra, DynamoDB |
| Pick when | Data is related and correctness matters | Data is huge or changes shape often |

### Key Points
* Start with SQL unless you have a clear reason not to.
* Many real systems use both.

## In-Memory Databases
video: in memory database redis
summary: An in-memory database keeps all its data in RAM, so reads and writes are extremely fast.

**Real-life example:** Keeping your notes on your desk instead of walking to the library each time.

### Key Points
* Examples: Redis, Memcached.
* RAM is expensive and can lose data on restart, so they often save snapshots to disk.
* Great for sessions, leaderboards, counters and caching.

## Data Replication & Migration
video: database replication explained
summary: Replication keeps copies of the same data on several servers; migration moves data from one system to another.

**Real-life example:** Replication is photocopying an important file and keeping copies in different offices. Migration is moving the files to a new office.

```flow
title: Primary and replicas
Primary | takes all writes
> copies changes
Replica 1 || Replica 2 || Replica 3
```

### Key Points
* Replicas serve reads (more speed) and take over if the primary dies (more safety).
* Copies can lag a little behind the primary.
* Migrate safely: copy data, keep both in sync, switch traffic, then retire the old one.

## Data Partition
video: database partitioning explained
summary: Partitioning splits one big table into smaller parts so each part is faster to search and manage.

**Real-life example:** A phone book split into A-F, G-M, N-Z volumes instead of one giant book.

### Key Points
* **Horizontal** partitioning splits rows (users 1-1M, 1M-2M).
* **Vertical** partitioning splits columns (profile data apart from big photo data).
* Usually the parts stay on the same database server.

## Sharding
video: database sharding explained
summary: Sharding is partitioning the data across many separate database servers, so no single server holds everything.

**Real-life example:** A library too big for one building, so books are split across several branches by author's first letter.

```flow
title: Sharding by user id
App | picks the shard from the user id
> id 1-1M || id 1M-2M || id 2M-3M
Shard 1 || Shard 2 || Shard 3
```

### Key Points
* The **shard key** (like user id) decides where data lives; choose it carefully.
* A bad key creates a "hot" shard that gets all the traffic.
* Joins across shards are hard, so keep related data together.

# Step 3: Consistency vs Availability

## Data Consistency & Its Levels
video: data consistency levels strong eventual
summary: Consistency means every user sees the same, latest data, and the levels say how strictly that is promised.

**Real-life example:** You transfer money and your friend should see the new balance. Strong consistency shows it instantly; eventual consistency shows it a moment later.

| Level | Meaning |
|---|---|
| **Strong** | Every read sees the latest write, always |
| **Eventual** | Replicas catch up after a short delay |
| **Causal** | Related actions appear in the right order (reply after question) |
| **Read-your-writes** | You always see your own changes immediately |

### Key Points
* Stronger consistency means slower and less available.
* Use strong for money, eventual for likes and views.

## Isolation & Its Levels
video: transaction isolation levels explained
summary: Isolation decides how much one running transaction can see of another transaction's unfinished changes.

**Real-life example:** Two people editing the same document, should one see the other's half-typed sentence?

| Level | Stops |
|---|---|
| **Read Uncommitted** | Nothing (can see unsaved changes) |
| **Read Committed** | Dirty reads |
| **Repeatable Read** | Dirty and non-repeatable reads |
| **Serializable** | Everything, as if transactions ran one by one |

### Key Points
* Higher isolation is safer but slower.
* Most databases default to Read Committed or Repeatable Read.

## CAP Theorem
video: cap theorem system design
summary: When the network breaks, a distributed system must choose between staying consistent and staying available.

**Real-life example:** Two bank branches lose their phone line. Either they stop serving customers (consistent but unavailable) or keep serving with possibly old balances (available but inconsistent).

| Letter | Meaning |
|---|---|
| **C** Consistency | Everyone sees the same latest data |
| **A** Availability | Every request gets an answer |
| **P** Partition tolerance | Works even when the network between nodes breaks |

### Key Points
* Network failures will happen, so P is a must; the real choice is **C or A**.
* **CP** examples: banks, HBase. **AP** examples: Cassandra, DynamoDB, DNS.

# Step 4: Cache

## What is Cache (Redis, Memcached)
video: what is cache redis memcached
summary: A cache is a small, very fast storage that keeps frequently used data close, so you do not fetch it from the slow source again.

**Real-life example:** Keeping your favourite snacks in your bag instead of going to the shop every time.

```flow
title: Cache in front of the database
App | needs some data
Cache (Redis) | is it here?
> miss
Database | slow, but has everything
```

### Key Points
* **Redis**: rich data types, can save to disk. **Memcached**: simple, very fast key-value.
* Cache hit = found (fast). Cache miss = not found (go to the database).
* Cached data can become stale, so set an expiry (TTL).

## Write Policies: Write Back, Through & Around
video: cache write policies write through write back write around
summary: A write policy decides when new data is written to the cache and when it reaches the database.

| Policy | How it works | Trade-off |
|---|---|---|
| **Write-through** | Write to cache and database together | Safe but slower |
| **Write-back** | Write to cache first, database later | Fast but can lose data on a crash |
| **Write-around** | Write straight to the database, skip the cache | Avoids filling cache with rarely read data |

### Key Points
* Write-through for important data, write-back for speed-heavy writes like counters.
* Write-around suits data that is written once and rarely read.

## Replacement Policies: LFU, LRU, Segmented LRU
video: cache eviction policies lru lfu
summary: A replacement policy decides which item to throw out of a full cache to make room for a new one.

**Real-life example:** A small shelf is full, so you remove the thing you have not touched for the longest time.

| Policy | Removes |
|---|---|
| **LRU** (Least Recently Used) | The item not used for the longest time |
| **LFU** (Least Frequently Used) | The item used the fewest times |
| **Segmented LRU** | Uses two lists (new and proven items) so one-time items do not push out popular ones |
| **FIFO** | The oldest item |

### Key Points
* LRU is the most common default.
* LFU is better when some items are popular for a long time.

## Content Delivery Networks (CDNs)
video: what is cdn content delivery network
summary: A CDN keeps copies of your files on servers around the world so users download them from a place near them.

**Real-life example:** A shop chain with a branch in every city, so you do not order from the faraway head office.

```flow
title: CDN hit and miss
User | in Delhi
Nearest CDN server | has the file?
> miss: fetch once
Origin server | your main server
```

### Key Points
* Best for images, videos, CSS and JavaScript.
* Lower latency for users and less load on your own servers.
* Examples: Cloudflare, Akamai, CloudFront.

# Step 5: Networking

## TCP vs UDP
video: tcp vs udp
summary: TCP is reliable and ordered but slower; UDP is fast but does not guarantee delivery.

**Real-life example:** TCP is a registered courier with delivery confirmation. UDP is shouting across a street, quick but some words may be missed.

| | TCP | UDP |
|---|---|---|
| Delivery | Guaranteed, in order | No guarantee |
| Speed | Slower | Faster |
| Used for | Web pages, email, file transfer | Video calls, gaming, live streams |

### Key Points
* TCP first does a "handshake" to set up a connection.
* If a late packet is useless (live video), UDP wins.

## What is HTTP (1/2/3) & HTTPS
video: http 1.1 vs http 2 vs http 3
summary: HTTP is the language browsers and servers use to talk, and HTTPS is the same language but encrypted.

| Version | Main idea |
|---|---|
| **HTTP/1.1** | One request at a time per connection |
| **HTTP/2** | Many requests share one connection (multiplexing) |
| **HTTP/3** | Runs on QUIC (UDP), faster to connect and handles bad networks better |

### Key Points
* **HTTPS = HTTP + TLS**, so nobody in the middle can read or change the data.
* Always use HTTPS, it also helps SEO and browser trust.

## WebSockets
video: websockets explained
summary: A WebSocket keeps one connection open so the server and client can send messages to each other any time.

**Real-life example:** Normal HTTP is sending a letter and waiting for a reply. A WebSocket is a phone call that stays connected.

### Key Points
* Great for chat, live scores, notifications and multiplayer games.
* No need to keep asking "any news?" (polling).
* Many open connections use server memory, so plan for scale.

## WebRTC & Video Streaming
video: webrtc and video streaming explained
summary: WebRTC lets browsers send audio and video directly to each other in real time, while video streaming sends video in small chunks to many viewers.

**Real-life example:** WebRTC is a direct video call between two people. Streaming is a TV channel broadcasting to millions.

| | WebRTC | Streaming (HLS / DASH) |
|---|---|---|
| Delay | Under 1 second | A few seconds |
| Best for | Calls, meetings | Netflix, YouTube, live events |

### Key Points
* Streaming splits video into small chunks and picks quality based on your internet speed (adaptive bitrate).
* Chunks are served through a CDN.

# Step 6: Load Balancers

## Load Balancing Algorithms (Stateless & Stateful)
video: load balancing algorithms round robin
summary: A load balancer spreads incoming requests across many servers using a rule so no single server is overloaded.

```flow
title: Load balancer
Users | many requests
Load Balancer | picks a server for each request
> spreads the load
Server 1 || Server 2 || Server 3
```

| Algorithm | How it picks |
|---|---|
| **Round robin** | Servers one by one in turn |
| **Least connections** | The server with the fewest active requests |
| **IP hash** | Same user always goes to the same server (stateful / sticky) |
| **Weighted** | Stronger servers get more requests |

### Key Points
* **Stateless** servers keep no user data, so any server can handle any request (preferred).
* **Stateful** servers remember the user, so the user must keep returning to the same one.

## Consistent Hashing
video: consistent hashing explained
summary: Consistent hashing places servers and keys on a ring so that adding or removing a server moves only a small part of the data.

**Real-life example:** Seats around a round table; when one person leaves, only their neighbour shifts, not everybody.

### Key Points
* Normal hashing (key mod N) reshuffles almost everything when N changes.
* Each key goes to the next server clockwise on the ring.
* **Virtual nodes** spread the load evenly.
* Used in caches, databases like Cassandra and DynamoDB, and CDNs.

## Proxy & Reverse Proxy
video: proxy vs reverse proxy
summary: A proxy sits in front of clients and talks to the internet for them; a reverse proxy sits in front of servers and talks to clients for them.

**Real-life example:** A proxy is an assistant who makes calls for you. A reverse proxy is a receptionist who answers calls for a company.

| | Proxy (forward) | Reverse proxy |
|---|---|---|
| Hides | The client | The servers |
| Used for | Privacy, filtering, caching | Load balancing, SSL, caching, security |
| Examples | Corporate proxy, VPN | Nginx, HAProxy, Cloudflare |

### Key Points
* A load balancer is a kind of reverse proxy.
* It protects your real servers from direct exposure.

## Rate Limiting
video: rate limiting algorithms token bucket
summary: Rate limiting caps how many requests a user can make in a given time, to stop abuse and overload.

**Real-life example:** A club that lets only 100 people in per hour, no matter how many are waiting.

| Algorithm | Idea |
|---|---|
| **Token bucket** | Tokens refill at a steady rate, each request uses one |
| **Fixed window** | Max N requests per minute |
| **Sliding window** | Like fixed, but the minute keeps moving, so it is fairer |
| **Leaky bucket** | Requests leave at a constant speed |

### Key Points
* Return HTTP **429 Too Many Requests** when the limit is hit.
* Keep counters in Redis so all servers share them.

# Step 7: Message Queues

## Asynchronous Processing (Kafka, RabbitMQ)
video: message queue kafka rabbitmq
summary: A message queue holds tasks so a slow job can be done later in the background, and the user does not have to wait.

**Real-life example:** You order food and get a token number; the kitchen cooks in the background while you wait.

```flow
title: Queue in action
Web server | accepts the order quickly
> puts a message
Queue (Kafka / RabbitMQ) | holds the jobs safely
> worker picks it
Worker | sends email, processes video
```

| | RabbitMQ | Kafka |
|---|---|---|
| Style | Classic message broker | Distributed event log |
| Strength | Flexible routing | Huge throughput, replay old events |

### Key Points
* Absorbs traffic spikes and keeps services independent.
* Make workers **idempotent** because a message may be delivered twice.

## Publisher-Subscriber Model
video: publish subscribe pattern
summary: In pub/sub, a publisher sends an event to a topic and every subscriber of that topic receives it.

**Real-life example:** A YouTube channel posts a video and all subscribers get notified, the channel does not know who they are.

```flow
title: Publish / subscribe
Order service | publishes "order placed"
> topic
Inventory || Billing || Notifications
```

### Key Points
* A queue gives each message to **one** worker; pub/sub gives it to **every** subscriber.
* Easy to add new features without changing the publisher.

# Step 8: Monoliths vs Microservices

## Why Microservices?
video: monolith vs microservices
summary: Microservices split one big application into small independent services that can be built, deployed and scaled separately.

**Real-life example:** A monolith is one giant shop that does everything. Microservices are a mall with separate specialised shops.

| | Monolith | Microservices |
|---|---|---|
| Deploy | All together | Each service alone |
| Scaling | Whole app | Only the busy part |
| Complexity | Simple to start | Harder (network, monitoring) |
| Failure | One bug can stop everything | Failure stays mostly local |

### Key Points
* Start with a monolith, move to microservices when the team and traffic grow.
* Each service should own its own data.

## Concept of Single Point of Failure
video: single point of failure system design
summary: A single point of failure (SPOF) is any one part that, if it breaks, brings the whole system down.

**Real-life example:** A house with one door; if it jams, nobody gets in or out.

### Key Points
* Find SPOFs by asking "what if this one thing dies?" for every box in your diagram.
* Fix with **redundancy**: two load balancers, database replicas, servers in many zones.
* Add **failover** so the backup takes over automatically.

## Avoiding Cascading Failures
video: cascading failures circuit breaker
summary: A cascading failure is when one failing service overloads the next one, and the problem spreads like falling dominoes.

**Real-life example:** One slow cashier makes the queue long, people crowd the next counter, and soon the whole shop is stuck.

### Key Points
* **Timeouts**: never wait forever for another service.
* **Retries with backoff**: retry slowly, not instantly.
* **Circuit breaker**: stop calling a failing service for a while.
* **Rate limiting and load shedding**: reject extra work early.
* **Bulkheads**: keep resources separate so one failure cannot use them all.

## Containerization (Docker)
video: docker explained in hindi
summary: A container packs an app with everything it needs, so it runs the same way on any machine.

**Real-life example:** A lunchbox that holds the food, spoon and sauce together, so it works the same wherever you open it.

### Key Points
* **Image** is the blueprint, **container** is the running copy.
* Lighter and faster than virtual machines because containers share the host OS.
* Kubernetes runs and scales many containers for you.

## Migrating to Microservices
video: migrating monolith to microservices strangler pattern
summary: Move to microservices step by step by carving out one piece at a time, instead of rewriting everything at once.

```flow
title: Strangler pattern
Monolith | the old big app
> move one feature out
New service | handles that feature
> repeat
Monolith shrinks | until nothing is left
```

### Key Points
* Pick a clear, low-risk part first (like notifications).
* Put an API gateway in front to route requests to old or new code.
* Split the database last, it is the hardest part.

# Step 9: Monitoring & Logging

## Logging Events & Monitoring Metrics
video: logging monitoring metrics observability
summary: Logs record what happened, and metrics measure how the system is doing, so you can see problems and fix them fast.

**Real-life example:** Logs are the CCTV recording (what happened). Metrics are the car dashboard (speed, fuel, temperature right now).

| | Logs | Metrics |
|---|---|---|
| Answer | What exactly happened? | How healthy is it? |
| Example | "Payment 42 failed: timeout" | CPU 80%, 500 errors per minute |
| Tools | ELK, Loki | Prometheus, Grafana |

### Key Points
* Together with **traces** (the path of one request) they make up observability.
* Watch latency, error rate, traffic and saturation.
* Set alerts so you hear about problems before users do.

## Anomaly Detection
video: anomaly detection in monitoring
summary: Anomaly detection automatically spots unusual behaviour in your data, like a sudden spike in errors or a drop in orders.

**Real-life example:** Your bank texts you when your card is used in another country at 3 AM.

### Key Points
* Compare current numbers with the normal pattern for that time of day or week.
* Catches problems that fixed alert limits miss.
* Too sensitive means false alarms, too relaxed means missed problems.

# Step 10: Security

## Tokens for Auth
video: jwt authentication explained
summary: After you log in, the server gives you a token that proves who you are on every later request.

**Real-life example:** A wristband at a festival; you show it at every gate instead of re-checking your ticket.

### Key Points
* **JWT** is a signed token holding the user id and expiry, so servers do not need to look it up.
* Keep tokens short-lived and use a refresh token to get new ones.
* Send them over HTTPS only.
* **Authentication** = who you are. **Authorization** = what you may do.

## SSO & OAuth
video: sso and oauth explained
summary: SSO lets you log in once to use many apps, and OAuth lets an app act for you without ever getting your password.

**Real-life example:** SSO is one office ID card that opens every door. OAuth is "Sign in with Google": Google vouches for you, the app never sees your password.

### Key Points
* **OAuth** is about giving limited access (permission).
* **OpenID Connect** adds login (identity) on top of OAuth.
* Users get fewer passwords to remember and you store fewer secrets.

## Access Control Lists & Rule Engines
video: access control list rbac abac
summary: An access control list says who may do what, and a rule engine decides it automatically using rules.

**Real-life example:** A guest list at a party door, plus a few rules like "only adults after 10 PM".

| Model | Idea |
|---|---|
| **ACL** | A list per resource of who can access it |
| **RBAC** | Permissions come from roles (admin, editor, viewer) |
| **ABAC** | Rules use attributes (department, time, location) |

### Key Points
* Give the **least privilege** needed, nothing more.
* Keep rules in one place so they are easy to audit.

## Encryption
video: encryption symmetric asymmetric explained
summary: Encryption scrambles data so only someone with the right key can read it.

**Real-life example:** Locking a message in a box that only the right key can open.

| | Symmetric | Asymmetric |
|---|---|---|
| Keys | One shared key | Public key + private key |
| Speed | Fast | Slower |
| Example | AES | RSA |

### Key Points
* **In transit**: HTTPS/TLS. **At rest**: encrypted disks and databases.
* Never store passwords as plain text; **hash** them with salt (bcrypt).

# Step 11: System Design Tradeoffs

## Push vs Pull Architecture
video: push vs pull architecture system design
summary: In push the server sends updates to clients as they happen; in pull the client asks the server for updates.

**Real-life example:** Push is a newspaper delivered to your door. Pull is you walking to the shop to buy it.

| | Push | Pull |
|---|---|---|
| Freshness | Instant | Depends on how often you ask |
| Load | Server does the work | Client does the work, many empty requests |
| Example | Notifications, WebSockets | Polling, RSS |

### Key Points
* Push for real-time needs, pull for simplicity.
* Hybrid works too: push for normal users, pull for celebrities with millions of followers.

## Consistency vs Availability
video: consistency vs availability tradeoff
summary: When parts of the system cannot talk to each other, you choose between always-correct data and always-answering.

### Key Points
* Choose **consistency** for money, stock and bookings.
* Choose **availability** for feeds, likes and recommendations.
* See CAP Theorem in Step 3.

## SQL vs NoSQL: Which to Pick
video: sql vs nosql when to use
summary: Pick SQL when your data is related and correctness matters, and NoSQL when scale and flexibility matter more.

### Key Points
* SQL: orders, payments, users with relations.
* NoSQL: logs, chats, product catalogs, huge write volume.
* Real systems often mix both (polyglot persistence).

## Memory vs Latency
video: memory vs latency tradeoff caching
summary: Using more memory (caches, precomputed results) makes responses faster, but costs more money.

**Real-life example:** Keeping more tools on your table saves time, but the table needs to be bigger.

### Key Points
* Cache only the hot data that gets read often.
* Memory is limited and costly, disk is cheap but slow.

## Throughput vs Latency
video: throughput vs latency
summary: Latency is how long one request takes, and throughput is how many requests are handled per second.

**Real-life example:** A bus carries many people at once (high throughput) but is slower per person than a bike (low latency).

### Key Points
* Batching improves throughput but makes each item wait longer.
* Real-time apps want low latency; data pipelines want high throughput.

## Accuracy vs Latency
video: accuracy vs latency tradeoff approximate algorithms
summary: Getting an exact answer takes more time, so sometimes a fast, nearly-right answer is the better choice.

**Real-life example:** "About 1.2M views" loads instantly, while the exact count would need counting every single view.

### Key Points
* Approximate tools: **Bloom filter**, **HyperLogLog**, sampling.
* Use exact answers for money, approximate for analytics and counters.

# Step 12: For Practice

## Design YouTube
video: design youtube system design
summary: A video platform where users upload, process and stream videos to millions of viewers.

```flow
title: YouTube design
Upload | video goes to storage
Queue | triggers processing
Workers | convert to many sizes and formats
CDN | serves chunks to viewers
```

### Key Points
* Store videos in object storage (S3), details in a database.
* Adaptive streaming (HLS/DASH) picks quality by internet speed.
* Recommendations, search and view counts are separate services.

## Design Twitter
video: design twitter system design
summary: A social feed where users post short messages and see posts from people they follow.

### Key Points
* **Fan-out on write**: push a new tweet into followers' timelines (fast reads).
* **Fan-out on read** for celebrities, to avoid millions of writes.
* Cache timelines in Redis, use a search index for tweet search.

## Design WhatsApp
video: design whatsapp system design
summary: A chat app that delivers messages instantly between users, even when one of them is offline.

### Key Points
* WebSockets keep a live connection for real-time messages.
* A message queue stores messages for offline users until they return.
* Tick marks: sent, delivered, read are status events.
* End-to-end encryption keeps messages private.

## Design Uber
video: design uber system design
summary: A ride service that matches riders with nearby drivers in real time.

### Key Points
* Drivers send their location every few seconds.
* Use geospatial indexing (geohash, quadtree) to find nearby drivers fast.
* A matching service picks a driver; a trip service tracks the ride.
* Pricing, payments and notifications are separate services.

## Design Netflix
video: design netflix system design
summary: A video streaming service that delivers movies to millions of people with very little buffering.

### Key Points
* Videos are encoded in many qualities and stored close to users in its own CDN (Open Connect).
* The app picks quality automatically based on network speed.
* Microservices handle login, recommendations, billing and search.

## Design Amazon
video: design amazon e-commerce system design
summary: An online store with product search, cart, orders and payments that must stay correct under heavy traffic.

### Key Points
* Search with Elasticsearch; product pages cached heavily.
* The cart can be eventually consistent, but **orders and payments need strong consistency**.
* Inventory and checkout use transactions or a saga to avoid overselling.
* Queues handle order emails and shipping updates.

## Design Instagram
video: design instagram system design
summary: A photo-sharing app where users post pictures and follow a feed of others' posts.

### Key Points
* Photos go to object storage and are delivered via a CDN, with several sizes generated.
* The feed works like Twitter (fan-out on write, hybrid for big accounts).
* Likes and comments can be eventually consistent.

## Design Zoom
video: design zoom video conferencing system design
summary: A video meeting service that connects many people with live audio and video.

### Key Points
* **WebRTC / UDP** is used for low-delay audio and video.
* An SFU server receives each person's stream and forwards it to the others, instead of everyone connecting to everyone.
* Quality adapts to each person's network; chat and signalling use WebSockets.
