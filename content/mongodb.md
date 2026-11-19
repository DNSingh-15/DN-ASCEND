---
name: MongoDB
icon: 🍃
category: Database
track: fullstack
color: #47a248
order: 9.3
description: MongoDB is a popular open-source NoSQL document database that stores flexible JSON-like documents and scales with replication and sharding.
---

# Step 1: MongoDB Basics

## What is MongoDB
video: mongodb tutorial for beginners
summary: MongoDB is a document database that stores flexible JSON-like records instead of fixed rows and columns.

MongoDB is a **NoSQL document database**. Instead of tables with fixed columns, you store self-contained **documents** that look like JSON objects. Each document can have its own shape, so the schema can evolve as your product changes, and related data can live together in one record.

### Why developers use it
* **Flexible schema** - add fields without a migration of the whole table.
* **Natural fit for JavaScript** - a document maps almost 1:1 to an object in your code.
* **Built-in scaling** - replica sets for availability, sharding for horizontal scale.
* **Rich queries** - filters, indexes, aggregation pipelines, text search and vector search.

### Common use cases
* Product catalogs where items have different attributes
* Content management, user profiles, event and activity feeds
* Real-time analytics, IoT data, logs
* Apps that change quickly and need a flexible schema

### Try it in mongosh
```js
// mongosh is the MongoDB shell (JavaScript based)
use shop                       // switch to (or lazily create) the "shop" database

db.products.insertOne({
  name: "Keyboard",
  price: 49.99,
  tags: ["usb", "mechanical"]
})

db.products.find({ price: { $lt: 100 } })
```

The database and collection are created automatically the first time you write to them.

### Key Points
* MongoDB = document database, data stored as BSON (binary JSON).
* Flexible does not mean "no design" - you still model data around your queries.
* Interview tip: say "MongoDB is NoSQL, but it supports ACID transactions, indexes and joins ($lookup)."

## Documents, Collections and BSON
video: mongodb documents collections bson explained
summary: Documents live in collections inside databases, and are stored on disk as BSON with extra types.

The building blocks are simple. A **database** holds **collections**, and a collection holds **documents**. A document is a set of field-value pairs, similar to a JSON object, and is stored internally as **BSON** (Binary JSON), which adds types that plain JSON lacks.

| SQL term | MongoDB term |
|----------|--------------|
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Field |
| Primary key | `_id` field |
| JOIN | `$lookup` or embedding |

### A sample document
```json
{
  "_id": { "$oid": "665f1a2b3c4d5e6f7a8b9c0d" },
  "name": "Asha",
  "email": "asha@example.com",
  "age": 27,
  "address": { "city": "Pune", "pin": "411001" },
  "skills": ["node", "react", "mongodb"],
  "createdAt": { "$date": "2025-01-15T10:30:00Z" }
}
```

### What BSON adds
* **ObjectId** - 12-byte unique id, the default `_id`. It embeds a timestamp, so it roughly sorts by creation time.
* **Date** - a real date type, not a string.
* **Int32, Int64, Double, Decimal128** - proper numeric types. Use `Decimal128` for money.
* **Binary data**, **Boolean**, **Null**, **Array**, **Embedded document**.

### Rules to remember
* Every document has a unique **`_id`**. If you do not supply one, MongoDB creates an ObjectId.
* A document can be at most **16 MB**.
* Field names are case sensitive. Documents in one collection may have different fields.
* Nested documents and arrays are first-class, so you can query inside them with dot notation: `"address.city"`.

```js
db.users.find({ "address.city": "Pune" })
db.users.find({ skills: "node" })        // matches arrays that contain "node"
```

### Key Points
* Collection = group of documents; it does not enforce a schema unless you add validation.
* `_id` is always indexed and unique.
* BSON has more types than JSON (ObjectId, Date, Decimal128).
* Interview tip: "BSON is binary, faster to parse and supports more data types than JSON."

## MongoDB vs PostgreSQL
video: mongodb vs postgresql when to use
summary: Compare the document model with the relational model so you can pick the right database for the job.

Both are excellent, mature databases. **PostgreSQL** is relational: fixed schema, strong joins, and ACID by default. **MongoDB** is document-oriented: flexible schema, data that is read together is stored together, and horizontal scaling is built in. The right choice depends on your data shape and access patterns.

| Topic | PostgreSQL | MongoDB |
|-------|-----------|---------|
| Data model | Tables, rows, columns | Collections, JSON-like documents |
| Schema | Strict, enforced by default | Flexible, optional validation |
| Relationships | Foreign keys and JOINs | Embedding or references, `$lookup` |
| Query language | SQL | MQL (query operators, aggregation pipeline) |
| Transactions | Fully ACID, always | ACID, multi-document needs a replica set |
| Scaling | Vertical first, read replicas, extensions for sharding | Native sharding (horizontal) |
| JSON | JSONB column inside a relational row | JSON is the native model |

### Choose MongoDB when
* Data is hierarchical or varies a lot between records (catalogs, CMS, profiles).
* You read a whole "aggregate" (an order with its items) most of the time.
* The schema changes often, or you need to scale writes across many machines.

