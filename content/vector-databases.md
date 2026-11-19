---
name: Vector Databases
icon: 🧲
category: Database
track: fullstack
also_track: ai
also_category: AI
also_order: 17
color: #8b5cf6
order: 9.6
description: Store embeddings and run fast similarity search with Pinecone, pgvector, Chroma and more, from HNSW indexes to production choices.
---

# Step 1: Foundations

## What is a Vector Database
video: what is a vector database explained
summary: A vector database stores embeddings with their metadata and finds the stored vectors closest to a query vector.

A **vector database** is a database built to store **embeddings** (lists of numbers that represent meaning) and to answer one question quickly: *which stored vectors are closest to this query vector?* Each record usually holds an ID, the vector, and metadata such as source file, page or date. Normal databases match exact values, while a vector database matches by similarity.

```flow
direction: right
Ingest | chunk and embed each document
Index | build a fast search structure over the vectors
Query | embed the user's question
Search | return the top-k nearest chunks
```

### What a record looks like

```text
id:        doc-12-chunk-3
vector:    [0.34, -0.18, 0.92, ...]      (1536 numbers)
metadata:  {"source": "manual.pdf", "page": 12, "year": 2024}
text:      "Pipeline corrosion is caused by..."
```

### Why not a normal index?
A B-tree index on a text column answers "is this exact string here?" It cannot answer "which 5 stored items mean the most similar thing to this question?" That needs distance calculations across vectors, plus specialised indexes so the search does not compare the query with every single record.

### Where it fits
Vector databases are the storage layer of semantic search, recommendations, duplicate detection and retrieval-augmented generation (RAG). For how RAG uses them, see [Vector Databases in RAG](/generative-ai/vector-databases) and [Vector Search](/generative-ai/vector-search).

### Key Points
- A vector database = vectors + metadata + an index for fast nearest-neighbour search.
- It answers "what is similar?", not "what is equal?".
- Interview tip: "The database is the storage and index; the embedding model is what creates the meaning."

## How Vectors Represent Meaning
video: word embeddings vectors meaning explained
summary: An embedding model maps text to a point in high-dimensional space, so texts with similar meaning land close together.

An **embedding model** reads a piece of text and outputs a fixed-length vector. The model learns during training that words and sentences used in similar contexts should get similar vectors, so "car" and "automobile" end up near each other. Each dimension does not have a human-readable meaning; the meaning lives in the overall pattern of values.

```text
"car"          -> [0.12,  0.88, -0.31, ...]
"automobile"   -> [0.10,  0.91, -0.28, ...]   close to "car"
"banana"       -> [0.75, -0.20,  0.44, ...]   far from both
```

### Dimensions must match the model
The **dimension** is the length of the vector. Common sizes are 384, 768, 1024, 1536 and 3072. You must set the index dimension to the exact size the embedding model produces. A mismatch is the most common setup error, and the database will reject the write or the query.

| Example model | Typical dimension |
| ------------- | ----------------- |
| OpenAI text-embedding-3-small | 1536 |
| OpenAI text-embedding-3-large | 3072 (can be shortened with the `dimensions` parameter) |
| Many open-source sentence models | 384 to 1024 |

### Same model, both sides
Documents and queries must be embedded with the **same model**. Vectors from two different models live in different spaces, so their distances mean nothing. If you change the model, you must re-embed every stored document. See [Vector Embeddings](/ai-fundamentals/vector-embeddings) for the basic idea.

### Key Points
- Embedding dimension is fixed by the model; the index dimension must match it.
- Changing the embedding model means re-embedding and re-indexing everything.
- Interview tip: "Similarity search works because the model puts related meanings close together."

## Similarity Metrics: Cosine, Dot Product and Euclidean
video: cosine similarity vs dot product vs euclidean distance
summary: Cosine, dot product and Euclidean distance measure closeness differently, and the right choice depends on how the embeddings were produced.

