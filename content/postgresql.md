---
name: PostgreSQL
icon: 🐘
category: Database
track: fullstack
color: #336791
order: 8
description: PostgreSQL is a powerful open-source relational database known for reliability, SQL compliance, JSONB support and strong concurrency.
---

## Mindset
video: postgresql tutorial for beginners
summary: Think about performance, consistency, scalability and trade-offs whenever you design or query a database.

PostgreSQL ("Postgres") is an open-source relational database. It stores data in tables (rows and columns), you talk to it using SQL, and it guarantees that your data stays correct even when many users write at the same time.

Before learning individual features, adopt the right mindset. Every database decision is a trade-off between four things:

* **Performance** - how fast do queries run?
* **Consistency** - is the data always correct and valid?
* **Scalability** - what happens when users or data grow 100x?
* **Trade-offs** - every choice (an index, a cache, a replica) gains something and costs something.

For example, an index makes reads faster but makes writes slower and uses disk space. A cache makes reads faster but can show stale data. There is rarely a "perfect" answer, only a justified one.

```text
Think in this order:
1. What are the queries? (access patterns)
2. What must be 100% correct? (transactions)
3. What will grow? (scaling plan)
4. What is the cost of each choice? (trade-offs)
```

### Key Points
* Postgres = relational + ACID + very extensible (JSONB, extensions, full-text search).
* Always start from the access pattern, not from the tools.
* Interview tip: say "Schema design depends on query patterns."

## SQL Basics and CRUD
video: sql basics crud queries
summary: Create tables and use INSERT, SELECT, UPDATE and DELETE, the four core operations of any database.

SQL (Structured Query Language) is how you talk to PostgreSQL. Almost everything you do falls into CRUD: **C**reate, **R**ead, **U**pdate, **D**elete.

```sql
-- Create a table
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Create
INSERT INTO users (name, email) VALUES ('Ravi', 'ravi@example.com');

-- Read
SELECT id, name FROM users WHERE email = 'ravi@example.com';

-- Update
UPDATE users SET name = 'Ravi Kumar' WHERE id = 1;

-- Delete
DELETE FROM users WHERE id = 1;
```

Important clauses for reading data:

| Clause | Purpose |
|--------|---------|
| `WHERE` | Filter rows |
| `ORDER BY` | Sort results |
| `LIMIT / OFFSET` | Restrict how many rows return |
| `GROUP BY` | Group rows to aggregate (`COUNT`, `SUM`, `AVG`) |
| `HAVING` | Filter groups after aggregation |

```sql
SELECT status, COUNT(*) AS total
FROM orders
GROUP BY status
HAVING COUNT(*) > 10
ORDER BY total DESC;
```

### Key Points
* Always use a `WHERE` clause with `UPDATE` and `DELETE`, or you change every row.
* A **primary key** uniquely identifies a row; a **foreign key** links to another table.
* Avoid `SELECT *` in production code - ask only for the columns you need.

## Joins
video: sql joins explained
summary: Joins combine rows from two or more tables using related columns such as foreign keys.

Data is split across tables (users, orders, products). A **JOIN** combines them at query time using a shared column, usually a foreign key.

```sql
SELECT u.name, o.id AS order_id, o.total
FROM users u
INNER JOIN orders o ON o.user_id = u.id
WHERE o.total > 500;
```

| Join type | Result |
|-----------|--------|
| `INNER JOIN` | Only rows that match in both tables |
| `LEFT JOIN` | All rows from the left table, matched rows from the right (NULL if none) |
| `RIGHT JOIN` | Opposite of LEFT JOIN |
| `FULL JOIN` | All rows from both sides |

Use `LEFT JOIN` to find things that are missing, for example users who never placed an order:

```sql
SELECT u.id, u.name
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL;
```

Joins are fast when the join columns are indexed. In very high-traffic systems, too many joins across huge tables become expensive, which is why teams sometimes denormalize (see Data Modeling).

### Key Points
* Index the foreign key columns used in joins.
* `INNER` = intersection, `LEFT` = keep everything on the left.
* Joining 5+ big tables in a hot path is a red flag.

## Data Modeling
video: database schema design
summary: Start with a normalized schema, then denormalize selectively for performance, always guided by query patterns.

