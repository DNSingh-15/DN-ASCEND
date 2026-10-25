---
name: React
icon: ⚛️
category: Frontend
track: fullstack
color: #06b6d4
order: 3
description: React is a JavaScript library for building component-based user interfaces that update efficiently when data changes.
---

## What is React?
video: react js introduction for beginners
summary: React is a JavaScript library for building UIs from components with one-way data flow.

React is a **JavaScript library** for building dynamic user interfaces. You describe the UI as a function of state, and React updates the screen when that state changes. It follows a **unidirectional data flow**: data moves from parent to child through props.

React is a library, not a full framework, so routing, data fetching and state management are usually added with other tools such as React Router, Next.js or Redux.

```tsx
export default function App() {
  return <h1>Hello, React!</h1>;
}
```

### Key Points
- Declarative: you describe what the UI should look like for a given state.
- Component-based: the UI is built from small reusable pieces.
- Interview tip: explain why React is called a library and what it does not include.

## Why React?
video: react advantages why use react
summary: React is popular for its reusable components, efficient updates, large ecosystem and server rendering via Next.js.

Reasons teams choose React:

- **Fast updates**: the Virtual DOM and reconciliation update only what changed.
- **Component reusability**: build once, reuse across pages and projects.
- **Easy to learn and test**: components are plain functions of props and state.
- **Huge community and ecosystem**: libraries for routing, forms, state, testing and UI kits.
- **Server-side rendering**: frameworks such as Next.js add SSR, static generation and React Server Components for SEO and speed.
- **Cross-platform**: React Native uses the same ideas for mobile apps.

```tsx
function ProductCard({ title, price }: { title: string; price: number }) {
  return <div>{title}: Rs {price}</div>;
}
// reused for every product in the list
```

### Key Points
- Interview tip: give 3-4 concrete reasons, and mention one downside (it is only the view layer, so you must pick other libraries).

## Components
video: react components functional components
summary: Components are reusable UI building blocks; modern React uses function components.

Components are **reusable UI blocks**. A component is a function that returns JSX.

| Type | Description |
|------|-------------|
| **Function components** | Modern standard, use hooks for state and effects |
| **Class components** | Legacy style, uses lifecycle methods such as `componentDidMount` |

```tsx
function Button({ label }: { label: string }) {
  return <button>{label}</button>;
}
```

Component names must start with a capital letter so React knows they are components, not HTML tags.

### Key Points
- Compose larger UIs by nesting components.
- New projects should use function components with hooks.

## JSX
video: react jsx tutorial
summary: JSX lets you write HTML-like markup inside JavaScript; Babel compiles it to function calls.

JSX allows you to write **HTML-like markup inside JavaScript**. Browsers do not understand JSX directly; tools such as Babel or the SWC compiler convert it into plain `React.createElement` (or `jsx()`) calls.

```tsx
const el = <h1 className="title">Hi</h1>;
// compiles roughly to: React.createElement("h1", { className: "title" }, "Hi")
```

Rules to remember:
- Use `className` instead of `class`, and `htmlFor` instead of `for`.
- Use `{ }` to embed any JavaScript expression.
- Every JSX expression needs one parent element (or a fragment).

### Key Points
- JSX is syntactic sugar, not required, but it is what everyone uses.
- Interview tip: explain that JSX is compiled, so browsers never see it.

## Props
video: react props tutorial
summary: Props are read-only inputs passed from a parent component to a child component.

Props are **inputs** passed from parent to child. They are **read-only**: a child must never change its own props.

```tsx
function Greeting({ name }: { name: string }) {
  return <h1>Hello {name}</h1>;
}

<Greeting name="Asha" />
```

### Special prop: children
```tsx
function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}
```

### Key Points
- Data flows down through props; events flow up through callback props.
- Default values: `function Button({ size = "md" })`.

## State and useState
video: react usestate hook
summary: useState stores a value that, when changed, makes React re-render the component.

**State** is data that can change over time and affects what is rendered. `useState` returns the current value and a setter function. Calling the setter schedules a re-render.

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Important rules
- Never modify state directly (`count = 5` does nothing useful). Always use the setter.
- State updates are batched and may be asynchronous. If the new value depends on the old one, use the functional form:

```tsx
setCount(prev => prev + 1);
```

- Use an initializer function for expensive initial values: `useState(() => computeValue())`.