A vector database ranks results with a **distance or similarity metric**. The three common choices are **cosine similarity**, **dot product** and **Euclidean (L2) distance**. They are easy to confuse because they often give the same ranking, but they differ in what they measure.

### The three metrics

| Metric | What it measures | Ranking rule |
| ------ | ---------------- | ------------ |
| Cosine similarity | Angle between two vectors, ignoring length | Higher is more similar (1 = same direction) |
| Dot product | Angle and length together | Higher is more similar |
| Euclidean (L2) distance | Straight-line distance between points | Lower is more similar |

### Normalised vectors make them equal
If every vector has length 1 (**normalised**), then cosine similarity equals the dot product, and Euclidean distance gives the same ranking as well. Many embedding APIs return normalised vectors already. Using the metric the model was trained for is still the safest choice.

```text
Cosine similarity = (a · b) / (|a| × |b|)
If |a| = |b| = 1, then cosine = dot product
```

### Which one to pick
- **Cosine**: the default for text embeddings and for most RAG systems.
- **Dot product**: fast, and correct when vectors are normalised or when the model documentation asks for it.
- **Euclidean**: common in image and clustering work; check your model's guidance before using it for text.

### Key Points
- Cosine ignores length; dot product uses length; Euclidean measures distance.
- For normalised vectors, all three rank results the same way.
- Interview tip: "Use the metric the embedding model was trained with, usually cosine for text."

# Step 2: Indexing

## Exact vs Approximate Nearest Neighbor Search
video: exact vs approximate nearest neighbor search ann
summary: Exact search compares the query with every vector, while approximate search trades a little accuracy for much faster lookups.

**Exact nearest neighbour (kNN) search** computes the distance from the query to every stored vector and sorts the results. It is always correct, but its cost grows with the number of vectors and their dimension. For a few thousand vectors this is fine; for tens of millions it is far too slow for an interactive app.

**Approximate nearest neighbour (ANN) search** builds an index that lets the database inspect only a small, well-chosen part of the data. It returns results that are *almost always* the true nearest neighbours, and it is orders of magnitude faster.

### Measuring quality: recall@k
The standard quality metric is **recall@k**: the fraction of the true top-k neighbours (found by exact search) that the ANN index also returns.

```text
Exact top 10:   [A, B, C, D, E, F, G, H, I, J]
ANN top 10:     [A, B, C, D, E, F, G, H, K, M]
Recall@10 = 8 / 10 = 0.80
```

### The trade-off
| Choice | Speed | Recall | Memory |
| ------ | ----- | ------ | ------ |
| Exact search | Slow at scale | 100% | Vectors only |
| ANN index | Fast | Typically 90 to 99% (tunable) | Vectors plus index overhead |

### Key Points
- Exact search is the baseline for measuring ANN recall.
- ANN is the default in production; the question is how much recall you can give up.
- Interview tip: "Approximate search is acceptable because the LLM only needs good context, not the mathematically perfect top 1."

## HNSW Index
video: HNSW hierarchical navigable small world explained
summary: HNSW organises vectors into a multi-layer graph, so a search jumps quickly across coarse layers and refines on the dense bottom layer.

**HNSW (Hierarchical Navigable Small World)** is the most widely used ANN index for vector search. It builds a graph in which each vector is a node connected to a few nearby vectors. The graph has several layers: the top layer holds only a few nodes for long jumps, and the bottom layer holds every vector for fine-grained search.

```flow
Top layer | few nodes, long jumps across the space
Middle layer | more nodes, medium jumps
Bottom layer | every vector, local refinement
Result | top-k nearest neighbours
```

### How a search works
1. Enter the graph at the top layer, at a fixed starting node.
2. Greedily move to the neighbour closest to the query, then drop down a layer.
3. On the bottom layer, keep exploring a candidate list until no closer node is found.
4. Return the best k candidates.

