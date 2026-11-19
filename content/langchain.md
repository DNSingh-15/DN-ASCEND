---
name: LangChain
icon: 🦜
category: AI
track: ai
color: #059669
order: 16
description: Build LLM apps in Python with LangChain chat models, loaders, retrievers, RAG chains, custom tools, streaming and LangSmith tracing.
---

# Step 1: Getting Started

## LangChain Overview and Setup
video: langchain python setup tutorial
summary: Install the modern LangChain packages, set API keys and run your first model call in a few lines.

LangChain is a Python framework that gives every part of an LLM app a standard interface: models, prompts, parsers, retrievers and tools. Because they all share one interface, you can swap providers or vector stores by changing a single line. This course covers the parts that go beyond the basics, so start here to get a working environment.

### What this course covers
The core ideas are already explained in the Agentic AI course. Read these first if they are new to you:
- [LangChain Prompt Templates](/agentic-ai/langchain-prompt-templates)
- [LangChain Chains and LCEL](/agentic-ai/langchain-chains-and-lcel)
- [LangChain Memory](/agentic-ai/langchain-memory)
- [LangChain Agents](/agentic-ai/langchain-agents)

This course goes deeper on everything else: chat models and messages, structured output, loading and splitting your own data, vector stores, retrievers, RAG chains, custom tools, streaming, resilience patterns and LangSmith. For the theory behind RAG, see [Generative AI & RAG](/generative-ai). For the storage layer, see [Vector Databases](/vector-databases).

### The package layout
LangChain is split into small packages so you only install what you use.

| Package | What it holds |
| ------- | ------------- |
| `langchain-core` | Base interfaces: Runnable, messages, prompts, parsers, tools, `InMemoryVectorStore` |
| `langchain` | High-level pieces such as `init_chat_model` and `create_agent` |
| `langchain-openai`, `langchain-anthropic` | Provider integrations (chat models and embeddings) |
| `langchain-community` | Many third-party loaders, tools and stores |
| `langchain-text-splitters` | Text splitters |
| `langchain-chroma`, `langchain-pinecone` | Vector store integrations |
| `langsmith` | Tracing, datasets and evaluation |

### Install and configure

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install langchain langchain-core langchain-openai langchain-community \
            langchain-text-splitters langchain-chroma pypdf python-dotenv
```

Keep secrets in a `.env` file, never in code.

```bash
# .env
OPENAI_API_KEY=sk-...
```

```python
from dotenv import load_dotenv
load_dotenv()   # loads OPENAI_API_KEY into the environment

from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
print(llm.invoke("Say hello in one short sentence.").content)
```

### Provider-agnostic model creation
`init_chat_model` builds a chat model from a string, so the provider becomes configuration instead of code.

```python
from langchain.chat_models import init_chat_model

llm = init_chat_model("gpt-4o-mini", model_provider="openai", temperature=0)
# the same line with another provider:
# llm = init_chat_model("claude-sonnet-4-5", model_provider="anthropic")
```

### Key Points
- Install only the partner packages you need (`langchain-openai`, `langchain-chroma`, ...).
- Load API keys from environment variables or `.env`. Never hard-code or commit them.
- Everything is a **Runnable**: models, prompts, parsers and retrievers share `.invoke()`, `.stream()` and `.batch()`.
- Interview tip: be able to explain why LangChain is split into `langchain-core` and partner packages (small installs, independent releases).

## Chat Models and Messages
video: langchain chat models messages tutorial
summary: Chat models take a list of typed messages and return an AIMessage with content, metadata and token usage.

A chat model does not take a plain string in a real application. It takes a **list of messages**, each with a role: system, human or AI. The reply is an `AIMessage` that holds the text plus useful metadata such as token usage. Understanding messages is the foundation for prompts, memory and tool calling.

### Message types

| Class | Role | Purpose |
| ----- | ---- | ------- |
| `SystemMessage` | system | Sets behaviour and rules |
| `HumanMessage` | user | What the user said |
| `AIMessage` | assistant | Model replies (and tool call requests) |
| `ToolMessage` | tool | Result of a tool call sent back to the model |

```python
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

messages = [
    SystemMessage("You are a concise Python tutor."),
    HumanMessage("What is a list comprehension?"),
]
ai_msg = llm.invoke(messages)

print(ai_msg.content)          # the text answer
print(ai_msg.usage_metadata)   # {'input_tokens': ..., 'output_tokens': ..., 'total_tokens': ...}
print(ai_msg.response_metadata)  # provider details such as model name and finish reason
```

### Multi-turn conversations
The model is **stateless**. To continue a chat, send the earlier messages again.

```python
messages.append(ai_msg)
messages.append(HumanMessage("Show me an example."))
print(llm.invoke(messages).content)
```

You can also pass shorthand tuples such as `("human", "Hi")`, or a dict like `{"role": "user", "content": "Hi"}`. LangChain converts them to message objects.

### Key model parameters
- `temperature`: randomness. Use `0` for extraction, classification and RAG.
- `max_tokens`: caps the length of the reply (and your cost).
- `timeout` and `max_retries`: network safety.

```python
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, max_tokens=300, timeout=30, max_retries=2)
```

### Trimming long histories
Long chats eventually exceed the context window. `trim_messages` keeps only the most recent part.

```python
from langchain_core.messages import trim_messages