### Choose PostgreSQL when
* Data is highly relational with many-to-many links and complex reports.
* You need strict integrity (foreign keys, constraints) everywhere.
* You run lots of ad-hoc analytical SQL with joins.

### The same query in both
```js
// MongoDB: orders with their items embedded, one read
db.orders.findOne({ _id: 101 })
```

```sql
-- PostgreSQL: two tables joined
SELECT o.id, i.product, i.qty
FROM orders o
JOIN order_items i ON i.order_id = o.id
WHERE o.id = 101;
```

### Key Points
* Neither is "better" - it is a trade-off between flexibility and strictness.
* Both support transactions, indexes, JSON and replication today.
* Interview tip: start from the access pattern and the data shape, not from the tool.

# Step 2: CRUD Operations

## Insert and Find
video: mongodb insertOne insertMany find tutorial
summary: Use insertOne, insertMany and find with filters, projections, sort, limit and skip to create and read data.

CRUD stands for Create, Read, Update, Delete. You create documents with **`insertOne`** and **`insertMany`**, and read them with **`find`** (many) or **`findOne`** (first match). `find` takes a **filter** and an optional **projection** that decides which fields come back.

### Insert
```js
db.users.insertOne({ name: "Asha", age: 27, skills: ["node", "react"] })

db.users.insertMany([
  { name: "Ravi", age: 31, city: "Delhi" },
  { name: "Meera", age: 24, city: "Pune" }
])
// returns { acknowledged: true, insertedIds: {...} }
```

`insertMany` is ordered by default: it stops at the first error. Pass `{ ordered: false }` to keep going and insert the rest.

### Find
```js
db.users.find()                              // all documents
db.users.find({ city: "Pune" })              // filter (equality)
db.users.findOne({ name: "Asha" })           // first match only

// find(filter, projection)
db.users.find({ city: "Pune" }, { name: 1, age: 1, _id: 0 })
```

### Projection rules
* `1` includes a field, `0` excludes it.
* You cannot mix include and exclude in one projection, except for `_id`.
* `_id` is returned unless you set `_id: 0`.

### Sort, limit and skip
```js
db.users.find({ city: "Pune" })
  .sort({ age: -1 })     // 1 = ascending, -1 = descending
  .skip(20)
  .limit(10)

db.users.countDocuments({ city: "Pune" })
```

Pagination with `skip` gets slower as the offset grows, because MongoDB still walks past the skipped documents. For big collections, use **range pagination**: remember the last `_id` and query `{ _id: { $gt: lastId } }`.

### In the Node.js driver
```js
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const users = client.db("shop").collection("users");

await users.insertOne({ name: "Asha", age: 27 });
const adults = await users
  .find({ age: { $gte: 18 } })
  .project({ name: 1, _id: 0 })
  .sort({ age: -1 })
  .limit(10)
  .toArray();
```

### Key Points
* `find` returns a cursor; call `.toArray()` in the driver (the shell prints the first batch).
* Always project only the fields you need.
* Prefer range pagination over a large `skip`.
* Interview tip: `find()` with no filter on a big collection is a full collection scan.

## Query Operators
video: mongodb query operators gt in and or regex
summary: Operators such as $gt, $in, $and, $or, $regex, $exists and $elemMatch let you express precise filters.

A filter like `{ age: 27 }` is an equality match. To express anything else you use **query operators**, which always start with `$` and are written as `{ field: { $operator: value } }`. Learn the comparison, logical, element and array operators and you can express most real queries.

### Comparison
```js
db.products.find({ price: { $eq: 50 } })        // same as { price: 50 }
db.products.find({ price: { $gt: 10, $lte: 100 } })  // 10 < price <= 100
db.products.find({ category: { $in: ["books", "toys"] } })
db.products.find({ category: { $nin: ["books"] } })
db.products.find({ status: { $ne: "archived" } })
```

Other comparison operators: `$gte`, `$lt`. Several operators on the same field are combined with AND.

### Logical
```js
// $and is implicit between separate fields
db.users.find({ city: "Pune", age: { $gte: 18 } })

// $or needs an array of conditions
db.users.find({
  $or: [{ city: "Pune" }, { age: { $lt: 21 } }]
})

db.users.find({
  $and: [{ age: { $gte: 18 } }, { age: { $lte: 30 } }]
})

db.users.find({ age: { $not: { $gt: 30 } } })
```

### Element and text matching
```js
db.users.find({ phone: { $exists: true } })      // field is present
db.users.find({ age: { $type: "int" } })

// regex (case-insensitive); a prefix regex like /^as/ can use an index
db.users.find({ name: { $regex: /^as/i } })
```

### Arrays
```js
db.users.find({ skills: "node" })                       // array contains value
db.users.find({ skills: { $all: ["node", "react"] } })  // contains all
db.users.find({ skills: { $size: 3 } })                 // exact length
```

`$elemMatch` makes **several conditions apply to the same array element**:

```js
// document: { name: "Order1", items: [ { sku: "A", qty: 5 }, { sku: "B", qty: 1 } ] }

// Matches if ANY item has sku "A" AND qty > 3 on the SAME element
db.orders.find({ items: { $elemMatch: { sku: "A", qty: { $gt: 3 } } } })

// Without $elemMatch the two conditions can match different elements
db.orders.find({ "items.sku": "A", "items.qty": { $gt: 3 } })
```