Data modeling means deciding which tables, columns and relationships your application needs. A good rule of thumb:

1. **Start normalized** - no duplicated data, clean relationships. It is easy to keep correct.
2. **Denormalize for performance** - when a hot query needs too many joins, store a copy of some data to avoid them.

```text
Normalized:                       Denormalized (read-optimised):
orders(id, user_id, total)        orders(id, user_id, user_name, total)
users(id, name)                   -- no join needed to show the name
```

The cost of denormalizing: duplicated data can become inconsistent, so you must update every copy when the original changes. Use it only where measurements show a real problem.

Relationships to model:

* **One-to-many** - one user, many orders (foreign key on the "many" side).
* **Many-to-many** - students and courses (use a join/junction table).
* **One-to-one** - user and profile.

### Key Points
* Avoid heavy joins in high-traffic systems; precompute or cache instead.
* Choose proper types (`TIMESTAMPTZ`, `NUMERIC` for money, `UUID`/`BIGINT` for IDs).
* Interview tip: "Schema design depends on query patterns."

## Normalization
video: database normalization 1nf 2nf 3nf
summary: Normalization removes duplicate data by splitting tables so each fact is stored in exactly one place.

Normalization is a set of rules for organising tables so that data is not repeated and updates do not cause anomalies.

* **1NF** - each column holds a single value (no comma-separated lists), each row is unique.
* **2NF** - 1NF plus every non-key column depends on the whole primary key (matters for composite keys).
* **3NF** - 2NF plus no non-key column depends on another non-key column.

Bad design (customer name and city repeated in every order):

```text
orders: order_id | customer_name | customer_city | product | price
```

Better design:

```text
customers: id | name | city
orders:    id | customer_id | product | price
```

Now changing a customer's city is a single-row update, not hundreds.

Normalization gives correctness and less storage. The price is more joins. That is why the usual advice is: normalize first (to 3NF), then denormalize only the few hot paths where performance demands it.

### Key Points
* One fact, one place.
* 3NF is enough for most applications.
* Denormalization is a deliberate, measured exception, not a starting point.

## Indexing
video: postgresql indexing
summary: Indexes are fast lookup structures that speed up reads; choose the type and columns based on access patterns.

An index works like the index at the back of a book: instead of reading every page (a **sequential scan**), the database jumps straight to the right rows. Indexes speed up `SELECT`, but slow down `INSERT/UPDATE/DELETE` slightly and use disk space.

Common index types:

| Type | Use case |
|------|----------|
| **B-Tree** | Default. Equality and range queries (`=`, `<`, `>`, `BETWEEN`, `ORDER BY`) |
| **GIN** | `JSONB`, arrays, full-text search |
| **Composite** | Queries that filter on several columns together |

```sql
-- Single column
CREATE INDEX idx_users_email ON users(email);

-- Composite (multi-column)
CREATE INDEX idx_user_created ON users(user_id, created_at);

-- GIN for JSONB
CREATE INDEX idx_data_gin ON events USING GIN (data);
```

For composite indexes, column order matters: the index helps queries that use the **leftmost** columns. An index on `(user_id, created_at)` helps `WHERE user_id = 5` and `WHERE user_id = 5 AND created_at > ...`, but not `WHERE created_at > ...` alone.

### Key Points
* Index columns used in `WHERE`, `JOIN`, and `ORDER BY`.
* Do not index everything - each index costs write speed and storage.
* Primary keys and `UNIQUE` columns are indexed automatically.
* Interview tip: "Indexes are based on access patterns, not blindly added."

## Query Optimization
video: postgresql explain analyze query optimization
summary: Use EXPLAIN ANALYZE to read the query plan, avoid sequential scans, and fix slow queries with indexes or rewrites.

When a query is slow, do not guess. Ask Postgres how it executes the query:

```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'x';
```

`EXPLAIN` shows the plan; `ANALYZE` actually runs the query and reports real timings. What to look for:

* **Seq Scan** on a big table - usually means a missing index.
* **Index Scan / Index Only Scan** - good.
* Estimated rows vs actual rows far apart - statistics are stale, run `ANALYZE`.
* Large `Sort` or `Hash` steps - may need an index or more memory.

