---
name: Node.js
icon: 🟩
category: Backend
track: fullstack
color: #22c55e
order: 5
description: Node.js is a JavaScript runtime built on the V8 engine that lets you run JavaScript on servers to build fast, scalable network applications and APIs.
---

## What is Node.js
video: nodejs introduction what is nodejs
summary: Node.js is a JavaScript runtime built on Chrome's V8 engine that runs JavaScript outside the browser.

Node.js is a **JavaScript runtime environment**. Before Node.js, JavaScript could only run inside a browser. Node.js takes the **V8 engine** (the same engine that powers Chrome), wraps it with extra features (file access, networking, timers), and lets you run JavaScript on a server or your own computer.

> Note: Node.js does not turn JS into machine code by itself. The V8 engine handles compilation (JIT) internally. Node.js adds the system APIs around V8.

### Why developers use it
- One language (JavaScript) for frontend and backend
- Non-blocking I/O makes it great for apps with many simultaneous connections
- Huge ecosystem of packages on npm

### Common use cases
- Real-time chats
- Streaming applications
- Microservices architecture
- Complex SPAs (Single-Page Applications) with API backends
- Internet of Things (IoT) projects

```js
// hello.js  ->  run with: node hello.js
console.log("Hello from Node.js");
```

### Key Points
- Node.js = V8 engine + libuv + system APIs
- Runs JS outside the browser
- Best for I/O-heavy apps, not for heavy CPU work
- Interview tip: "Node.js is a runtime, not a language or a framework."

## How Node.js Works
video: nodejs architecture explained
summary: Node.js is single-threaded, event-driven and non-blocking: V8 runs your JS while libuv handles slow I/O in the background.

Node.js is **event-driven** and **non-blocking**. Your JavaScript code runs on one main thread. When you ask for something slow (read a file, query a database, call an API), Node hands the job to the system (libuv / OS) and keeps running other code. When the job is done, a callback is placed in the **event queue**, and the **event loop** picks it up and runs it.

![Node.js architecture with event queue, event loop and thread pool](/images/node.webp)

The second picture shows the whole system: your application talks to V8, Node bindings connect JS to C++ code, and libuv runs the event loop and the worker thread pool.

![The Node.js system: V8, Node bindings, libuv, event loop and worker threads](/images/node1.png)

### Flow in simple steps
1. Requests arrive and enter the event queue.
2. The event loop takes one request at a time.
3. Non-blocking work (like network I/O polling) is handled directly by the OS.
4. Blocking work (file system, DNS, crypto) goes to the thread pool.
5. When finished, the callback returns to the event loop and runs on the main thread.

### Key Points
- One JS thread, but I/O happens in the background
- Never block the main thread with heavy loops
- Great for real-time, high-concurrency apps

## Event Loop Phases
video: nodejs event loop phases
summary: The event loop cycles through fixed phases (timers, poll, check, close) to decide which callback runs next.

The **event loop** is the engine that lets Node.js do async work on a single thread. It runs in a loop and, in every cycle, visits several **phases**. Each phase has its own queue of callbacks.

```text
   ┌───────────────────────────┐
┌─>│ timers                    │  setTimeout, setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
│  │ pending callbacks         │  some system errors
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
│  │ idle, prepare             │  internal use
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
│  │ poll                      │  I/O callbacks (files, network)
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
│  │ check                     │  setImmediate
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
└──┤ close callbacks           │  socket.on('close')
   └───────────────────────────┘
```

Between phases Node also drains two special queues: `process.nextTick()` first, then Promise microtasks.

```js
console.log("1 start");
setTimeout(() => console.log("4 timeout"), 0);
setImmediate(() => console.log("5 immediate"));
Promise.resolve().then(() => console.log("3 promise"));
process.nextTick(() => console.log("2 nextTick"));
console.log("1 end");
// start, end, nextTick, promise, timeout, immediate
```

### Key Points
- nextTick runs before promises, which run before timers
- setTimeout vs setImmediate order can vary in the main module
- Interview tip: be able to name the six phases in order