trimmed = trim_messages(
    messages,
    strategy="last",
    max_tokens=10,          # counts messages here
    token_counter=len,      # simple counter: 1 per message
    include_system=True,    # always keep the system message
    start_on="human",
)
```

### Key Points
- Send a **list of messages**; the reply is an `AIMessage` with `.content` and `.usage_metadata`.
- The model is stateless, so you must resend history to continue a conversation.
- Use `temperature=0` for deterministic tasks and set `max_tokens` to control cost.
- Interview tip: explain the roles (system, human, ai, tool) and why the system message is the right place for rules.

## Output Parsers and Structured Output
video: langchain structured output pydantic with_structured_output
summary: Turn free-text LLM replies into strings, JSON or validated Pydantic objects your code can trust.

LLMs return text, but programs need data. **Output parsers** and **structured output** convert the model's reply into a string, a dict or a validated Python object. In modern LangChain, `with_structured_output` is the preferred way to get reliable typed data from a model.

### StrOutputParser
Extracts the plain text from an `AIMessage`. This is the most common last step of a chain.

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

prompt = ChatPromptTemplate.from_template("Give one tip about {topic}.")
chain = prompt | llm | StrOutputParser()
print(chain.invoke({"topic": "Python"}))   # a plain str, not an AIMessage
```

### with_structured_output (recommended)
Pass a **Pydantic model**. The model uses its native tool or JSON mode, and you get a validated object back.

```python
from pydantic import BaseModel, Field

class Ticket(BaseModel):
    """A support ticket extracted from an email."""
    category: str = Field(description="billing, technical or general")
    priority: int = Field(description="1 (low) to 5 (urgent)")
    summary: str = Field(description="One-sentence summary")

structured_llm = llm.with_structured_output(Ticket)

ticket = structured_llm.invoke(
    "My card was charged twice and I need this fixed today!"
)
print(ticket.category, ticket.priority)   # billing 5
print(ticket.model_dump())                # plain dict
```

The field descriptions are part of the prompt the model sees, so write them clearly.

### JsonOutputParser
Use it when you only need a dict and do not want a schema class.

```python
from langchain_core.output_parsers import JsonOutputParser

parser = JsonOutputParser()
prompt = ChatPromptTemplate.from_template(
    "Return JSON with keys 'name' and 'age' for: {text}\nReturn only JSON."
)
chain = prompt | llm | parser
print(chain.invoke({"text": "Asha is 29 years old."}))   # {'name': 'Asha', 'age': 29}
```

### Structured output inside a chain

```python
extract_prompt = ChatPromptTemplate.from_messages([
    ("system", "Extract the ticket details."),
    ("human", "{email}"),
])
extract_chain = extract_prompt | llm.with_structured_output(Ticket)
```

### When parsing fails
- Validation errors mean the model returned data that did not match the schema. Catch them and retry (`.with_retry()`, see the Runnable Patterns topic).
- Keep schemas small and use clear field names.
- Use `Literal["billing", "technical", "general"]` or an `Enum` to restrict values.

### Key Points
- `StrOutputParser` for text, `JsonOutputParser` for dicts, `with_structured_output(PydanticModel)` for validated objects.
- Pydantic gives you type checking and validation for free.
- Always validate model output before using it for actions such as database writes.
- Interview tip: explain why structured output is more reliable than asking for JSON in the prompt and parsing it by hand.

# Step 2: Working with Your Data

## Document Loaders
video: langchain document loaders pdf web
summary: Loaders read PDFs, web pages and text files into Document objects with page_content and metadata.

An LLM only knows its training data. To answer questions about your own files, you first need to load them. A **document loader** reads a source (PDF, web page, text file, folder) and returns a list of `Document` objects. This is the first step of every RAG pipeline.

### The Document object
Every loader returns the same structure.

```python
from langchain_core.documents import Document

doc = Document(
    page_content="Refunds are allowed within 30 days.",
    metadata={"source": "policy.pdf", "page": 3},
)
```

- `page_content`: the text.
- `metadata`: a dict (source, page, author, date). It is used later for filtering and citations.

### Common loaders

```python
from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader, TextLoader

# PDF: one Document per page
pdf_docs = PyPDFLoader("handbook.pdf").load()

# Web page: needs beautifulsoup4
web_docs = WebBaseLoader("https://example.com/blog/rag").load()

# Plain text file
txt_docs = TextLoader("notes.txt", encoding="utf-8").load()

print(len(pdf_docs), pdf_docs[0].metadata)
# 42 {'source': 'handbook.pdf', 'page': 0}
```

### Loading a whole folder

```python
from langchain_community.document_loaders import DirectoryLoader, TextLoader

loader = DirectoryLoader("docs/", glob="**/*.md", loader_cls=TextLoader)
docs = loader.load()
```

### load() vs lazy_load()
- `load()` reads everything into memory at once.
- `lazy_load()` is a generator that yields one document at a time. Use it for large corpora.

```python
for doc in PyPDFLoader("big.pdf").lazy_load():
    process(doc)
```