### The three parameters
- **M**: the maximum number of connections per node. Higher M gives better recall and a bigger index, using more memory.
- **efConstruction**: the candidate list size while *building* the graph. Higher values build a better graph, but indexing takes longer.
- **efSearch**: the candidate list size while *querying*. Higher values raise recall and cost more latency. This is the main knob you tune at query time.

### Trade-offs
- Very fast queries and high recall, which is why most vector databases use it.
- The graph lives in memory for good speed, so memory is the main cost.
- Inserts and updates are supported, but heavy deletes can degrade the graph over time.

### Key Points
- HNSW = layered graph; the top layers route, the bottom layer finds the answer.
- Raise efSearch for recall, lower it for speed. Build-time M and efConstruction are fixed once built.
- Interview tip: "HNSW is fast and accurate, but it is memory hungry."

## IVF and Product Quantization
video: IVF product quantization vector index explained
summary: IVF groups vectors into clusters and PQ compresses them, which together cut search cost and memory for very large collections.

Graph indexes like HNSW are fast but use a lot of RAM. **IVF (Inverted File index)** and **Product Quantization (PQ)** are the classic alternatives for very large collections, where memory and cost matter as much as speed.

### IVF: cluster first, search a few clusters
IVF runs k-means clustering on the vectors to create **nlist** centroids (cluster centres). Each vector is stored in the list of its nearest centroid. At query time, the database finds the closest centroids and searches only those lists.

```text
nlist = 1000 clusters
nprobe = 10   -> search the 10 closest clusters, not all 1000
```

- **nlist**: number of clusters. More clusters = smaller lists, faster search, but a harder training step.
- **nprobe**: number of clusters searched per query. Higher nprobe = better recall, slower search.
- Some vectors near a cluster border are missed if the true neighbour sits in an unprobed cluster.

### Product Quantization: compress the vectors
PQ splits each vector into **m** smaller sub-vectors. For each sub-vector it learns a small codebook (often 256 entries) and stores only the index of the closest entry, which takes one byte. A 1536-number float vector can shrink to a few dozen bytes.

- Distances are estimated from the compressed codes, so **PQ trades recall for memory**.
- Often combined with IVF (IVF-PQ) for billion-scale collections.
- Some systems re-score the top candidates with the full vectors to win back recall.

### Choosing between them
| Index | Strength | Cost |
| ----- | -------- | ---- |
| HNSW | Best speed and recall at moderate scale | High memory |
| IVF | Lower memory, needs training and tuning | Lower recall at the same speed |
| IVF-PQ | Very low memory at huge scale | Recall loss from compression |

### Key Points
- IVF = search only the nearest clusters; nprobe controls how many.
- PQ = compress vectors to save memory; always measure the recall it costs.
- Interview tip: "For billions of vectors on a budget, IVF-PQ; for best recall at moderate size, HNSW."

# Step 3: Pinecone

## Pinecone Overview
video: pinecone vector database overview tutorial
summary: Pinecone is a fully managed vector database service that handles indexing, scaling and storage so you focus on the application.

**Pinecone** is a managed vector database. You create an index, send vectors with metadata over an API, and query it. Pinecone runs the storage, the ANN index and the scaling, so you do not manage servers or index tuning in the usual way.

### Core concepts

| Concept | What it means |
| ------- | ------------- |
| Index | A named collection of vectors with one fixed dimension and one metric |
| Vector record | An ID, a list of float values, and optional metadata |
| Namespace | A partition inside an index; queries run inside one namespace |
| Metadata | Small key-value fields stored with each vector and used for filters |
| Serverless index | Pay for what you store and query; capacity scales automatically |
| Pod-based index | Reserved capacity you size yourself; more control, more to manage |

### Typical flow

```flow
direction: right
Create index | fixed dimension and metric
Upsert | vectors with metadata and namespace
Query | vector, top_k and filter
```

### Install the SDK

```bash
pip install pinecone
export PINECONE_API_KEY="your-key-here"
```

