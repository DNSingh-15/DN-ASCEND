---
name: FastAPI
icon: ⚡
category: Backend
track: fullstack
color: #10b981
order: 6
description: FastAPI is a modern, high-performance Python web framework for building APIs with automatic validation and interactive documentation.
---

## What is FastAPI
video: fastapi introduction tutorial
summary: FastAPI is a modern, fast Python framework for building APIs, built on Starlette and Pydantic.

FastAPI is a **modern, high-performance Python web framework** for building APIs. It uses standard Python **type hints** to understand your data, so it can validate input and generate documentation automatically.

### Built on
* **Starlette** - handles web parts (routing, requests, middleware, WebSockets)
* **Pydantic** - handles data validation and serialization

It also supports **async/await** natively, and runs on an ASGI server such as Uvicorn.

### Install
```bash
pip install "fastapi[standard]"
```

### Where it fits
Python is the main language for AI and data work, so FastAPI is a popular way to expose ML models, LLM apps, and microservices as HTTP APIs.

### Key Points
- Framework for APIs, not for server-rendered pages (though it can)
- FastAPI = Starlette (web) + Pydantic (data)
- Interview tip: FastAPI is ASGI-based; Flask/Django are traditionally WSGI

## Why FastAPI
video: fastapi vs flask vs django
summary: FastAPI is very fast, validates data automatically, generates docs, and is easy to learn.

* **Very fast** - performance comparable to Node.js and Go (thanks to Starlette and async)
* **Automatic validation** - wrong data returns a clear 422 error without extra code
* **Auto API docs** - Swagger UI and ReDoc are generated for free
* **Type hints support** - great editor autocomplete and fewer bugs
* **Easy to learn** - little boilerplate, clean code

### Quick comparison
| | FastAPI | Flask | Django |
|---|---|---|---|
| Type | API framework | Micro framework | Full-stack framework |
| Async | Native | Limited | Partial |
| Validation | Built in (Pydantic) | Manual / extensions | Forms / DRF serializers |
| Auto docs | Yes | No | With DRF add-ons |

### Key Points
- Less code, fewer bugs, docs for free
- Best for APIs, microservices, ML model serving
- Interview tip: speed comes from async + Starlette + Pydantic (written in Rust in v2)

## Basic Example
video: fastapi first app hello world
summary: Create a FastAPI app, define a route with a decorator, and run it with Uvicorn.

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello FastAPI"}
```

Save this as `main.py` and run:

```bash
uvicorn main:app --reload
```

- `main` is the file name, `app` is the FastAPI object
- `--reload` restarts the server when you edit code (development only)

Open `http://127.0.0.1:8000/` to see the JSON response, and `http://127.0.0.1:8000/docs` for interactive docs.

### How it works
- `@app.get("/")` is a **decorator**: it registers the function as the handler for GET requests on `/`.
- Returning a dict (or list, or Pydantic model) is automatically converted to JSON.
- Other decorators: `@app.post`, `@app.put`, `@app.patch`, `@app.delete`.

### Key Points
- One decorator = one route (method + path)
- No manual `json.dumps` needed
- Use `--reload` only in development

## Path and Query Parameters
video: fastapi path parameters query parameters
summary: Path parameters sit inside the URL; query parameters come after ? and can have defaults.

```python
@app.get("/users/{id}")
def get_user(id: int):
    return {"id": id}

@app.get("/items/")
def get_items(skip: int = 0):
    return {"skip": skip}
```

### Path parameters
Defined inside `{}` in the path. The type hint (`int`) makes FastAPI convert and validate the value. `/users/abc` automatically returns a 422 error.

### Query parameters
Any function argument that is **not** in the path is treated as a query parameter: `/items/?skip=10`. A default value makes it optional; no default makes it required.

```python
from typing import Optional

@app.get("/search")
def search(q: str, limit: int = 10, category: Optional[str] = None):
    return {"q": q, "limit": limit, "category": category}
# GET /search?q=phone&limit=5
```