### Clean up metadata
Add your own metadata at load time so you can filter later.

```python
for d in pdf_docs:
    d.metadata["department"] = "hr"
    d.metadata["version"] = "2026-01"
```

### Key Points
- Loaders turn any source into `list[Document]`. Hundreds of loaders exist in `langchain_community.document_loaders`.
- Keep useful **metadata** (source, page, date). It enables citations and filtering.
- Scanned PDFs have no text layer; they need OCR first.
- Use `lazy_load()` for big data sets.

## Text Splitters
video: langchain recursivecharactertextsplitter chunk size overlap
summary: Splitters cut long documents into overlapping chunks small enough to embed and retrieve accurately.

Embedding a whole 50-page PDF as one vector loses detail, and models have size limits. A **text splitter** cuts documents into smaller **chunks**. The standard choice is `RecursiveCharacterTextSplitter`, which tries to split on paragraphs first, then lines, then words, so chunks stay readable. For chunking theory, see [Generative AI & RAG](/generative-ai).

### Basic usage

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,      # max characters per chunk
    chunk_overlap=200,    # characters shared between neighbours
    add_start_index=True, # store the position in metadata
)

chunks = splitter.split_documents(docs)   # keeps and copies metadata
print(len(docs), "documents ->", len(chunks), "chunks")
print(chunks[0].metadata)
```

Use `split_text(text)` when you have a raw string and want a list of strings.

### Why overlap?
Without overlap, a sentence can be cut in half and its meaning lost. Overlap repeats a little text at each boundary so context survives.

```text
Chunk 1: [ ...................... ]
Chunk 2:                   [ ...................... ]
                           ^ overlap
```

### Choosing sizes

| Content | Starting point |
| ------- | -------------- |
| Short FAQs | 300 to 500 chars, small overlap |
| General docs and articles | 800 to 1200 chars, 10 to 20% overlap |
| Long legal or technical text | 1000 to 2000 chars, more overlap |

There is no perfect number. **Test with real questions** and measure retrieval quality.

### Splitting code and Markdown
Language-aware splitting respects structure such as functions and headings.

```python
from langchain_text_splitters import Language

py_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.PYTHON, chunk_size=800, chunk_overlap=100
)
md_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.MARKDOWN, chunk_size=800, chunk_overlap=100
)
```

### Token-based sizing
Character counts are only an approximation of tokens. You can measure in tokens with `tiktoken`.

```python
splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
    encoding_name="cl100k_base", chunk_size=300, chunk_overlap=50
)
```

### The load, split, embed, store pipeline

```flow
title: Ingestion pipeline
direction: right
Load | PyPDFLoader
Split | RecursiveCharacterTextSplitter
Embed | OpenAIEmbeddings
Store | vector store
```

### Key Points
- Use `RecursiveCharacterTextSplitter` as the default. Call `split_documents` to keep metadata.
- `chunk_size` is the maximum chunk length; `chunk_overlap` preserves context between chunks.
- Chunks too big dilute meaning; too small lose context. Tune with real queries.
- Interview tip: be ready to explain the trade-off between chunk size and retrieval precision.

## Embeddings and Vector Stores
video: langchain vector store chroma pinecone openai embeddings
summary: Embeddings turn text into vectors, and vector stores save and search them by meaning.

An **embedding model** turns text into a vector of numbers so that similar meanings sit close together. A **vector store** saves those vectors and finds the nearest ones for a query. LangChain wraps many databases behind one interface, so you can start in memory and move to Chroma or Pinecone later. For the database internals, see [Vector Databases](/vector-databases).

### Create embeddings

```python
from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

vec = embeddings.embed_query("What is the refund policy?")
print(len(vec))   # 1536 numbers

vecs = embeddings.embed_documents(["chunk one", "chunk two"])   # list of vectors
```

Always use the **same embedding model** for indexing and querying. Vectors from different models are not comparable.

### In-memory store (prototyping)

```python
from langchain_core.vectorstores import InMemoryVectorStore

vector_store = InMemoryVectorStore.from_documents(chunks, embeddings)

results = vector_store.similarity_search("refund within how many days?", k=3)
for r in results:
    print(r.metadata.get("source"), "->", r.page_content[:80])
```

### Chroma (local, persistent)

```python
from langchain_chroma import Chroma

vector_store = Chroma(
    collection_name="company_docs",
    embedding_function=embeddings,
    persist_directory="./chroma_db",   # saved to disk
)
vector_store.add_documents(chunks)
```

### Pinecone (managed, production)

```python
from langchain_pinecone import PineconeVectorStore

# needs PINECONE_API_KEY and an existing index with matching dimensions
vector_store = PineconeVectorStore.from_documents(
    chunks, embeddings, index_name="company-docs"
)
```

### Searching with scores and filters

```python
# lower or higher score depends on the store's distance metric
docs_scores = vector_store.similarity_search_with_score("refund policy", k=3)

