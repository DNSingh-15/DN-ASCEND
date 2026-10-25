---
name: Python
icon: 🐍
category: Backend
track: fullstack
color: #3776ab
order: 7
description: Python is a readable, general-purpose language used for backends, automation, data analysis and AI, covered here from basics to OOP and data libraries.
---

## Variables and Data Types
video: python variables data types
summary: A variable is a name that refers to a value; Python's common types are int, float, str, bool, list, tuple, dict and set.

A **variable** is a name used to store a value in memory. You reuse the name instead of the value. Python decides the type automatically from the value, so you don't declare types.

```python
name = "Alice"
age = 25
price = 99.99
is_active = True

print(name, age)
print(type(age))   # <class 'int'>
```

### Common types
| Type | Example | Meaning |
|---|---|---|
| `int` | `25` | whole numbers |
| `float` | `99.99` | decimal numbers |
| `str` | `"Alice"` | text |
| `bool` | `True` / `False` | yes or no |
| `list` | `[1, 2]` | ordered, changeable |
| `tuple` | `(1, 2)` | ordered, fixed |
| `dict` | `{"a": 1}` | key-value pairs |
| `set` | `{1, 2}` | unique items |

### Dynamic and strong typing
Python is **dynamically typed** (a name can point to any type, at any time) and **strongly typed** (it will not silently mix incompatible types). `"5" + 5` raises a `TypeError`.

Type hints are optional annotations that tools and editors read:
```python
age: int = 25
```

### Key Points
- Variables are names, not boxes; assignment binds a name to an object
- Use `type()` to check a type, `isinstance()` in code
- Interview tip: Python is dynamically typed but strongly typed

## Operators
video: python operators arithmetic comparison logical
summary: Operators perform arithmetic, comparison, logical, assignment and membership operations.

**Operators** perform operations on variables and values.

| Kind | Operators |
|---|---|
| Arithmetic | `+  -  *  /  %  //  **` |
| Comparison | `==  !=  >  <  >=  <=` |
| Logical | `and  or  not` |
| Assignment | `=  +=  -=` |
| Membership | `in`, `not in` |

```python
a = 10
b = 5

print(a + b)        # 15
print(a / b)        # 2.0  (always float)
print(a // 3)       # 3    (floor division)
print(a ** 2)       # 100  (power)
print(a > b)        # True
print(a and b)      # 5
print("x" in "xyz") # True
```

`and` and `or` return one of the operands, not always a bool. `a and b` gives `b` when `a` is truthy. This is why `print(a and b)` prints `5`.

```python
count = 0
count += 1          # same as count = count + 1
```

### Key Points
- `/` always gives a float, `//` gives a floored integer result
- Use `is` only for identity checks like `x is None`
- Interview tip: `and`/`or` short-circuit and return operands

## Conditional Statements
video: python if else elif conditions
summary: if, elif and else run code only when a condition is true.

Conditional statements execute code based on a condition. Use them for decision making.

```python
age = 18

if age >= 18:
    print("Eligible")
else:
    print("Not Eligible")
```

### Multiple conditions
```python
score = 72

if score >= 90:
    grade = "A"
elif score >= 60:
    grade = "B"
else:
    grade = "C"

print(grade)   # B
```

### Truthy and falsy values
`0`, `""`, `[]`, `{}`, `None` and `False` are falsy. Everything else is truthy.

```python
items = []
if not items:
    print("Cart is empty")
```

### Key Points
- Python uses indentation (4 spaces) to define blocks
- Use `elif`, not `else if`
- Interview tip: use the truthiness of values for clean code

## Loops
video: python for loop while loop range break continue
summary: for loops iterate over a sequence and while loops repeat while a condition holds; break and continue control them.

Loops execute a block of code repeatedly. Python has two kinds.

- **for** - iterate over items of a sequence
- **while** - repeat while a condition is `True`

```python
for i in range(5):        # 0, 1, 2, 3, 4
    print(i)

count = 3
while count > 0:
    print(count)
    count -= 1
```

### range()
`range(stop)`, `range(start, stop)` and `range(start, stop, step)`:
```python
list(range(2, 10, 2))   # [2, 4, 6, 8]
```