## libuv and Thread Pool
video: libuv thread pool nodejs
summary: libuv is the C library behind Node's event loop and a thread pool of 4 threads for blocking tasks.

**libuv** is a C library that gives Node.js its event loop and async I/O. It hides operating system differences (Windows, Linux, macOS) behind one API.

Some operations have no async support in the OS (for example many file system calls, DNS lookups, `crypto.pbkdf2`, `zlib`). libuv runs these in a **thread pool**. The default size is **4 threads**, and you can change it with the `UV_THREADPOOL_SIZE` environment variable.

```flow
JS code | calls Node API (fs.readFile)
libuv event loop
Network I/O | OS handles it || Blocking work | thread pool: 4 threads
Callback queued
Your callback | run by the event loop
```

```js
const fs = require("fs");

fs.readFile("big.txt", (err, data) => {
  // runs later on the main thread, after a pool thread read the file
  console.log("file read done");
});
console.log("this prints first");
```

Important: your own JavaScript code is **not** run in the thread pool. Only the underlying C++ work is.

### Key Points
- libuv = event loop + thread pool + async I/O
- Default thread pool size = 4
- Network I/O mostly uses OS async mechanisms, not the pool

## REPL
video: nodejs repl
summary: REPL (Read, Evaluate, Print, Loop) is an interactive Node shell for quickly testing JavaScript.

**REPL** stands for **Read, Evaluate, Print, Loop**. It is an interactive shell that comes with Node. Type `node` in your terminal (without a file name) and you can run JavaScript line by line and see results instantly.

```text
$ node
> 2 + 3
5
> const name = "Node"
undefined
> name.toUpperCase()
'NODE'
> .help
> .exit
```

### Useful features
- `_` holds the result of the last expression
- Tab key auto-completes names
- Dot commands: `.help`, `.save file.js`, `.load file.js`, `.exit`
- All built-in modules are available without `require`

### One-line summary
REPL = quick testing and debugging tool.

### Key Points
- Start with `node`, exit with `.exit` or Ctrl+C twice
- Perfect for trying out small snippets or checking an API

## Modules
video: nodejs modules require import export
summary: Modules are reusable code units; Node supports CommonJS (require) and ES Modules (import).

Modules are **reusable code units** that help organize a Node.js app. Every file is a module by default.

### Two module systems
| | CommonJS | ES Modules |
|---|---|---|
| Import | `require()` | `import` |
| Export | `module.exports` | `export` / `export default` |
| File type | `.js` (default) or `.cjs` | `.mjs` or `"type": "module"` in package.json |
| Loading | synchronous | asynchronous |

### Types of modules

#### 1. Built-in modules
Provided by Node.js, no install needed:
- `http` - server creation
- `fs` - file system
- `url` - URL handling
- `stream` - data streaming
- `cluster` - scaling
- `path`, `os`, `events`, `crypto` and more

#### 2. Custom modules
User-defined reusable code.

```js
// customModule.js
module.exports = (a, b) => a + b;

// app.js
const add = require("./customModule");
console.log(add(2, 3)); // 5
```

```js
// ES Module version
export const add = (a, b) => a + b;
import { add } from "./math.mjs";
```

#### 3. Third-party modules
Installed from npm, for example `express`.

### Key Points
- Each file has its own scope; only what you export is visible
- Node caches modules after the first `require`
- Use `./` for local files, bare names for packages

## NPM and package.json
video: npm package.json nodejs tutorial
summary: npm installs and manages third-party packages; package.json records your project's dependencies and scripts.

**npm (Node Package Manager)** installs and manages JavaScript packages (dependencies). It comes bundled with Node.js. Note: npm does not manage Node versions. For switching Node versions use a tool like **nvm** (or fnm, volta).

### Common commands
| Command | Purpose |
|---|---|
| `npm init -y` | create package.json |
| `npm install` | install all dependencies |
| `npm install express` | add a package |
| `npm install -D nodemon` | add a dev-only package |
| `npm update` | update packages (within allowed ranges) |
| `npm uninstall express` | remove a package |
| `npm run dev` | run a script |
| `npx create-next-app` | run a package without installing it globally |