# metadata filter (Chroma syntax)
hr_only = vector_store.similarity_search(
    "leave policy", k=3, filter={"department": "hr"}
)
```

### Common store operations

| Operation | Method |
| --------- | ------ |
| Add documents | `add_documents(docs)` |
| Delete by id | `delete(ids=[...])` |
| Search | `similarity_search(query, k=4)` |
| Search with scores | `similarity_search_with_score(query)` |
| Turn into a retriever | `as_retriever()` |

### Key Points
- Embed with `OpenAIEmbeddings` (or another provider) and store with `InMemoryVectorStore`, `Chroma` or `PineconeVectorStore`.
- Use one embedding model for both documents and queries.
- Start in memory for prototypes; use a persistent or managed store for production.
- Metadata filters narrow search by department, date, tenant and more.
- Embedding costs real money. Index once and persist, do not re-embed on every run.

## Retrievers
video: langchain retrievers mmr similarity search
summary: A retriever takes a query string and returns relevant Documents; vector stores create one with as_retriever.

A **retriever** is a simple interface: give it a question, get back a list of relevant `Document` objects. Vector stores are the most common source, but a retriever can wrap anything: keyword search, an API or a database. Because it is a Runnable, it plugs straight into chains.

### From a vector store

```python
retriever = vector_store.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 4},
)

docs = retriever.invoke("What is the refund window?")   # list[Document]
```

### Search types

| search_type | Behaviour | Use when |
| ----------- | --------- | -------- |
| `"similarity"` | Top-k nearest vectors | Default, fast |
| `"mmr"` | Maximal marginal relevance: relevant but diverse | Results look repetitive |
| `"similarity_score_threshold"` | Only results above a score | You prefer no answer to a bad one |

```python
# MMR: fetch 20 candidates, return 5 diverse ones
mmr_retriever = vector_store.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 5, "fetch_k": 20, "lambda_mult": 0.5},
)

# Score threshold (scores are store-dependent, tune on real data)
strict = vector_store.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={"score_threshold": 0.5, "k": 4},
)
```

`lambda_mult` runs from 0 (maximum diversity) to 1 (maximum relevance).

### Filtering in the retriever

```python
hr_retriever = vector_store.as_retriever(
    search_kwargs={"k": 4, "filter": {"department": "hr"}}
)
```

### Writing your own retriever
Anything that maps a string to documents works. A `RunnableLambda` is the quickest way.

```python
from langchain_core.runnables import RunnableLambda
from langchain_core.documents import Document

def faq_lookup(query: str) -> list[Document]:
    answers = {"refund": "Refunds within 30 days."}
    return [Document(page_content=v) for k, v in answers.items() if k in query.lower()]

faq_retriever = RunnableLambda(faq_lookup)
print(faq_retriever.invoke("Tell me about refund rules"))
```

### Improving retrieval
- **Query rewriting**: have the LLM rewrite or expand the question before searching.
- **Hybrid search**: combine keyword (BM25) and vector search for exact terms and codes.
- **Re-ranking**: retrieve 20, then re-score and keep the best 4.
- Details of these techniques are in [Generative AI & RAG](/generative-ai).

### Key Points
- A retriever is `query -> list[Document]`, and it is a Runnable.
- `as_retriever` supports `similarity`, `mmr` and score threshold search; tune `k`.
- Use `mmr` to avoid near-duplicate results.
- Interview tip: explain why retriever quality matters more than the LLM in most RAG failures.

# Step 3: Building Applications

## Building a RAG Chain
video: langchain rag chain lcel tutorial
summary: Combine a retriever, prompt, model and parser with LCEL to answer questions from your own documents.

**Retrieval-Augmented Generation** finds relevant chunks for a question, puts them in the prompt, and asks the LLM to answer using only that context. With LCEL you build the whole flow in a few lines. This replaces the legacy `RetrievalQA` class, which you will still see in old tutorials.

```flow
title: RAG chain
direction: right
Question
Retriever | top-k chunks
Prompt | context + question
LLM
Answer
```

### Complete example

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
retriever = vector_store.as_retriever(search_kwargs={"k": 4})

prompt = ChatPromptTemplate.from_messages([
    ("system",
     "Answer using ONLY the context below. "
     "If the answer is not in the context, say you do not know.\n\n"
     "Context:\n{context}"),
    ("human", "{question}"),
])

def format_docs(docs):
    return "\n\n".join(
        f"[{d.metadata.get('source', 'unknown')}] {d.page_content}" for d in docs
    )

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

print(rag_chain.invoke("How many days do I have to request a refund?"))
```

### How the dictionary step works
The first step is a dict of runnables. LangChain runs each value **in parallel** on the same input (the question):
- `retriever | format_docs` fetches chunks and turns them into one string.
- `RunnablePassthrough()` forwards the original question unchanged.

The resulting dict `{"context": ..., "question": ...}` fills the prompt variables.

### Returning the sources
Users trust answers more when they see where they came from. Keep the retrieved documents in the output.

```python
from langchain_core.runnables import RunnableParallel, RunnableLambda

answer_chain = (
    RunnableLambda(lambda x: {"context": format_docs(x["context"]), "question": x["question"]})
    | prompt
    | llm
    | StrOutputParser()
)

rag_with_sources = (
    RunnableParallel(context=retriever, question=RunnablePassthrough())
    | RunnablePassthrough.assign(answer=answer_chain)
)

out = rag_with_sources.invoke("What is the refund window?")
print(out["answer"])
print([d.metadata["source"] for d in out["context"]])
```