### break and continue
```python
for n in range(10):
    if n == 3:
        continue          # skip 3
    if n == 6:
        break             # stop the loop
    print(n)              # 0 1 2 4 5
```

### enumerate and zip
```python
names = ["Ali", "Sara"]
for index, name in enumerate(names):
    print(index, name)    # 0 Ali / 1 Sara
```

### Key Points
- Prefer `for` over `while` when you know the number of steps
- `for ... else` runs `else` only if the loop was not broken
- Avoid changing a list while looping over it

## Lists
video: python list methods append
summary: A list is an ordered, mutable collection that can hold items of any type.

A **list** is an ordered and **mutable** (changeable) collection. Use it to store multiple values that you need to modify.

```python
fruits = ["Apple", "Banana", "Mango"]

fruits.append("Orange")    # add at the end
fruits.insert(1, "Kiwi")   # add at index 1
fruits.remove("Banana")    # remove by value
last = fruits.pop()        # remove and return last item

print(fruits)              # ['Apple', 'Kiwi', 'Mango']
print(fruits[0])           # Apple (index starts at 0)
print(fruits[-1])          # Mango (negative index counts from end)
print(fruits[0:2])         # slicing: ['Apple', 'Kiwi']
print(len(fruits))         # 3
```

### Useful methods
| Method | What it does |
|---|---|
| `append(x)` | add one item at the end |
| `extend(list)` | add many items |
| `sort()` | sort in place |
| `reverse()` | reverse in place |
| `index(x)` | position of x |
| `count(x)` | how many times x appears |

### Key Points
- Lists are mutable; the same list can change in many places (be careful when copying: use `.copy()` or `list(x)`)
- Indexing out of range raises `IndexError`
- Interview tip: `list.sort()` changes the list; `sorted(list)` returns a new one

## Tuples
video: python tuple immutable
summary: A tuple is an ordered, immutable collection, useful for data that should not change.

A **tuple** is an ordered and **immutable** (unchangeable) collection. Use it for data that should never change, such as coordinates or RGB colors.

```python
colors = ("Red", "Blue", "Green")

print(colors[0])      # Red
# colors[0] = "Pink"  # TypeError: tuples do not support item assignment
```

### Packing and unpacking
```python
point = (10, 20)
x, y = point          # unpacking
print(x, y)           # 10 20

# swap two values without a temp variable
a, b = 1, 2
a, b = b, a
```

### Single-item tuple
```python
one = (5,)            # the comma makes it a tuple
not_tuple = (5)       # just the int 5
```

### Why use a tuple?
- Slightly faster and smaller than a list
- Can be a dictionary key (lists cannot)
- Signals to readers that the data is fixed

### Key Points
- Immutable means you cannot add, remove or replace items
- Unpacking is one of the most used Python features
- Interview tip: tuples are hashable when their items are hashable

## Dictionaries
video: python dictionary key value methods
summary: A dictionary stores key-value pairs for fast lookup by key.

A **dictionary** stores data as **key-value pairs**. Use it to store structured data and look it up quickly by key (average O(1) time).

```python
student = {
    "name": "John",
    "age": 22
}

print(student["name"])            # John
print(student.get("grade", "NA")) # NA (safe: no KeyError)

student["age"] = 23               # update
student["city"] = "Lahore"        # add new key
del student["city"]               # delete

for key, value in student.items():
    print(key, value)
```

### Common methods
| Method | Purpose |
|---|---|
| `keys()` | all keys |
| `values()` | all values |
| `items()` | key-value pairs |
| `get(key, default)` | safe read |
| `update(other)` | merge another dict |
| `pop(key)` | remove and return value |

### Dict comprehension
```python
squares = {n: n * n for n in range(4)}   # {0: 0, 1: 1, 2: 4, 3: 9}
```

### Key Points
- Keys must be immutable (str, int, tuple)
- `d[key]` raises `KeyError` if missing; `d.get(key)` returns `None`
- Since Python 3.7, dictionaries keep insertion order

## Sets
video: python set unique items operations
summary: A set is an unordered collection of unique items, great for removing duplicates and membership tests.