### Extra validation
```python
from fastapi import Query, Path

@app.get("/products/{pid}")
def product(pid: int = Path(gt=0), q: str = Query(default=None, max_length=20)):
    return {"pid": pid, "q": q}
```

### Key Points
- Type hints give automatic conversion and validation
- Default value = optional query parameter
- Order of routes matters: define `/users/me` before `/users/{id}`

## Request Body with Pydantic
video: fastapi request body pydantic
summary: Pydantic models describe the JSON a client sends; FastAPI validates it automatically.

A **request body** is the data a client sends (usually JSON in POST/PUT). In FastAPI you describe it with a **Pydantic** model.

```python
from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int

@app.post("/users/")
def create_user(user: User):
    return user
```

👉 Automatic validation

Sending `{"name": "Ali", "age": "25"}` works (age is converted to int). Sending `{"name": "Ali"}` returns a 422 error saying `age` is required. You never write that check yourself.

### Optional fields and defaults
```python
class User(BaseModel):
    name: str
    age: int
    email: str | None = None
    is_active: bool = True
```

### Mixing path, query and body
```python
@app.put("/users/{user_id}")
def update_user(user_id: int, user: User, notify: bool = False):
    return {"id": user_id, **user.model_dump(), "notify": notify}
```

FastAPI works out which is which: path (in the URL), body (Pydantic model), query (simple types left over).

### Key Points
- Inside the function you get a real Python object (`user.name`)
- `model_dump()` converts to a dict (Pydantic v2)
- Interview tip: Pydantic does parsing + validation + serialization

## Validation
video: fastapi pydantic validation field validator
summary: Pydantic gives type checking, required fields, constraints with Field, and custom validators.

Validation is one of FastAPI's biggest strengths.

* Type checking
* Required fields
* Custom validation

```python
from pydantic import BaseModel, Field

class User(BaseModel):
    age: int = Field(gt=0)
```

### More Field constraints
```python
from pydantic import BaseModel, Field, EmailStr

class Signup(BaseModel):
    username: str = Field(min_length=3, max_length=20)
    email: EmailStr                      # needs: pip install email-validator
    age: int = Field(ge=18, le=100)
    bio: str = Field(default="", max_length=200)
```

Constraint names: `gt` (greater than), `ge` (>=), `lt`, `le`, `min_length`, `max_length`, `pattern`.

### Custom validation
```python
from pydantic import field_validator

class Signup(BaseModel):
    password: str

    @field_validator("password")
    @classmethod
    def strong(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v
```

### What an error looks like
```json
{ "detail": [ { "loc": ["body", "age"], "msg": "Input should be greater than 0", "type": "greater_than" } ] }
```

### Key Points
- Failed validation = HTTP 422 with details
- Use Field for simple rules, validators for complex ones
- Validation also appears in the generated docs

## Dependency Injection
video: fastapi dependency injection depends
summary: Depends lets you share reusable logic (DB sessions, auth, pagination) across routes, like clean middleware.

👉 Reusable logic (like middleware, but per route).

A **dependency** is a function FastAPI runs *before* your route and passes its result in. You declare it with `Depends`.

```python
from fastapi import Depends

def get_db():
    return "db_connection"

@app.get("/")
def read(db=Depends(get_db)):
    return {"db": db}
```

### Why it matters
- Reuse code (database session, current user, pagination params)
- Keep routes small and testable
- Dependencies can have their own dependencies

### Common patterns
```python
# Database session with cleanup (yield)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Reusable pagination
def pagination(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}

@app.get("/items")
def items(p: dict = Depends(pagination), db = Depends(get_db)):
    return {"page": p}
```

### Apply to a whole router
```python
router = APIRouter(dependencies=[Depends(verify_token)])
```

