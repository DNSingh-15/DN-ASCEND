---
name: Agentic AI
icon: 🔗
category: AI
track: ai
color: #6366f1
order: 14
description: Build goal-driven AI agents that plan, use tools and loop until done, using LangChain and LangGraph.
---

## What is Agentic AI?
video: what is agentic ai
summary: Agentic AI = generate plus act: agents understand goals, plan steps, use tools, and iterate until done.

A normal LLM call only **generates** text. Agentic AI adds **action**: the system can decide what to do next and actually do it.

> **Generate + Action = Agents**

An agent can:
- Understand goals
- Plan steps
- Make decisions
- Use tools (APIs, databases, code)
- Iterate until completion

### Chatbot vs agent

| Chatbot | Agent |
| ------- | ----- |
| Answers one question | Works toward a goal |
| No tools | Calls APIs, DBs, code |
| One step | Many steps with decisions |
| Stops after replying | Loops until the task is complete |

### Example
Goal: "Create tests for this function and make sure they pass."
A chatbot writes some tests. An agent writes tests, runs them, reads the errors, fixes the tests, runs again, and stops when everything passes.

### Key Points
- Agentic AI = LLM + tools + loop + goal.
- The LLM is the decision-maker; tools do the real work.
- Needs guardrails because the system acts on its own.

## The Agentic Loop
video: agentic loop plan act observe ai agent
summary: Agentic AI repeats Goal, Plan, Act, Evaluate until the goal is reached.

> **Agentic AI = Goal → Plan → Act → Evaluate → Repeat**

```text
        ┌────────────────────────────────┐
        ↓                                │
Goal -> Plan -> Act (use tool) -> Observe result -> Evaluate
                                                      │
                                       done? ── yes ──┴──> Final answer
                                       no  -> back to Plan
```

### The steps
1. **Goal**: what the user wants.
2. **Plan**: the LLM decides the next step(s).
3. **Act**: call a tool (API, DB query, code runner).
4. **Observe**: read the tool result.
5. **Evaluate**: is the goal complete? If not, loop again.

### Minimal pseudo-code

```python
def run_agent(goal, tools, llm, max_steps=8):
    history = [goal]
    for _ in range(max_steps):              # always cap the loop
        decision = llm.decide(history, tools)
        if decision.is_final:
            return decision.answer
        result = tools[decision.tool](**decision.args)
        history.append(result)              # observation
    return "Stopped: step limit reached"
```

### Key Points
- Always set a max step limit and timeout to avoid infinite loops and runaway cost.
- The ReAct pattern (Reason + Act) is the most common loop design.

## Tools and Function Calling
video: ai agent tools function calling
summary: Tools are external functions such as APIs, DB queries and calculations that an agent can call.

**Tools** are functions the LLM can request: API calls, database queries, calculations, web search, code execution, file access.

The LLM does not run the tool. It outputs "call tool X with arguments Y", and your code executes it and returns the result.

### Defining a tool

```python
from langchain_core.tools import tool

@tool
def get_order_status(order_id: str) -> str:
    """Return the status of an order by its ID."""
    # real code would query a database
    return f"Order {order_id}: shipped"
```

The **docstring and type hints** are important: they become the tool description the LLM reads to decide when to use it.

### Using tools with a model

```python
llm_with_tools = llm.bind_tools([get_order_status])
resp = llm_with_tools.invoke("Where is order 42?")
print(resp.tool_calls)
# [{'name': 'get_order_status', 'args': {'order_id': '42'}, 'id': '...'}]
```

### MCP
The **Model Context Protocol** is a standard way to expose tools and data so any agent can use them without custom glue code.

### Key Points
- Tools = external actions. Write clear names, descriptions and typed arguments.
- Validate tool arguments in code. Never trust the model blindly with dangerous actions (delete, pay).

## Multi-Agent Architecture Patterns
video: multi agent systems patterns ai
summary: Common multi-agent designs include orchestrator-worker, pipeline, supervisor and peer collaboration.

One big agent with 30 tools gets confused. **Multi-agent systems** split the work into specialised agents with a few tools each.

### Common patterns

