---
name: Next.js
icon: ▲
category: Frontend
track: fullstack
color: #64748b
order: 4
description: Next.js is a React framework for building fast, SEO-friendly, full-stack web applications with routing, rendering and backend features built in.
---

## What is Next.js?
video: nextjs introduction for beginners
summary: Next.js is a React framework that adds routing, server rendering, API endpoints and optimizations on top of React.

Next.js is a **React framework** for building **fast, SEO-friendly, production-ready** web applications. React alone only renders UI in the browser; Next.js adds the rest that real apps need: routing, rendering strategies, data fetching, backend endpoints, image optimization and deployment tooling.

### Key Features
- **SSR (Server-Side Rendering)**: render pages on the server for SEO and fast first paint.
- **SSG (Static Site Generation)**: pre-build pages at build time.
- **ISR (Incremental Static Regeneration)**: refresh static pages after deployment without a full rebuild.
- **Backend endpoints**: API Routes (Pages Router) or Route Handlers (App Router).
- **Image Optimization**: `next/image` resizes, lazy-loads and serves modern formats.
- **File-based routing**: folders and files define your URLs.

### Two routers
Next.js has two routing systems:
- **Pages Router** (`pages/` folder): the original system, which these notes describe in several places.
- **App Router** (`app/` folder): the modern default since Next.js 13, built on React Server Components.

This guide explains both, marking which is which.

### Key Points
- New projects should use the App Router; many existing projects still use the Pages Router.
- Interview tip: know that Next.js = React + routing + rendering modes + backend features.

## Project Setup and Folder Structure
video: nextjs app router project setup folder structure
summary: Create an app with create-next-app and understand the special files in the app directory.

```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

### App Router structure
```
app/
  layout.tsx       # root layout (required, wraps all pages)
  page.tsx         # the home page  ->  /
  loading.tsx      # loading UI (Suspense fallback)
  error.tsx        # error boundary UI
  not-found.tsx    # 404 UI
  about/page.tsx   # /about
  blog/[slug]/page.tsx  # /blog/anything
  api/hello/route.ts    # Route Handler -> /api/hello