### Key Points
- Pinecone = managed vector database; you control the schema, not the servers.
- Index dimension and metric are fixed when you create the index.
- Interview tip: "Choose Pinecone when you want a managed vector store with minimal ops work."

## Pinecone: Create, Upsert and Query
video: pinecone python tutorial create index upsert query
summary: Create a serverless index, upsert embedded chunks with metadata, then query with a vector, a top-k limit and a filter.

The basic Pinecone workflow is three calls: create an index, upsert vectors, and query. The embedding model runs in your code, so every vector you send already has its `values` list.

### 1. Create the index

```python
import os
from pinecone import Pinecone, ServerlessSpec

pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])

pc.create_index(
    name="manuals",
    dimension=1536,                  # must match text-embedding-3-small
    metric="cosine",
    spec=ServerlessSpec(cloud="aws", region="us-east-1"),
)
index = pc.Index("manuals")
```

Creating an index with a name that already exists fails, so check first or handle the error. A new index may take a short time to become ready.

### 2. Upsert vectors

An **upsert** inserts a record, or replaces it if the ID already exists. Upserts are safe to re-run, which is useful for re-ingestion.

```python
index.upsert(
    vectors=[
        {
            "id": "doc-12-chunk-3",          # stable, unique ID
            "values": embedding_vector,      # list of 1536 floats
            "metadata": {
                "source": "manual.pdf",
                "page": 12,
                "year": 2024,
                "text": "Pipeline corrosion is caused by...",
            },
        }
    ],
    namespace="acme-corp",
)
```

Keep metadata small. Store the full chunk text in your own database if it is large, and keep only an ID or short snippet in Pinecone.

### 3. Query

```python
query_vector = embed("Why do pipelines corrode?")   # same model as ingestion

results = index.query(
    vector=query_vector,
    top_k=5,
    include_metadata=True,
    filter={"year": {"$eq": 2024}},
    namespace="acme-corp",
)

for match in results.matches:
    print(match.id, round(match.score, 3), match.metadata["source"])
```

- `top_k` is the number of results returned.
- `include_metadata=True` returns the stored metadata with each match.
- `filter` restricts the search to records that match the condition.

### Key Points
- Use a stable, unique ID per chunk so upserts replace instead of duplicating.
- Always query with the same embedding model you used for ingestion.
- Interview tip: "Upsert makes ingestion idempotent; a re-run updates records rather than duplicating them."

## Pinecone Namespaces and Metadata Filtering
video: pinecone namespaces metadata filter tutorial
summary: Namespaces split one index into isolated partitions for tenants or datasets, while metadata filters narrow each query to matching records.

**Namespaces** and **metadata filters** both limit what a query can see, but at different levels. A namespace is a hard partition: a query runs inside one namespace and never touches the others. A metadata filter is a condition evaluated on each record's fields inside that namespace.

### When to use namespaces
- **Multi-tenant apps**: one namespace per customer keeps data separated in one index.
- **Environments or versions**: separate staging and production data, or old and new embeddings during a migration.
- Namespaces are cheap to create and are created implicitly on the first upsert with that name.

### Filter operators
Pinecone filters use a MongoDB-style syntax. These operators are supported:

| Operator | Meaning |
| -------- | ------- |
| `$eq` | Equal to |
| `$ne` | Not equal to |
| `$gt`, `$gte` | Greater than, greater than or equal |
| `$lt`, `$lte` | Less than, less than or equal |
| `$in` | Value is in a list |
| `$nin` | Value is not in a list |
| `$exists` | Field is present (or absent) |
| `$and`, `$or` | Combine conditions |

```python
results = index.query(
    vector=query_vector,
    top_k=5,
    include_metadata=True,
    filter={
        "$and": [
            {"year": {"$gte": 2020}},
            {"source": {"$in": ["manual.pdf", "faq.pdf"]}},
        ]
    },
    namespace="acme-corp",
)
```

### Access control with filters
A filter is a common way to enforce permissions: store a `group` or `owner` field in metadata and always add it to the filter from the authenticated user's identity. Never trust a filter that comes from the client alone.

