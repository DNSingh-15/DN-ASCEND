---
name: Generative AI & RAG
icon: ✨
category: AI
track: ai
color: #ec4899
order: 13
description: How Retrieval-Augmented Generation works, from document ingestion and embeddings to vector search and grounded answers.
---

## RAG Overview
video: rag retrieval augmented generation
summary: RAG combines a retrieval step with an LLM so answers are grounded in your own documents.

**RAG (Retrieval-Augmented Generation)** = **LLM + external knowledge**. Instead of asking the model to answer from memory, you first *retrieve* relevant pieces of your own documents and then give them to the LLM as context.

```flow
direction: right
Query
Search
Context
LLM
Answer
```

### Core components

| Component | What it does |
| --------- | ------------ |
| Document processing | Reads PDF, DOCX, PPTX, XLSX and extracts text |
| Chunking | Splits text into smaller pieces |
| Embeddings | Turns each chunk into a vector of numbers |
| Vector database | Stores vectors and finds similar ones fast |
| Retrieval | Picks the most relevant chunks for a question |
| Agent orchestration | Coordinates steps when the task is complex |
| Memory systems | Keeps chat history for follow-up questions |

### Why RAG?
- **Reduces hallucination**: answers come from real text.
- **Fresh knowledge**: update a document and re-index it; no retraining.
- **Private data**: the model sees your data only at query time.
- **Citations**: you can show which document an answer came from.

### Two pipelines
RAG has two separate flows:

1. **Ingestion pipeline (offline)**: prepare documents and store embeddings.
2. **Query pipeline (online)**: handle a user question and generate an answer.

### Key Points
- RAG = retrieve first, then generate.
- It is the most common way to build "chat with your documents" apps.
- Interview tip: "RAG reduces hallucination by grounding the LLM in retrieved facts."

## Ingestion Pipeline Overview
video: rag ingestion pipeline document indexing
summary: The ingestion pipeline converts documents into embeddings and stores them in a vector database.

The ingestion step prepares documents for semantic search. It runs once per document (and again when the document changes).

```flow
Documents | PDF / DOCX / PPTX / XLSX
Document Processing
Chunking
Embedding Generation
Vector Database Storage
```

### Why do it offline?
Processing a 200-page PDF takes time and money. Doing it once at upload time means that every user question only needs a fast search.

### Key Points
- Ingestion = prepare once, search many times.
- Each stage can fail, so log and retry per document.
- Store metadata (file name, page, date) with each chunk for filters and citations.

## Document Processing
video: document loader pdf docx text extraction
summary: Document processing collects enterprise files and extracts clean text for chunking and embeddings.

**Document processing** is the process of collecting and reading enterprise documents before AI systems use them. The goal is to extract the business knowledge inside the file.

### What it involves
- **Loading**: read files from storage, upload, SharePoint, S3 or a database.
- **Extraction**: pull text, tables and headings out of the file format.
- **Cleaning**: remove headers, footers, page numbers, and repeated noise.
- **Metadata**: keep title, author, page number, section and date.

### Example with LangChain loaders

```python
from langchain_community.document_loaders import PyPDFLoader

loader = PyPDFLoader("manual.pdf")
pages = loader.load()          # one Document per page
print(pages[0].metadata)       # {'source': 'manual.pdf', 'page': 0}
```

### Common pitfalls
- Scanned PDFs have no text layer, so you need OCR.
- Tables get flattened into messy text; extract them separately if they matter.
- Multi-column layouts can mix up reading order.

### Key Points
- Good retrieval starts with clean extraction. Garbage in, garbage out.
- Always keep metadata; you will need it for citations and filters.

## Chunking
video: text chunking rag chunk size overlap
summary: Chunking splits large documents into smaller pieces so each piece can be embedded and retrieved precisely.

**Chunking** is splitting a large document into smaller pieces before creating embeddings. The reason: LLMs cannot efficiently process very large documents, and a search result should contain only the relevant part, not the whole book.

### Key settings
- **Chunk size**: typically 300 to 1000 tokens (or characters). Smaller chunks are precise but can lose context; larger chunks carry more context but add noise.
- **Overlap**: repeat 10 to 20 percent of text between neighbouring chunks, so a sentence cut at a boundary is not lost.

```text
Document: [.......chunk 1.......][...overlap...][.......chunk 2.......]
```