### Key Points
* Operators start with `$`; field names should not.
* Use `$elemMatch` when multiple conditions must hit one array element.
* Unanchored or case-insensitive `$regex` usually cannot use an index efficiently.
* Interview tip: explain the difference between `$in` (any of these values) and `$all` (all of these values).

## Update and Delete
video: mongodb updateOne updateMany set inc push deleteMany
summary: Update with operators like $set, $inc and $push, use upsert and bulkWrite, and delete safely.

An update takes a **filter** to choose documents and an **update document** made of update operators. Never pass a plain document as the second argument of `updateOne`; always use operators such as `$set`, or you will get an error (or, with `replaceOne`, replace the whole document).

### Update operators
```js
db.users.updateOne(
  { email: "asha@example.com" },
  {
    $set:   { city: "Mumbai", "address.pin": "400001" },
    $inc:   { loginCount: 1 },
    $unset: { tempToken: "" }
  }
)

db.users.updateMany({ city: "Pune" }, { $set: { region: "West" } })
```

### Array update operators
```js
db.users.updateOne({ _id: 1 }, { $push:     { skills: "docker" } })   // always adds
db.users.updateOne({ _id: 1 }, { $addToSet: { skills: "docker" } })   // adds only if missing
db.users.updateOne({ _id: 1 }, { $pull:     { skills: "php" } })      // removes matching
db.users.updateOne({ _id: 1 }, { $pop:      { skills: 1 } })          // removes last (-1 = first)
```

### Upsert
`upsert: true` updates the document if it exists, otherwise **inserts** a new one built from the filter and the update.

```js
db.counters.updateOne(
  { _id: "pageViews" },
  { $inc: { count: 1 } },
  { upsert: true }
)
```

### findOneAndUpdate
Updates a document and returns it in one atomic step. Useful for counters, queues and locks.

```js
const doc = await jobs.findOneAndUpdate(
  { status: "pending" },
  { $set: { status: "running" } },
  { returnDocument: "after", sort: { createdAt: 1 } }
);
```

### Delete
```js
db.users.deleteOne({ _id: 1 })
db.sessions.deleteMany({ expiresAt: { $lt: new Date() } })
// db.users.deleteMany({})   <- deletes EVERY document in the collection
```

### bulkWrite
Send many operations in one round trip.

```js
await db.collection("products").bulkWrite([
  { insertOne:  { document: { sku: "A1", stock: 10 } } },
  { updateOne:  { filter: { sku: "B2" }, update: { $inc: { stock: -1 } } } },
  { deleteOne:  { filter: { sku: "OLD" } } }
], { ordered: false });
```

### Key Points
* A single-document update is **atomic**, even when it changes many fields or nested arrays.
* `$push` can create duplicates; `$addToSet` cannot.
* Check `matchedCount` and `modifiedCount` in the result.
* Interview tip: "Single-document operations are atomic, which is why embedding is so useful."

# Step 3: Indexes and Performance

## Indexing
video: mongodb indexes explained compound index
summary: Indexes make queries fast by avoiding full collection scans, at the cost of slower writes and extra storage.

Without an index, MongoDB must read every document to answer a query (a **COLLSCAN**). An **index** is a sorted structure (a B-tree) that lets MongoDB jump straight to matching documents. Indexes speed up reads, but each one costs extra disk, memory and write time, so index what you actually query.

### Index types
```js
// Single field
db.users.createIndex({ email: 1 })

// Unique index (rejects duplicates)
db.users.createIndex({ email: 1 }, { unique: true })

// Compound index (order of fields matters)
db.orders.createIndex({ userId: 1, createdAt: -1 })

// Multikey: indexing an array field creates one entry per element
db.users.createIndex({ skills: 1 })

// Text index for word search
db.articles.createIndex({ title: "text", body: "text" })
db.articles.find({ $text: { $search: "mongodb index" } })

// TTL index: deletes documents automatically after the time passes
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 })

// Partial index: only index documents that match a filter
db.orders.createIndex(
  { userId: 1 },
  { partialFilterExpression: { status: "open" } }
)
```

### Compound index and the ESR rule
A compound index is used from its **left-most prefix**. The index `{ a: 1, b: 1, c: 1 }` supports queries on `a`, on `a, b` and on `a, b, c`, but not on `b` alone.

Order the fields using **ESR: Equality, Sort, Range**.

1. **Equality** fields first (exact matches).
2. **Sort** fields next (so the index can return sorted results).
3. **Range** fields last (`$gt`, `$lt`, `$in` with many values).

```js
// Query: status equals "open", sorted by createdAt, amount greater than 100
db.orders.find({ status: "open", amount: { $gt: 100 } }).sort({ createdAt: -1 })

// ESR index
db.orders.createIndex({ status: 1, createdAt: -1, amount: 1 })
```

### Manage indexes
```js
db.users.getIndexes()
db.users.dropIndex("email_1")
```

### Key Points
* `_id` has a unique index automatically.
* Compound index order matters; follow **ESR** and the left-most prefix rule.
* TTL indexes are great for sessions, OTPs and temporary logs.
* Too many indexes slow down writes and eat RAM.
* Interview tip: an index on an array field is called a **multikey** index.