### Key Points
- Namespace = hard isolation between datasets or tenants; filter = condition within a namespace.
- Keep metadata field names and types consistent across records, or filters silently miss data.
- Interview tip: "For multi-tenancy, use namespaces for isolation and filters for finer selection."

# Step 4: Other Vector Databases

## pgvector (PostgreSQL)
video: pgvector postgres vector search tutorial
summary: pgvector adds a vector type, distance operators and HNSW or IVFFlat indexes to PostgreSQL, so vectors live next to your relational data.

**pgvector** is an open-source extension for PostgreSQL. It adds a `vector` column type, distance operators and approximate indexes. Its main advantage is that vectors and ordinary data share one database, with SQL, joins, transactions and backups you already use.

### Setup

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE chunks (
  id         BIGSERIAL PRIMARY KEY,
  content    TEXT NOT NULL,
  source     TEXT,
  page       INT,
  embedding  vector(1536)              -- match the model dimension
);
```

### Distance operators

| Operator | Meaning | Ordering |
| -------- | ------- | -------- |
| `<->` | Euclidean (L2) distance | Smaller is closer |
| `<#>` | Negative inner product | Smaller is closer (negate it to get the dot product) |
| `<=>` | Cosine distance | Smaller is closer; similarity = 1 - distance |

### Index with HNSW

```sql
CREATE INDEX chunks_embedding_hnsw
  ON chunks USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

SET hnsw.ef_search = 100;             -- query-time recall knob
```

### Index with IVFFlat

```sql
CREATE INDEX chunks_embedding_ivf
  ON chunks USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

SET ivfflat.probes = 10;              -- clusters searched per query
```

Create the IVFFlat index after the table has data, because it learns its clusters from existing rows.

### Query with a filter

```sql
SELECT id, content, 1 - (embedding <=> $1) AS similarity
FROM chunks
WHERE source = 'manual.pdf'
ORDER BY embedding <=> $1
LIMIT 5;
```

`$1` is a driver parameter that holds the query vector. Order by the distance operator itself, not by the computed similarity, so the index can be used.

### Caveats
- Filtered queries can return fewer rows than `LIMIT` when the index scan finds candidates that the filter then removes. Newer pgvector releases add iterative index scans to help; check your version.
- The vector index types have a dimension limit (2000 for `vector` in HNSW and IVFFlat). Larger models need reduced dimensions or the `halfvec` type.

### Key Points
- pgvector = vectors inside PostgreSQL; SQL, joins and transactions work unchanged.
- Use `vector_cosine_ops` for cosine indexes and `<=>` in the ORDER BY so the index is used.
- Interview tip: "If you already run Postgres, pgvector avoids a second system to operate."

## Chroma
video: chromadb python tutorial collection query
summary: Chroma is a lightweight, developer-friendly vector store that runs locally or in a server and handles embedding for you.

**Chroma** (ChromaDB) is an open-source vector database designed to be easy to start with. You can run it in memory, save it to a folder on disk, or run it as a server. A **collection** groups records, and Chroma can embed the text for you if you give it a collection embedding function.

### Create a persistent client and collection

```python
import chromadb

client = chromadb.PersistentClient(path="./chroma_db")

collection = client.get_or_create_collection(
    name="manuals",
    metadata={"hnsw:space": "cosine"},   # the default distance is L2
)
```

Set the distance metric when the collection is created. The default distance is L2, so set `"hnsw:space": "cosine"` if you want cosine.

### Add records

```python
collection.add(
    ids=["doc-12-chunk-3"],
    documents=["Pipeline corrosion is caused by..."],
    metadatas=[{"source": "manual.pdf", "page": 12, "year": 2024}],
)
```

If you pass `documents` without `embeddings`, Chroma embeds the text with the collection's embedding function. The default embedding function is a small local model, which is fine for prototypes. For production, pass your own `embeddings` so the model is explicit and consistent with your query code.