### Key Points
- Code before `yield` is setup, after `yield` is cleanup
- In tests you can override dependencies with `app.dependency_overrides`
- Interview tip: DI = FastAPI gives your function what it needs instead of the function creating it

## Async vs Sync
video: fastapi async await vs def
summary: Use async def for non-blocking I/O work; plain def runs in a thread pool and is fine for blocking code.

```python
@app.get("/sync")
def sync_fn():
    return {"msg": "sync"}

@app.get("/async")
async def async_fn():
    return {"msg": "async"}
```

👉 Use **async** for I/O operations (database, HTTP calls, files) when the library supports `await`.

### How FastAPI treats each
- `async def` runs directly on the event loop. Fast, but if you call blocking code inside (like `time.sleep` or `requests.get`) you freeze the whole server.
- `def` (sync) is run by FastAPI in a **thread pool**, so blocking code is safe there.

```python
import asyncio, httpx

@app.get("/slow")
async def slow():
    await asyncio.sleep(2)            # does not block other requests
    return {"done": True}

@app.get("/external")
async def external():
    async with httpx.AsyncClient() as client:
        r = await client.get("https://api.github.com")
    return r.json()
```

### Rule of thumb
| Situation | Use |
|---|---|
| Async libraries (httpx, asyncpg, motor) | `async def` |
| Blocking libraries (requests, psycopg2) | plain `def` |
| CPU-heavy work | background worker / separate process |

### Key Points
- Never use blocking calls inside `async def`
- async helps with many concurrent I/O waits, not CPU speed
- Interview tip: async = concurrency, not parallelism

## Middleware
video: fastapi middleware
summary: Middleware wraps every request and response, useful for logging, timing, headers and CORS.

```python
@app.middleware("http")
async def log_requests(request, call_next):
    response = await call_next(request)
    return response
```

👉 Runs before & after every request.

Code before `await call_next(request)` runs on the way in; code after runs on the way out.

### Timing example
```python
import time

@app.middleware("http")
async def add_process_time(request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    response.headers["X-Process-Time"] = str(time.perf_counter() - start)
    return response
```

### Adding built-in middleware
```python
from fastapi.middleware.gzip import GZipMiddleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
```

```flow
Request
Middleware 1
Middleware 2
Route | your path operation
> response returns through middleware 2, then 1
Response
```

### Middleware vs Dependencies
| Middleware | Dependency |
|---|---|
| Every request | Only routes that use it |
| Works on raw request/response | Works with parsed parameters |
| Logging, CORS, compression | Auth, DB session, pagination |

### Key Points
- Use for cross-cutting concerns
- Last middleware added runs first
- Keep it light; it affects every request

## CORS
video: fastapi cors middleware
summary: CORSMiddleware allows browser apps on other origins (like a React frontend) to call your API.

Browsers block a web page from calling an API on a different origin (domain/port) unless the API allows it. This is **CORS** (Cross-Origin Resource Sharing). If your React app runs on `localhost:3000` and FastAPI on `localhost:8000`, you need to enable CORS.

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://myapp.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Notes
- CORS is enforced by the **browser**; Postman or curl are not affected.
- Browsers send an `OPTIONS` "preflight" request first for some requests; the middleware answers it.
- With `allow_credentials=True`, you cannot use `allow_origins=["*"]`. List exact origins.
- Don't use `"*"` in production unless the API is truly public.

### Key Points
- Add CORS when a separate frontend calls your API
- List allowed origins explicitly
- CORS error in the browser console = server config problem, not a frontend bug

## Exception Handling
video: fastapi exception handling httpexception
summary: Raise HTTPException to return error responses, and register custom handlers for consistent error output.

```python
from fastapi import HTTPException

@app.get("/error")
def error():
    raise HTTPException(status_code=404, detail="Not found")
```

This returns `404` with body `{"detail": "Not found"}`.

### Realistic use
```python
items = {1: "pen", 2: "book"}

@app.get("/items/{item_id}")
def get_item(item_id: int):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"item": items[item_id]}
```