A **set** is an unordered collection with **no duplicate items**. Sets are fast for membership tests (`in`).

```python
nums = {1, 2, 2, 3, 3, 3}
print(nums)                # {1, 2, 3}

nums.add(4)
nums.discard(1)            # no error if missing

a = {1, 2, 3}
b = {3, 4, 5}
print(a | b)               # union: {1, 2, 3, 4, 5}
print(a & b)               # intersection: {3}
print(a - b)               # difference: {1, 2}
```

### Remove duplicates from a list
```python
emails = ["a@x.com", "b@x.com", "a@x.com"]
unique = list(set(emails))   # order is not guaranteed
```

### Key Points
- Use `set()` for an empty set; `{}` creates an empty dict
- Sets only hold hashable (immutable) items
- Use `frozenset` for an immutable set

## Functions
video: python functions def return parameters
summary: A function is a reusable block of code that takes parameters, performs a task and optionally returns a value.

A **function** is a reusable block of code that performs a specific task. Functions reduce duplication and improve readability.

```python
def greet(name):
    return f"Hello {name}"

print(greet("Alice"))   # Hello Alice
```

### Parameters and defaults
```python
def power(base, exp=2):
    return base ** exp

print(power(3))        # 9
print(power(2, 5))     # 32
print(power(exp=3, base=2))   # 8 (keyword arguments)
```

### return
A function without `return` gives back `None`. A function can return several values as a tuple:
```python
def min_max(nums):
    return min(nums), max(nums)

low, high = min_max([4, 9, 1])
```

### Docstrings
```python
def area(w, h):
    """Return the area of a rectangle."""
    return w * h
```

### Key Points
- Default arguments must come after non-default ones
- Never use a mutable default like `def f(x=[])`; use `None` instead
- Interview tip: Python passes object references ("call by object reference")

## *args and **kwargs
video: python args kwargs variable arguments
summary: *args collects extra positional arguments as a tuple and **kwargs collects extra keyword arguments as a dict.

Sometimes you don't know how many arguments a function will get. `*args` and `**kwargs` handle that.

- `*args` - collects extra **positional** arguments into a **tuple**
- `**kwargs` - collects extra **keyword** arguments into a **dict**

```python
def total(*args):
    return sum(args)

print(total(1, 2, 3))          # 6

def profile(**kwargs):
    for key, value in kwargs.items():
        print(key, "=", value)

profile(name="Ali", age=25)    # name = Ali / age = 25
```

### Combining them
```python
def show(title, *args, **kwargs):
    print(title, args, kwargs)

show("Report", 1, 2, year=2024)
# Report (1, 2) {'year': 2024}
```

### Unpacking when calling
```python
nums = [1, 2, 3]
print(*nums)                   # same as print(1, 2, 3)

config = {"name": "Ali", "age": 25}
profile(**config)              # same as profile(name="Ali", age=25)
```

The names `args` and `kwargs` are only convention; the `*` and `**` are what matter.

### Key Points
- Order in a signature: normal args, `*args`, keyword-only, `**kwargs`
- Very common in decorators and wrapper functions
- Interview tip: `*` unpacks iterables, `**` unpacks dicts

## Lambda, map() and filter()
video: python lambda map filter
summary: Lambda creates small anonymous one-line functions; map and filter apply or select items from iterables using them.

**Lambda functions** are small anonymous functions written in a single line. Useful for short operations.

```python
square = lambda x: x * x
print(square(5))          # 25
```

**`map()`** applies a function to every item in an iterable. It is used to transform data.

```python
numbers = [1, 2, 3]
result = list(map(lambda x: x * 2, numbers))
print(result)            # [2, 4, 6]
```

**`filter()`** keeps only the items where the function returns `True`.

```python
numbers = [1, 2, 3, 4, 5]
result = list(filter(lambda x: x % 2 == 0, numbers))
print(result)            # [2, 4]
```

`map()` and `filter()` return lazy iterators, so wrap them in `list()` to see the values.

### Using a named function instead
```python
def is_even(n):
    return n % 2 == 0

evens = list(filter(is_even, range(10)))
```