### Add chat history
For follow-up questions such as "and for sale items?", first **rewrite** the question using history into a standalone question, then retrieve. See [LangChain Memory](/agentic-ai/langchain-memory) for history handling and [Generative AI & RAG](/generative-ai) for query rewriting.

### Common problems and fixes

| Problem | Fix |
| ------- | --- |
| Hallucinated answers | Strict prompt ("only the context"), `temperature=0` |
| Wrong chunks retrieved | Tune chunking, `k`, use MMR or re-ranking |
| Missing exact terms | Add hybrid (keyword + vector) search |
| Slow or costly | Smaller `k`, cache, cheaper model |

### Key Points
- RAG chain = `{"context": retriever | format_docs, "question": RunnablePassthrough()} | prompt | llm | StrOutputParser()`.
- The prompt must tell the model to use only the context and admit when it does not know.
- Return source documents so answers are verifiable.
- `RetrievalQA` and `LLMChain` are legacy. Use LCEL.
- Interview tip: describe the full pipeline (load, split, embed, store, retrieve, generate) and where each part can fail.

## Custom Tools
video: langchain custom tools @tool bind_tools
summary: Define tools with @tool or Pydantic schemas, bind them to a model and run the tool calls it requests.

A **tool** is a Python function with a name, a description and typed arguments that a model can ask you to run. The model never executes code itself. It returns a **tool call**, and your code runs it. The tool basics are in the [Agentic AI course](/agentic-ai); this topic shows how to define good tools and run the loop by hand.

### The @tool decorator

```python
from langchain_core.tools import tool

@tool
def get_weather(city: str) -> str:
    """Get the current weather for a city."""
    return f"It is 24 C and sunny in {city}."

print(get_weather.name)          # get_weather
print(get_weather.description)   # Get the current weather for a city.
print(get_weather.args)          # {'city': {'title': 'City', 'type': 'string'}}
print(get_weather.invoke({"city": "Pune"}))
```

The **docstring** becomes the description the model reads. Be specific about when to use the tool.

### Rich argument schemas
Use a Pydantic model for descriptions and validation.

```python
from pydantic import BaseModel, Field

class OrderQuery(BaseModel):
    order_id: str = Field(description="Order ID such as ORD-1001")
    include_items: bool = Field(default=False, description="Also return line items")

@tool(args_schema=OrderQuery)
def get_order(order_id: str, include_items: bool = False) -> str:
    """Look up an order by its ID."""
    return f"Order {order_id}: shipped"
```

### Letting the model call tools

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
llm_with_tools = llm.bind_tools([get_weather, get_order])

ai_msg = llm_with_tools.invoke("What's the weather in Pune?")
print(ai_msg.tool_calls)
# [{'name': 'get_weather', 'args': {'city': 'Pune'}, 'id': 'call_abc', 'type': 'tool_call'}]
```

### The manual tool loop
Run each requested tool, send the results back as `ToolMessage` objects, and ask the model again.

```python
from langchain_core.messages import HumanMessage

tools_by_name = {"get_weather": get_weather, "get_order": get_order}

messages = [HumanMessage("What's the weather in Pune?")]
ai_msg = llm_with_tools.invoke(messages)
messages.append(ai_msg)

for call in ai_msg.tool_calls:
    tool_msg = tools_by_name[call["name"]].invoke(call)   # returns a ToolMessage
    messages.append(tool_msg)

final = llm_with_tools.invoke(messages)
print(final.content)
```

This is exactly what `create_agent` automates in a loop. See [LangChain Agents](/agentic-ai/langchain-agents).

### A retriever as a tool
Wrap retrieval in a tool so an agent decides when to search your documents.

```python
@tool
def search_policies(query: str) -> str:
    """Search the company policy documents for relevant text."""
    docs = retriever.invoke(query)
    return "\n\n".join(d.page_content for d in docs)
```

### Writing good tools
- Use a clear verb name: `get_order`, `search_policies`.
- Describe inputs, outputs and when to use the tool.
- Return short strings or JSON, not huge payloads.
- Catch errors and return a helpful message instead of crashing.
- Require human approval for dangerous actions (delete, pay, send).

### Key Points
- `@tool` turns a function into a tool; the docstring and type hints become the schema.
- `llm.bind_tools([...])` makes the model return `ai_msg.tool_calls`; your code executes them.
- Send results back as `ToolMessage` so the model can write the final answer.
- Never trust tool arguments blindly. Validate them.
- Interview tip: explain that the model only requests a call, and the application executes it.

## Streaming and Batching
video: langchain streaming astream batch
summary: Stream tokens as they are generated for fast UX, and batch many inputs to run them concurrently.

Waiting 10 seconds for a full answer feels slow. **Streaming** shows tokens as they are generated, so users see text almost instantly. **Batching** runs many independent inputs at once to save total time. Every Runnable supports both, including whole LCEL chains.

### Streaming

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

chain = ChatPromptTemplate.from_template("Explain {topic} in 3 sentences.") | llm | StrOutputParser()

for chunk in chain.stream({"topic": "vector databases"}):
    print(chunk, end="", flush=True)
```