### Simple example

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=100,
)
chunks = splitter.split_text(long_text)
print(len(chunks))
```

`RecursiveCharacterTextSplitter` tries to split on paragraphs first, then lines, then sentences, so chunks stay readable.

### Key Points
- Chunk size is a trade-off between precision and context.
- Overlap protects against information split across boundaries.
- Evaluate chunk settings with real questions; there is no universal best value.

## Chunking Strategies by Document Type
video: chunking strategies pdf word powerpoint excel
summary: Different file types need different chunking, such as sections for PDFs, slides for PowerPoint and rows for Excel.

Chunking works best when it respects the structure of the document.

| Document Type | Chunking Strategy | Purpose |
| ------------- | ----------------- | ------- |
| PDF | Semantic / Recursive chunking | Preserve sections and document hierarchy |
| Word (.docx) | Semantic chunking | Keep related content and procedures together |
| PowerPoint (.pptx) | Slide-based chunking | Treat each slide as an independent chunk |
| Excel (.xlsx) | Table / row chunking | Retrieve structured records efficiently |

### Semantic chunking
Split where the topic changes, detected by comparing embeddings of neighbouring sentences, rather than at a fixed length.

### Slide-based chunking
One slide = one chunk, with the slide title and speaker notes attached.

### Table / row chunking
For Excel, a row (or a small group of rows) with its column headers becomes one chunk. This lets a question such as "What is the price of part 45-B?" return exactly that record.

```python
# Each row becomes a text chunk with its headers
rows = [f"Part: {r['part']}, Price: {r['price']}, Stock: {r['stock']}" for r in records]
```

### Key Points
- Use structure (headings, slides, rows) as natural chunk boundaries.
- Attach headers or titles to chunks so they make sense on their own.

## Embedding Generation
video: embeddings openai bge e5 sentence transformers
summary: Embedding generation converts every chunk into a vector and needs a model chosen for accuracy, cost, or privacy.

**Embedding generation** sends each chunk to an embedding model, which returns a vector (a list of numbers, typically 384 to 3072 values) that represents its meaning.

```text
"Pipeline corrosion issue"  ->  [0.34, -0.18, 0.92, ...]
```

### Popular embedding models

| Model | Use |
| ----- | --- |
| OpenAI text-embedding-3-large | High accuracy |
| OpenAI text-embedding-3-small | Cost efficient |
| BGE-large | Enterprise RAG, open-source |
| E5 models | Open-source retrieval |

### Example

```python
from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectors = embeddings.embed_documents(chunks)   # one vector per chunk
```

### Practical rules
- **Use the same model for ingestion and queries.** Vectors from different models are not comparable.
- **Batch requests** to save time and API calls.
- **Re-embed everything** if you change the model.

### Key Points
- Embeddings give semantic meaning, so "car" matches "automobile".
- Pick a model based on accuracy, cost, language support and whether data can leave your network.

## Vector Databases
video: vector database pgvector pinecone chromadb
summary: Vector databases store embeddings with metadata and find the most similar vectors quickly.

A **vector database** stores embeddings and answers one question very fast: *which stored vectors are closest to this query vector?*

### Popular options

| Vector DB | Use |
| --------- | --- |
| PostgreSQL + pgvector | Vector search and relational data in one system |
| SQL Server + vector search | Vector search inside an enterprise relational database |
| Pinecone | Fully managed vector database for production RAG |
| ChromaDB | Lightweight and developer-friendly for local projects |

### What a record looks like

```text
id:        doc-12-chunk-3
vector:    [0.34, -0.18, 0.92, ...]
text:      "Pipeline corrosion is caused by..."
metadata:  {"source": "manual.pdf", "page": 12, "year": 2024}
```

### Choosing one
- **Small project or prototype**: ChromaDB or FAISS (local).
- **Already use PostgreSQL**: pgvector keeps everything in one database.
- **Large scale, managed**: Pinecone, or other managed services.

```python
from langchain_chroma import Chroma

db = Chroma(collection_name="manuals", embedding_function=embeddings,
            persist_directory="./chroma")
db.add_texts(chunks, metadatas=metas)
```

### Key Points
- Vector DBs store meaning-based indexes, often alongside metadata for filtering.
- pgvector is a good choice when you want SQL, transactions and vectors together.

## Ingestion Pipeline in Code
video: langchain rag tutorial python ingestion
summary: A complete small ingestion script that loads, splits, embeds and stores a PDF in a vector store.

Here is the whole ingestion pipeline in about 15 lines using LangChain.

```python
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

# 1. Document processing
docs = PyPDFLoader("manual.pdf").load()

# 2. Chunking
splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
chunks = splitter.split_documents(docs)

# 3. Embeddings + 4. Vector database storage
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
db = Chroma.from_documents(chunks, embeddings,
                           collection_name="manuals",
                           persist_directory="./chroma")