### package.json
```json
{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": { "express": "^4.19.0" }
}
```

`package-lock.json` locks exact versions so every machine gets the same install. Never commit `node_modules`; add it to `.gitignore`.

### Key Points
- dependencies vs devDependencies
- `^` allows minor updates, `~` allows patch updates
- Interview tip: npm = package manager, nvm = version manager

## Built-in HTTP Server
video: nodejs http module create server
summary: Node's built-in http module can create a web server without any framework.

Before using Express, it helps to know that Node can create a server on its own using the built-in `http` module.

```js
const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Hello" }));
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(3000, () => console.log("Server on 3000"));
```

- `req` (IncomingMessage) holds the URL, method, headers and body stream.
- `res` (ServerResponse) is used to send status, headers and data back.
- You must call `res.end()` or the request will hang.

Doing routing, body parsing and headers by hand gets tedious. That is why frameworks like Express exist.

### Key Points
- `http.createServer` takes a callback run for every request
- The body arrives as a stream of chunks
- Express is a thin layer over this module

## Event-Driven Programming
video: nodejs event driven programming
summary: Node runs code in response to events (requests, timers, file reads) instead of strictly top to bottom.

Node.js runs code based on **events** instead of only sequential flow.

👉 Listens → triggers → executes

You register a function (a **listener** or callback) for an event, and Node calls it whenever that event happens. Examples of events: an HTTP request arrives, a file finishes reading, a timer expires, a user clicks a button (in the browser).

```js
const fs = require("fs");

// 1. register interest in an event
fs.readFile("a.txt", "utf8", (err, data) => {
  // 3. runs when the event "file read finished" fires
  console.log(data);
});

// 2. continue immediately
console.log("Reading file...");
```

### Callbacks, Promises, async/await
Callbacks were the first way to handle async results. Promises and `async/await` are cleaner ways to write the same idea.

```js
const fs = require("fs/promises");

async function main() {
  const data = await fs.readFile("a.txt", "utf8");
  console.log(data);
}
main();
```

### Key Points
- Event-driven = react to events with callbacks
- Avoid "callback hell" by using async/await
- Many Node objects (streams, servers) are built on EventEmitter

## EventEmitter
video: nodejs eventemitter
summary: EventEmitter lets you emit named events and listen to them with on(), the base of many Node APIs.

`EventEmitter` (from the `events` module) is a class used to **emit and listen to events**.

- `on()` - listen for an event
- `emit()` - trigger an event

```js
const emitter = new (require('events'))();

emitter.on('greet', () => console.log('Hello'));
emitter.emit('greet');
```

### More useful methods
```js
const EventEmitter = require("events");
const emitter = new EventEmitter();

emitter.on("order", (id, item) => console.log("Order", id, item));
emitter.once("start", () => console.log("runs only once"));

emitter.emit("order", 101, "Pizza");   // arguments are passed to listeners
emitter.emit("start");
emitter.emit("start");                  // nothing happens the second time

emitter.off("order", () => {});         // remove a listener
```

### Real use
Streams, HTTP servers, and processes all extend EventEmitter. You can also extend it for your own classes (`class Chat extends EventEmitter`).

### Key Points
- Listeners run synchronously, in the order they were added
- Always handle the special `error` event or the process may crash
- Interview tip: `on` listens, `emit` fires, `once` listens one time

## Buffers
video: nodejs buffer
summary: A Buffer is a fixed chunk of memory for raw binary data such as files, images or network packets.

A **Buffer** is temporary memory for binary data. JavaScript strings are great for text, but files, images, and network packets are raw bytes. Buffers hold those bytes.

```js
const buf = Buffer.from("Hello");
console.log(buf);                 // <Buffer 48 65 6c 6c 6f>
console.log(buf.toString());      // "Hello"
console.log(buf.length);          // 5

const empty = Buffer.alloc(10);   // 10 zero-filled bytes
```

### Streams vs Buffer
- **Buffer** - the full data is loaded into memory first, then used.
- **Stream** - data is processed in small chunks as it arrives.

```text
Buffer:  [ whole 2GB file in RAM ] -> process
Stream:  [chunk][chunk][chunk] ... -> process each chunk, then discard
```