Streaming a model directly gives `AIMessageChunk` objects; the text is in `chunk.content`.

```python
for chunk in llm.stream("Write a haiku about code."):
    print(chunk.content, end="", flush=True)
```

### Async streaming
Use `astream` in async apps such as FastAPI.

```python
import asyncio

async def main():
    async for chunk in chain.astream({"topic": "RAG"}):
        print(chunk, end="", flush=True)

asyncio.run(main())
```

### Streaming from FastAPI

```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()

@app.get("/explain")
async def explain(topic: str):
    async def gen():
        async for chunk in chain.astream({"topic": topic}):
            yield chunk
    return StreamingResponse(gen(), media_type="text/plain")
```

### Streaming a RAG chain
The final parser streams text as it arrives, so the same `.stream()` call works on your `rag_chain`.

```python
for token in rag_chain.stream("What is the refund window?"):
    print(token, end="", flush=True)
```

### Batching

```python
topics = [{"topic": "RAG"}, {"topic": "embeddings"}, {"topic": "LCEL"}]

results = chain.batch(topics, config={"max_concurrency": 3})
for r in results:
    print(r[:60])
```

`max_concurrency` limits parallel calls so you do not hit provider **rate limits**. The async version is `await chain.abatch(topics)`.

### Intermediate events
For chains with several steps (retrieval, tools), `astream_events(..., version="v2")` emits events for each step so you can show progress such as "searching documents...".

### Which method when?

| Method | Use case |
| ------ | -------- |
| `invoke` | One input, wait for the result |
| `stream` / `astream` | Chat UIs, long answers |
| `batch` / `abatch` | Many inputs: evaluation, bulk processing |

### Key Points
- `stream()` for sync and `astream()` for async token streaming; they work on whole chains.
- `batch()` runs many inputs concurrently; set `max_concurrency` to respect rate limits.
- Streaming improves perceived speed, not total generation time.
- Interview tip: mention that parsers like `StrOutputParser` pass chunks through, so streaming survives the pipeline.

## Runnable Patterns: Parallel, Branching and Fallbacks
video: langchain runnableparallel runnablebranch with_fallbacks with_retry
summary: Run steps in parallel, route by condition, and make chains resilient with retries and fallback models.

Real apps need more than a straight line of steps. LCEL has building blocks to run steps **in parallel**, **route** input to different chains, and **recover** from failures. Because they are all Runnables, you can combine them freely.

### RunnableLambda: wrap any function

```python
from langchain_core.runnables import RunnableLambda

def clean(text: str) -> str:
    return text.strip().lower()

chain = RunnableLambda(clean) | prompt | llm | StrOutputParser()
```

Plain functions in a `|` pipe are converted to `RunnableLambda` automatically.

### RunnableParallel: fan out

```python
from langchain_core.runnables import RunnableParallel

summary_chain = ChatPromptTemplate.from_template("Summarize: {text}") | llm | StrOutputParser()
keywords_chain = ChatPromptTemplate.from_template("List 5 keywords for: {text}") | llm | StrOutputParser()

analysis = RunnableParallel(summary=summary_chain, keywords=keywords_chain)

result = analysis.invoke({"text": "LangChain is a framework for LLM apps..."})
print(result["summary"])
print(result["keywords"])
```

Both branches run concurrently, so total time is about that of the slowest branch.

```flow
Input text
Summary chain || Keywords chain
Combined dict
```

### Routing: choose a chain by input
The simplest and most flexible pattern is a **function that returns a runnable**.

```python
billing_chain = ChatPromptTemplate.from_template("As a billing expert answer: {q}") | llm | StrOutputParser()
tech_chain = ChatPromptTemplate.from_template("As a tech support expert answer: {q}") | llm | StrOutputParser()

def route(info: dict):
    if "refund" in info["q"].lower() or "invoice" in info["q"].lower():
        return billing_chain
    return tech_chain

router = RunnableLambda(route)
print(router.invoke({"q": "I need a refund for my invoice"}))
```

When the returned object is a Runnable, LangChain runs it with the same input.

### RunnableBranch: condition list
`RunnableBranch` takes `(condition, runnable)` pairs and a default.

```python
from langchain_core.runnables import RunnableBranch

branch = RunnableBranch(
    (lambda x: "refund" in x["q"].lower(), billing_chain),
    (lambda x: "error" in x["q"].lower(), tech_chain),
    ChatPromptTemplate.from_template("Answer generally: {q}") | llm | StrOutputParser(),  # default
)
```

For smarter routing, use an LLM with structured output (a `Literal` category) to classify the question first, then route on the result.

### Retries
Transient errors (timeouts, rate limits) are common. Retry automatically.

```python
reliable_llm = llm.with_retry(
    stop_after_attempt=3,
    wait_exponential_jitter=True,
)
```

### Fallbacks
If the main model fails, try a backup.

```python
from langchain_openai import ChatOpenAI

primary = ChatOpenAI(model="gpt-4o", max_retries=0)
backup = ChatOpenAI(model="gpt-4o-mini")

safe_llm = primary.with_fallbacks([backup])

chain = prompt | safe_llm | StrOutputParser()
```