print(f"Stored {len(chunks)} chunks")
```

### Production concerns
- Use a stable ID per chunk so re-running does not create duplicates.
- Track which file version was indexed.
- Delete old chunks when a document is updated.

### Key Points
- Four stages: load, split, embed, store.
- Keep the ingestion code separate from the query code, so each can scale on its own.

## User Query
video: user query intent rag chatbot
summary: The user query is the raw question entered by the user, which starts the query pipeline.

The **user query** is the question the user types.

```text
Explain the concept of machine learning.
```

### What can go wrong
- The question is vague ("Teach me about ML").
- It depends on earlier messages ("What about its cost?").
- It contains typos, slang or multiple questions.

The next steps in the query pipeline exist to handle these problems before any search happens.

### Key Points
- The raw query is often not a good search query. Improve it before retrieval.

## Query Understanding
video: query understanding intent entity extraction
summary: Query understanding identifies the user's intent, entities, context and domain before searching.

**Query understanding** analyses the user's question to find out what they really want. The system extracts:

- **Intent**: what kind of answer is needed (concept explanation, comparison, steps, data lookup)
- **Entities**: the key objects in the question (product, person, part number)
- **Context**: the conversation or extra details that matter
- **Domain**: the subject area, so the right index is searched

### Example

```text
Query: Explain the concept of machine learning.

Intent : Concept Explanation
Entity : Machine Learning
Context: Learning
Domain : Artificial Intelligence
```

### How it is done
- A small LLM call with a classification prompt, or
- Rules and keyword lists for simple domains, or
- Named entity recognition models.

```python
intent_prompt = """Return JSON with keys intent, entities, domain for this question:
{question}"""
```

### Key Points
- Intent and domain decide *where* and *how* to search.
- Keep this step cheap; a small model is usually enough.

## System Prompt
video: system prompt rag grounding instructions
summary: The system prompt sets the assistant's role, tone, and rules, such as answering only from retrieved context.

The **system prompt** is the set of hidden instructions that define how the AI should behave. It ensures responses are consistent, accurate and safe.

### Example

```text
You are an AI tutor.
Provide clear and beginner-friendly explanations.
Answer only using the retrieved context.
If the answer is not in the context, say "I could not find this in the documents."
```

### What a good RAG system prompt includes
1. **Role**: who the assistant is.
2. **Grounding rule**: use only the context.
3. **Fallback**: what to say when the answer is missing.
4. **Format**: bullets, length, language.
5. **Citation rule**: cite the source file or page.

### Example in LangChain

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an AI tutor. Answer only from the context. Cite sources."),
    ("human", "Context:\n{context}\n\nQuestion: {question}"),
])
```

### Key Points
- The system prompt is the main control for grounding and tone.
- Always include a clear "I don't know" rule to reduce hallucination.

## Query Rewriting
video: query rewriting rag search query
summary: Query rewriting turns a casual or vague user question into a clear, search-friendly query.

**Query rewriting** (or query building) converts the user's query into a search-friendly form. Better search queries give better retrieval.

### Example

```text
User query:      Teach me about ML.
Rewritten query: Explain the fundamentals of machine learning.
```

### Other rewriting techniques
- **Expand abbreviations**: "ML" -> "machine learning".
- **Resolve references**: "What about its cost?" -> "What is the cost of the Azure Functions plan?"
- **Multi-query**: generate 3 variations of the question and search for each.
- **Step-back**: ask a broader question first to get background context.

```python
rewrite_prompt = ChatPromptTemplate.from_template(
    "Rewrite this question as a clear search query. Keep the meaning.\nQuestion: {q}"
)
rewriter = rewrite_prompt | llm | StrOutputParser()
search_query = rewriter.invoke({"q": "Teach me about ML."})
```

### Key Points
- Retrieval quality depends heavily on the query wording.
- Rewriting is cheap compared with a bad answer.

## Query Embedding
video: query embedding vector search rag
summary: Query embedding converts the rewritten question into a vector using the same model as the documents.

**Query embedding** turns the rewritten question into a vector so it can be compared with the stored chunk vectors.

```text
"Explain the fundamentals of machine learning."
   ↓
[0.52, -0.11, 0.78, ...]
```

### Rules
- **Same model** as ingestion. If you indexed with `text-embedding-3-small`, embed the query with that model too.
- Some models use different prefixes for queries and documents (E5 uses `query:` and `passage:`). Follow the model's documentation.

```python
query_vector = embeddings.embed_query(search_query)
```

### Key Points
- Query embedding and document embedding must share the same vector space.
- The query is embedded at request time, so it should be fast.

## Vector Search
video: vector similarity search cosine hnsw
summary: Vector search finds stored chunks whose vectors are most similar to the query vector.