👉 Streams are memory efficient. Reading a 2 GB file into a buffer may crash your app; streaming it will not.

### Key Points
- Buffers are fixed size and hold bytes
- `Buffer.from()` and `Buffer.alloc()` are the safe ways to create them
- Streams use buffers internally for each chunk

## Streams
video: nodejs streams pipe
summary: Streams process large data in chunks instead of loading everything into memory.

Streams allow reading/writing large data efficiently **without loading it all** into memory.

👉 **One-line:** Process data in chunks.

### Types
1. **Readable** - read operations (`fs.createReadStream`, HTTP request)
2. **Writable** - write operations (`fs.createWriteStream`, HTTP response)
3. **Duplex** - read and write both (a TCP socket)
4. **Transform** - modify data while it passes through (compression, encryption)

```js
const fs = require("fs");

const readStream = fs.createReadStream("input.txt");
const writeStream = fs.createWriteStream("output.txt");

readStream.pipe(writeStream);
```

### Transform example
```js
const zlib = require("zlib");

fs.createReadStream("input.txt")
  .pipe(zlib.createGzip())              // Transform
  .pipe(fs.createWriteStream("input.txt.gz"));
```

`pipe()` also handles **backpressure**: if the writer is slower than the reader, it pauses the reader automatically. For error handling in pipelines, prefer `stream.pipeline()`.

### Key Points
- Streams are EventEmitters (`data`, `end`, `error` events)
- Use for large files, video streaming, uploads
- Interview tip: name the 4 types and give one example each

## Process, Cluster and Worker Threads
video: nodejs cluster vs worker threads
summary: Cluster handles more users by running copies of your app; worker threads handle heavy CPU tasks inside one process.

These three ideas are often confused.

- **Cluster** → handle more users
- **Worker Threads** → handle heavy tasks
- **Process** → a running program. Inside a process we have threads, which are responsible for executing the work.

Node runs your JS on a single thread, so one process uses only one CPU core. To use all cores you run several processes (cluster). To run CPU-heavy JS without freezing the event loop you use worker threads.

![Clustering: master forks workers](/images/cluster.png)

![Master process distributing requests to child processes](/images/cluster1.png)

```flow
Client Requests
Master Process | single port, distributes requests like a load balancer
Child Process 1 | own memory, own event loop || Child Process 2 | own memory, own event loop || Child Process N | own memory, own event loop
```

### Cluster example
```js
const cluster = require("cluster");
const http = require("http");
const os = require("os");

if (cluster.isPrimary) {
  os.cpus().forEach(() => cluster.fork());
} else {
  http.createServer((req, res) => res.end("Hi from " + process.pid)).listen(3000);
}
```

### Worker thread example
```js
const { Worker, isMainThread, parentPort } = require("worker_threads");

if (isMainThread) {
  const w = new Worker(__filename);
  w.on("message", (result) => console.log("Result:", result));
} else {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) sum += i;   // heavy work off the main thread
  parentPort.postMessage(sum);
}
```

### Key Points
- Cluster = multiple processes, separate memory, one shared port
- Worker threads = threads in one process, can share memory
- Use cluster for I/O throughput, workers for CPU tasks

## Process vs Thread Architecture
video: nodejs process threads libuv child process
summary: A Node process has one JS thread, libuv's thread pool, optional worker threads and separate child processes.

This diagram puts everything together: what lives inside one Node process and what lives outside it.

```flow
Node.js Process | your running app: single JS thread, one memory space
Event Loop | main thread: API, DB, timers || libuv | C++ engine: FS, DNS, I/O || Worker Threads | parallel JS threads for CPU tasks
Thread Pool | 4 threads (used by libuv) || Shared Memory | same process (used by workers)
```

### Comparison
| | Child process / Cluster | Worker thread |
|---|---|---|
| Memory | separate | can share (SharedArrayBuffer) |
| Event loop | own | own |
| Isolation | strong, a crash does not kill others | weaker |
| Startup cost | higher | lower |