### Custom exception handler
```python
from fastapi import Request
from fastapi.responses import JSONResponse

class OutOfStock(Exception):
    def __init__(self, name: str):
        self.name = name

@app.exception_handler(OutOfStock)
async def out_of_stock_handler(request: Request, exc: OutOfStock):
    return JSONResponse(status_code=409, content={"message": f"{exc.name} is out of stock"})
```

### Common status codes
`200` OK, `201` Created, `204` No Content, `400` Bad Request, `401` Unauthorized, `403` Forbidden, `404` Not Found, `409` Conflict, `422` Validation Error, `500` Server Error.

### Key Points
- Use `raise`, not `return`, for HTTPException
- Validation errors (422) are handled automatically
- Custom handlers keep error format consistent

## Response Models and Status Codes
video: fastapi response_model status code
summary: response_model filters and documents what your API returns, e.g. hiding password fields.

Use `response_model` to control exactly what is sent back. This is vital for hiding sensitive fields.

```python
from pydantic import BaseModel

class UserIn(BaseModel):
    name: str
    password: str

class UserOut(BaseModel):
    id: int
    name: str

@app.post("/users", response_model=UserOut, status_code=201)
def create_user(user: UserIn):
    # ... save to DB ...
    return {"id": 1, "name": user.name, "password": user.password}
# password is filtered out of the response
```

### Benefits
- Hides internal or sensitive fields (password hashes)
- Validates your output, not just input
- Shows the exact response shape in `/docs`

### Useful options
```python
@app.get("/users", response_model=list[UserOut])        # list of models
@app.get("/u", response_model=UserOut, response_model_exclude_none=True)
@app.delete("/users/{id}", status_code=204)              # no body
```

Use the `status` helpers for readability: `from fastapi import status` then `status.HTTP_201_CREATED`.

### Key Points
- Separate input models (`UserIn`) and output models (`UserOut`)
- Set `status_code` on the decorator
- This matches the API best practice "use response models"

## Routers
video: fastapi apirouter project structure
summary: APIRouter splits a growing app into multiple files, each with its own prefix and tags.

As your app grows, putting all routes in `main.py` gets messy. **APIRouter** lets you group related routes in separate files.

```text
app/
├── main.py
├── routers/
│   ├── users.py
│   └── items.py
├── models.py
├── schemas.py
└── database.py
```

```python
# routers/users.py
from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/")
def list_users():
    return []

@router.get("/{user_id}")
def get_user(user_id: int):
    return {"id": user_id}
```

```python
# main.py
from fastapi import FastAPI
from routers import users, items

app = FastAPI()
app.include_router(users.router)
app.include_router(items.router, prefix="/v1")
```

### Key Points
- `prefix` avoids repeating the path start
- `tags` group endpoints in the docs
- Use `/v1` prefixes for API versioning

## Authentication with JWT
video: fastapi jwt authentication oauth2
summary: Issue a signed JWT at login and verify it on protected routes with OAuth2PasswordBearer.

JWT (JSON Web Token) is a signed token the server gives after login. The client sends it with each request, so the server doesn't need to store sessions.

```python
from jose import jwt

token = jwt.encode({"user_id": 1}, "secret", algorithm="HS256")
```

### Full flow with OAuth2
```python
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError

SECRET = "load-from-env"
oauth2 = OAuth2PasswordBearer(tokenUrl="login")

@app.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends()):
    # verify form.username / form.password against DB (with hashing)
    exp = datetime.now(timezone.utc) + timedelta(minutes=30)
    token = jwt.encode({"sub": form.username, "exp": exp}, SECRET, algorithm="HS256")
    return {"access_token": token, "token_type": "bearer"}

def current_user(token: str = Depends(oauth2)):
    try:
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
        return payload["sub"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/me")
def me(user: str = Depends(current_user)):
    return {"user": user}
```

`OAuth2PasswordBearer` also adds an "Authorize" button to Swagger docs.