### Key Points
- Lambdas can hold only one expression, no statements
- Many Python developers prefer list comprehensions over map/filter for readability
- Interview tip: `map` transforms, `filter` selects

## List Comprehensions
video: python list comprehension
summary: List comprehensions build a new list in one readable line, with an optional if condition.

A **list comprehension** builds a new list from another iterable in one line. It is shorter and usually faster than a `for` loop with `append`.

```python
# loop version
squares = []
for n in range(5):
    squares.append(n * n)

# comprehension version
squares = [n * n for n in range(5)]   # [0, 1, 4, 9, 16]
```

### With a condition
```python
evens = [n for n in range(10) if n % 2 == 0]   # [0, 2, 4, 6, 8]
```

### With if / else
```python
labels = ["even" if n % 2 == 0 else "odd" for n in range(4)]
# ['even', 'odd', 'even', 'odd']
```

### Nested
```python
pairs = [(x, y) for x in [1, 2] for y in ["a", "b"]]
# [(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]
```

### Key Points
- Read it as: "for each item in iterable, if condition, give expression"
- Keep it short; if it needs three lines, use a loop
- Set and dict comprehensions use `{}` instead of `[]`

## Modules and Imports
video: python modules import packages
summary: A module is a Python file with reusable code; import it with import, from ... import or an alias.

**Modules** are Python files containing reusable code. You reuse built-in or your own functionality by importing them.

```python
import math
print(math.sqrt(25))         # 5.0

from math import pi, sqrt    # import specific names
print(pi)

import numpy as np           # alias
```

### Your own module
```python
# utils.py
def add(a, b):
    return a + b

# main.py
from utils import add
print(add(2, 3))
```

A folder with an `__init__.py` file (or any folder in modern Python) is a **package**, and you import with dots: `from app.services import email`.

### The main guard
```python
def main():
    print("running directly")

if __name__ == "__main__":
    main()
```
Code under this guard runs only when you run the file, not when it is imported.

### Key Points
- Each module is imported only once and cached
- Avoid `from x import *` in real code
- Interview tip: `__name__` is `"__main__"` when the file is run directly

## Standard Library
video: python standard library math os sys random datetime json
summary: Python ships with a large standard library for math, files, dates, JSON, random numbers and collections.

Python provides many built-in libraries for common tasks. You don't need to install them.

| Library | Use |
|---|---|
| `math` | square root, trig, constants |
| `os` | files, folders, environment variables |
| `sys` | interpreter info, command line args |
| `random` | random numbers and choices |
| `datetime` | dates and times |
| `json` | read and write JSON |
| `collections` | `Counter`, `defaultdict`, `deque`, `namedtuple` |

```python
from datetime import datetime
print(datetime.now())

import json
data = json.dumps({"name": "Ali"})      # dict -> JSON string
obj = json.loads(data)                   # JSON string -> dict

from collections import Counter
print(Counter("banana").most_common(1))  # [('a', 3)]

import os
print(os.getenv("HOME"))
```

### Key Points
- Check the docs before writing a helper; the stdlib often has it
- `pathlib` is the modern way to handle file paths
- Interview tip: know `collections` and `itertools` for clean code

## Virtual Environments and pip
video: python virtual environment pip requirements
summary: pip installs third-party packages, and a virtual environment keeps each project's dependencies separate.

**pip** is Python's package installer. It downloads packages from PyPI (the Python Package Index).

A **virtual environment** is an isolated folder with its own Python and packages, so projects don't break each other.

```bash
# create and activate (Windows PowerShell)
python -m venv .venv
.venv\Scripts\Activate.ps1

# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate

# install and record dependencies
pip install fastapi uvicorn
pip freeze > requirements.txt

# install from file on another machine
pip install -r requirements.txt
```

### Key Points
- Create one venv per project; add `.venv/` to `.gitignore`
- Always check which Python and pip you are using inside the venv
- Modern alternatives: `uv`, `poetry`, `conda`

## Exception Handling
video: python exception handling try except finally
summary: try/except catches runtime errors so the program can respond instead of crashing, and finally always runs.

**Exception handling** prevents a program from crashing when an error occurs. It also identifies, catches, and responds to runtime errors, which improves reliability.