| Pattern | How it works | Example |
| ------- | ------------ | ------- |
| Pipeline (sequential) | Agent A → B → C | Parse → Analyse → Generate |
| Orchestrator-worker | One manager assigns tasks to workers | Planner assigns Code Analyzer, Generator |
| Supervisor / router | A router picks the right specialist | Support bot → billing or tech agent |
| Parallel fan-out | Several agents work at once, results merged | Extract patterns and analyse code together |
| Generator + critic | One agent creates, another reviews and requests fixes | Code Generator + Validator |

```flow
Orchestrator
Agent A || Agent B || Agent C
Aggregator
```

### When to use multi-agent
- The task has clearly different skills (retrieval, coding, validation).
- You need independent validation of results.
- A single prompt is too long or unreliable.

### When not to
Simple tasks. More agents = more latency, more cost, harder debugging. Start with one agent or a plain chain.

### Key Points
- Specialise agents; give each a small toolset and clear role.
- Add a validator or critic to improve quality.
- Keep the design as simple as the problem allows.

## Real Example: Multi-Agent Test Automation
video: multi agent architecture langgraph aws step functions
summary: A real architecture where React, Node, Step Functions, Lambda and a LangGraph agent engine generate test cases.

In **Qmentis-AI** I worked on the **Test Automation feature**, designing and implementing a **multi-agent AI system** that generates test scripts from user code or requirements.

```flow
Client (React UI) | user submits code / request
Backend API (Node.js) | validates input, sends request to AI flow
AWS Step Functions | manages workflow state and execution flow
AWS Lambda | invokes AI agent system
Orchestrator + Planner | Python LangGraph engine: controls agents, breaks task into steps
Pattern Extractor Agent || Code Analyzer Agent || Code Generator Agent || Validator Agent
Aggregation / Refinement Layer | produces final test output
PostgreSQL | stores test cases and execution logs
Response to Client | generated test scripts
```

### How to explain it in an interview
1. **React UI** collects code or requirements.
2. **Node.js API** validates input and starts the workflow.
3. **Step Functions** manage long-running workflow state, retries and timeouts.
4. **Lambda** invokes the Python agent engine.
5. **LangGraph engine**: Orchestrator controls execution, Planner breaks the task into steps, then Pattern Extractor, Code Analyzer and Code Generator work, and the Validator checks the generated tests.
6. **Aggregation layer** merges and refines results.
7. **PostgreSQL** stores test cases and execution logs for history and debugging.

### Key Points
- Orchestration happens at two levels: AWS Step Functions (infrastructure) and LangGraph (agent logic).
- A Validator agent plus stored logs gives quality control and traceability.
- Be ready to explain why each layer exists.

## What is LangChain?
video: langchain tutorial
summary: LangChain is a framework for building LLM apps by connecting prompts, models, tools, memory and data.

LangChain is a framework to **build LLM-powered applications**. It gives you ready-made building blocks:

- **Prompts**: reusable templates
- **Chains**: steps connected together
- **Memory**: conversation history
- **Tools**: external functions
- **Retrievers / loaders**: connect to your data

> **LangChain = glue between LLM + data + logic**

### Why use it?
Without a framework you write the same code again and again: build the prompt, call the API, parse the result, handle history, switch model providers. LangChain standardises this, so you can swap OpenAI for Claude or a local model by changing one line.

### Typical flow

```flow
User Input
Prompt Template
LLM
Tool | if needed
Response
```

### Packages (modern layout)
- `langchain-core`: base interfaces (prompts, runnables, tools)
- `langchain`: chains, agents
- `langchain-openai`, `langchain-anthropic`, ...: model integrations
- `langgraph`: stateful workflows
- `langsmith`: tracing and evaluation

### Key Points
- LangChain = building blocks for LLM apps.
- Good for quick pipelines: Q&A, RAG, simple tool use.

## LangChain Prompt Templates
video: langchain prompt template
summary: Prompt templates are reusable prompts with variables that are filled in at runtime.

A **prompt template** is a reusable prompt with `{variables}`. It keeps prompts out of messy string concatenation and makes them easy to test and version.