### Key Points
- Token goes in header: `Authorization: Bearer <token>`
- Read the secret from an environment variable
- Always set an expiry (`exp`)
- JWT payload is readable by anyone; don't store secrets inside

## Security
video: fastapi security password hashing bcrypt
summary: Secure FastAPI with OAuth2, JWT, bcrypt password hashing, HTTPS and input validation.

* **OAuth2** - standard authorization framework (FastAPI has built-in helpers)
* **JWT** - signed tokens for stateless auth
* **Password hashing (bcrypt)** - never store plain passwords

```python
from passlib.context import CryptContext

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

hashed = pwd.hash("mypassword")           # store this in DB
ok = pwd.verify("mypassword", hashed)     # True / False
```

### Checklist
- Hash passwords; never log or return them
- Use HTTPS in production
- Restrict CORS origins
- Add rate limiting (e.g. `slowapi`)
- Keep secrets in environment variables
- Validate every input (Pydantic does most of it)
- Use scopes/roles for permissions (admin vs user)

```python
def require_admin(user = Depends(current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    return user
```

### Key Points
- 401 = not logged in; 403 = logged in but not allowed
- bcrypt is slow on purpose, which blocks brute force
- Never invent your own crypto

## Database Integration
video: fastapi sqlalchemy database tutorial
summary: Connect FastAPI to a database using an ORM like SQLAlchemy, with a session dependency per request.

👉 Use ORMs like:

* **SQLAlchemy** - the most popular Python ORM
* **Tortoise ORM** - async-first ORM inspired by Django
* (Also SQLModel, made by the FastAPI author, combining Pydantic and SQLAlchemy)

```python
# Example (concept)
db.query(User).all()
```

### Working example
```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base, Session

engine = create_engine("sqlite:///./app.db")
SessionLocal = sessionmaker(bind=engine, autoflush=False)
Base = declarative_base()

class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/users")
def users(db: Session = Depends(get_db)):
    return db.query(UserDB).all()

@app.post("/users")
def add(name: str, db: Session = Depends(get_db)):
    u = UserDB(name=name)
    db.add(u)
    db.commit()
    db.refresh(u)
    return u
```

### Key Points
- One session per request, via a dependency
- Keep SQLAlchemy models (DB) separate from Pydantic schemas (API)
- Use Alembic for database migrations
- Use `commit()` to save and `rollback()` on errors (transactions)

## Background Tasks
video: fastapi background tasks
summary: BackgroundTasks run small jobs, like sending emails, after the response has been returned.

```python
from fastapi import BackgroundTasks

def send_email():
    print("Email sent")

@app.get("/")
def main(bg: BackgroundTasks):
    bg.add_task(send_email)
    return {"msg": "Task running"}
```

👉 Runs tasks after the response is sent, so the user doesn't wait.

### With arguments
```python
def write_log(message: str):
    with open("log.txt", "a") as f:
        f.write(message + "\n")

@app.post("/signup")
def signup(email: str, bg: BackgroundTasks):
    bg.add_task(write_log, f"New signup: {email}")
    return {"status": "ok"}
```

### When NOT to use it
BackgroundTasks run inside the same server process. For heavy, long, or must-not-be-lost jobs (video processing, large reports), use a real task queue such as **Celery**, **RQ**, or **Arq** with Redis.

### Key Points
- Good for emails, notifications, logging
- Task is lost if the server crashes
- Use Celery for heavy or reliable jobs

## Caching
video: fastapi redis caching
summary: Cache expensive results in Redis or memory to make repeated requests much faster.

* **Redis** - shared, fast, supports expiry
* **In-memory cache** - simple, per process

👉 Improves performance.

```python
# in-memory with functools
from functools import lru_cache

@lru_cache
def get_settings():
    return Settings()      # created once, reused
```