### Key Points
- Process = isolated memory; thread = runs inside a process
- libuv's thread pool is internal; worker threads are for your own JS
- Interview tip: "Node is single-threaded for JS, but not single-threaded overall."

## Child Processes
video: nodejs child process spawn exec fork
summary: The child_process module starts other programs or Node scripts; spawn, exec and fork differ in how they handle output.

A **child process** is a separate OS process started from your Node app. It has its own memory (no sharing) so it is fully isolated.

```flow
Child Processes | separate OS processes, new memory, isolation
spawn() || exec() || fork()
```

- `spawn()` → create child process (run any OS command, **stream** data)
- `exec()` → create child process (run command, **buffer** output, give it all at the end)
- `fork()` → create child process (**Node.js scripts only** + IPC messaging channel)

```js
const { spawn, exec, fork } = require("child_process");

// spawn: streams output, good for large output
const ls = spawn("ls", ["-la"]);
ls.stdout.on("data", (d) => console.log(d.toString()));

// exec: whole output in a callback, good for small output
exec("node -v", (err, stdout) => console.log(stdout));

// fork: another Node script, talk using messages
const child = fork("./worker.js");
child.send({ task: "compute" });
child.on("message", (msg) => console.log(msg));
```

### Key Points
- Never pass unchecked user input to `exec` (command injection risk)
- `fork` is what `cluster` uses internally
- Choose spawn for big output, exec for small, fork for Node-to-Node work

## Express.js Basics
video: expressjs tutorial for beginners
summary: Express is a minimal framework on top of Node's http module for building APIs and web servers quickly.

**Express.js** is a minimal framework to build APIs. It simplifies routing, request parsing and middleware over the raw `http` module.

```js
const express = require('express');
const app = express();

app.use(express.json());
app.get('/', (req, res) => res.send("Hello"));
app.listen(3000);
```

### Routing
A route = HTTP method + path + handler.

```js
app.get("/users", (req, res) => res.json([{ id: 1 }]));
app.post("/users", (req, res) => res.status(201).json(req.body));
```

### Router (organizing code)
```js
// routes/users.js
const router = require("express").Router();
router.get("/", (req, res) => res.json([]));
router.get("/:id", (req, res) => res.json({ id: req.params.id }));
module.exports = router;

// app.js
app.use("/api/users", require("./routes/users"));
```

### Response helpers
`res.send()`, `res.json()`, `res.status(404)`, `res.redirect()`, `res.sendFile()`.

### Key Points
- `express.json()` parses JSON request bodies
- Use `Router` to split routes into files
- Typical structure: routes → controllers → services → models

## Body, Params, Query
video: express req body params query
summary: Express reads data from the request via req.body (payload), req.params (path) and req.query (after ?).

There are three common ways a client sends data.

* **Body** → request payload (usually JSON in POST/PUT)
* **Params** → part of the path: `/user/:id`
* **Query** → after the question mark: `?id=5`

```js
app.use(express.json());

// Params:  GET /user/42
app.get("/user/:id", (req, res) => {
  res.json({ id: req.params.id });          // "42"
});

// Query:   GET /search?name=ali&page=2
app.get("/search", (req, res) => {
  const { name, page } = req.query;         // strings
  res.json({ name, page });
});

// Body:    POST /user   { "name": "Ali" }
app.post("/user", (req, res) => {
  res.status(201).json(req.body);
});
```

### When to use which
| Type | Use for |
|---|---|
| Params | identify one resource (`/users/5`) |
| Query | filter, sort, paginate (`?page=2&sort=name`) |
| Body | send data to create or update |

### Key Points
- Params and query values are always strings; convert them
- Without `express.json()`, `req.body` is undefined
- Never trust any of them; validate

## HTTP Methods
video: http methods get post put delete patch
summary: HTTP methods describe the action a client wants on a resource: fetch, create, update, delete.

| Method | Description |
| ------ | -------------- |
| GET | Fetch |
| POST | Create |
| PUT | Update (replace whole resource) |
| DELETE | Remove |
| PATCH | Partial update |
| OPTIONS | Check supported operations |