```text
Before: Seq Scan on users  (cost=0..18334 rows=1)  Execution Time: 120 ms
After CREATE INDEX idx_users_email ON users(email):
        Index Scan using idx_users_email           Execution Time: 0.05 ms
```

Optimization checklist:

* Avoid Seq Scan on large tables.
* Add the right indexes.
* Use pagination instead of loading everything.
* Select only needed columns, not `SELECT *`.
* Rewrite queries (e.g. avoid functions on indexed columns in `WHERE`).

### Key Points
* Measure first, then optimize.
* Interview tip: "I analyze the query plan and optimize with indexing or query rewrite."

## Pagination
video: sql pagination limit offset keyset
summary: Return data in small pages using LIMIT/OFFSET or faster keyset pagination instead of fetching all rows.

Never return an entire large table to the client. Split results into pages.

**OFFSET pagination** (simple):

```sql
SELECT id, title FROM posts
ORDER BY id
LIMIT 20 OFFSET 40;   -- page 3
```

Problem: with a big offset, Postgres still reads and discards all the skipped rows, so page 10,000 is slow.

**Keyset (cursor) pagination** (fast):

```sql
SELECT id, title FROM posts
WHERE id > 1000        -- last id seen on the previous page
ORDER BY id
LIMIT 20;
```

This uses an index to jump directly to the next page, so every page costs about the same.

| Method | Pros | Cons |
|--------|------|------|
| OFFSET | Easy, can jump to page N | Slow for deep pages |
| Keyset | Constant speed | Only next/previous, needs a unique sortable column |

### Key Points
* Always `ORDER BY` with `LIMIT`, otherwise page contents are not stable.
* Use keyset pagination for feeds and infinite scroll.

## Transactions
video: database transactions acid
summary: A transaction groups several statements into one all-or-nothing unit, essential for payments and orders.

A transaction bundles multiple SQL statements so they either **all succeed or all fail**. Use them for critical operations such as payments and orders.

```sql
BEGIN;
UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;
COMMIT;      -- or ROLLBACK; to undo everything
```

If the server crashes after the first `UPDATE`, the money is not lost - the transaction never committed, so neither update is applied.

Transactions follow **ACID**:

* **Atomicity** - all or nothing.
* **Consistency** - the database moves from one valid state to another (constraints are respected).
* **Isolation** - concurrent transactions do not interfere.
* **Durability** - once committed, data survives crashes.

Keep transactions **short**: long ones hold locks, block others, and bloat the database.

### Key Points
* Wrap multi-step money/stock/order changes in `BEGIN ... COMMIT`.
* Use `ROLLBACK` (or let the app do so on error) to undo.
* Interview tip: "Transactions ensure atomicity and consistency."

## Isolation Levels
video: transaction isolation levels dirty read
summary: Isolation levels control which concurrent anomalies (dirty, non-repeatable, phantom reads) a transaction can see.

When several transactions run at once, isolation decides how much they can "see" of each other's work.

| Level | Prevents | Notes |
|-------|----------|-------|
| **Read Committed** (default) | Dirty reads | Each statement sees data committed before it started |
| **Repeatable Read** | + non-repeatable reads, phantoms (in Postgres) | Whole transaction sees one snapshot |
| **Serializable** | All anomalies | Behaves as if transactions ran one after another; may abort with a serialization error you must retry |

(Postgres treats Read Uncommitted the same as Read Committed - dirty reads never happen.)

Anomalies in plain words:

* **Dirty read** - reading data another transaction has not committed yet.
* **Non-repeatable read** - reading the same row twice and getting different values.
* **Phantom read** - running the same query twice and getting different sets of rows.

```sql
BEGIN ISOLATION LEVEL REPEATABLE READ;
SELECT balance FROM accounts WHERE id = 1;
-- ...other work; same snapshot is used...
COMMIT;
```

### Key Points
* The default (Read Committed) is fine for most apps.
* Higher isolation = stronger guarantees but more retries/conflicts.
* Retry the transaction when you receive a serialization failure.

## MVCC
video: postgresql mvcc explained
summary: MVCC keeps multiple row versions so readers never block writers, giving high concurrency through snapshots.

**MVCC (Multi-Version Concurrency Control)** is how Postgres handles many users at once. Instead of locking a row while someone reads it, Postgres keeps multiple versions of it.