```python
# Redis with expiry
import redis, json
r = redis.Redis(host="localhost", port=6379, decode_responses=True)

@app.get("/products")
def products():
    cached = r.get("products")
    if cached:
        return json.loads(cached)
    data = fetch_products_from_db()
    r.setex("products", 60, json.dumps(data))      # expires in 60s
    return data
```

Libraries like `fastapi-cache2` offer a `@cache(expire=60)` decorator.

### Key Points
- Set a TTL so data doesn't go stale
- Clear the cache when data changes
- In-memory caches are not shared across workers

## API Docs (Auto Generated)
video: fastapi swagger ui docs redoc
summary: FastAPI builds interactive Swagger UI and ReDoc documentation automatically from your code.

FastAPI creates documentation from your routes, type hints and models, using the OpenAPI standard.

* **Swagger UI** → `/docs` (interactive, you can try requests)
* **ReDoc** → `/redoc` (clean reference documentation)
* Raw OpenAPI schema → `/openapi.json`

### Improve the docs
```python
app = FastAPI(
    title="My Shop API",
    description="Manage products and orders",
    version="1.0.0",
)

@app.get("/items", tags=["items"], summary="List items",
         description="Returns all items in stock")
def items():
    return []
```

Docstrings of route functions also appear as the description.

### Why it's valuable
- Frontend developers can test the API without Postman
- Always up to date because it comes from code
- Clients can be auto-generated from `openapi.json`

### Key Points
- No extra work needed; open `/docs`
- Disable in production with `FastAPI(docs_url=None, redoc_url=None)` if the API is private
- Docs update as soon as you change code

## Testing
video: fastapi testing testclient pytest
summary: TestClient lets you call your FastAPI app in pytest tests without running a server.

```python
from fastapi.testclient import TestClient

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
```

Run with `pytest`. Install first: `pip install pytest httpx`.

### More tests
```python
def test_create_user():
    r = client.post("/users/", json={"name": "Ali", "age": 25})
    assert r.status_code == 200
    assert r.json()["name"] == "Ali"

def test_validation_error():
    r = client.post("/users/", json={"name": "Ali"})
    assert r.status_code == 422
```

### Overriding dependencies
```python
def fake_db():
    return "test_db"

app.dependency_overrides[get_db] = fake_db
```

### Key Points
- TestClient works like `requests`
- Test success and failure paths
- Override DB and auth dependencies for isolated tests

## Environment Variables
video: fastapi environment variables pydantic settings
summary: Keep configuration and secrets in environment variables, loaded with os.getenv or pydantic-settings.

```python
import os

PORT = os.getenv("PORT")
```

`os.getenv("NAME", "default")` returns `None` (or the default) if the variable is not set.

### A .env file
```bash
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=change-me
```

### Recommended: pydantic-settings
```python
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    debug: bool = False

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()      # fails at startup if something is missing
```

Combine with `@lru_cache` and `Depends` so settings are created once and easy to override in tests.

### Key Points
- Never commit `.env` or secrets to Git
- pydantic-settings validates and converts types for you
- Different values per environment (dev, test, prod)

## API Best Practices
video: fastapi best practices project structure
summary: Use proper status codes, validate input, use response models, handle errors and version your API.

* Use proper status codes
* Validate input
* Use response models
* Handle errors properly
* Version APIs (`/v1`)

```python
v1 = APIRouter(prefix="/v1")

@v1.post("/users", response_model=UserOut, status_code=201)
def create_user(user: UserIn, db: Session = Depends(get_db)):
    if db.query(UserDB).filter_by(email=user.email).first():
        raise HTTPException(status_code=409, detail="Email already registered")
    ...

app.include_router(v1)
```

### More habits
- Use nouns for resources: `/users`, `/orders`
- Paginate list endpoints (`skip`, `limit`)
- Keep business logic out of route functions (use a services layer)
- Use dependencies for auth, DB and common params
- Write tests and keep consistent JSON shapes