### Query with a filter

```python
results = collection.query(
    query_texts=["Why do pipelines corrode?"],
    n_results=3,
    where={"year": {"$eq": 2024}},
)

print(results["documents"][0])
print(results["metadatas"][0])
```

Chroma returns results as lists, one list per query text, so the first query is at index `[0]`.

### Where Chroma fits
- Prototypes, notebooks and local RAG demos.
- Small to medium apps where simplicity matters more than horizontal scale.
- Moving to a server deployment is possible, but plan the migration if traffic grows.

### Key Points
- Chroma = fastest path to a working local vector store.
- Set the distance metric when you create the collection; changing it later usually means rebuilding the collection.
- Interview tip: "Chroma is great for prototypes; for large multi-user production, teams often choose a managed or server-grade store."

## Qdrant, Weaviate and Milvus
video: qdrant weaviate milvus vector database comparison
summary: Qdrant, Weaviate and Milvus are dedicated open-source vector databases with rich filtering, hybrid search and self-hosted or cloud options.

These three are popular open-source vector databases that you can self-host or use as a managed cloud service. They share the same core ideas (collections or classes, vectors with payloads, ANN indexes such as HNSW) and differ in their strengths and operational model.

### Qdrant
- Written in Rust, with a focus on fast filtered search and a simple API.
- Strong payload (metadata) filtering, and a practical choice for self-hosted or cloud deployments.
- Good fit when filtering is complex and latency matters.

### Weaviate
- Can work as a vector database and also offers built-in modules for vectorisation and hybrid search.
- Useful when you want the database to combine keyword and vector retrieval in one place. See [Hybrid Search](/generative-ai/hybrid-search) for the idea.
- Schema-based, with classes that define properties and vectors.

### Milvus
- Built for very large scale, with a distributed architecture that separates storage, query and index nodes.
- Supports multiple index types, including IVF and HNSW families, which suits billion-scale data.
- Operationally heavier than a single-node store, so it fits teams that expect large volumes.

### How to compare them
| Question | Lean towards |
| -------- | ------------ |
| Complex filters on metadata at moderate scale | Qdrant |
| Hybrid search and built-in vectorisation | Weaviate |
| Very large, distributed collections | Milvus |

Check each project's current documentation for supported features and deployment options, because these products change quickly.

### Key Points
- All three are dedicated vector databases with filters and ANN indexes.
- Pick by scale, filter needs, hybrid search needs and how much operations work you can take on.
- Interview tip: "Ask about filtering, scale and operations before naming a product."

# Step 5: Production

## Choosing a Vector Database
video: how to choose a vector database
summary: Choose a vector database by weighing scale, filtering needs, existing infrastructure, operations effort and the cost of running it.

There is no single best vector database. The right choice depends on what you already run, how many vectors you have, how much you filter, and how much operational work your team can carry. Most mistakes come from choosing a dedicated product before measuring whether the existing database is enough.

### Decision checklist

| Question | If yes, consider |
| -------- | ---------------- |
| Already run PostgreSQL and under a few million vectors? | pgvector |
| Want fully managed, minimal ops, production RAG? | Pinecone or another managed service |
| Building a local prototype or demo? | Chroma |
| Need hybrid search or built-in vectorisation? | Weaviate, or hybrid search in your existing search engine |
| Very large, distributed, self-managed? | Milvus or Qdrant |

### Questions to ask
- How many vectors now, and in one year? What is the dimension?
- How many metadata filters do queries use, and how selective are they?
- Do you need strict data residency, on-premises hosting or private networking?
- Who will operate it, and what happens during an outage or a restore?

### Test before you commit
Build a small evaluation set of real questions with known good chunks. Measure recall@k, latency at your expected load, and the cost of ingesting your full corpus. Repeat with two candidate databases.

### Key Points
- Start from scale, filters and operations, not from brand names.
- Measure recall and latency on your own data before choosing.
- Interview tip: "I would start with the database we already run and move only when measurements say so."