**Vector search** compares the query vector with the stored vectors and returns the closest matches. Typical goal: find chunks about "machine learning basics", "supervised learning" and "algorithms and examples".

### Similarity measures

| Measure | Meaning |
| ------- | ------- |
| Cosine similarity | Angle between vectors; most common for text (1 = same meaning) |
| Dot product | Fast; works well when vectors are normalised |
| Euclidean distance | Straight-line distance; smaller is closer |

### Approximate Nearest Neighbour (ANN)
Comparing the query with millions of vectors one by one is slow. Vector databases use **ANN indexes** such as **HNSW** that trade a tiny bit of accuracy for huge speed gains.

### Metadata filters
Narrow the search before or during vector search:

```python
results = db.similarity_search_with_score(
    search_query,
    k=10,
    filter={"year": 2024, "source": "manual.pdf"},
)
```

### Example output

```text
Retrieve:
  Machine Learning Basics      score 0.91
  Supervised Learning          score 0.87
  Algorithms and Examples      score 0.84
```

### Key Points
- Vector search finds similar meaning, not exact words.
- ANN indexes make search fast at scale.
- Use metadata filters to reduce noise and enforce permissions.

## Hybrid Search
video: hybrid search bm25 keyword vector
summary: Hybrid search combines keyword matching (BM25) with vector search to catch both exact terms and meaning.

Vector search is great for meaning but can miss exact terms such as product codes, error IDs or names. **Keyword search** (BM25) is great at exact matches but misses synonyms. **Hybrid search** runs both and merges the results.

```flow
Query
Vector search || Keyword search | BM25
Merge | e.g. Reciprocal Rank Fusion
Top-N
```

### Why it helps
- "Error E-4021" is found by keyword match.
- "Why does the pump overheat?" is found by vector meaning.

### Key Points
- Hybrid search is often the best default for enterprise documents.
- Many vector databases (pgvector with full-text search, Elasticsearch, Azure AI Search) support it directly.

## Top-N Retrieval and Re-ranking
video: rag reranking top k retrieval
summary: Top-N retrieval keeps only the best few chunks, and re-ranking reorders them more accurately.

**Top-N retrieval** selects the most relevant chunks based on their similarity score.

```text
Top 5 chunks   (short, precise answers)
Top 10 chunks  (more context, more noise)
```

### Why not send everything?
- More chunks = more tokens = more cost and slower answers.
- Irrelevant chunks confuse the model and can lower answer quality.
- Retrieval is about reducing noise.

### Re-ranking
A first search is fast but rough. A **re-ranker** (cross-encoder model) reads the query together with each candidate and scores it more carefully. A common pattern:

```flow
direction: right
Retrieve top 50 | vector search
Re-rank
Keep top 5
```

### Key Points
- Retrieve more than you need, then keep only the best few.
- Re-ranking often gives a big quality gain for a small extra cost.

## Context Building
video: rag context building prompt assembly
summary: Context building combines the selected chunks, metadata and chat history into one prompt for the LLM.

**Context building** combines the retrieved information and the conversation so far into the input for the LLM.

```text
Retrieved chunk 1
Retrieved chunk 2
Retrieved chunk 3
+ previous chat history
+ system instructions
```

### Good practices
- **Label each chunk** with its source, for example `[Source: manual.pdf, p.12]`, so the model can cite it.
- **Order matters**: models pay more attention to the start and end of long prompts. Put the most relevant chunks first or last.
- **Respect the token budget**: stop adding chunks when the limit is reached.
- **Trim history**: keep recent turns and summarise older ones.

### Example

```python
def build_context(chunks):
    parts = []
    for c in chunks:
        src = c.metadata.get("source", "unknown")
        page = c.metadata.get("page", "?")
        parts.append(f"[Source: {src}, p.{page}]\n{c.page_content}")
    return "\n\n".join(parts)
```

### Key Points
- Context building decides what the model sees, so it strongly affects answer quality.
- Labelled, ordered and trimmed context makes citations and answers better.

## Answer Generation
video: llm answer generation rag langchain chain
summary: The LLM uses the query, system prompt and context to write the answer, usually via an LCEL chain.

In **answer generation**, the LLM receives the system prompt, the labelled context and the question, and writes the answer.

```flow
System prompt + Context + Question
LLM
Answer
```

### Full query pipeline in LangChain (LCEL)

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
retriever = db.as_retriever(search_kwargs={"k": 5})

prompt = ChatPromptTemplate.from_messages([
    ("system", "Answer only from the context. If missing, say you don't know. "
               "Cite sources like [manual.pdf p.12]."),
    ("human", "Context:\n{context}\n\nQuestion: {question}"),
])