```python
from langchain_core.prompts import PromptTemplate

template = PromptTemplate.from_template("Hello {name}, explain {topic} simply.")
print(template.invoke({"name": "Ravi", "topic": "RAG"}).text)
```

### Chat prompt templates
For chat models, use roles (system, human, ai):

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a {role}. Be concise."),
    ("human", "{question}"),
])
messages = prompt.invoke({"role": "QA engineer", "question": "What is a unit test?"})
```

### Why it matters
- Same prompt reused in many places.
- Missing variables raise an error early.
- Easy to add few-shot examples and format instructions.

### Key Points
- Use `ChatPromptTemplate` for chat models.
- Keep prompts in one place (a file or module) so you can improve them without touching logic.

## LangChain Chains and LCEL
video: langchain chains lcel
summary: Chains connect steps like prompt, model and parser; LCEL joins them with the pipe operator.

A **chain** combines multiple steps in sequence:

```flow
direction: right
Input
Prompt
LLM
Output
```

Modern LangChain uses **LCEL (LangChain Expression Language)**: connect components with the `|` pipe operator.

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

prompt = ChatPromptTemplate.from_template("Explain {topic} in 2 lines.")
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

chain = prompt | llm | StrOutputParser()

print(chain.invoke({"topic": "vector database"}))
```

### What you get for free
Every LCEL chain is a `Runnable`, so it supports:
- `.invoke()` for a single call
- `.batch()` for many inputs
- `.stream()` for token streaming
- async versions (`ainvoke`, `astream`)

### Combining chains

```python
summary_chain = prompt_summary | llm | StrOutputParser()
translate_chain = prompt_translate | llm | StrOutputParser()
pipeline = summary_chain | (lambda s: {"text": s}) | translate_chain
```

### Key Points
- Chains = sequential, predictable execution.
- LCEL (`prompt | llm | parser`) is the current standard way to write them.

## LangChain Memory
video: langchain memory chat history
summary: Memory stores conversation history so chat apps remember earlier messages.

**Memory** stores conversation history, which is needed in chat applications because the LLM itself is stateless: each call is independent.

### Types of memory
- **Buffer memory**: keep all messages. Simple but grows without limit.
- **Window memory**: keep only the last N messages.
- **Summary memory**: an LLM summarises older messages to save tokens.

### Modern approach: message history per session

```python
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    MessagesPlaceholder("history"),
    ("human", "{input}"),
])

stores = {}
def get_history(session_id):
    return stores.setdefault(session_id, InMemoryChatMessageHistory())

chat = RunnableWithMessageHistory(
    prompt | llm,
    get_history,
    input_messages_key="input",
    history_messages_key="history",
)

chat.invoke({"input": "My name is Ravi"}, config={"configurable": {"session_id": "u1"}})
chat.invoke({"input": "What is my name?"}, config={"configurable": {"session_id": "u1"}})
```

In LangGraph, memory is handled by **state** and **checkpointers** (see later topics).

### Key Points
- LLMs are stateless; memory re-sends relevant history each call.
- Store history per user or session (use Redis or a database in production).
- Trim or summarise to control tokens.

## LangChain Agents
video: langchain agents tools
summary: A LangChain agent lets the LLM decide which tool to call and what action to take, dynamically.

In a chain the steps are fixed. In an **agent**, the **LLM decides** which tool to use and what to do next. That is dynamic execution.

### Example with a prebuilt agent

```python
from langchain.agents import create_agent
from langchain_core.tools import tool

@tool
def multiply(a: float, b: float) -> float:
    """Multiply two numbers."""
    return a * b

@tool
def search_docs(query: str) -> str:
    """Search internal documents."""
    return "Refund policy: 30 days."

agent = create_agent(model=llm, tools=[multiply, search_docs])

result = agent.invoke({"messages": [("user", "What is 12.5 times 8?")]})
print(result["messages"][-1].content)
```

The agent reads the question, decides to call `multiply`, gets the result, and writes the final answer. The older `AgentExecutor` and `langgraph.prebuilt.create_react_agent` patterns are deprecated in favour of `create_agent`.

### Chain vs agent