### REST style CRUD in Express
```js
app.get("/todos", listTodos);          // read all
app.get("/todos/:id", getTodo);        // read one
app.post("/todos", createTodo);        // create
app.put("/todos/:id", replaceTodo);    // full update
app.patch("/todos/:id", updateTodo);   // partial update
app.delete("/todos/:id", deleteTodo);  // delete
```

### Important ideas
- **Safe**: GET does not change data.
- **Idempotent**: calling it many times gives the same result (GET, PUT, DELETE). POST is not idempotent.
- **OPTIONS** is used by browsers in the CORS "preflight" check before certain cross-origin requests.

### Common status codes
`200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Server Error`.

### Key Points
- PUT replaces, PATCH changes only some fields
- Pick the method by intent, status code by outcome

## Middleware
video: expressjs middleware
summary: Middleware are functions that run between the request and the response and can modify, stop or pass on the request.

Middleware runs **between request → response**. Each middleware gets `req`, `res` and `next`. It can change the request, end the response, or call `next()` to pass control on.

```js
app.use((req, res, next) => next());
```

### Practical example
```js
// logger
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// auth middleware for specific routes
function auth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "No token" });
  }
  next();
}
app.get("/profile", auth, (req, res) => res.json({ ok: true }));
```

```flow
Request
logger
json parser
auth
route handler
Response
```

### Types
- Application-level: `app.use()`
- Router-level: `router.use()`
- Built-in: `express.json()`, `express.static()`
- Third-party: `cors`, `helmet`, `morgan`
- Error-handling: four arguments `(err, req, res, next)`

### Key Points
- Order matters: middleware runs in the order you register it
- Forgetting `next()` makes the request hang
- Interview tip: Express is basically a chain of middleware

## Error Handling
video: nodejs express error handling
summary: Use try-catch for local errors and a global error-handling middleware for centralized responses.

👉 Handle errors using:

- **Try-Catch** → for local/synchronous errors (and `await` code)
- **Global Handler** → for centralized error handling

```js
// Global Error Handler (must be registered LAST, 4 arguments)
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});
```

### With async routes
```js
app.get("/user/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json(user);
  } catch (err) {
    next(err);            // forward to the global handler
  }
});
```

### Custom error class
```js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
// global handler: res.status(err.statusCode || 500)
```

### Process-level safety net
```js
process.on("unhandledRejection", (reason) => console.error(reason));
process.on("uncaughtException", (err) => { console.error(err); process.exit(1); });
```

### Key Points
- Express 4 does not catch rejected promises; use try-catch + `next(err)`
- Do not leak stack traces to clients in production
- Log errors on the server

## Environment Variables
video: nodejs environment variables dotenv
summary: Environment variables keep secrets and config (ports, DB URLs, keys) out of your code.

Store sensitive configuration securely, outside the source code. Values differ per environment (development, testing, production).

Create a `.env` file:
```bash
PORT=5000
DB_URL=mongodb://localhost:27017
JWT_SECRET=supersecret
```

Load and read it in code:
```js
require('dotenv').config();
console.log(process.env.PORT);
```

### Good habits
- Add `.env` to `.gitignore`; commit a `.env.example` with fake values instead.
- Give defaults for non-secret values: `const port = process.env.PORT || 3000;`
- Values are always strings; convert numbers and booleans yourself.
- Newer Node versions can load a file directly: `node --env-file=.env app.js`.
- In production (Vercel, AWS, Docker) set variables in the platform settings.

### Key Points
- Never hard-code secrets or push them to GitHub
- `process.env.NAME` reads a variable
- Validate required variables at startup so the app fails early

## Authentication with JWT
video: nodejs jwt authentication
summary: JWT gives stateless authentication: the server signs a token at login and verifies it on later requests.

**JWT (JSON Web Token)** gives secure and **stateless** authentication. The server does not store sessions; the token itself proves who the user is.

A JWT has three parts: `header.payload.signature`. The signature stops anyone from changing the payload.

```js
const token = jwt.sign({ id: user.id }, "secret");
```

### Full login flow
```js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const ok = user && await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];   // "Bearer <token>"
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}
```