## Query Optimization
video: mongodb explain executionStats query performance
summary: Use explain("executionStats") to see whether a query uses an index and how many documents it examines.

To tune a query, ask MongoDB how it ran it. The **`explain("executionStats")`** method shows the winning plan and real numbers. The key is to compare **documents examined** with **documents returned**: they should be close.

```js
db.orders.find({ userId: 42, status: "open" }).explain("executionStats")
```

### What to read in the output
```json
{
  "queryPlanner": {
    "winningPlan": {
      "stage": "FETCH",
      "inputStage": { "stage": "IXSCAN", "indexName": "userId_1_status_1" }
    }
  },
  "executionStats": {
    "nReturned": 12,
    "totalKeysExamined": 12,
    "totalDocsExamined": 12,
    "executionTimeMillis": 2
  }
}
```

| Signal | Meaning |
|--------|---------|
| `COLLSCAN` | Full collection scan, usually bad on big collections |
| `IXSCAN` | An index was used |
| `FETCH` | Documents were loaded after the index lookup |
| `SORT` | An in-memory sort happened because no index supports it |
| `totalDocsExamined` much higher than `nReturned` | The index is not selective enough |

### Covered queries
If every field in the filter **and** the projection is in one index, MongoDB answers from the index alone and never reads the documents.

```js
db.users.createIndex({ email: 1, name: 1 })
db.users.find({ email: "a@x.com" }, { _id: 0, name: 1 })   // covered
```

### Optimization checklist
* Add an index for filters and sorts that run often.
* Use projection to return fewer fields.
* Avoid large `skip` values; use range pagination.
* Avoid unanchored regex and `$where`.
* Use the **profiler** or Atlas Performance Advisor to find slow queries.

```js
db.setProfilingLevel(1, { slowms: 100 })   // log operations slower than 100 ms
db.system.profile.find().sort({ ts: -1 }).limit(5)
```

### Key Points
* Look for `IXSCAN` instead of `COLLSCAN`, and a low docs-examined to returned ratio.
* An in-memory `SORT` stage is a hint that the index should include the sort field.
* Interview tip: walk through "run explain, read the stage, add or reorder an index, run explain again."

## Aggregation Pipeline
video: mongodb aggregation pipeline tutorial
summary: Chain stages like $match, $group, $sort and $project so documents flow through and get transformed.

The **aggregation pipeline** processes documents through an ordered list of **stages**. Each stage takes the output of the previous one, so you can filter, reshape, group and compute step by step. It is MongoDB's answer to SQL `WHERE`, `GROUP BY`, `HAVING` and `SELECT` combined.

```flow
title: Aggregation pipeline
direction: right
orders collection | input documents
$match | keep only paid orders
$group | total per customer
$sort | highest total first
$limit | top 5
Result | output documents
```

### Core stages
| Stage | Purpose |
|-------|---------|
| `$match` | Filter documents (like `WHERE`) |
| `$group` | Group and compute with `$sum`, `$avg`, `$min`, `$max`, `$push` |
| `$project` | Include, exclude or compute fields |
| `$sort` | Sort documents |
| `$limit` / `$skip` | Restrict results |
| `$unwind` | Turn an array into one document per element |
| `$lookup` | Left outer join with another collection |
| `$facet` | Run several sub-pipelines on the same input |

### Example: top customers by spending
```js
db.orders.aggregate([
  { $match: { status: "paid", createdAt: { $gte: ISODate("2025-01-01") } } },
  { $group: {
      _id: "$customerId",
      totalSpent: { $sum: "$amount" },
      orders: { $sum: 1 }
  } },
  { $sort: { totalSpent: -1 } },
  { $limit: 5 },
  { $project: { _id: 0, customerId: "$_id", totalSpent: 1, orders: 1 } }
])
```

Field paths in expressions start with `$`, for example `"$amount"`.

### $unwind and $facet
```js
// Count how many users have each skill
db.users.aggregate([
  { $unwind: "$skills" },
  { $group: { _id: "$skills", users: { $sum: 1 } } },
  { $sort: { users: -1 } }
])

// Several results in one query: products by category AND a price histogram
db.products.aggregate([
  { $facet: {
      byCategory: [ { $group: { _id: "$category", n: { $sum: 1 } } } ],
      priceBuckets: [ { $bucket: { groupBy: "$price", boundaries: [0, 50, 100, 500], default: "500+" } } ]
  } }
])
```

### Performance tips
* Put **`$match` (and `$sort`, `$limit`) as early as possible** so indexes are used and fewer documents flow downstream.
* `$match` at the very start of a pipeline can use an index.
* Stages have a memory limit (100 MB). Use `{ allowDiskUse: true }` for large groups, or reduce the data early.

### Key Points
* Order of stages matters: filter first, shape later.
* `$group` with `_id: null` calculates totals over the whole input.
* Use `$facet` for dashboards that need many aggregates in one round trip.
* Interview tip: compare `$group` to SQL `GROUP BY` and `$match` to `WHERE`.

## $lookup and Joins
video: mongodb lookup join aggregation
summary: $lookup performs a left outer join between collections, but needs care for performance.