```python
try:
    num = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")
```

### try / except / else / finally
```python
try:
    number = int(input("Enter a number: "))
except ValueError:
    print("Invalid input")
else:
    print("You entered", number)     # runs only when no error
finally:
    print("Program finished")        # always runs
```

### Raising your own errors
```python
def set_age(age):
    if age < 0:
        raise ValueError("Age cannot be negative")
    return age
```

### Catch several errors
```python
try:
    value = data["key"] / count
except (KeyError, ZeroDivisionError) as err:
    print("Problem:", err)
```

### Key Points
- Catch specific exceptions, not a bare `except:`
- Use `finally` (or `with`) to release resources
- Don't hide errors silently; log them or re-raise

## File Operations
video: python file handling read write with open
summary: Use open() inside a with block to read, write and append files safely.

**File operations** let a program create, read, write, and update files. Use them to store and retrieve data permanently.

```python
with open("sample.txt", "w") as file:
    file.write("Hello Python")
```

The `with` block closes the file automatically, even when an error happens.

### Read modes
```python
with open("sample.txt", "r", encoding="utf-8") as f:
    text = f.read()          # whole file as a string

with open("sample.txt") as f:
    for line in f:          # memory friendly for big files
        print(line.strip())
```

### File modes
| Mode | Meaning |
|---|---|
| `r` | read (default) |
| `w` | write, erases old content |
| `a` | append to the end |
| `x` | create, fail if it exists |
| `b` | binary (e.g. images), e.g. `rb` |

### Key Points
- Always use `with open(...)`
- Specify `encoding="utf-8"` for text
- Use `pathlib.Path` for paths that work on every OS

## Decorators
video: python decorators tutorial
summary: A decorator is a function that wraps another function to add behavior, such as logging or timing, without changing its code.

A **decorator** is a function that takes another function and returns a new one with extra behavior. The `@name` syntax is shorthand for wrapping.

```python
def log_call(func):
    def wrapper(*args, **kwargs):
        print("Calling", func.__name__)
        result = func(*args, **kwargs)
        print("Done")
        return result
    return wrapper

@log_call
def add(a, b):
    return a + b

add(2, 3)
# Calling add
# Done
```

`@log_call` above `def add` is the same as `add = log_call(add)`.

### Real use: timing
```python
import time
from functools import wraps

def timer(func):
    @wraps(func)                  # keeps the original name and docstring
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.perf_counter() - start:.4f}s")
        return result
    return wrapper
```

Frameworks use the same idea: `@app.get("/")` in FastAPI, `@login_required` in Flask and Django.

### Key Points
- Use `*args, **kwargs` in the wrapper so it works with any function
- Use `functools.wraps` to keep metadata
- Interview tip: a decorator is a higher-order function

## Generators
video: python generators yield
summary: Generators use yield to produce values one at a time, saving memory on large or endless sequences.

A **generator** is a function that uses `yield` instead of `return`. It produces values one at a time, pausing between them, so it does not store the whole sequence in memory.

```python
def count_up(limit):
    n = 1
    while n <= limit:
        yield n
        n += 1

for x in count_up(3):
    print(x)          # 1 2 3

gen = count_up(2)
print(next(gen))      # 1
print(next(gen))      # 2
```

### Generator expression
```python
total = sum(n * n for n in range(1_000_000))   # no big list created
```

### Reading big files
```python
def read_lines(path):
    with open(path) as f:
        for line in f:
            yield line.strip()
```

### Key Points
- A generator can be iterated only once
- Compare: `[x for x in ...]` builds a list, `(x for x in ...)` is lazy
- Interview tip: `yield` makes a function return an iterator

## Classes (OOP)
video: python classes objects oop init self
summary: A class is a blueprint for objects that bundle data (attributes) and behavior (methods).

A **class** is a blueprint for creating **objects** that contain data and methods. Use classes to organize code with object-oriented programming (OOP).

```python
class Student:
    def __init__(self, name):      # constructor
        self.name = name           # attribute

    def introduce(self):           # method
        return f"Hi, I am {self.name}"

student = Student("Alice")         # create an object (instance)
print(student.name)                # Alice
print(student.introduce())         # Hi, I am Alice
```