| Chain | Agent |
| ----- | ----- |
| Fixed steps | LLM chooses steps |
| Predictable | Flexible but less predictable |
| Cheaper and faster | More LLM calls |

### Key Points
- Agents = dynamic decision makers that use tools.
- Use `create_agent` (LangChain 1.x) for new projects; it replaces older `AgentExecutor` patterns.
- Limit steps and validate tool inputs.

## What is LangGraph?
video: langgraph tutorial
summary: LangGraph builds stateful, multi-agent workflows as graphs with loops and branching.

LangGraph is a library for building **stateful, multi-agent workflows**. It is the advanced step beyond LangChain chains.

> **LangGraph = workflow engine for agent systems**

You describe your system as a **graph**:
- **Nodes** are steps (functions or agents).
- **Edges** connect the steps.
- **State** is shared data that flows through the graph.

### Why LangGraph?
- **Multi-agent orchestration**: many agents in one workflow.
- **State management**: all nodes read and update a shared state.
- **Looping and branching**: retry, validate, go to different paths.
- **Better control** than a linear chain.
- **Persistence**: save state with checkpointers, pause and resume, human-in-the-loop.

### Flow example

```flow
User Input
Planner Agent
Executor Agent
Tool Call
Decision Node
Loop / Next Step
Final Output
```

### Key Points
- LangGraph = graph of nodes and edges around a shared state.
- Ideal for loops, validation retries and multiple agents.
- This is what the Qmentis-AI engine used.

## LangGraph State, Nodes and Edges
video: langgraph state nodes edges
summary: A LangGraph app has a typed State, node functions that update it, and edges that decide what runs next.

Three core ideas:

1. **State**: a typed dictionary shared by all nodes.
2. **Nodes**: Python functions that read the state and return updates.
3. **Edges**: connections between nodes. Normal edges always go to the next node; **conditional edges** choose the next node based on state.

### Small working example

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    question: str
    answer: str
    attempts: int

def generate(state: State) -> dict:
    return {"answer": f"Draft for: {state['question']}",
            "attempts": state["attempts"] + 1}

def validate(state: State) -> str:
    # conditional edge: returns the name of the next route
    if len(state["answer"]) > 10 or state["attempts"] >= 3:
        return "done"
    return "retry"

graph = StateGraph(State)
graph.add_node("generate", generate)

graph.add_edge(START, "generate")
graph.add_conditional_edges("generate", validate,
                            {"retry": "generate", "done": END})

app = graph.compile()
result = app.invoke({"question": "What is RAG?", "answer": "", "attempts": 0})
print(result["answer"])
```

### How to read it
`START → generate → (validate) → either back to generate or END`. The loop is capped by `attempts`.

### Key Points
- Nodes return only the fields they change; LangGraph merges them into the state.
- Conditional edges implement decisions, retries and routing.
- Always include an exit condition or a max-attempts counter.

## Building a Multi-Agent Graph
video: langgraph multi agent supervisor example
summary: Build planner, worker and validator agents as LangGraph nodes with conditional routing and a retry loop.

This is a simplified version of the Qmentis-style design: Planner → Generator → Validator, with a retry loop.

```python
from typing import TypedDict, Annotated
from operator import add
from langgraph.graph import StateGraph, START, END

class TestState(TypedDict):
    code: str
    plan: list[str]
    tests: str
    errors: Annotated[list[str], add]   # reducer: append instead of overwrite
    retries: int

def planner(state: TestState):
    steps = llm.invoke(f"List test steps for:\n{state['code']}").content.split("\n")
    return {"plan": steps}

def generator(state: TestState):
    prompt = f"Write tests following {state['plan']}. Fix errors: {state['errors']}"
    return {"tests": llm.invoke(prompt).content,
            "retries": state["retries"] + 1}

def validator(state: TestState):
    ok, err = run_tests(state["tests"])        # deterministic check
    return {"errors": [] if ok else [err]}

def route(state: TestState) -> str:
    if not state["errors"] or state["retries"] >= 3:
        return "end"
    return "fix"

g = StateGraph(TestState)
g.add_node("planner", planner)
g.add_node("generator", generator)
g.add_node("validator", validator)