public/            # static files
middleware.ts      # runs before requests
next.config.js
```

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Key Points
- A route is only public when it contains a `page.tsx` (or `route.ts`).
- Layouts persist across navigation and do not re-render when moving between child pages.

## Routing and Navigation
video: nextjs routing dynamic routes link useRouter
summary: Folders and files define routes; dynamic segments use square brackets and navigation uses Link and router hooks.

Next.js uses **file-based routing**: the file system is your router.

| Route type | Pages Router | App Router |
|------------|--------------|------------|
| Static | `pages/about.js` | `app/about/page.js` |
| Dynamic | `pages/post/[id].js` | `app/post/[id]/page.js` |
| Catch-all | `pages/[...params].js` | `app/[...params]/page.js` |
| Optional catch-all | `pages/[[...params]].js` | `app/[[...params]]/page.js` |
| Nested | nested folders | nested folders |

### Navigation with Link
```tsx
import Link from "next/link";
<Link href="/about">About</Link>
```
`Link` does client-side navigation and prefetches pages in the viewport.

### Programmatic navigation
```tsx
// Pages Router
import { useRouter } from "next/router";
const router = useRouter();
router.push("/dashboard");
```

```tsx
// App Router (inside a Client Component)
"use client";
import { useRouter } from "next/navigation";
const router = useRouter();
router.push("/dashboard");
```

### Dynamic route params (App Router)
```tsx
// app/post/[id]/page.tsx
export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;   // params is a Promise in Next.js 15+
  return <h1>Post {id}</h1>;
}
```

### Key Points
- In the App Router import `useRouter`, `usePathname`, `useSearchParams` from `next/navigation`, not `next/router`.
- Use the `redirect()` function from `next/navigation` in Server Components.

## Rendering Types: CSR, SSR, SSG, ISR
video: nextjs csr ssr ssg isr difference
summary: The four rendering strategies differ in when the HTML is produced: browser, request time, build time, or refreshed later.

| Type | When HTML is generated | Pages Router example | App Router equivalent |
|------|------------------------|----------------------|----------------------|
| **CSR** | In the browser | `useEffect` + fetch | Client Component + `useEffect` / data library |
| **SSR** | On every request | `getServerSideProps` | Server Component with `cache: "no-store"` or dynamic APIs (`cookies()`, `headers()`) |
| **SSG** | At build time | `getStaticProps` | Server Component with default cached `fetch` / static params |
| **ISR** | Build time, then re-generated in the background | `revalidate` in `getStaticProps` | `fetch(url, { next: { revalidate: 60 } })` or `export const revalidate = 60` |

### When to use which
- **SSG**: blogs, docs, marketing pages: fastest, cheapest.
- **ISR**: product pages, news: mostly static but needs updates.
- **SSR**: dashboards, personalised pages: always fresh.
- **CSR**: highly interactive, private areas where SEO does not matter.

### Key Points
- SEO is better with SSR/SSG/ISR because HTML arrives already filled with content.
- Interview tip: explain the trade-off between freshness and speed.

## Server Components and Client Components
video: nextjs server components client components use client
summary: In the App Router components run on the server by default; add "use client" when you need state, effects or browser APIs.

In the App Router, every component is a **React Server Component (RSC)** by default. It runs only on the server, so its code is not sent to the browser, it can fetch data directly, and it can access databases or secrets.

Add `"use client"` at the top of a file to make a **Client Component**, which can use state, effects, event handlers and browser APIs.

```tsx
// Server Component (default): can be async
export default async function Users() {
  const res = await fetch("https://api.example.com/users");
  const users = await res.json();
  return <ul>{users.map((u: any) => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

```tsx
// Client Component
"use client";
import { useState } from "react";

export default function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}
```

| Need | Use |
|------|-----|
| Fetch data, read DB, keep secrets | Server Component |
| `useState`, `useEffect`, `onClick`, `window` | Client Component |

### Key Points
- Keep `"use client"` boundaries as low as possible in the tree to reduce JavaScript sent to the browser.
- A Server Component can render a Client Component, and can pass it props that are serializable.
- Interview tip: server components reduce bundle size and remove client-side data waterfalls.

## Data Fetching (Pages Router)
video: nextjs getStaticProps getServerSideProps getStaticPaths
summary: In the Pages Router, special exported functions fetch data at build time or request time.

### getStaticProps (SSG)
Runs at build time. Use for data that rarely changes.

```tsx
export async function getStaticProps() {
  const res = await fetch("https://api.example.com/posts");
  const posts = await res.json();
  return { props: { posts }, revalidate: 60 }; // revalidate enables ISR
}
```

### getServerSideProps (SSR)
Runs on the server for every request.

```tsx
export async function getServerSideProps() {
  const res = await fetch("https://api.example.com/data");
  const data = await res.json();
  return { props: { data } };
}
```

### getStaticPaths (Dynamic SSG)
Tells Next.js which dynamic pages to pre-build.

```tsx
export async function getStaticPaths() {
  const res = await fetch("https://api.example.com/posts");
  const posts = await res.json();
  const paths = posts.map(p => ({ params: { id: p.id.toString() } }));
  return { paths, fallback: false };
}
```

`fallback: false` returns 404 for unknown paths; `true` or `"blocking"` generate them on demand.

### Key Points
- These functions run on the server only and work only in files inside `pages/`.
- They are replaced by `async` Server Components in the App Router.

## getServerSideProps vs getStaticProps
video: getServerSideProps vs getStaticProps nextjs
summary: One fetches on every request, the other once at build time (optionally refreshed with ISR).

| Feature | getServerSideProps | getStaticProps |
|---------|--------------------|----------------|
| When it runs | Every request | Build time (and on revalidate) |
| Freshness | Always up to date | Static (can use ISR) |
| Speed | Slower (server work per request) | Fastest (served from CDN) |
| Use case | Dashboard, user-specific data | Blogs, marketing pages |
| Has access to request (cookies, headers) | Yes | No |

### App Router equivalents
```tsx
// like getStaticProps (cached, revalidated every hour)
await fetch(url, { next: { revalidate: 3600 } });

// like getServerSideProps (fresh each request)
await fetch(url, { cache: "no-store" });
```

### Key Points
- Interview tip: pick getStaticProps unless data must be fresh on every request or depends on the user.

## Data Fetching and Caching (App Router)
video: nextjs app router fetch cache revalidate generateStaticParams
summary: Fetch directly in async Server Components and control caching with fetch options, revalidate and generateStaticParams.

In the App Router you fetch data directly inside async Server Components. No special functions are needed.

```tsx
// app/posts/page.tsx
export default async function Posts() {
  const res = await fetch("https://api.example.com/posts", {
    next: { revalidate: 60 },     // ISR: refresh at most every 60 seconds
  });
  const posts = await res.json();
  return <ul>{posts.map((p: any) => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

### Caching options
| Option | Behaviour |
|--------|-----------|
| `cache: "force-cache"` | Cache until revalidated (static) |
| `cache: "no-store"` | Fetch fresh on every request (dynamic) |
| `next: { revalidate: n }` | Cache and refresh after n seconds |
| `next: { tags: ["posts"] }` | Tag for on-demand revalidation |

Note: the default caching behaviour of `fetch` changed across versions (Next.js 15 no longer caches `fetch` by default), so set the option explicitly.

### Route segment config
```tsx
export const revalidate = 60;       // page-level ISR
export const dynamic = "force-dynamic"; // always SSR
```

### Dynamic SSG: generateStaticParams
The App Router replacement for `getStaticPaths`:

```tsx
export async function generateStaticParams() {
  const posts = await fetch("https://api.example.com/posts").then(r => r.json());
  return posts.map((p: any) => ({ id: String(p.id) }));
}
```

### On-demand revalidation
```tsx
import { revalidatePath, revalidateTag } from "next/cache";
revalidatePath("/posts");
revalidateTag("posts");
```

### Key Points
- Using `cookies()`, `headers()` or `searchParams` makes a route dynamic.
- Identical `fetch` calls in one render are de-duplicated.

## Server Actions
video: nextjs server actions form
summary: Server Actions are server functions you call from forms or components to mutate data without writing an API route.

A **Server Action** is an async function marked with `"use server"` that runs on the server. You can attach it to a form or call it from a Client Component.

```tsx
// app/actions.ts
"use server";
import { revalidatePath } from "next/cache";

export async function addTodo(formData: FormData) {
  const title = formData.get("title") as string;
  await db.todo.create({ data: { title } });
  revalidatePath("/todos");
}
```

```tsx
// app/todos/page.tsx
import { addTodo } from "../actions";

export default function Todos() {
  return (
    <form action={addTodo}>
      <input name="title" />
      <button type="submit">Add</button>
    </form>
  );
}
```

### Key Points
- Works even before JavaScript loads (progressive enhancement).
- Always validate input and check authorization inside the action: it is a public endpoint.

## API Routes and Route Handlers
video: nextjs api routes route handlers
summary: Create backend endpoints with API Routes in the Pages Router or Route Handlers in the App Router.

### Pages Router: API Routes
Files inside `pages/api/` become endpoints.

```tsx
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: "Hello from Next.js API" });
}
```

### App Router: Route Handlers
Files named `route.ts` export functions named after HTTP methods.

```tsx
// app/api/hello/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello from Next.js API" });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ received: body }, { status: 201 });
}
```

### Key Points
- A folder cannot contain both `page.tsx` and `route.ts` for the same segment.
- Use Route Handlers for webhooks, public APIs or mobile clients; use Server Actions for form mutations.

## Layouts, Loading and Error UI
video: nextjs layout loading error not-found app router
summary: Special files in the App Router give you shared layouts, loading states and error handling with no extra code.

| File | Purpose |
|------|---------|
| `layout.tsx` | Shared UI that wraps pages and persists on navigation |
| `template.tsx` | Like layout, but re-created on each navigation |
| `loading.tsx` | Shown instantly while the route streams in (uses Suspense) |
| `error.tsx` | Error boundary for the route (must be a Client Component) |
| `not-found.tsx` | UI for `notFound()` and unknown routes |

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <p>Loading dashboard...</p>;
}
```