### Key ideas
- `__init__` runs when an object is created
- `self` is the object itself; it is passed automatically
- Each object has its own attributes

### Class attributes vs instance attributes
```python
class Dog:
    species = "Canine"             # shared by all dogs

    def __init__(self, name):
        self.name = name           # unique to each dog

print(Dog.species)                 # Canine
```

### Special methods
```python
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

print(Point(1, 2))                 # Point(1, 2)
```

### Key Points
- Class = blueprint, object = instance made from it
- Use `@dataclass` for simple data-holding classes
- Interview tip: `__init__` initializes; `__new__` creates

## Inheritance
video: python inheritance
summary: Inheritance lets a child class reuse and extend the attributes and methods of a parent class.

**Inheritance** allows one class to inherit properties and methods from another class. It promotes code reuse and reduces duplication.

```python
class Animal:
    def sound(self):
        print("Animal Sound")

class Dog(Animal):
    pass

Dog().sound()      # Animal Sound
```

### Overriding and super()
```python
class Animal:
    def __init__(self, name):
        self.name = name

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)     # call the parent constructor
        self.breed = breed

    def sound(self):
        return f"{self.name} says Woof"

d = Dog("Tommy", "Lab")
print(d.sound())                   # Tommy says Woof
```

### Checking types
```python
isinstance(d, Animal)   # True
issubclass(Dog, Animal) # True
```

### Key Points
- A child can override a parent's method
- Use `super()` to reuse parent behavior
- Python supports multiple inheritance; prefer composition when it gets confusing

## Polymorphism
video: python polymorphism
summary: Polymorphism lets different objects respond to the same method call in their own way.

**Polymorphism** means "many forms". The same method call behaves differently depending on the object. This lets you write flexible code that works with any object that has the right method.

```python
class Dog:
    def sound(self):
        print("Bark")

class Cat:
    def sound(self):
        print("Meow")

for animal in [Dog(), Cat()]:
    animal.sound()     # Bark, then Meow
```

The loop does not care whether the object is a Dog or a Cat. It only needs a `sound()` method. This is called **duck typing**: "if it walks like a duck and quacks like a duck, it is a duck".

### Polymorphism with inheritance
```python
class Shape:
    def area(self):
        return 0

class Square(Shape):
    def __init__(self, s):
        self.s = s
    def area(self):
        return self.s ** 2

shapes = [Square(2), Square(3)]
print([s.area() for s in shapes])   # [4, 9]
```

### Key Points
- Same interface, different implementation
- Makes code easy to extend with new classes
- Interview tip: method overriding is runtime polymorphism

## Encapsulation
video: python encapsulation private variables property
summary: Encapsulation hides internal data and gives controlled access through methods or properties.

**Encapsulation** hides internal data and controls access using methods. It protects object data from being changed in invalid ways.

```python
class Bank:
    def __init__(self):
        self.__balance = 1000          # name mangled: private by convention

    def get_balance(self):
        return self.__balance

bank = Bank()
print(bank.get_balance())      # 1000
# print(bank.__balance)        # AttributeError
```

A double underscore (`__`) triggers name mangling, which makes the name hard to access from outside. A single underscore (`_balance`) only signals "internal use".

### Controlled changes
```python
class Bank:
    def __init__(self):
        self.__balance = 1000

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        self.__balance += amount

    @property
    def balance(self):
        return self.__balance
```

With `@property`, `bank.balance` reads like an attribute but goes through your method.

### Key Points
- Expose behavior, hide state
- Validate inside setters or methods
- Python's privacy is by convention, not strict

## Abstraction
video: python abstract class abc abstractmethod
summary: Abstraction exposes only essential methods of a class through an abstract base class, hiding implementation details.

**Abstraction** hides implementation details and exposes only the essential functionality. It helps simplify complex systems: the user knows *what* an object can do, not *how* it does it.

In Python you use the `abc` module to create an **abstract base class** (ABC) with **abstract methods**.