Set `max_retries=0` on the primary so the failure moves to the fallback quickly. You can also add fallbacks on a whole chain, for example a simple chain as backup for a complex one.

### Key Points
- `RunnableParallel` (or a dict in a chain) runs steps concurrently and returns a dict.
- Route with a function returning a runnable, or with `RunnableBranch`.
- `.with_retry()` handles transient errors; `.with_fallbacks([...])` switches to another model or chain.
- All of these are Runnables, so they still support `invoke`, `stream` and `batch`.
- Interview tip: explain how fallbacks and retries make a production LLM app resilient to outages and rate limits.

# Step 4: Production

## LangSmith Tracing and Evaluation
video: langsmith tracing evaluation langchain tutorial
summary: LangSmith records every step of your chains for debugging and runs evaluations on datasets of examples.

LLM apps are hard to debug because each answer comes from many hidden steps: retrieval, prompts, tool calls, model replies. **LangSmith** records a **trace** of every run, showing inputs, outputs, latency, tokens and errors for each step. It also lets you test quality with datasets and evaluators.

### Turn on tracing
No code changes are needed. Set environment variables and run your app as usual.

```bash
# .env
LANGSMITH_TRACING=true
LANGSMITH_API_KEY=lsv2_...
LANGSMITH_PROJECT=rag-demo
```

Now every `chain.invoke(...)` shows up in the LangSmith UI as a tree: the chain, the retriever, the prompt, the model call and the parser.

### What a trace shows
- Exact prompt sent to the model (after all variables are filled in).
- Documents the retriever returned and their metadata.
- Tokens, cost estimates and latency for each step.
- Errors and the step where they happened.

### Add names, tags and metadata

```python
answer = rag_chain.invoke(
    "What is the refund window?",
    config={
        "run_name": "refund-question",
        "tags": ["prod", "rag-v2"],
        "metadata": {"user_id": "u42", "app_version": "1.4"},
    },
)
```

Tags and metadata let you filter traces later, for example "all failures for version 1.4".

### Trace your own functions

```python
from langsmith import traceable

@traceable(name="postprocess")
def postprocess(text: str) -> str:
    return text.strip()
```

### Evaluation with datasets
A **dataset** is a set of example questions with expected answers. An **evaluator** scores each output. Run it after every prompt or retriever change to catch regressions.

```python
from langsmith import Client

client = Client()

dataset = client.create_dataset("refund-qa")
client.create_examples(
    dataset_id=dataset.id,
    examples=[
        {"inputs": {"question": "How many days for refunds?"},
         "outputs": {"answer": "30 days"}},
        {"inputs": {"question": "Can I return sale items?"},
         "outputs": {"answer": "No"}},
    ],
)

def target(inputs: dict) -> dict:
    return {"answer": rag_chain.invoke(inputs["question"])}

def contains_expected(outputs: dict, reference_outputs: dict) -> bool:
    return reference_outputs["answer"].lower() in outputs["answer"].lower()

results = client.evaluate(
    target,
    data="refund-qa",
    evaluators=[contains_expected],
    experiment_prefix="rag-v2",
)
```

Compare experiments in the UI to see whether a change improved or hurt quality.

### Evaluator types
- **Code evaluators**: exact match, contains, regex, schema checks. Cheap and deterministic.
- **LLM-as-judge**: another model grades relevance or faithfulness. Flexible, but needs its own validation.
- **Human review**: annotate traces for the hardest cases.

### Key Points
- Set `LANGSMITH_TRACING=true`, `LANGSMITH_API_KEY` and `LANGSMITH_PROJECT`; tracing works automatically for LangChain code.
- Use tags and metadata to find and group runs.
- Datasets plus evaluators turn "it seems better" into measured results.
- Never log secrets or sensitive user data to traces without a policy.
- Interview tip: say you would trace in development and production, and run a dataset evaluation before every release.

## Caching and Cost Control
video: langchain caching set_llm_cache cost tokens
summary: Cache repeated calls, count tokens and trim context to cut latency and API cost in production.

LLM calls cost money and take seconds. Many apps ask the same questions repeatedly, or send far more text than needed. A few habits (caching, smaller models, token limits) can cut cost sharply without hurting quality.

### Cache identical LLM calls

```python
from langchain_core.globals import set_llm_cache
from langchain_core.caches import InMemoryCache

set_llm_cache(InMemoryCache())

import time
for _ in range(2):
    start = time.time()
    llm.invoke("What is LangChain in one line?")
    print(round(time.time() - start, 2), "seconds")
# first call: ~1 s, second call: ~0 s (cache hit, no API charge)
```

A cache hit needs the **same prompt and same model settings**. It works best with `temperature=0`.

### Persistent cache
`InMemoryCache` is lost on restart. For a file-based cache, use SQLite.

```python
from langchain_community.cache import SQLiteCache

set_llm_cache(SQLiteCache(database_path=".langchain.db"))
```

For many servers, use a shared cache such as Redis.

### Cache embeddings
Re-embedding unchanged documents wastes money. Wrap the embedding model with a store-backed cache.