```tsx
// app/dashboard/error.tsx
"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <button onClick={reset}>Something went wrong. Try again</button>;
}
```

### Key Points
- Streaming with Suspense lets the page show parts as soon as they are ready.
- Route groups `(group)` organize files without changing the URL.

## Image Optimization
video: nextjs image component optimization
summary: The next/image component automatically resizes, lazy-loads and serves modern image formats.

```tsx
import Image from "next/image";

<Image src="/hero.png" alt="Hero" width={500} height={300} />
```

### What it gives you
- Automatic resizing for different screen sizes (`srcset`).
- Modern formats such as WebP/AVIF.
- Lazy loading by default.
- Prevents layout shift because width and height are reserved.

```tsx
<Image src="/banner.jpg" alt="Banner" fill priority sizes="100vw" />
```

Use `priority` for above-the-fold images such as the hero. For remote images, allow the host in `next.config.js` using `images.remotePatterns`.

### Key Points
- Always provide `alt`, and either `width`/`height` or `fill`.
- Use `next/font` in the same way to optimize fonts with no layout shift.

## Middleware
video: nextjs middleware authentication redirect
summary: Middleware runs before a request completes, letting you redirect, rewrite or protect routes.

Middleware (introduced in Next.js 12) is code that runs **before a request is handled**, at the edge. It is used for authentication checks, redirects, rewrites, headers and A/B tests. Place `middleware.ts` at the project root (or inside `src/`).