```python
from abc import ABC, abstractmethod

class Shape(ABC):

    @abstractmethod
    def area(self):
        pass

class Circle(Shape):
    def __init__(self, r):
        self.r = r

    def area(self):
        return 3.14159 * self.r ** 2

# Shape()          # TypeError: cannot instantiate abstract class
print(Circle(2).area())   # 12.56636
```

Any subclass must implement every abstract method, or Python refuses to create it.

### Key Points
- Abstract class = a contract for subclasses
- You cannot create an instance of an abstract class
- Interview tip: abstraction is about hiding details, encapsulation is about protecting data

## NumPy
video: numpy python tutorial arrays
summary: NumPy provides fast n-dimensional arrays and vectorized math, the foundation of Python data science.

**NumPy** is a Python library for fast numerical computing using **arrays**. It is written largely in C, so operations on arrays are much faster than Python loops. It is the base for pandas, scikit-learn and most AI libraries.

```python
import numpy as np

arr = np.array([1, 2, 3])
print(arr * 2)           # [2 4 6]   no loop needed
```

### Creating arrays
```python
np.zeros((2, 3))         # 2 rows, 3 columns of 0.0
np.arange(0, 10, 2)      # [0 2 4 6 8]
np.linspace(0, 1, 5)    # 5 evenly spaced values from 0 to 1
```

### Vectorized operations
A **vectorized** operation applies to the whole array at once.
```python
prices = np.array([100, 200, 300])
with_tax = prices * 1.18           # every element multiplied
mask = prices > 150                # [False True True]
print(prices[mask])                # [200 300]
```

### Key Points
- All items in an array have the same type (usually)
- Avoid Python loops on large arrays; use vectorized operations
- Interview tip: vectorization is faster because the loop runs in C

## Pandas
video: pandas python tutorial dataframe
summary: Pandas provides DataFrames for loading, cleaning, filtering and analyzing tabular data such as CSV files.

**Pandas** is a library for **data analysis and manipulation**. Its main object is the **DataFrame**, a table with rows and named columns. Use it to work with tables, CSV files, and structured datasets.

```python
import pandas as pd

data = {
    "Name": ["Alice", "Bob"],
    "Age": [22, 25]
}

df = pd.DataFrame(data)
print(df)
```

```text
    Name  Age
0  Alice   22
1    Bob   25
```

### Read and inspect
```python
df = pd.read_csv("students.csv")
df.head()          # first 5 rows
df.info()          # columns, types, missing values
df.describe()      # mean, min, max, etc.
```

### Filter, sort and select
```python
df2 = pd.DataFrame({"Name": ["Alice", "Bob"], "Age": [22, 25]})

print(df2[df2["Age"] > 22])            # only Bob
print(df2.sort_values("Age", ascending=False))
print(df2["Name"])                     # one column as a Series
```

### Key Points
- A DataFrame column is a Series (a 1-D NumPy-like array)
- Use `df.loc[]` for label-based and `df.iloc[]` for position-based access
- Interview tip: pandas is built on NumPy

## Data Manipulation with NumPy and Pandas
video: numpy pandas data manipulation groupby
summary: Use NumPy for numeric aggregation and Pandas for cleaning, grouping and preparing datasets for analysis.

Both libraries let you clean, filter, sort, reshape and aggregate data without writing loops.

### NumPy aggregation
```python
import numpy as np

arr = np.array([10, 20, 30])
print(arr.mean())        # 20.0
print(arr.max())         # 30
print(arr.sum(), arr.std())
```

### Pandas cleaning and grouping
```python
import pandas as pd

df = pd.DataFrame({
    "city": ["Lahore", "Karachi", "Lahore", None],
    "sales": [120, 90, None, 60],
})

df["sales"] = df["sales"].fillna(0)        # replace missing numbers
df = df.dropna(subset=["city"])           # drop rows with missing city

summary = df.groupby("city")["sales"].sum()
print(summary)
```

### Typical workflow
```text
Load (read_csv) -> Clean (fillna, dropna) -> Transform (new columns)
   -> Aggregate (groupby, mean) -> Report or feed a model
```

### Key Points
- Prefer vectorized operations over `iterrows()` (slow)
- `groupby` followed by an aggregate is the most common pandas pattern
- Always check `df.info()` for missing values first