MongoDB is not a relational database, but it can still join data. The **`$lookup`** stage performs a **left outer join**: for each input document it finds matching documents in another collection and adds them as an **array** field.
### Basic $lookup
```js
// orders: { _id, customerId, total }   customers: { _id, name, city }
db.orders.aggregate([
  { $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customer"
  } },
  { $unwind: "$customer" }                  // turn the 1-element array into an object
])
```

If nothing matches, `customer` is an empty array. `$unwind` drops those documents unless you set `preserveNullAndEmptyArrays: true`.

### Pipeline form (extra conditions)
```js
db.orders.aggregate([
  { $lookup: {
      from: "payments",
      let: { orderId: "$_id" },
      pipeline: [
        { $match: { $expr: { $and: [
            { $eq: ["$orderId", "$$orderId"] },
            { $eq: ["$status", "success"] }
        ] } } },
        { $project: { _id: 0, amount: 1 } }
      ],
      as: "payments"
  } }
])
```

### Performance rules
* Index the **foreignField** (`customers._id` is already indexed; add one for other fields).
* `$match` early, so you look up fewer documents.
* Lookups run per input document, so a join on millions of rows is slow. If you always need the joined data, **embed it** instead.
* Frequent `$lookup` on hot paths often means the schema should be reshaped.

### Key Points
* `$lookup` = left outer join, result is an array in the `as` field.
* Use the `let` + `pipeline` form for conditions beyond simple equality.
* Interview tip: "If I join all the time, I should probably embed or denormalize."

# Step 4: Data Modeling

## Data Modeling
video: mongodb data modeling schema design patterns
summary: Design documents around how the app reads and writes data, not around normalized tables.

In SQL you normalize first and decide queries later. In MongoDB you do the opposite: **model data for your access patterns**. The guiding rule is "**data that is accessed together should be stored together**". That makes common reads a single document fetch with no join.

### Steps to model
1. List the **queries and writes** the app will run, and how often.
2. Identify the entities and their **relationships** (1:1, 1:few, 1:many, many:many).
3. Decide per relationship: **embed** or **reference**.
4. Validate against the queries, then add indexes.

### Relationship patterns
| Pattern | Typical approach | Example |
|---------|------------------|---------|
| One-to-one | Embed | user and profile settings |
| One-to-few | Embed an array | user and 3 addresses |
| One-to-many | Reference from the many side (or embed if bounded) | blog post and comments |
| One-to-squillions | Reference from the child to the parent | server and millions of log lines |
| Many-to-many | Arrays of references on one or both sides | students and courses |

### Example: blog post
```json
{
  "_id": 1,
  "title": "Learning MongoDB",
  "author": { "id": 7, "name": "Asha" },
  "tags": ["db", "nosql"],
  "comments": [
    { "user": "Ravi", "text": "Nice post", "at": "2025-02-01T10:00:00Z" }
  ]
}
```

Here the author name is **copied** (denormalized) because the post list always shows it. The cost is that a rename must update every copy. This is a deliberate trade-off.

### Useful patterns
* **Subset pattern** - embed only the latest 10 comments, keep the rest in another collection.
* **Bucket pattern** - group time-series points (for example one document per sensor per hour).
* **Computed pattern** - store precomputed totals (`commentCount`) instead of counting each time.
* **Extended reference** - copy only the few fields of a related document that you need to display.

### Key Points
* Model for queries; there is no single "correct" normalized form.
* Avoid **unbounded arrays**: a document can never exceed **16 MB**.
* Duplicating data speeds up reads but you must keep copies in sync.
* Interview tip: "I design for the most frequent read and keep writes atomic within one document."

## Embedding vs Referencing
video: mongodb embedding vs referencing
summary: Embed related data for fast reads and atomic updates, or reference it when it is large, shared or unbounded.

There are two ways to relate data. **Embedding** nests the related data inside the parent document. **Referencing** stores the `_id` of the other document, like a foreign key, and you fetch it with a second query or `$lookup`. Pick based on how the data is read, how big it grows, and how often it changes.

### Embedded
```json
{
  "_id": 101,
  "customer": "Asha",
  "items": [
    { "sku": "A1", "qty": 2, "price": 20 },
    { "sku": "B7", "qty": 1, "price": 55 }
  ]
}
```

### Referenced
```json
// orders
{ "_id": 101, "customerId": 7, "itemIds": [11, 12] }

// customers
{ "_id": 7, "name": "Asha", "email": "asha@example.com" }
```

### Decision guide
| Embed when | Reference when |
|------------|----------------|
| Data is read together almost always | Data is read on its own often |
| Relationship is 1:1 or 1:few | Relationship is 1:many (large) or many:many |
| Child data has no meaning without the parent | The child is shared by many parents |
| Child is small and bounded | Child can grow without limit |
| You want an atomic update of parent and child | The child changes frequently and independently |