### Key Points
- State is local to each component instance.
- Interview tip: explain why functional updates are safer when called multiple times in one event.

## Hooks: The Basics
video: react hooks tutorial rules of hooks
summary: Hooks let function components use state and other React features; they must follow two rules.

Hooks are special functions starting with `use` that let function components use React features such as state, side effects, context and refs.

Hooks are **not** lifecycle methods. Lifecycle methods belong to class components. Hooks let you describe the same behaviour (mount, update, unmount) using effects.

### The Rules of Hooks
1. Call hooks only at the **top level** of a component or custom hook, never inside loops, conditions or nested functions.
2. Call hooks only from **React function components** or **custom hooks**.

React relies on the order in which hooks are called to match state with each hook, so changing that order breaks the component.

### Key Points
- Interview tip: state the two rules and explain why the order matters.
- ESLint plugin `eslint-plugin-react-hooks` enforces them.

## useEffect
video: react useEffect hook
summary: useEffect runs side effects like API calls and subscriptions after render, with dependencies and cleanup.

`useEffect` lets you run **side effects**: work that reaches outside the component, such as API calls, subscriptions, timers, or direct DOM changes. It runs **after** the component renders and the screen is updated.

```tsx
useEffect(() => {
  console.log("Component mounted");
}, []); // [] = run only once, after the first render
```

### Dependency array
| Dependency array | When the effect runs |
|------------------|----------------------|
| Omitted | After every render |
| `[]` | Only after the first render |
| `[a, b]` | After the first render and whenever `a` or `b` changes |

### Cleanup
Return a function from the effect to clean up (remove listeners, clear timers, cancel requests). It runs before the next effect and when the component unmounts.

```tsx
useEffect(() => {
  const id = setInterval(() => tick(), 1000);
  return () => clearInterval(id);
}, []);
```

### Key Points
- Fetching data in an effect: guard against race conditions with an `ignore` flag or `AbortController`.
- Do not use effects for things that can be computed during render.

## useLayoutEffect
video: react useLayoutEffect vs useEffect
summary: useLayoutEffect runs after DOM changes but before the browser paints, so it can measure and adjust layout without flicker.

`useLayoutEffect` has the same signature as `useEffect`, but it runs **after React has updated the DOM and before the browser paints** the screen. It is synchronous and blocks painting.

```tsx
useLayoutEffect(() => {
  const height = boxRef.current.getBoundingClientRect().height;
  setHeight(height); // applied before the user sees the old layout
}, []);
```

### useEffect vs useLayoutEffect

| Feature | useEffect | useLayoutEffect |
|---------|-----------|-----------------|
| Runs | After browser paints | After DOM update, before paint |
| Blocking | Non-blocking | Blocks painting |
| Use for | Data fetching, subscriptions, logging | Measuring layout, avoiding visual flicker |

### Key Points
- Start with `useEffect`; switch to `useLayoutEffect` only when you need to measure the DOM and avoid a flash of incorrect layout.
- It does not run during server rendering, so prefer `useEffect` in SSR code unless you truly need layout measurement.

## useRef
video: react useRef hook
summary: useRef holds a mutable value that persists across renders without causing re-renders, and gives access to DOM nodes.

`useRef` returns a plain object `{ current: ... }` that **persists across renders**. Changing `.current` does **not** trigger a re-render, which makes it ideal for values you need to remember but not display.

Two main uses:
1. **Access DOM elements** (focus, scroll, measure).
2. **Store mutable values** such as timer IDs or previous values, where `useState` would cause unwanted re-renders.

```tsx
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  inputRef.current?.focus();
}, []);

return <input ref={inputRef} />;
```

### Key Points
- Use `useRef` when you need a value that is not part of the rendered output.
- Interview tip: the difference between `useRef` and `useState` is that changing a ref does not re-render.

## useContext
video: react useContext context api
summary: useContext shares data across the component tree without passing props through every level.

Context shares values, such as theme or logged-in user, with many components without **prop drilling**.

```tsx
const ThemeContext = createContext("dark");

// Provider higher up the tree
<ThemeContext.Provider value="light">
  <Page />
</ThemeContext.Provider>

// Any descendant
function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Save</button>;
}
```

### Key Points
- Every component that reads the context re-renders when the provided value changes, so keep context values stable (use `useMemo` for objects).
- Context is great for low-frequency global data; for frequently changing or complex state, consider a state library.