* A **reader** sees a consistent **snapshot** of the data as of when its query/transaction began.
* A **writer** creates a *new version* of the row; the old version stays visible to older snapshots.
* So **reads don't block writes, and writes don't block reads**.

```text
Time ->
T1 (reader):  BEGIN ... SELECT balance -> 100 (snapshot)
T2 (writer):        UPDATE balance = 150; COMMIT   (new row version)
T1 (reader):  SELECT balance -> still 100 (Repeatable Read)
```

The downside: old row versions ("dead tuples") pile up. **VACUUM** (run automatically by autovacuum) cleans them and frees space for reuse. If autovacuum falls behind, tables bloat and queries slow down.

### Key Points
* Snapshot-based reads = high concurrency.
* Writers only conflict with other writers on the same row.
* Watch for table bloat; keep autovacuum healthy; avoid very long transactions.
* Interview tip: "PostgreSQL uses MVCC for high concurrency."

## Locking
video: postgresql row level locking select for update
summary: Row-level locks such as SELECT FOR UPDATE prevent race conditions when concurrent requests change the same data.

MVCC handles most concurrency, but sometimes you must explicitly stop two requests from changing the same row based on stale data. Example: two users buy the last item at the same time.

```sql
BEGIN;
SELECT * FROM orders WHERE id = 42 FOR UPDATE;   -- locks this row
UPDATE orders SET status = 'PAID' WHERE id = 42;
COMMIT;                                          -- lock released
```

Other transactions that try to update or `FOR UPDATE` the same row **wait** until the first one commits or rolls back.

Useful variants:

* `FOR UPDATE NOWAIT` - fail immediately instead of waiting.
* `FOR UPDATE SKIP LOCKED` - skip locked rows; perfect for job queues where workers pick different tasks.
* `FOR SHARE` - allow others to read-lock but not modify.

```sql
SELECT * FROM jobs WHERE status = 'pending'
ORDER BY id LIMIT 1
FOR UPDATE SKIP LOCKED;
```

### Key Points
* Row-level locking prevents race conditions (lost updates).
* Hold locks for the shortest possible time.
* Interview tip: "Row-level locking avoids concurrent conflicts."

## Deadlocks
video: database deadlock explained
summary: Deadlocks occur when transactions wait on each other in a circle; fix with consistent lock order and short transactions.

A **deadlock** happens when two transactions each hold a lock the other needs, so both wait forever.

```text
T1: locks row A, then wants row B
T2: locks row B, then wants row A
        -> circular wait = DEADLOCK
```

Postgres detects this automatically, aborts one transaction with an error ("deadlock detected"), and lets the other continue. Your app should catch the error and retry.

How to prevent deadlocks:

* **Lock in the same order** everywhere (e.g. always update the lower account id first).
* **Keep transactions short** so locks are held briefly.
* Lock everything you need up front (`SELECT ... FOR UPDATE` on all rows in sorted order).
* Avoid user interaction (waiting for input) inside a transaction.

```sql
-- Consistent order: always lock lower id first
SELECT * FROM accounts WHERE id IN (1, 2) ORDER BY id FOR UPDATE;
```

### Key Points
* Cause: circular wait.
* Fix: same lock order + short transactions + retry on failure.

## JSONB
video: postgresql jsonb tutorial
summary: JSONB stores flexible JSON documents in Postgres with indexing, giving NoSQL-like flexibility inside a relational database.

Postgres can store JSON documents in a **JSONB** column (binary JSON). It lets you mix a fixed schema with flexible fields, so for many apps you do not need a separate NoSQL database.

```sql
CREATE TABLE events (
  id   SERIAL PRIMARY KEY,
  data JSONB NOT NULL
);

INSERT INTO events (data)
VALUES ('{"type":"click","user":{"id":7,"city":"Pune"},"tags":["a","b"]}');

-- Get a field as text
SELECT data->>'type' FROM events;

-- Nested field
SELECT data->'user'->>'city' FROM events;

-- Containment filter (uses GIN index)
SELECT * FROM events WHERE data @> '{"type":"click"}';

-- Index it
CREATE INDEX idx_events_data ON events USING GIN (data);
```

Operators: `->` returns JSON, `->>` returns text, `@>` means "contains".