### Key Points
- Keep the secret in an env variable, never in code
- Always hash passwords (bcrypt); never store plain text
- JWT payload is encoded, not encrypted: do not put secrets in it
- Set an expiry; use refresh tokens for long sessions

## Security Basics
video: nodejs express security helmet cors
summary: Protect your Express app with CORS rules, Helmet security headers and strict input validation.

👉 Protect your app with a few key practices.

* **CORS** → controls which other origins (websites) can call your API
* **Helmet** → sets secure HTTP headers
* **Input validation** → prevent bad or malicious data

```js
const cors = require("cors");
const helmet = require("helmet");
const { z } = require("zod");

app.use(helmet());
app.use(cors({ origin: "https://myapp.com" }));

const userSchema = z.object({
  email: z.string().email(),
  age: z.number().min(0),
});

app.post("/user", (req, res) => {
  const result = userSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error);
  res.json(result.data);
});
```

### More tips
- Hash passwords with bcrypt
- Use parameterized queries to avoid SQL injection
- Keep dependencies updated (`npm audit`)
- Use HTTPS in production
- Do not expose error details or secrets

### Key Points
- CORS is enforced by browsers; it is not a replacement for authentication
- Validate everything that comes from the client
- Libraries: helmet, cors, zod / joi / express-validator

## Rate Limiting
video: express rate limit nodejs
summary: Rate limiting caps how many requests a client can make in a time window to prevent abuse.

👉 Prevent API abuse such as brute-force login attempts, scraping, and DDoS-style floods.

```js
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 100,                   // 100 requests per IP per window
  message: "Too many requests, try again later",
});

app.use("/api", limiter);

// stricter for login
app.use("/login", rateLimit({ windowMs: 60 * 1000, max: 5 }));
```

When the limit is exceeded the server replies with status **429 Too Many Requests**.

### In production
The default store is in memory, so each server instance counts separately. With cluster or several servers, use a shared store such as **Redis** so the count is global.

### Key Points
- Apply stricter limits on sensitive routes (login, OTP)
- Identify clients by IP or by API key / user id
- Return 429 and optionally a `Retry-After` header

## Caching
video: nodejs redis caching
summary: Caching stores frequently used data in fast memory (Redis or in-process) to avoid repeated slow work.

👉 Improve performance by remembering results of expensive operations (DB queries, API calls).

* **Redis** - an external in-memory store shared by all servers
* **In-memory cache** - a variable or `Map` inside your process (fast but not shared, lost on restart)

```js
// simple in-memory cache
const cache = new Map();

app.get("/products", async (req, res) => {
  if (cache.has("products")) return res.json(cache.get("products"));
  const data = await db.query("SELECT * FROM products");
  cache.set("products", data.rows);
  res.json(data.rows);
});
```

```js
// Redis with expiry (TTL)
const cached = await redis.get("products");
if (cached) return res.json(JSON.parse(cached));
const data = await getProducts();
await redis.set("products", JSON.stringify(data), { EX: 60 });   // 60 seconds
```

### Key Points
- Always set a TTL so data does not go stale forever
- Invalidate (delete) the cache when the underlying data changes
- Hardest part of caching: knowing when to clear it

## Database Transactions
video: nodejs database transactions
summary: A transaction groups several database operations so that either all succeed or none are applied.

A **transaction** is a group of database operations (INSERT, UPDATE, DELETE) treated as one unit.

Either all succeed ✅ or none happen ❌.

Transactions are a database feature (SQL databases like PostgreSQL/MySQL, and MongoDB with replica sets). In Node.js you use them through your DB driver or ORM. Classic example: transferring money. Debit and credit must both happen, or neither.

### Example with pg (PostgreSQL)
```js
const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query("UPDATE accounts SET balance = balance - 100 WHERE id = 1");
  await client.query("UPDATE accounts SET balance = balance + 100 WHERE id = 2");
  await client.query("COMMIT");
} catch (err) {
  await client.query("ROLLBACK");   // undo everything
  throw err;
} finally {
  client.release();
}
```

### Example with Prisma
```js
await prisma.$transaction([
  prisma.account.update({ where: { id: 1 }, data: { balance: { decrement: 100 } } }),
  prisma.account.update({ where: { id: 2 }, data: { balance: { increment: 100 } } }),
]);
```