```tsx
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (!req.cookies.get("token")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],  // only run on these paths
};
```

### Key Points
- Redirects must use an absolute URL: `new URL("/login", req.url)`.
- Use `matcher` to avoid running middleware on every static asset.
- In recent versions the file may be named `proxy.ts`, with the same idea.
- Do not rely on middleware alone for security; also check authorization where data is accessed.

## NextAuth.js (Auth.js)
video: nextjs next-auth authentication
summary: NextAuth.js provides ready-made authentication with OAuth, credentials and email providers.

NextAuth.js (now Auth.js) is a complete authentication solution for Next.js. It supports **OAuth** (Google, GitHub), **Credentials** (email/password) and **Email** (magic link) providers out of the box.

### How it works
1. The user signs in with credentials or a provider.
2. NextAuth validates them and creates a session, typically a signed **JWT**.
3. The JWT is stored in an **HTTP-only cookie**, which JavaScript cannot read (protects against XSS).
4. Each request to protected routes sends the cookie so the server can verify the user.
5. The session can be read on the client with the `useSession()` hook, or on the server with the `auth()` / `getServerSession()` helpers.

```tsx
"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  return session
    ? <button onClick={() => signOut()}>Sign out {session.user?.name}</button>
    : <button onClick={() => signIn("github")}>Sign in</button>;
}
```

`useSession` needs the app wrapped in `<SessionProvider>`.

### Key Points
- A database adapter lets you store users and sessions in your own DB instead of using JWT only.
- Always set `NEXTAUTH_SECRET` / `AUTH_SECRET` in production.

## SEO and the Metadata API
video: nextjs seo metadata api generateMetadata
summary: Set page titles and meta tags with next/head in the Pages Router or the Metadata API in the App Router.

### Pages Router: next/head
```tsx
import Head from "next/head";

<Head>
  <title>My Page</title>
  <meta name="description" content="SEO optimized page" />
</Head>
```

### App Router: Metadata API
Export a `metadata` object or a `generateMetadata` function from a `layout` or `page`. Do not use `next/head` in the App Router.

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Page",
  description: "SEO optimized page",
  openGraph: { title: "My Page", images: ["/og.png"] },
};
```

```tsx
// dynamic metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  return { title: post.title };
}
```

### Key Points
- Also add `sitemap.ts` and `robots.ts` files in `app/` for search engines.
- Server rendering gives crawlers complete HTML, which is the main SEO advantage.

## Performance Tips
video: nextjs performance optimization
summary: Use built-in components, dynamic imports, caching and bundle analysis to keep Next.js apps fast.

- Use the `Image` and `Script` components (`next/script` controls when third-party scripts load).
- Use `next/font` to avoid font layout shifts.
- Lazy load heavy components with `next/dynamic`.
- Cache data and API responses; use ISR where data changes only sometimes.
- Prefer Server Components to send less JavaScript.
- Analyze bundles with `@next/bundle-analyzer`.

```tsx
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("../components/Chart"), {
  loading: () => <p>Loading...</p>,
  ssr: false, // only render on client (Client Components)
});
```

### Key Points
- Check Core Web Vitals (LCP, CLS, INP) with Lighthouse.
- `Link` prefetching makes navigation feel instant.

## Environment Variables and Config
video: nextjs environment variables env.local next.config.js
summary: Store secrets in .env files; only variables starting with NEXT_PUBLIC_ reach the browser.

Next.js loads `.env.local`, `.env.development` and `.env.production` automatically.

```bash
# .env.local
DATABASE_URL=postgres://...          # server only
NEXT_PUBLIC_API_URL=https://api.example.com  # exposed to browser
```

```tsx
process.env.DATABASE_URL;               // available on the server
process.env.NEXT_PUBLIC_API_URL;        // available everywhere
```

`next.config.js` configures redirects, rewrites, image domains, headers and experimental features.

### Key Points
- Never put secrets in `NEXT_PUBLIC_` variables.
- Never commit `.env.local` to git.

## Interview Quick Review
video: nextjs interview questions
summary: A short checklist of Next.js topics that are asked most often.

- Difference between **CSR, SSR, SSG and ISR**.
- **getServerSideProps vs getStaticProps**, and their App Router equivalents.
- **Pages Router vs App Router**.
- **Server Components vs Client Components** and `"use client"`.
- How routing works (dynamic routes, catch-all routes, layouts).
- How NextAuth stores sessions (JWT in HTTP-only cookie).
- Why use `next/image` and `next/link`.
- How middleware works and what it can do.

### Key Points
- Be able to choose a rendering strategy for a given page and justify it.