```python
from langchain.embeddings import CacheBackedEmbeddings
from langchain.storage import LocalFileStore

store = LocalFileStore("./embedding_cache")
cached_embeddings = CacheBackedEmbeddings.from_bytes_store(
    embeddings, store, namespace="text-embedding-3-small"
)
```

Using the model name as the `namespace` prevents mixing vectors from different models.

### Track token usage

```python
ai_msg = llm.invoke("Explain RAG briefly.")
usage = ai_msg.usage_metadata
print(usage["input_tokens"], usage["output_tokens"], usage["total_tokens"])
```

Multiply by your provider's price per token to estimate cost, or let LangSmith show cost per trace.

### Cost control checklist

| Technique | Effect |
| --------- | ------ |
| Cheaper model for simple steps (classify, route) | Large saving |
| Smaller `k` and chunk size | Fewer prompt tokens |
| `max_tokens` on replies | Caps output cost |
| `trim_messages` on chat history | Stops history growing forever |
| LLM and embedding caches | No repeat charges |
| Provider prompt caching for a long stable prefix | Cheaper repeated system prompts |
| Retries limited with `max_retries` and timeouts | Avoids runaway spending |

### Key Points
- `set_llm_cache(InMemoryCache())` caches identical calls; use SQLite or Redis for persistence.
- Cache embeddings so unchanged documents are never re-embedded.
- Read `usage_metadata` to measure tokens, and trace cost in LangSmith.
- Route easy tasks to small models and keep prompts lean.
- Caching can hide prompt changes during development. Clear the cache when you edit prompts.

## Interview Quick Review
video: langchain interview questions and answers
summary: Fast revision of LangChain concepts, components and common interview questions with short answers.

Use this page for last-minute revision. Each answer is short on purpose, so you can say it clearly in an interview and then expand with an example from your own project.

### Core concepts in one line

| Concept | One-line answer |
| ------- | --------------- |
| Runnable | Standard interface with `invoke`, `stream`, `batch` (and async versions) |
| LCEL | The pipe-operator syntax that composes Runnables into chains |
| Document | `page_content` plus `metadata` |
| Loader | Source to `list[Document]` |
| Splitter | Long text to overlapping chunks |
| Embeddings | Text to vectors that capture meaning |
| Vector store | Stores vectors and finds nearest neighbours |
| Retriever | `query -> list[Document]` |
| Tool | Function the model can request; your code runs it |
| LangSmith | Tracing, datasets and evaluation |

### The RAG pipeline

```flow
title: End to end RAG
Load documents | loaders
Split into chunks | RecursiveCharacterTextSplitter
Embed and store | embeddings + vector store
Retrieve top-k | retriever
Generate answer | prompt + LLM + parser
```

### Common questions and short answers

**What is the difference between a chain and an agent?**
A chain has fixed steps. In an agent the LLM decides which tool to call next. See [LangChain Agents](/agentic-ai/langchain-agents).

**Why use `with_structured_output` instead of parsing JSON text?**
It uses the model's native tool or JSON mode and validates the result against a Pydantic schema, so it is far more reliable.

**Why do we need chunk overlap?**
To keep context that would be lost when a sentence or idea is cut at a chunk boundary.

**What is MMR?**
Maximal marginal relevance. It balances relevance with diversity to avoid near-duplicate chunks.

**How do you reduce hallucinations in RAG?**
Strict "answer only from context" prompt, `temperature=0`, good chunking, MMR or re-ranking, return sources, and say "I do not know" when context is missing.

**How do you make an LLM app reliable?**
Retries, fallback models, timeouts, input and output validation, and tracing.

**How do you cut costs?**
Cache LLM and embedding calls, use a small model for simple steps, limit `k` and `max_tokens`, and trim history.

**How do you evaluate a RAG app?**
Build a dataset of questions with expected answers, run evaluators in LangSmith, and compare experiments. Check both retrieval quality and answer faithfulness.

**What does the model do when you bind tools?**
It does not execute anything. It returns `tool_calls` with a name and arguments, and your code runs them and returns `ToolMessage` results.

### Legacy names to recognise
These appear in old tutorials. Know they are replaced.

| Legacy | Use now |
| ------ | ------- |
| `LLMChain` | A prompt, model and parser piped together with LCEL |
| `RetrievalQA` | LCEL RAG chain (see Building a RAG Chain) |
| `ConversationBufferMemory` | Message history or LangGraph state, see [LangChain Memory](/agentic-ai/langchain-memory) |
| `initialize_agent` / `AgentExecutor` | `create_agent` |

### Related topics
- [LangChain Prompt Templates](/agentic-ai/langchain-prompt-templates)
- [LangChain Chains and LCEL](/agentic-ai/langchain-chains-and-lcel)
- [Generative AI & RAG](/generative-ai) for chunking, hybrid search and re-ranking
- [Vector Databases](/vector-databases) for how similarity search works

### Key Points
- Be able to draw the RAG pipeline and name the LangChain component for each step.
- Know that everything is a Runnable and LCEL composes them.
- Describe reliability (retry, fallback), observability (LangSmith) and cost (caching, small models).
- Prefer a concrete example from your own project over textbook definitions.