### Key Points
- ACID: Atomicity, Consistency, Isolation, Durability
- Use the same connection (client) for every query in the transaction
- Always ROLLBACK on error and release the connection

## Testing
video: nodejs testing jest supertest
summary: Automated tests (Jest, Mocha, Supertest) check your code and API routes keep working as you change them.

👉 Ensure reliability by testing automatically.

* **Jest** - popular test runner with built-in assertions and mocking
* **Mocha** - flexible test runner (often with Chai)
* **Supertest** - sends HTTP requests to your Express app in tests

```js
// app.js must export app (without calling listen)
module.exports = app;

// app.test.js
const request = require("supertest");
const app = require("./app");

describe("GET /", () => {
  it("returns Hello", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello");
  });
});
```

Run with `npx jest` or add `"test": "jest"` to package.json scripts.

### Types of tests
- **Unit** - one function in isolation
- **Integration** - several parts together (route + database)
- **End-to-end** - the full app like a real user

### Key Points
- Separate `app` from `app.listen` so tests do not open ports
- Mock external services (email, payment APIs)
- Test success and failure cases

## API Best Practices
video: rest api best practices nodejs
summary: Build clean, scalable APIs using proper status codes, validation, versioning and centralized error handling.

👉 Build clean and scalable APIs.

* Use proper status codes
* Validate inputs
* Version APIs (`/v1`)
* Centralized error handling

```js
app.use("/api/v1/users", usersRouter);

app.post("/api/v1/users", async (req, res, next) => {
  try {
    const parsed = userSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.issues });
    const user = await createUser(parsed.data);
    res.status(201).json(user);
  } catch (e) { next(e); }
});
```

### More habits
- Use nouns in URLs: `/users`, not `/getUsers`
- Paginate lists: `?page=2&limit=20`
- Return consistent JSON shapes (`{ data, error }`)
- Never return password hashes or secrets
- Document with OpenAPI / Swagger

### Key Points
- Versioning lets you change the API without breaking old clients
- Consistent errors make front-end work easier

## Scaling Node.js Apps
video: nodejs scaling load balancing cluster
summary: Handle high traffic by using all CPU cores (cluster), spreading load across servers and adding caching.

👉 Handle high traffic.

* **Cluster** - run one process per CPU core on a machine (vertical scaling)
* **Load balancing** - a server like Nginx or a cloud load balancer spreads requests across many instances (horizontal scaling)
* **Microservices** - split the app into independent services

```flow
Users
Load Balancer | Nginx
Server 1 | cluster: 4 processes || Server 2 | cluster: 4 processes || Server 3 | cluster: 4 processes
```

### Practical checklist
- Keep servers **stateless** (store sessions/data in Redis or the DB, not in memory)
- Use a process manager like **PM2** (`pm2 start app.js -i max`) for cluster mode and auto-restart
- Add caching and DB indexes
- Move slow jobs to background queues (BullMQ, RabbitMQ)
- Never block the event loop with heavy CPU work

### Key Points
- Vertical scaling = bigger machine; horizontal = more machines
- Stateless apps are easy to scale horizontally

## Microservices
video: microservices architecture nodejs
summary: Microservices split a big application into small independent services that communicate over the network.

👉 Break an application into small, independent services.

Instead of one big app (a **monolith**), each business feature (users, orders, payments) is its own small service with its own code, database and deployment.

```flow
Client
API Gateway
User Service | own DB || Order Service | own DB || Payment Service | own DB
```

Services talk using REST/HTTP, gRPC, or message brokers (RabbitMQ, Kafka).

### Pros and cons
| Pros | Cons |
|---|---|
| Scale each service separately | More complex to run and monitor |
| Teams work independently | Network failures, latency |
| Use different tech per service | Data consistency is harder |
| A failure is isolated | Needs DevOps (Docker, Kubernetes) |

### Key Points
- Start with a monolith; split when it truly hurts
- Each service owns its own data
- Node.js is a popular choice thanks to light, fast services