## Prop Drilling
video: react prop drilling solution context redux
summary: Prop drilling is passing data through many layers that do not need it; use Context or state management to avoid it.

**Prop drilling** means passing data through several nested components that do not use it, only to reach a deeper child.

```tsx
// App -> Layout -> Sidebar -> UserCard  (user only needed in UserCard)
```

Solutions:
- **Context API** for shared values.
- **Component composition** (pass the finished element as `children`).
- **Redux, Zustand or other state libraries** for large shared state.

### Key Points
- Prop drilling is not always bad; passing props only a couple of levels is fine.

## useMemo
video: react useMemo hook performance
summary: useMemo caches the result of an expensive calculation between renders until its dependencies change.

`useMemo` returns a **memoized value**. It recalculates only when a dependency changes, which avoids repeating expensive work on every render.

```tsx
const memoValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Also useful to keep object or array references stable for child components or effects.

### Key Points
- Do not wrap every value in `useMemo`; measure first. It has its own cost.
- Interview tip: `useMemo` memoizes a value, `useCallback` memoizes a function.

## useCallback
video: react useCallback hook
summary: useCallback returns a memoized function so its reference stays the same between renders.

`useCallback` returns a **memoized function**. Each render normally creates a new function object; `useCallback` keeps the same one unless dependencies change. This matters when the function is passed to a child wrapped in `React.memo`.

```tsx
const handleClick = useCallback(() => setCount(c => c + 1), []);
```

Equivalent: `useCallback(fn, deps)` is the same as `useMemo(() => fn, deps)`.

### Key Points
- Useful together with `React.memo` and when a function is a dependency of an effect.
- Using it everywhere adds overhead for no benefit.

## React.memo
video: react memo component rerender optimization
summary: React.memo skips re-rendering a component when its props have not changed.

`React.memo` wraps a component and skips re-rendering it when its props are shallowly equal to the previous props.

```tsx
const ExpensiveList = React.memo(function ExpensiveList({ items }: { items: string[] }) {
  return items.map(i => <div key={i}>{i}</div>);
});
```

### Key Points
- Props that are new objects, arrays or functions on each render break memoization; combine with `useMemo` and `useCallback`.
- It is an optimization, not a guarantee.

## Lists and Keys
video: react lists keys map rendering
summary: Use map to render arrays of elements, and give each item a stable key.

```tsx
const users = ["Asha", "Ravi"];

<ul>
  {users.map(u => <li key={u}>{u}</li>)}
</ul>
```

React uses the `key` to match items between renders. Use a stable unique id from the data. Avoid using the array index when items can be reordered, added or removed.

### Key Points
- Missing keys cause a warning in the console.
- Keys only need to be unique among siblings.

## Controlled and Uncontrolled Components
video: react controlled uncontrolled input forms
summary: Controlled inputs have their value stored in React state; uncontrolled inputs keep their value in the DOM.

| Type | Description |
|------|-------------|
| **Controlled** | React state is the single source of truth for the input value |
| **Uncontrolled** | The DOM holds the value; you read it with a ref when needed |

```tsx
// Controlled
const [name, setName] = useState("");
<input value={name} onChange={e => setName(e.target.value)} />

// Uncontrolled
const nameRef = useRef<HTMLInputElement>(null);
<input defaultValue="Asha" ref={nameRef} />
```

### Key Points
- Controlled inputs make validation and formatting easy.
- Uncontrolled inputs are simpler for very basic forms or file inputs.

## Events
video: react event handling onClick onChange
summary: React attaches event handlers using synthetic events that work consistently across browsers.

React uses **synthetic events**: cross-browser wrappers around native DOM events with the same interface. Event props are camelCase, such as `onClick`, `onChange`, `onSubmit`.

```tsx
<form onSubmit={e => { e.preventDefault(); save(); }}>
  <button onClick={() => console.log("clicked")}>Save</button>
</form>
```

### Key Points
- Pass a function reference (`onClick={handle}`) or call with an arrow function when you need arguments (`onClick={() => handle(id)}`). Do not write `onClick={handle()}`, which runs immediately.
- Use `e.preventDefault()` to stop default browser behaviour.

## Fragments
video: react fragment tutorial
summary: Fragments group several elements without adding an extra DOM node.

A **fragment** lets a component return multiple elements without wrapping them in an extra `<div>`.

```tsx
<>
  <ChildA />
  <ChildB />