### Key Points
- Thin routes, logic in services
- Separate schemas (API) from models (DB)
- Version early

## Deployment
video: fastapi deployment docker uvicorn gunicorn
summary: Deploy FastAPI with Uvicorn or Gunicorn, containerize with Docker and put Nginx in front.

* **Uvicorn / Gunicorn** - ASGI server and process manager
* **Docker** - package app and dependencies together
* **Nginx** - reverse proxy, HTTPS, load balancing

```bash
uvicorn main:app --reload
```
(`--reload` is for development only.)

### Production run
```bash
gunicorn main:app -k uvicorn.workers.UvicornWorker -w 4 -b 0.0.0.0:8000
# or simply: fastapi run  /  uvicorn main:app --workers 4
```

### Dockerfile
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Typical setup
```flow
direction: right
Internet
Nginx | HTTPS
Gunicorn/Uvicorn workers | FastAPI
Database
```

### Key Points
- Workers = multiple processes to use all CPU cores
- Run behind a reverse proxy in production
- Use environment variables for config, not baked-in secrets

## Performance Tips
video: fastapi performance optimization
summary: Speed up FastAPI with async I/O, caching, connection pooling and by avoiding blocking code.

* Use async functions (with async libraries)
* Use caching (Redis)
* Use connection pooling
* Avoid blocking code

### Details
- **Connection pooling**: reuse DB connections instead of opening a new one per request (SQLAlchemy does this by default; tune `pool_size`).
- **Avoid blocking in async routes**: `time.sleep`, `requests`, heavy loops all freeze the event loop. Use `httpx`, `asyncio.sleep`, or move heavy work to a worker.
- **Pagination**: never return thousands of rows at once.
- **Response size**: use `response_model` and GZip middleware.
- **Multiple workers**: run several Uvicorn workers.
- **Faster JSON**: `ORJSONResponse` for large payloads.

```python
from fastapi.responses import ORJSONResponse

app = FastAPI(default_response_class=ORJSONResponse)
```

### Key Points
- Measure first (profiling, logs), then optimize
- The database is usually the real bottleneck: add indexes
- Cache read-heavy endpoints

## Microservices
video: fastapi microservices architecture
summary: FastAPI suits small independent services that each own one job and talk to each other over HTTP or queues.

👉 Build small independent services.

FastAPI is light and fast to start, so it's a natural fit for microservices: each service does one job (auth, orders, ML inference, notifications), has its own database, and can be deployed and scaled separately.

```flow
Client
API Gateway
Auth Service | FastAPI || Order Service | FastAPI || ML Service | FastAPI + model
```

### Service to service call
```python
import httpx

@app.get("/orders/{oid}")
async def order(oid: int):
    async with httpx.AsyncClient() as client:
        user = await client.get("http://auth-service:8000/users/me")
    return {"order": oid, "user": user.json()}
```

Services can also communicate through message brokers (RabbitMQ, Kafka) for async events.

### Key Points
- One service = one responsibility = own data
- Each service gets its own Docker container
- Don't start with microservices unless needed

## Summary Cheat Sheet
video: fastapi complete overview
summary: A quick table of the core FastAPI concepts to revise before interviews.

| Concept | Description |
| --------------- | ------------------------------ |
| FastAPI | High-performance API framework |
| Async | Non-blocking execution |
| Pydantic | Data validation |
| Depends | Dependency injection |
| JWT | Authentication |
| BackgroundTasks | Async jobs |
| APIRouter | Split routes into files |
| response_model | Control and filter output |
| CORSMiddleware | Allow other origins |
| TestClient | Test without a server |

### Request lifecycle
```flow
Request
Middleware
Routing | path match
Dependencies | auth, DB
Validation | Pydantic: path, query, body
Your function
response_model filter
Response | + middleware on the way out
```

### Key Points
- Types + Pydantic = validation + docs
- `Depends` for shared logic, `HTTPException` for errors
- Run with Uvicorn; docs at `/docs`