g.add_edge(START, "planner")
g.add_edge("planner", "generator")
g.add_edge("generator", "validator")
g.add_conditional_edges("validator", route, {"fix": "generator", "end": END})

app = g.compile()
```

### Key ideas
- **Reducers** (`Annotated[list, add]`) tell LangGraph how to combine updates.
- The **Validator is plain code** (running tests), which follows the "deterministic logic" principle.
- The loop gives self-correction: errors go back to the generator.

### Key Points
- Multi-agent = several nodes with different roles in one graph.
- Combine LLM nodes with deterministic nodes for reliable output.

## LangGraph Persistence and Human in the Loop
video: langgraph checkpointer human in the loop
summary: Checkpointers save graph state so workflows can resume, remember conversations, and pause for human approval.

Real agents need to **remember** and sometimes **wait for a human**. LangGraph supports this through **checkpointers**, which save the state after every step.

### Memory per conversation

```python
from langgraph.checkpoint.memory import MemorySaver

app = graph.compile(checkpointer=MemorySaver())

config = {"configurable": {"thread_id": "user-42"}}
app.invoke({"messages": [("user", "Hi, I am Ravi")]}, config)
app.invoke({"messages": [("user", "Who am I?")]}, config)   # remembers
```

Each `thread_id` is a separate conversation. In production use a database checkpointer (Postgres or Redis) instead of `MemorySaver`.

### Human in the loop
Pause before a risky step (send email, deploy, delete) and continue only after approval:

```python
app = graph.compile(checkpointer=MemorySaver(), interrupt_before=["send_email"])
```

The graph stops, you show the draft to the user, and resume with the same `thread_id` after approval.

### Other benefits
- Resume after a crash or timeout.
- Time travel: replay from an earlier state for debugging.
- Streaming of intermediate steps to the UI.

### Key Points
- Checkpointer = saved state; `thread_id` = conversation key.
- Use interrupts for approvals on dangerous actions.

## LangChain vs LangGraph
video: langchain vs langgraph difference
summary: LangChain is a linear pipeline toolkit; LangGraph is a graph-based engine for complex stateful agent workflows.

| Feature | LangChain | LangGraph |
| ------- | --------- | --------- |
| Type | Linear flow | Graph-based |
| Use case | Simple apps | Complex workflows |
| Agents | Basic | Advanced multi-agent |
| State | Limited | Strong, explicit and persistent |
| Loops / branching | Awkward | Natural (conditional edges) |
| Human approval | Manual | Built-in interrupts |
| Control | Less | Fine-grained |

> **LangChain = simple pipeline. LangGraph = complex workflow.**

### They work together
LangGraph is not a replacement for LangChain. You still use LangChain's prompts, models, tools and retrievers *inside* LangGraph nodes. LangGraph just controls how the steps are connected and repeated.

```text
LangGraph (flow control)
   └── nodes use LangChain parts: prompt | llm | parser, tools, retrievers