## Scaling, Cost and Operations
video: scaling vector database cost operations production
summary: Scaling a vector store means managing memory, index rebuilds, replicas, filtered-query cost and safe re-indexing when models change.

Production vector search is mostly an operations problem. The main cost drivers are the number of vectors, their dimension, the index overhead, query volume, and the number of replicas you run for availability. Plan these before launch, because re-indexing a large collection is slow and expensive.

### Cost drivers (qualitative)
- **Vector count and dimension**: storage grows with count times dimension. Halving the dimension or using a smaller model can cut memory significantly.
- **Index overhead**: HNSW graphs add memory on top of raw vectors; a higher M increases this.
- **Query volume and top-k**: more queries and bigger result sets use more compute.
- **Replicas**: copies for availability and read throughput multiply cost.
- **Embedding calls**: re-embedding a corpus costs model usage every time you change the model or chunking.

### Scaling patterns
- Scale reads with replicas; scale writes and storage with sharding or a managed service that does it for you.
- Keep metadata small and filter fields indexed where the product supports it.
- Batch upserts instead of single-record writes to save time and requests.

### Operations checklist
1. **Versioned indexes**: build a new index with the new model, run both in parallel, then switch traffic.
2. **Stable IDs** so re-ingestion updates records instead of duplicating them.
3. **Delete old chunks** when a source document changes or is removed.
4. **Monitor** latency, recall on a fixed test set, index size and error rates.
5. **Backups and restores**: know how to rebuild the index from source documents if needed.

### Filtered search at scale
When a filter removes most of the data, the ANN index may return fewer or less accurate results, because the candidate set is mostly filtered out. Test filtered queries separately, and use partitions such as namespaces or tenant-based collections where the filter is always the same.

### Key Points
- Vector count x dimension drives memory; the index adds overhead on top.
- Use blue-green indexes when you change models, so users are never served mixed vectors.
- Interview tip: "The expensive part is usually re-indexing and memory, not the query itself."

## Interview Quick Review
video: vector database interview questions quick review
summary: A fast recap of the core vector database ideas, from similarity metrics and HNSW to choosing and operating a production store.

Use this section as a last pass before an interview. Each answer is short, but the reasoning behind it is what interviewers look for. Be ready to explain one trade-off in your own words.

### What is a vector database?
A database that stores embeddings with metadata and finds the nearest vectors quickly using an ANN index.

### Why approximate instead of exact search?
Exact search compares the query with every vector, which is too slow at scale. ANN gives near-exact results much faster, and recall@k tells you how close it is.

### How does HNSW work?
It builds a multi-layer graph. Searches move greedily from coarse top layers to a dense bottom layer, and efSearch controls how much work each query does.

### What is the difference between IVF and HNSW?
IVF clusters vectors and searches only the nearest clusters, which saves memory. HNSW uses a graph for high speed and recall, but needs more RAM.

### What does Product Quantization do?
It compresses vectors into short codes, which saves a lot of memory and costs some recall.

### Cosine or dot product?
Cosine ignores length; dot product uses it. For normalised vectors they rank results the same way. Use the metric the embedding model expects.

### What must match between ingestion and query?
The embedding model, and therefore the vector dimension and space. Otherwise the distances are meaningless.

### Namespace or metadata filter?
A namespace is a hard partition for isolation, such as per tenant. A filter selects records inside a partition.

### When would you choose pgvector?
When the data already lives in PostgreSQL and the dataset is moderate in size, so vectors, SQL and transactions stay in one system.

### How do you keep a vector store correct over time?
Use stable IDs for upserts, delete chunks when sources change, and build a new versioned index when the embedding model changes.

### Key Points
- Know the flow: embed, index, query with the same model.
- Know one trade-off per index: HNSW trades memory for speed, IVF trades recall for cost, PQ trades recall for memory.
- Interview tip: finish every answer with the trade-off you would accept and why.