def format_docs(docs):
    return "\n\n".join(
        f"[{d.metadata.get('source')} p.{d.metadata.get('page')}]\n{d.page_content}"
        for d in docs)

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)
print(rag_chain.invoke("Explain the concept of machine learning."))
```

### Key Points
- Use low temperature for factual answers.
- Ask the model to say "I don't know" rather than guess.
- LCEL chains (`prompt | llm | parser`) make the flow easy to read and test.

## Final Response
video: rag citations sources response formatting
summary: The final response returns the answer with sources, references, and optional follow-up suggestions.

The **final response** is the answer shown to the user. A good RAG response is more than text.

### What it may include
- **Answer**: the direct response to the question.
- **Sources**: file name, page or link for each claim.
- **References**: quotes or snippets that support the answer.
- **Follow-up suggestions**: related questions the user might ask next.
- **Confidence or fallback message**: "Not found in the documents" when retrieval is weak.

### Example

```text
Machine learning is a branch of AI where systems learn patterns from data
instead of being explicitly programmed.

Sources:
  - manual.pdf, p.3
  - ml-basics.docx, section 2

Follow-up: Would you like an example of supervised learning?
```

### Key Points
- Always show sources in business RAG apps; users need to trust the answer.
- Decide clearly what the UI does when no good context is found.

## Memory Systems and Chat History
video: langchain chat memory conversation history rag
summary: Memory stores earlier turns so follow-up questions like "what about its cost?" are understood correctly.

A chatbot must remember earlier messages. **Memory** stores conversation history so the system can understand follow-up questions.

### Approaches

| Approach | How it works | Trade-off |
| -------- | ------------ | --------- |
| Full buffer | Send all previous messages | Accurate but expensive for long chats |
| Window | Keep the last N messages | Cheap, forgets old context |
| Summary | Summarise old turns with an LLM | Compact, may lose detail |
| Vector memory | Store past turns as embeddings and retrieve relevant ones | Scales to long histories |

### Using history in query rewriting

```text
History: "What is Azure Functions?"  ->  "It is serverless compute..."
New query: "What about its pricing?"
Rewritten: "What is the pricing of Azure Functions?"
```

Rewriting with history is what lets retrieval understand follow-up questions.

### Key Points
- Memory is needed for follow-up questions; rewrite the query using history before searching.
- Choose a memory approach based on conversation length and cost.

## Evaluating RAG Systems
video: rag evaluation metrics faithfulness ragas
summary: RAG quality is measured separately for retrieval and generation using metrics such as recall, faithfulness and relevance.

You cannot improve what you do not measure. RAG has two parts, and each needs its own checks.

### Retrieval metrics
- **Recall@k**: did the correct chunk appear in the top k results?
- **Precision@k**: how many of the top k chunks were actually relevant?
- **MRR**: how high the first correct result ranks.

### Generation metrics
- **Faithfulness**: is every claim in the answer supported by the context?
- **Answer relevance**: does the answer address the question?
- **Context relevance**: were the retrieved chunks useful?

### How to evaluate
1. Build a small test set of 50 to 100 real questions with the expected source.
2. Run the pipeline and record the retrieved chunks and answers.
3. Score with metrics or an LLM judge (libraries such as RAGAS help).
4. Change one thing at a time (chunk size, top-k, prompt) and compare.

### Key Points
- Separate retrieval problems ("wrong chunk") from generation problems ("right chunk, wrong answer").
- Keep a fixed test set so you can compare versions fairly.

## Common RAG Problems and Fixes
video: rag problems troubleshooting chunking retrieval
summary: Most bad RAG answers come from poor chunking, weak retrieval, or a prompt that does not enforce grounding.

| Symptom | Likely cause | Fix |
| ------- | ------------ | --- |
| Answer is missing details | Chunks too small or top-k too low | Increase chunk size or k, add overlap |
| Answer mixes unrelated topics | Chunks too large or too many | Smaller chunks, re-ranking, metadata filters |
| Model invents facts | Weak grounding prompt | Strict system prompt, "say I don't know" rule |
| Exact codes not found | Pure vector search | Add hybrid (keyword) search |
| Follow-up question fails | No history in rewriting | Rewrite query with chat history |
| Outdated answers | Documents not re-indexed | Incremental re-ingestion with versioning |
| Table data garbled | PDF extraction issue | Use table-aware loader or row chunking |

### Key Points
- Debug in order: extraction, chunking, retrieval, context, then prompt.
- Most RAG failures are retrieval failures, not LLM failures.
- Interview tip: "I measure retrieval and generation separately and tune one factor at a time."