</>
```

Use `<React.Fragment key={id}>` when you need a key on a fragment inside a list.

### Key Points
- Keeps the DOM clean and avoids breaking layouts such as tables.

## Conditional Rendering
video: react conditional rendering
summary: Show or hide UI based on state using ternary operators, && and early returns.

```tsx
{isLoggedIn ? <Dashboard /> : <Login />}
{error && <p className="error">{error}</p>}
```

### Key Points
- Careful: `count && <X />` renders the number `0` when `count` is `0`. Use `count > 0 && ...` or a ternary instead.
- Early return is useful: `if (!data) return <Spinner />;`.

## Virtual DOM and Reconciliation
video: react virtual dom reconciliation diffing
summary: React keeps a lightweight in-memory copy of the UI and updates only the changed parts of the real DOM.

The **Virtual DOM** is a lightweight JavaScript object tree that describes the UI. When state changes, React:

1. Creates a new Virtual DOM tree.
2. **Reconciles** it: compares the new tree with the old one (the diffing algorithm).
3. Computes the minimal set of changes.
4. Applies only those changes to the real DOM.

| Virtual DOM | Real DOM |
|-------------|----------|
| Lightweight JavaScript copy | The actual browser DOM |
| Fast to create and compare | Slow to update |
| Not updated directly by you | Can be manipulated directly |

Note: the Virtual DOM is not automatically faster than direct DOM manipulation in every case. Its value is predictable updates and a declarative programming model.

### Key Points
- Reconciliation is React's process of updating the UI by comparing old and new trees.
- Keys help reconciliation match list items correctly.

## Re-rendering
video: react rerender why component re-renders
summary: A component re-renders when its state changes, its props change, or its parent re-renders.

React re-renders a component when:
- its **state** changes,
- its **props** change, or
- its **parent** re-renders (children re-render by default, unless memoized).

Re-rendering is cheap; the real cost is the DOM work and expensive calculations inside. Avoid unnecessary re-renders by moving state down, memoizing and splitting components.

### Key Points
- Re-render does not always mean the DOM changed.
- Interview tip: explain React's render phase vs commit phase.

## Stateful vs Stateless Components
video: react stateful stateless components
summary: Stateful components manage their own data with state; stateless components only render what their props give them.

| Type | Description |
|------|-------------|
| Stateful | Holds internal state (uses `useState` or `useReducer`) |
| Stateless | Depends only on props and renders the same output for the same input |

Stateless components are easier to test and reuse. A good pattern is to keep most components presentational and put state in a few container components.

### Key Points
- In modern React, both are function components; the difference is whether they use state.

## Custom Hooks
video: react custom hooks tutorial
summary: Custom hooks extract reusable stateful logic into functions whose names start with use.

A **custom hook** is a function whose name starts with `use` and that calls other hooks. It lets you share logic between components.

```tsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

const width = useWindowWidth();
```

### Key Points
- Custom hooks share logic, not state: each call gets its own state.
- Interview tip: explain that hooks are a way to reuse stateful logic, which mixins and HOCs did before.

## Memory Leaks
video: react memory leak useEffect cleanup
summary: Memory leaks happen when subscriptions, timers or requests keep running after a component is removed.

A memory leak happens when resources are not released.

### Common causes
1. **Uncleaned subscriptions**: WebSocket or event listeners keep running after unmount.
2. **Timers**: `setInterval` or `setTimeout` continue in the background if not cleared.
3. **Async updates after unmount**: a response arrives and tries to update state of an unmounted component.

```tsx
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // cleanup on unmount
}, []);
```

### Key Points
- Always return a cleanup function from `useEffect` when you add listeners or timers.
- Note: React 18 removed the "Can't perform a React state update on an unmounted component" warning, but the underlying leak is still real.

## Virtualization
video: react virtualization react-window large list
summary: Virtualization renders only the rows currently visible on screen, which keeps very long lists fast.

**Virtualization** renders only the visible portion of a large list instead of every item. It is ideal for hundreds or thousands of rows, reducing memory use and improving scroll performance.

Popular libraries:
1. **react-window**: lightweight, fixed and variable size lists.
2. **react-virtualized**: older, more features.

```tsx
import { FixedSizeList as List } from "react-window";

<List
  height={300}
  itemCount={1000}
  itemSize={35}
  width={300}
>
  {Row}