```

### Interview line
"LangChain chains are good for fixed pipelines like RAG Q&A. When I needed loops, validation retries, multiple agents and shared state, I used LangGraph."

### Key Points
- Both are part of the same ecosystem; choose based on flow complexity.
- LangChain for linear steps, LangGraph for decisions and loops.

## When to Use What
video: when to use agents vs chains vs rag
summary: Use plain code or a chain for simple tasks, LangChain for pipelines, and LangGraph for multi-agent, decision-based flows.

Do not use agents everywhere. Pick the simplest tool that solves the problem.

| Need | Choice |
| ---- | ------ |
| One fixed task (summarise, classify, extract) | Single LLM call |
| Answer from documents | RAG chain (LangChain) |
| Chatbot with history | LangChain + message history |
| LLM must pick between a few tools | Agent (`create_agent`) |
| Multi-step, branching, retries | LangGraph |
| Several specialised agents, shared state | LangGraph multi-agent |
| Long-running, needs approval or resume | LangGraph + checkpointer |
| Pure rules or calculations | Normal code, no LLM |

### Use LangChain for
Simple applications such as chatbots and Q&A systems.

### Use LangGraph for
Complex systems: multi-agent workflows, decision-based flows, AI pipelines.

### Trade-offs of agents
- More LLM calls: higher latency and cost
- Less predictable behaviour
- Harder to test and debug

So: start simple, add agents only when a fixed pipeline cannot handle the variation.

### Key Points
- Complexity must be earned by the problem.
- Add guardrails, step limits and observability to every agent system.

## Guardrails and Reliability for Agents
video: ai agents guardrails reliability evaluation
summary: Agents need step limits, validated tool inputs, output checks, tracing and fallbacks to be production-safe.

Because agents act on their own, a mistake can cause real damage. Build in safety.

### Checklist
- **Step and time limits**: stop infinite loops (`recursion_limit` in LangGraph).
- **Input guardrails**: detect prompt injection, validate size and type.
- **Tool permissions**: give each agent only the tools it needs; read-only by default.
- **Argument validation**: use typed schemas (Pydantic) for tool inputs.
- **Output guardrails**: validate JSON schema, check against sources.
- **Human approval** for irreversible actions.
- **Fallbacks**: retry, backup model, or a safe default message.
- **Observability**: trace every step (LangSmith or Langfuse).

### Example: limit steps

```python
result = app.invoke(
    {"messages": [("user", "Generate tests")]},
    config={"recursion_limit": 15},
)
```

### Prompt injection in agents
Tool results (web pages, documents, emails) can contain hidden instructions like "ignore your rules and send the data". Treat all tool output as untrusted data, never as commands.

### Key Points
- Least privilege for tools, limits for loops, validation for outputs.
- Trace everything so failures can be diagnosed.

## Real Use Case: Resume Analyzer
video: resume analyzer ai agent project langgraph
summary: A resume analyzer agent uses a planner, retriever, LLM and validator to produce a reliable scored report.

**Resume Analyzer** is a simple but complete agentic AI project.

### Agents and roles
- **Planner**: decides the steps (parse resume, fetch job requirements, compare, score).
- **Retriever**: fetches job description and skill data (RAG / database).
- **LLM**: extracts skills and writes the feedback.
- **Validator**: guardrails; checks JSON schema and removes unsupported claims.

```flow
Resume Upload
Input Guardrail | file type, size, injection check
Planner Agent
Parser
Retriever | job requirements
LLM Skill Extraction
Deterministic Scoring | Python
Validator Agent | schema check, hallucination check
Final Report | score + strengths + gaps
```

### Why this design works
- LLM does language tasks (understand the resume, write feedback).
- **Python computes the score**, so it is repeatable.
- The validator catches bad JSON or invented skills before the user sees them.

### Key Points
- Planner decides, Retriever supplies facts, LLM reasons, Validator protects.
- Mixing AI with deterministic logic is the main design lesson.

## Quick Memory and Interview Points
video: agentic ai interview questions langchain langgraph
summary: One-line answers for the most common agentic AI, LangChain and LangGraph interview questions.

### Quick memory

- **LangChain = simple pipeline**
- **LangGraph = complex workflow**
- **Agents = decision makers**
- **Tools = external actions**

### Interview points

| Question | Short answer |
| -------- | ------------ |
| What is Agentic AI? | Goal → Plan → Act → Evaluate → Repeat with tools |
| LangChain? | Framework for chaining LLM calls, prompts, tools, memory |
| LangGraph? | Graph-based orchestration with state, loops, branching |
| Agent vs chain? | Chain has fixed steps; agent chooses steps dynamically |
| Tool? | External function the LLM can request (API, DB, code) |
| Why multi-agent? | Specialisation, validation and easier debugging |
| How do you make agents reliable? | Step limits, guardrails, deterministic checks, tracing |

### Sample answer: "Tell me about your project"
"In Qmentis-AI I built the Test Automation feature. A React UI sends code to a Node.js API, AWS Step Functions manage the workflow, Lambda calls a Python LangGraph engine with Orchestrator, Planner, Pattern Extractor, Code Analyzer, Code Generator and Validator agents, and results are stored in PostgreSQL."

### Key Points
- Explain concepts in one sentence, then give your project as evidence.
- Always mention guardrails and deterministic logic.