When to use JSONB: varying attributes (product specs), event payloads, settings. When not to: data you filter, join and aggregate on constantly - make those proper columns.

### Key Points
* Prefer `JSONB` over `JSON` (faster, indexable).
* Use a GIN index for `@>` and key-exists queries.
* Do not turn the whole schema into one JSON blob.

## Connection Pooling
video: pgbouncer connection pooling
summary: A pooler like PgBouncer reuses a few database connections for many clients, avoiding connection overhead.

Every Postgres connection is a separate OS process that uses memory (several MB) and takes time to set up. If each web request opens its own connection, or you run many app instances, the database runs out of connections or slows down.

A **connection pool** keeps a small set of open connections and lends them out:

```text
App instances (1000 clients)
        |
        v
   PgBouncer  (pool of ~20-50 real connections)
        |
        v
   PostgreSQL
```

* **App-level pool** - libraries like `pg` Pool in Node.js keep connections per process.
* **External pooler** - **PgBouncer** sits in front of Postgres and multiplexes thousands of clients over a few real connections. Essential with many app servers or serverless functions.

PgBouncer modes: *session*, *transaction* (most common - connection returned after each transaction), *statement*.

```js
// Node.js example
const pool = new Pool({ max: 10 });
const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [1]);
```

### Key Points
* Do not create a new connection per request.
* Size pools carefully: more connections is not faster.
* Interview tip: "Pooling prevents connection overhead in Node.js apps."

## Scaling Overview
video: sharding vs replication vs partitioning
summary: Compare indexing, caching, partitioning, replication and sharding, and know which one solves which problem.

When a database gets slow or big, you have several tools. They solve different problems:

| Technique | What it does | Used for |
|-----------|--------------|----------|
| **Indexing** | Fast lookup structure, like a book index | Speeding up SELECT queries |
| **Caching** | Keep hot data in memory (Redis) | Reducing DB load, faster responses |
| **Partitioning** | Split one table into smaller parts in the **same** database | Large tables; queries scan only relevant partitions |
| **Replication** | Copy the **same** data to multiple servers (1 primary for writes, N replicas for reads) | High availability and read scaling |
| **Sharding** | Split data across **different** servers; each holds a portion | Data/writes too large for one server (horizontal scaling) |

Typical order of adoption (cheapest first):

```text
1. Indexes + query tuning
2. Connection pooling
3. Redis caching
4. Read replicas
5. Partitioning
6. Sharding (last resort - most complex)
```

### Key Points
* Replicas scale **reads**; sharding scales **writes and size**.
* Do the simple things first; sharding adds big complexity.
* Interview tip: "I scale reads via replicas and large datasets via partitioning."

## Partitioning
video: postgresql table partitioning
summary: Partitioning splits a huge table into smaller pieces so queries scan only relevant partitions and old data is easy to archive.

**Partitioning** splits one logical table into several physical tables inside the same database. Queries that filter by the partition key only touch the relevant partitions (**partition pruning**).

```sql
CREATE TABLE logs (
  id         BIGSERIAL,
  message    TEXT,
  created_at TIMESTAMPTZ NOT NULL
) PARTITION BY RANGE (created_at);

CREATE TABLE logs_2025_01 PARTITION OF logs
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE logs_2025_02 PARTITION OF logs
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
```

Types: **RANGE** (dates), **LIST** (country/region), **HASH** (spread evenly).

Why it helps with large data:

* Queries for "last 7 days" scan one small partition, not the whole table (avoids full scans).
* **Archive old data** by detaching or dropping a partition: `DROP TABLE logs_2025_01;` is instant, unlike a huge `DELETE`.
* Indexes and vacuum work on smaller pieces.

### Key Points
* Pick a partition key that appears in most queries (usually time).
* Partitioning is for big tables (tens of millions of rows and up).
* Interview tip: "I scale large datasets with partitioning and archive old data."

## Replication
video: postgresql replication primary replica
summary: Replication copies data from a primary to replicas for high availability and read scaling.

**Replication** keeps copies of the same data on multiple servers.

```text
          writes
Clients -------> PRIMARY ----(WAL stream)----> REPLICA 1  <--- reads
                                          \--> REPLICA 2  <--- reads
```