</List>
```

`Row` is a component that receives `index` and `style` props from the list.

### Key Points
- Use virtualization only for really long lists; normal lists are fine without it.

## Code Splitting with lazy and Suspense
video: react lazy suspense code splitting
summary: lazy loads a component only when it is needed, and Suspense shows a fallback while it loads.

`React.lazy` loads a component on demand, so the initial bundle is smaller. `Suspense` shows a fallback UI while the lazy component is loading.

```tsx
import { lazy, Suspense } from "react";

const Chart = lazy(() => import("./Chart"));

<Suspense fallback={<p>Loading...</p>}>
  <Chart />
</Suspense>
```

### Key Points
- Good for routes and heavy components such as charts or editors.
- Lazy components must be default exports.

## Performance Optimization Checklist
video: react performance optimization tips
summary: A summary of the main techniques for making React apps faster.

- Use `React.memo` for expensive pure components.
- Use `useMemo` and `useCallback` to keep references stable where it matters.
- Split code with `lazy` and `Suspense`.
- Avoid unnecessary re-renders by moving state closer to where it is used.
- Virtualize long lists (for example with `react-window`).
- Measure first with the React DevTools Profiler.

### Key Points
- Optimize after measuring, not before.

## Debouncing and Throttling in React
video: react debounce search input throttle
summary: Debouncing waits until the user stops an action; throttling limits how often a handler runs during the action.

| Feature | Debouncing | Throttling |
|---------|------------|------------|
| Execution | After a delay with no new events | At fixed intervals |
| Trigger | After the user stops | During the action |
| Use case | Search input, autosave | Scroll, resize, mouse move |

A simple debounced search with `useEffect` and a cleanup function:

```tsx
function Search() {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!query) return;
    const id = setTimeout(() => fetchResults(query), 400);
    return () => clearTimeout(id); // cancels the timer on every new keystroke
  }, [query]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

### Key Points
- If you create a debounced function with a helper (such as lodash `debounce`), wrap it in `useMemo` or `useRef` so it is not recreated on every render.
- The cleanup function is what makes the effect-based debounce work.

## Refs and Forward Refs
video: react forwardRef ref to child component
summary: Refs give direct access to DOM nodes; forwardRef passes a ref through a component to an inner element.

Refs let you reach DOM elements directly, for focusing, scrolling, or measuring.

```tsx
const inputRef = useRef<HTMLInputElement>(null);
<input ref={inputRef} />
```

To pass a ref from a parent to a child component's inner element, wrap the child in `forwardRef`. In React 19, `ref` can be passed as a normal prop.

```tsx
const FancyInput = forwardRef<HTMLInputElement>((props, ref) => (
  <input ref={ref} {...props} />
));
```

### Key Points
- Avoid using refs to change the DOM when a state change would do the job.

## Reducers with useReducer
video: react useReducer hook
summary: useReducer manages complex state transitions through a reducer function and actions.

`useReducer` is an alternative to `useState` for state with several related values or complex update logic.

```tsx
type Action = { type: "inc" } | { type: "dec" };

function reducer(state: number, action: Action) {
  switch (action.type) {
    case "inc": return state + 1;
    case "dec": return state - 1;
  }
}

const [count, dispatch] = useReducer(reducer, 0);
dispatch({ type: "inc" });
```

### Key Points
- Makes state transitions predictable and easy to test.
- Use it when the next state depends on many related values.

## Context vs Redux and State Libraries
video: react redux vs context state management
summary: Context is built in and simple; Redux and similar libraries add structure for large, frequently changing state.

| Option | Good for |
|--------|----------|
| `useState` / `useReducer` | Local component state |
| Context API | Low-frequency shared values (theme, auth user, locale) |
| Redux Toolkit, Zustand | Large, frequently changing global state with more tooling |
| TanStack Query, SWR | Server data: caching, refetching, loading states |

### Key Points
- Interview tip: separate client state from server state; server state is best handled by a data-fetching library.

## Interview Quick Review
video: react interview questions
summary: A short checklist of React concepts that are most often asked in interviews.

- What is the Virtual DOM and how does reconciliation work?
- Difference between `useEffect` and `useLayoutEffect`.
- Why hooks are not lifecycle methods, and the rules of hooks.
- Controlled vs uncontrolled components.
- `useMemo` vs `useCallback`.
- Keys in lists and why index keys can cause bugs.
- Prop drilling and how Context solves it.
- How to avoid memory leaks in effects.

### Key Points
- Explain each answer with a small code example if possible.