### Pitfalls
* Embedding a growing array (comments, logs) can hit the **16 MB** limit and makes the document large and slow to rewrite.
* Referencing too much brings back the joins you wanted to avoid.
* Embedded copies of shared data (a user's name inside many posts) go stale unless you update them.

### Hybrid is common
Embed a small summary and reference the full record:

```json
{
  "_id": 500,
  "title": "Learning MongoDB",
  "author": { "id": 7, "name": "Asha" },
  "recentComments": [ { "user": "Ravi", "text": "Nice" } ],
  "commentCount": 238
}
```

### Key Points
* Default to **embedding** for data used together; use references for large, shared or unbounded data.
* Atomicity is per document, so embedding gives you atomic updates without a transaction.
* Interview tip: always mention the 16 MB limit and unbounded arrays when discussing embedding.

## Schema Validation
video: mongodb schema validation jsonSchema
summary: Add a $jsonSchema validator to enforce required fields and types while keeping MongoDB flexible.

MongoDB does not force a schema by default, but you can add rules with a **validator**. The most common validator uses **`$jsonSchema`**. It checks documents on insert and update, so bad data is rejected at the database level, even if it comes from a script or another service.

### Create a collection with validation
```js
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "age"],
      properties: {
        name:  { bsonType: "string", minLength: 2 },
        email: { bsonType: "string", pattern: "^.+@.+$" },
        age:   { bsonType: "int", minimum: 0, maximum: 120 },
        role:  { enum: ["user", "admin"] },
        skills: { bsonType: "array", items: { bsonType: "string" } }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
})
```

### Add or change a validator later
```js
db.runCommand({
  collMod: "users",
  validator: { $jsonSchema: { bsonType: "object", required: ["name", "email"] } },
  validationLevel: "moderate"
})
```

### Options
| Option | Values | Meaning |
|--------|--------|---------|
| `validationLevel` | `strict` (default) | Validate all inserts and updates |
| | `moderate` | Validate inserts and updates to documents that already pass; skip existing invalid ones |
| `validationAction` | `error` (default) | Reject the write |
| | `warn` | Allow the write, log a warning |

### What happens on failure
```js
db.users.insertOne({ name: "A" })
// MongoServerError: Document failed validation
```

### Key Points
* Validation gives you flexibility plus safety: strict where it matters, free elsewhere.
* Use `validationAction: "warn"` and `moderate` to roll out rules on existing data safely.
* Unique rules are not part of `$jsonSchema`; use a **unique index**.
* Interview tip: "MongoDB is schema-flexible, not schema-less. I add validation for critical fields."

# Step 5: Production MongoDB

## Transactions
video: mongodb transactions session withTransaction
summary: Multi-document ACID transactions let you update several documents or collections atomically.

Every write to a single document is already atomic. When you must change **several documents or collections together** (for example, move money between two accounts) you use a **multi-document transaction**. It follows ACID: all operations commit together or none of them do. Transactions require a **replica set** (or sharded cluster).

### Node.js driver with withTransaction
```js
const session = client.startSession();

try {
  await session.withTransaction(async () => {
    const accounts = client.db("bank").collection("accounts");

    const debit = await accounts.updateOne(
      { _id: "A", balance: { $gte: 100 } },
      { $inc: { balance: -100 } },
      { session }
    );
    if (debit.modifiedCount === 0) throw new Error("Insufficient funds");

    await accounts.updateOne(
      { _id: "B" },
      { $inc: { balance: 100 } },
      { session }
    );
  }, {
    readConcern:  { level: "snapshot" },
    writeConcern: { w: "majority" }
  });
} finally {
  await session.endSession();
}
```

`withTransaction` starts the transaction, **commits** it, and **automatically retries** on transient errors. If the callback throws, the transaction is aborted. Every operation inside must pass `{ session }`.

### Rules and costs
* Needs a **replica set**. A standalone `mongod` cannot run transactions.
* Keep transactions **short**; there is a default time limit of 60 seconds.
* They add overhead (locks, extra memory), so do not use them for everything.
* Good schema design (embedding) often removes the need for a transaction.

### Key Points
* Single-document writes are atomic without a transaction.
* Use `session.withTransaction` and pass the `session` to every operation.
* Interview tip: "Transactions work, but I model data so that most operations touch one document."

## Replication
video: mongodb replica set explained primary secondary election
summary: A replica set keeps copies of data on several servers for high availability and automatic failover.

A **replica set** is a group of `mongod` servers that hold the same data. One member is the **primary** and receives all writes. The others are **secondaries** that copy the primary's changes from its **oplog**. If the primary fails, the remaining members hold an **election** and one secondary becomes the new primary, usually within seconds.

```flow
title: Replica set
direction: right
Application | driver connects to the replica set
Primary | accepts all writes
Secondary 1 || Secondary 2
Election | if primary fails, a secondary wins
```

### Key facts
* Use an **odd number** of voting members (typically 3) so a majority can always be found.
* An **arbiter** votes but holds no data (avoid it when you can).
* The driver discovers topology and **fails over automatically**; use a connection string with the replica set name.

```bash
mongodb://host1:27017,host2:27017,host3:27017/shop?replicaSet=rs0
```

### Write concern
How many members must confirm a write before it counts as successful.

```js
db.orders.insertOne(
  { item: "A1", qty: 1 },
  { writeConcern: { w: "majority", wtimeout: 5000 } }
)
```

* `w: 1` - only the primary acknowledges (fast, can be lost on failover).
* **`w: "majority"`** - most members have it, so it survives a failover. This is the recommended setting for important data.

### Read preference
Where reads are sent.

| Mode | Behaviour |
|------|-----------|
| `primary` (default) | Always the primary, freshest data |
| `primaryPreferred` | Primary, but a secondary if the primary is down |
| `secondary` | Secondaries only, may be slightly stale |
| `secondaryPreferred` | Secondary if available |
| `nearest` | Lowest network latency |

```js
const users = db.collection("users", { readPreference: "secondaryPreferred" });
```

### Key Points
* Replication gives **high availability**, not horizontal write scaling.
* Use `w: "majority"` for data you cannot lose.
* Reading from secondaries can return stale data (replication lag).
* Interview tip: explain primary, secondary, oplog and election in one breath.

## Sharding
video: mongodb sharding explained shard key
summary: Sharding splits a large collection across servers by a shard key to scale storage and throughput horizontally.

When one replica set cannot hold the data or handle the traffic, you **shard**: the collection is split into **chunks** by a **shard key** and the chunks are spread across several **shards** (each shard is itself a replica set). Sharding scales out writes and storage, but it adds complexity, so use it only when you need it.

```flow
title: Sharded cluster
Application | uses the normal driver
mongos | router that sends each query to the right shard
Config servers | store cluster metadata and chunk ranges
Shard 1 || Shard 2 || Shard 3
```

### Components
* **mongos** - the query router your app connects to.
* **Config servers** - a replica set that stores which chunk lives on which shard.
* **Shards** - replica sets that hold the actual data.

### Enable sharding
```js
sh.enableSharding("shop")

// Ranged shard key
sh.shardCollection("shop.orders", { customerId: 1 })

// Hashed shard key (spreads writes evenly)
sh.shardCollection("shop.events", { userId: "hashed" })
```

### Choosing a shard key
A good shard key has:
* **High cardinality** - many distinct values.
* **Even distribution** - no single value gets most of the traffic.
* **Query isolation** - common queries include the key, so `mongos` targets one shard instead of all.
* **Non-monotonic values** - avoid keys that only increase.

| Key type | Strength | Weakness |
|----------|----------|----------|
| Ranged | Efficient range queries on the key | Risk of hot spots |
| Hashed | Even write distribution | Range queries scatter across all shards |

### Common problems
* **Hot shard** - a monotonically increasing key (timestamp, ObjectId) sends all new writes to one shard. Use a hashed key or a compound key.
* **Jumbo chunks** - chunks that cannot be split because many documents share the same key value. Pick a higher-cardinality key.
* **Scatter-gather queries** - queries without the shard key must ask every shard.

### Key Points
* The shard key is hard to get right; changing it later is possible (resharding) but expensive.
* Queries that include the shard key are routed to specific shards.
* Interview tip: "Replication is for availability, sharding is for scale."

## Mongoose with Node.js
video: mongoose tutorial node js mongodb
summary: Mongoose is an ODM that adds schemas, validation, models and populate on top of the MongoDB driver.

**Mongoose** is the most popular ODM (Object Data Modeling) library for Node.js. It sits on top of the official driver and gives you **schemas**, **models**, validation, middleware and helpers like `populate`. You define the shape in the app, and Mongoose enforces it before sending data to MongoDB.

### Connect
```js
import mongoose from "mongoose";

await mongoose.connect(process.env.MONGODB_URI);
```

### Schema and model
```js
import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name:  { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, unique: true, lowercase: true },
    age:   { type: Number, min: 0, max: 120 },
    role:  { type: String, enum: ["user", "admin"], default: "user" }
  },
  { timestamps: true }          // adds createdAt and updatedAt
);

userSchema.index({ email: 1 });

export const User = model("User", userSchema);   // collection: "users"
```

### CRUD with a model
```js
const user = await User.create({ name: "Asha", email: "ASHA@example.com" });

const found = await User.findOne({ email: "asha@example.com" });
const adults = await User.find({ age: { $gte: 18 } }).sort({ age: -1 }).limit(10);

await User.findByIdAndUpdate(user._id, { $inc: { age: 1 } }, { new: true });
await User.deleteOne({ _id: user._id });
```

### Populate (reference to another model)
```js
const postSchema = new Schema({
  title:  String,
  author: { type: Schema.Types.ObjectId, ref: "User" }
});
const Post = model("Post", postSchema);

const posts = await Post.find().populate("author", "name email");
```

`populate` runs a **second query** to fetch the referenced documents. It is convenient, but it is not a database join.

### lean() for speed
By default Mongoose returns heavy document objects with getters, setters and methods. `lean()` returns plain JavaScript objects, which is faster and uses less memory for read-only work.

```js
const users = await User.find({ role: "admin" }).lean();
```

### Validation errors
```js
try {
  await User.create({ name: "A" });
} catch (err) {
  console.log(err.name);   // "ValidationError"
}
```

### Key Points
* Schema + model gives you structure, validation and defaults at the application level.
* `unique: true` creates a unique index; it is not a validator.
* Use `lean()` for read-only queries; use `populate` sparingly.
* Interview tip: Mongoose validation runs in the app; `$jsonSchema` validation runs in the database.

## Atlas Vector Search
video: mongodb atlas vector search tutorial
summary: Atlas Vector Search finds documents by semantic similarity using embeddings and the $vectorSearch stage.

**Vector search** finds items by **meaning**, not exact keywords. An embedding model turns text into an array of numbers (a **vector**), and similar content gets similar vectors. **Atlas Vector Search** stores them in your documents and searches them by similarity. It powers **RAG** (retrieval-augmented generation).

### How it works
1. Generate an **embedding** for each document and store it in a field.
2. Create an Atlas **vector search index** on that field.
3. At query time, embed the user's question with the same model.
4. Run an aggregation with **`$vectorSearch`** to get the closest documents.

### Store embeddings
```js
await db.collection("docs").insertOne({
  title: "Intro to indexes",
  text: "Indexes speed up queries...",
  category: "database",
  embedding: [0.012, -0.034, 0.101 /* ... one number per dimension ... */]
});
```

### Vector search index definition
Created in the Atlas UI, with the Atlas CLI, or with `createSearchIndex`. `numDimensions` must match your embedding model.

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1536,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "category"
    }
  ]
}
```

Similarity can be `cosine`, `euclidean` or `dotProduct`. Fields you want to pre-filter on must be declared with `type: "filter"`.

### Query with $vectorSearch
```js
const results = await db.collection("docs").aggregate([
  {
    $vectorSearch: {
      index: "vector_index",
      path: "embedding",
      queryVector: queryEmbedding,     // array from the same embedding model
      numCandidates: 200,              // candidates examined by the ANN search
      limit: 5,                        // results returned
      filter: { category: "database" } // optional pre-filter
    }
  },
  {
    $project: {
      _id: 0,
      title: 1,
      text: 1,
      score: { $meta: "vectorSearchScore" }
    }
  }
]).toArray();
```

### Tuning
* `numCandidates` should be higher than `limit` (a common starting point is 10-20 times `limit`). Higher means better recall but slower queries.
* Use `filter` to restrict results by metadata before ranking.
* Always use the **same embedding model** for stored documents and queries.

### Key Points
* `$vectorSearch` must be the **first stage** of the pipeline.
* It needs a vector search index on the embedding field and runs on Atlas.
* Vector search is **approximate**: you trade a little recall for speed.
* Interview tip: describe RAG as embed the question, `$vectorSearch` for context, then send that context to the LLM.

## Interview Quick Review
video: mongodb interview questions and answers
summary: A fast revision sheet of the MongoDB concepts, commands and trade-offs interviewers ask about most.

This is a last-minute checklist. If you can explain each line in your own words, you are ready for most MongoDB interviews. Practise answering with a trade-off, not just a definition.

### Core concepts
* **Document, collection, BSON** - data is JSON-like, stored as BSON, grouped in collections.
* **`_id`** - unique, indexed, default ObjectId; documents are limited to **16 MB**.
* **Schema-flexible** - add `$jsonSchema` validation where it matters.

### Commands to remember
```js
db.c.insertOne({}) ; db.c.insertMany([])
db.c.find(filter, projection).sort({ f: -1 }).skip(n).limit(n)
db.c.updateOne(filter, { $set: {}, $inc: {}, $push: {}, $addToSet: {}, $pull: {}, $unset: {} }, { upsert: true })
db.c.deleteOne(filter) ; db.c.deleteMany(filter)
db.c.bulkWrite([...])
db.c.createIndex({ a: 1, b: -1 }, { unique: true })
db.c.find(filter).explain("executionStats")
db.c.aggregate([{ $match: {} }, { $group: {} }, { $sort: {} }, { $limit: 5 }])
```

### Frequently asked questions
| Question | Short answer |
|----------|--------------|
| SQL vs MongoDB? | Rigid tables with joins vs flexible documents modeled for queries |
| Embed or reference? | Embed for data read together and bounded; reference for large, shared or unbounded data |
| What is the ESR rule? | Order compound index fields: Equality, Sort, Range |
| How do you know an index is used? | `explain("executionStats")` shows `IXSCAN` and a low docs-examined ratio |
| Are writes atomic? | Yes per document; multi-document transactions need a replica set |
| What is a replica set? | One primary plus secondaries with automatic election and failover |
| `w: "majority"`? | The write is on most members, so it survives failover |
| What is sharding? | Splitting data by a shard key across shards, routed by mongos |
| Good shard key? | High cardinality, even distribution, included in common queries, not monotonic |
| How do you join? | `$lookup` or, better, model so you do not need to |
| What is `lean()`? | Mongoose returns plain objects, faster for reads |
| What is `$vectorSearch`? | Atlas aggregation stage for semantic similarity search over embeddings |

### Common mistakes
* Unbounded arrays that grow toward the 16 MB limit.
* Missing indexes on hot queries (COLLSCAN) or too many indexes.
* Large `skip` pagination on big collections.
* Using a monotonically increasing shard key.
* Reading from secondaries when you need the latest data.
* Using transactions everywhere instead of modeling for single-document atomicity.

### Key Points
* Model for access patterns, index for the queries (ESR), and measure with `explain`.
* Replication = availability; sharding = scale; transactions = multi-document consistency.
* In an interview, always state the trade-off of your choice.