* The **primary** accepts reads and writes.
* **Replicas** receive changes via the write-ahead log (WAL) and serve read-only queries.
* If the primary dies, a replica can be **promoted** (failover) - high availability.

Types:

* **Asynchronous** - primary doesn't wait for replicas; fast, but a replica can lag and a crash may lose the last few transactions.
* **Synchronous** - primary waits for a replica to confirm; safer, but slower.

Because of **replication lag**, a user may write something and not see it immediately on a replica. Solutions: read your own writes from the primary, or route critical reads to the primary.

### Key Points
* Scales reads, not writes.
* Gives backup and failover capability.
* Expect eventual consistency on async replicas.

## Sharding
video: database sharding explained
summary: Sharding splits data across multiple servers by a shard key, scaling writes and storage horizontally.

**Sharding** divides a very large dataset across several independent database servers. Each server (shard) holds only a portion of the data, so both storage and write load are spread out (horizontal scaling).

```text
              Router / App logic
        shard_key = user_id % 3
         /          |          \
   Shard 0      Shard 1      Shard 2
 (users 0,3..) (users 1,4..) (users 2,5..)
```

Common strategies:

* **Hash-based** - hash(key) decides the shard; even distribution.
* **Range-based** - ids 1-1M on shard 1, etc.; simple but can create hot shards.
* **Directory-based** - a lookup table maps keys to shards.

Challenges: cross-shard joins and transactions are hard, re-balancing when adding shards is painful, and a bad shard key creates "hot" shards. Postgres has no built-in automatic sharding; use extensions like Citus or handle it in the application.

### Key Points
* Use only when a single server (even with replicas and partitioning) cannot cope.
* Choose the shard key carefully - it is very hard to change later.
* Sharding = different data on different servers; replication = same data on many servers.

## Caching with Redis
video: redis caching database
summary: Store frequently read data in Redis memory to cut database load and return responses faster.

**Caching** keeps frequently used data in fast memory so the database is hit less often. **Redis** is the most popular in-memory store for this.

The standard pattern is **cache-aside**:

```text
1. App checks Redis for key "user:42"
2. HIT  -> return it (sub-millisecond)
3. MISS -> query PostgreSQL, store in Redis with a TTL, return it
```

```js
async function getUser(id) {
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);

  const { rows } = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
  await redis.set(`user:${id}`, JSON.stringify(rows[0]), 'EX', 300); // 5 min TTL
  return rows[0];
}
```

The hard part is **invalidation**: when the user changes, delete or update the cached key, or accept data being stale until the TTL expires.

Good candidates: read-heavy, rarely changing data (profiles, product pages, config). Bad candidates: data that must always be exact (account balances).

### Key Points
* Reduces DB load and latency under high read traffic.
* Always set a TTL; plan invalidation.
* Cache is an optimization, never the source of truth.

## Performance Checklist
video: postgresql performance tuning
summary: A short checklist of indexing, caching and avoiding N+1 queries to keep PostgreSQL fast.

A quick checklist when an app feels slow:

1. **Indexing** - right indexes for `WHERE`, `JOIN`, `ORDER BY`.
2. **Redis caching** - for hot, read-heavy data.
3. **Avoid N+1 queries** - the classic ORM mistake.
4. **Pagination** - never fetch everything.
5. **Connection pooling** - PgBouncer / app pool.
6. **Partition or archive** old data.

**The N+1 problem:** you run 1 query to get a list, then 1 more query per item.

```js
// BAD: 1 + N queries
const users = await db.query('SELECT * FROM users LIMIT 100');
for (const u of users.rows) {
  u.orders = await db.query('SELECT * FROM orders WHERE user_id=$1', [u.id]); // 100 extra queries
}
```

```sql
-- GOOD: one query with a JOIN, or one query using IN / ANY
SELECT * FROM orders WHERE user_id = ANY($1);   -- pass all ids at once
```

With ORMs (Prisma, Sequelize, TypeORM), use eager loading (`include`, `relations`) to avoid N+1.

### Key Points
* Measure with `EXPLAIN ANALYZE` and slow-query logs (`pg_stat_statements`).
* Fix the biggest bottleneck first.
* Interview tip: "I optimize by indexing, caching, and eliminating N+1 queries."
