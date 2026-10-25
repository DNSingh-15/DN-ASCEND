---
name: Data Structures
icon: 🌳
category: DSA
track: dsa
color: #a855f7
order: 21
description: Linked lists, stacks, queues, trees, heaps, tries, graphs and the classic algorithms built on them, including dynamic programming and greedy.
---

## Singly Linked List
video: linked list dsa javascript
summary: Nodes connected by next pointers: O(1) insert at head, O(n) access by index.

A **linked list** stores elements in **nodes**, each holding a value and a pointer to the next node. Unlike arrays, nodes are not contiguous, so insert or delete at a known node is `O(1)` but reaching index i takes `O(n)`.

```text
head -> [1] -> [2] -> [3] -> null
```

```js
class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
}

// Insert at head: O(1)
function addFirst(head, val) { return new ListNode(val, head); }

// Delete first node with value: O(n)
function remove(head, val) {
  const dummy = new ListNode(0, head);   // dummy node handles head removal
  let cur = dummy;
  while (cur.next) {
    if (cur.next.val === val) { cur.next = cur.next.next; break; }
    cur = cur.next;
  }
  return dummy.next;
}
```

### Key Points
- Use when you need frequent insert or delete at the front or middle and do not need random access.
- A **dummy node** simplifies edge cases at the head.
- Always check for `null` before accessing `.next`.
- Problems: Delete Node, Remove Nth Node From End, Merge Two Sorted Lists, Remove Linked List Elements.

## Doubly Linked List
video: doubly linked list dsa
summary: Each node has next and prev pointers, allowing O(1) removal of a known node and two-way traversal.

A **doubly linked list** adds a `prev` pointer to each node, so you can traverse both ways and delete a node in `O(1)` when you already hold a reference to it.

```text
null <- [1] <-> [2] <-> [3] -> null
        head            tail
```

```js
class DNode {
  constructor(val) { this.val = val; this.prev = null; this.next = null; }
}

class DoublyList {
  constructor() { this.head = null; this.tail = null; }
  addLast(val) {                    // O(1)
    const node = new DNode(val);
    if (!this.tail) this.head = this.tail = node;
    else { node.prev = this.tail; this.tail.next = node; this.tail = node; }
  }
  removeNode(node) {                // O(1)
    if (node.prev) node.prev.next = node.next; else this.head = node.next;
    if (node.next) node.next.prev = node.prev; else this.tail = node.prev;
  }
}
```

### Key Points
- Costs extra memory for the prev pointer.
- Combined with a hash map it builds an **LRU Cache** (map for O(1) lookup, list for O(1) reorder).
- Used in browser history, undo/redo and deques.
- Problems: LRU Cache, Design Browser History, Flatten a Multilevel Doubly Linked List.

## Fast and Slow Pointers
video: fast slow pointer linked list cycle dsa
summary: Move two pointers at different speeds to find the middle or detect a cycle in O(n) time and O(1) space.

The **fast and slow pointer** (Floyd's tortoise and hare) technique moves one pointer one step and another two steps at a time.

- When fast reaches the end, slow is at the **middle**.
- If there is a **cycle**, fast eventually meets slow inside it.

```text
1 -> 2 -> 3 -> 4 -> 5 -> null
slow:1   2   3
fast:1   3   5      slow = middle (3)
```

```js
// Linked List Cycle: O(n) time, O(1) space
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

// Middle of the Linked List
function middle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
  return slow;
}
```

### Key Points
- To find the cycle start, reset one pointer to head after the meeting and move both one step at a time.
- Also solves Happy Number and Find the Duplicate Number.
- Problems: Linked List Cycle, Linked List Cycle II, Middle of the Linked List, Palindrome Linked List.

## Reverse a Linked List
video: reverse linked list dsa
summary: Walk the list once, flipping each next pointer to point backward, in O(n) time and O(1) space.

Reversing a list is the most common linked list interview question. Keep three pointers: `prev`, `cur` and `next`, and flip each link as you go.

```text
before: 1 -> 2 -> 3 -> null
after:  null <- 1 <- 2 <- 3   (head = 3)
```

```js
// Iterative: O(n) time, O(1) space
function reverseList(head) {
  let prev = null, cur = head;
  while (cur) {
    const next = cur.next;   // save
    cur.next = prev;         // flip
    prev = cur;              // advance
    cur = next;
  }
  return prev;
}

// Recursive: O(n) time, O(n) stack
function reverseRec(head) {
  if (!head || !head.next) return head;
  const newHead = reverseRec(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}
```

### Key Points
- Always save `next` before overwriting `cur.next`.
- Building block for Palindrome Linked List (reverse the second half) and Reverse in K-Group.
- Problems: Reverse Linked List, Reverse Linked List II, Reorder List, Add Two Numbers.

## Stack
video: stack data structure dsa
summary: Last-In-First-Out structure with O(1) push and pop, used for matching, undo and DFS.

A **stack** is **LIFO**: the last item pushed is the first popped. Operations `push`, `pop` and `peek` are all `O(1)`. In JavaScript an array works as a stack.

```text
push 1,2,3      pop -> 3
| 3 |  <- top
| 2 |
| 1 |
```

```js
// Valid Parentheses: O(n) time, O(n) space
function isValid(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const ch of s) {
    if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) return false;
    } else stack.push(ch);
  }
  return stack.length === 0;
}
```

### Key Points
- Use for balanced brackets, undo/redo, expression evaluation, and iterative DFS.
- The function call stack is a stack too.
- Problems: Valid Parentheses, Min Stack, Evaluate Reverse Polish Notation, Decode String, Implement Queue using Stacks.

## Monotonic Stack
video: monotonic stack next greater element dsa
summary: A stack kept in increasing or decreasing order to find the next greater or smaller element in O(n).

A **monotonic stack** keeps its elements in sorted order (increasing or decreasing). Before pushing a new element, pop everything that breaks the order. Each popped element has just found its "next greater" or "next smaller" answer.

```text
nums = [2, 1, 5, 3]
2 -> push        stack [2]
1 -> push        stack [2,1]
5 -> pops 1,2 (next greater is 5)
```

```js
// Next Greater Element / Daily Temperatures: O(n) time, O(n) space
function dailyTemperatures(temps) {
  const res = new Array(temps.length).fill(0);
  const stack = [];                       // indices, temps decreasing
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[i] > temps[stack[stack.length - 1]]) {
      const j = stack.pop();
      res[j] = i - j;
    }
    stack.push(i);
  }
  return res;
}
```

### Key Points
- Each element is pushed and popped at most once, so the total is O(n).
- Store indices when you need distances.
- Problems: Next Greater Element, Daily Temperatures, Largest Rectangle in Histogram, Trapping Rain Water, Stock Span.

## Queue and Deque
video: queue deque circular queue dsa
summary: FIFO queue for ordered processing; deque allows O(1) at both ends; circular queue reuses space.

A **queue** is **FIFO**: first in, first out. `enqueue` adds at the back, `dequeue` removes from the front. A **deque** supports O(1) insert and remove at both ends. A **circular queue** uses a fixed array with wrapping indices to reuse freed space.

```text
front -> [1][2][3] <- back
```

```js
// Circular queue: all operations O(1)
class CircularQueue {
  constructor(k) { this.a = new Array(k); this.k = k; this.head = 0; this.size = 0; }
  enqueue(v) {
    if (this.size === this.k) return false;
    this.a[(this.head + this.size) % this.k] = v;
    this.size++;
    return true;
  }
  dequeue() {
    if (this.size === 0) return undefined;
    const v = this.a[this.head];
    this.head = (this.head + 1) % this.k;
    this.size--;
    return v;
  }
}
```

### Key Points
- `array.shift()` is O(n); for real queues use a linked list, two pointers or a circular buffer.
- Queues power BFS, scheduling and buffering.
- A monotonic deque solves sliding window maximum in O(n).
- Problems: Implement Queue using Stacks, Design Circular Queue, Sliding Window Maximum, Number of Recent Calls.

## Binary Tree and Traversals
video: binary tree traversal inorder preorder postorder dsa
summary: A tree where each node has at most two children, traversed by DFS orders or level by level.

A **binary tree** node has up to two children, `left` and `right`. Traversals:

- **Preorder**: root, left, right
- **Inorder**: left, root, right
- **Postorder**: left, right, root
- **Level order**: BFS using a queue

```text
      1
     / \
    2   3
   / \
  4   5
preorder: 1 2 4 5 3   inorder: 4 2 5 1 3   postorder: 4 5 2 3 1
level:    1 2 3 4 5
```

```js
class TreeNode {
  constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}

// All DFS traversals: O(n) time, O(h) space (h = height)
function inorder(root, out = []) {
  if (!root) return out;
  inorder(root.left, out);
  out.push(root.val);
  inorder(root.right, out);
  return out;
}

function maxDepth(root) {
  return root ? 1 + Math.max(maxDepth(root.left), maxDepth(root.right)) : 0;
}

function levelOrder(root) {
  if (!root) return [];
  const res = [], q = [root];
  while (q.length) {
    const level = [];
    for (let n = q.length; n > 0; n--) {
      const node = q.shift();
      level.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    res.push(level);
  }
  return res;
}
```

### Key Points
- Most tree problems are solved recursively: handle null, solve left, solve right, combine.
- Problems: Maximum Depth, Invert Binary Tree, Same Tree, Symmetric Tree, Diameter of Binary Tree, Level Order Traversal, Lowest Common Ancestor.

## Binary Search Tree
video: binary search tree bst dsa
summary: A binary tree where left is smaller and right is larger, giving O(log n) operations when balanced.

A **BST** keeps the rule: all values in the left subtree are smaller than the node, and all in the right subtree are larger. **Inorder traversal gives sorted order.** Search, insert and delete are `O(h)`: `O(log n)` if balanced, `O(n)` if skewed (like a linked list).

```text
        8
       / \
      3   10
     / \    \
    1   6    14
```

```js
function searchBST(root, target) {      // O(h)
  while (root && root.val !== target)
    root = target < root.val ? root.left : root.right;
  return root;
}

function insertBST(root, val) {         // O(h)
  if (!root) return new TreeNode(val);
  if (val < root.val) root.left = insertBST(root.left, val);
  else root.right = insertBST(root.right, val);
  return root;
}

// Validate BST using value bounds
function isValidBST(root, lo = -Infinity, hi = Infinity) {
  if (!root) return true;
  if (root.val <= lo || root.val >= hi) return false;
  return isValidBST(root.left, lo, root.val) && isValidBST(root.right, root.val, hi);
}
```

### Key Points
- Self-balancing variants (AVL, Red-Black) guarantee O(log n).
- Deleting a node with two children: replace with the inorder successor.
- Problems: Validate BST, Kth Smallest Element in a BST, Lowest Common Ancestor of a BST, Convert Sorted Array to BST.

## Heap and Priority Queue
video: heap priority queue dsa
summary: A complete binary tree that gives the min or max in O(1), with O(log n) insert and remove.

A **heap** is a complete binary tree where each parent is smaller (min-heap) or larger (max-heap) than its children. It is stored in an array: for index `i`, children are at `2i+1` and `2i+2`, parent at `floor((i-1)/2)`. A **priority queue** is the abstract type usually built on a heap.

```text
min-heap:     1            array: [1, 3, 2, 7, 4]
             / \
            3   2
           / \
          7   4
```

```js
class MinHeap {
  constructor() { this.h = []; }
  push(v) {                                // O(log n)
    const h = this.h; h.push(v);
    let i = h.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (h[p] <= h[i]) break;
      [h[p], h[i]] = [h[i], h[p]]; i = p;
    }
  }
  pop() {                                  // O(log n)
    const h = this.h;
    if (h.length <= 1) return h.pop();
    const top = h[0]; h[0] = h.pop();
    let i = 0;
    for (;;) {
      let s = i, l = 2 * i + 1, r = l + 1;
      if (l < h.length && h[l] < h[s]) s = l;
      if (r < h.length && h[r] < h[s]) s = r;
      if (s === i) break;
      [h[s], h[i]] = [h[i], h[s]]; i = s;
    }
    return top;
  }
}
```

### Key Points
- Peek is O(1); building a heap from n items is O(n).
- For "K largest", keep a min-heap of size k: O(n log k).
- JavaScript has no built-in heap; write one as above in interviews.
- Problems: Kth Largest Element, Top K Frequent Elements, Merge K Sorted Lists, Find Median from Data Stream, Task Scheduler.

## Trie
video: trie prefix tree dsa
summary: A tree of characters where each path spells a word, enabling fast prefix search.

A **trie** (prefix tree) stores strings character by character. Each node has children keyed by character and a flag marking the end of a word. Insert, search and prefix check cost `O(L)` where L is the word length, independent of how many words are stored.

```text
words: cat, car, dog
root -- c -- a -- t*
              \-- r*
     -- d -- o -- g*
```

```js
class Trie {
  constructor() { this.root = {}; }
  insert(word) {                       // O(L)
    let node = this.root;
    for (const ch of word) node = node[ch] ??= {};
    node.end = true;
  }
  search(word) {                       // O(L)
    const n = this.#find(word);
    return !!n && n.end === true;
  }
  startsWith(prefix) { return !!this.#find(prefix); }
  #find(s) {
    let node = this.root;
    for (const ch of s) { node = node[ch]; if (!node) return null; }
    return node;
  }
}
```

### Key Points
- Ideal for autocomplete, spell check and prefix matching.
- Uses more memory than a hash set but gives prefix queries.
- Problems: Implement Trie, Word Search II, Design Add and Search Words, Longest Common Prefix.

## Graph Representation
video: graph representation adjacency list matrix dsa
summary: Graphs are nodes and edges, stored as an adjacency list (sparse) or adjacency matrix (dense).

A **graph** is a set of vertices connected by edges. Edges can be directed or undirected, weighted or unweighted.

| Representation | Space | Edge check | List neighbors |
|----------------|-------|-----------|----------------|
| Adjacency list | O(V + E) | O(degree) | O(degree) |
| Adjacency matrix | O(V^2) | O(1) | O(V) |

```text
0 -- 1        list: 0:[1,2]  1:[0,2]  2:[0,1,3]  3:[2]
 \  /
  2 -- 3
```

```js
// Build an undirected adjacency list from an edge list: O(V + E)
function buildGraph(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);          // omit for directed graphs
  }
  return adj;
}
// Weighted: adj[u].push([v, weight]);
```

### Key Points
- Adjacency list is the default for interview problems.
- Grids are implicit graphs: each cell connects to 4 or 8 neighbors.
- Always track `visited` to avoid infinite loops in cyclic graphs.
- Problems: Find if Path Exists in Graph, Clone Graph, Number of Provinces.

## Breadth-First Search
video: bfs breadth first search graph dsa
summary: Explore a graph level by level using a queue; finds shortest paths in unweighted graphs.

**BFS** visits all neighbors of a node before going deeper, using a **queue**. Because it expands in layers, the first time it reaches a node is via the **shortest path** (in an unweighted graph). Complexity is `O(V + E)`.

```text
    A
   / \
  B   C       order: A, B, C, D, E
 / \   \
D   E   F      (F next)
```

```js
// Shortest distance from start in an unweighted graph
function bfs(adj, start) {
  const dist = new Array(adj.length).fill(-1);
  dist[start] = 0;
  const q = [start];
  for (let head = 0; head < q.length; head++) {   // index pointer avoids O(n) shift
    const u = q[head];
    for (const v of adj[u]) {
      if (dist[v] === -1) { dist[v] = dist[u] + 1; q.push(v); }
    }
  }
  return dist;
}
```

### Key Points
- Mark nodes visited when you enqueue them, not when you dequeue.
- Multi-source BFS: push all sources first (Rotting Oranges).
- Problems: Number of Islands, Rotting Oranges, Word Ladder, Shortest Path in Binary Matrix, Binary Tree Level Order Traversal.

## Depth-First Search
video: dfs depth first search graph dsa
summary: Go as deep as possible along a path before backtracking, using recursion or a stack.

**DFS** follows one path to its end, then backtracks. It uses recursion (call stack) or an explicit stack. Complexity is `O(V + E)`. It is ideal for exploring connected components, detecting cycles and path problems.

```js
// Count connected components: O(V + E)
function countComponents(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const seen = new Set();
  let count = 0;
  function dfs(u) {
    seen.add(u);
    for (const v of adj[u]) if (!seen.has(v)) dfs(v);
  }
  for (let i = 0; i < n; i++) {
    if (!seen.has(i)) { dfs(i); count++; }
  }
  return count;
}

// Grid DFS: Number of Islands
function numIslands(grid) {
  let count = 0;
  const dfs = (r, c) => {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] !== '1') return;
    grid[r][c] = '0';                       // mark visited
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
  };
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[0].length; c++)
      if (grid[r][c] === '1') { count++; dfs(r, c); }
  return count;
}
```

### Key Points
- Cycle detection in directed graphs uses three states: unvisited, in progress, done.
- Deep recursion can overflow the stack; use an explicit stack for huge inputs.
- Problems: Number of Islands, Clone Graph, Course Schedule, Pacific Atlantic Water Flow, Max Area of Island.

## Topological Sort
video: topological sort kahn algorithm dsa
summary: Order the nodes of a directed acyclic graph so every edge goes from earlier to later.

A **topological ordering** of a **DAG** (directed acyclic graph) lists vertices so that for every edge `u -> v`, `u` comes before `v`. It models dependencies such as course prerequisites or build order. If a cycle exists, no ordering is possible.

**Kahn's algorithm** (BFS): repeatedly take nodes with in-degree 0.

```js
// Course Schedule II: O(V + E)
function findOrder(n, prerequisites) {
  const adj = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (const [course, pre] of prerequisites) {
    adj[pre].push(course);
    indeg[course]++;
  }
  const queue = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) queue.push(i);

  const order = [];
  for (let h = 0; h < queue.length; h++) {
    const u = queue[h];
    order.push(u);
    for (const v of adj[u]) if (--indeg[v] === 0) queue.push(v);
  }
  return order.length === n ? order : [];   // shorter means a cycle
}
```

### Key Points
- If the result has fewer than n nodes, the graph has a cycle.
- A DFS version adds nodes to the order after finishing them, then reverses.
- Problems: Course Schedule, Course Schedule II, Alien Dictionary, Parallel Courses.

## Dijkstra's Algorithm
video: dijkstra shortest path algorithm dsa
summary: Find shortest paths from a source in a graph with non-negative weights using a min-heap.

**Dijkstra** finds the shortest distance from a source to all nodes in a **weighted graph with non-negative edges**. It always expands the closest unfinalized node, using a priority queue, and relaxes its edges: `dist[v] = min(dist[v], dist[u] + w)`.

Complexity: `O((V + E) log V)` with a heap.

```js
// Assumes a PriorityQueue(comparator) like the MinHeap above, ordered by distance
function dijkstra(adj, src) {              // adj[u] = [[v, w], ...]
  const dist = new Array(adj.length).fill(Infinity);
  dist[src] = 0;
  const pq = new PriorityQueue((a, b) => a[0] - b[0]);   // [distance, node]
  pq.push([0, src]);
  while (!pq.isEmpty()) {
    const [d, u] = pq.pop();
    if (d > dist[u]) continue;             // stale entry
    for (const [v, w] of adj[u]) {
      if (d + w < dist[v]) {
        dist[v] = d + w;
        pq.push([dist[v], v]);
      }
    }
  }
  return dist;
}
```

### Key Points
- Fails with negative edges; use Bellman-Ford instead.
- For unweighted graphs, plain BFS is enough.
- Skip stale heap entries with `if (d > dist[u]) continue`.
- Problems: Network Delay Time, Cheapest Flights Within K Stops, Path With Minimum Effort, Swim in Rising Water.

## Union-Find (DSU)
video: union find disjoint set union dsa
summary: Track connected groups with near O(1) find and union using path compression and union by rank.

**Union-Find** (Disjoint Set Union) maintains a collection of disjoint sets. `find(x)` returns the set representative, `union(a, b)` merges two sets. With **path compression** and **union by rank**, each operation is almost `O(1)` (inverse Ackermann).

```js
class DSU {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.count = n;                        // number of components
  }
  find(x) {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);  // path compression
    return this.parent[x];
  }
  union(a, b) {
    let ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;           // already connected (cycle)
    if (this.rank[ra] < this.rank[rb]) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;
    if (this.rank[ra] === this.rank[rb]) this.rank[ra]++;
    this.count--;
    return true;
  }
}
```

### Key Points
- A failed `union` means the edge forms a cycle.
- Great for dynamic connectivity and Kruskal's algorithm.
- Problems: Number of Provinces, Redundant Connection, Accounts Merge, Number of Connected Components, Graph Valid Tree.

## Minimum Spanning Tree
video: minimum spanning tree kruskal prim dsa
summary: Connect all vertices with the lowest total edge weight using Kruskal (sort edges) or Prim (grow from a node).

A **minimum spanning tree (MST)** of a connected weighted undirected graph is a subset of V-1 edges that connects every vertex with minimum total weight and no cycles.

- **Kruskal**: sort edges by weight, add each edge if it does not create a cycle (checked with DSU). `O(E log E)`.
- **Prim**: start from any node and repeatedly add the cheapest edge leaving the tree, using a min-heap. `O(E log V)`.

```js
// Kruskal using the DSU class
function kruskal(n, edges) {               // edges: [u, v, w]
  edges.sort((a, b) => a[2] - b[2]);
  const dsu = new DSU(n);
  let total = 0, used = 0;
  for (const [u, v, w] of edges) {
    if (dsu.union(u, v)) {
      total += w;
      if (++used === n - 1) break;
    }
  }
  return used === n - 1 ? total : -1;      // -1 if graph is disconnected
}
```

### Key Points
- Kruskal suits sparse graphs given as edge lists; Prim suits dense graphs with adjacency lists.
- Both are greedy algorithms.
- Problems: Min Cost to Connect All Points, Connecting Cities With Minimum Cost, Optimize Water Distribution.

## Dynamic Programming Basics
video: dynamic programming 1d fibonacci climbing stairs
summary: Solve problems with overlapping subproblems by storing results, using memoization or tabulation.

**Dynamic Programming (DP)** applies when a problem has **overlapping subproblems** and **optimal substructure**. Store each subproblem's answer so it is computed once.

Steps: define the state, write the recurrence, set base cases, choose top-down (memoization) or bottom-up (tabulation), then optimize space.

```js
// Climbing Stairs: dp[i] = dp[i-1] + dp[i-2]. O(n) time, O(1) space
function climbStairs(n) {
  let a = 1, b = 1;
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}

// House Robber: dp[i] = max(dp[i-1], dp[i-2] + nums[i])
function rob(nums) {
  let prev = 0, cur = 0;
  for (const x of nums) [prev, cur] = [cur, Math.max(cur, prev + x)];
  return cur;
}

// Coin Change (min coins): O(amount * coins)
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++)
    for (const c of coins)
      if (a >= c) dp[a] = Math.min(dp[a], dp[a - c] + 1);
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

### Key Points
- Start with brute-force recursion, add a memo, then convert to a table.
- If dp[i] depends only on a few previous values, keep just those variables.
- Problems: Climbing Stairs, House Robber, Coin Change, Min Cost Climbing Stairs, Maximum Subarray, Decode Ways.

## 2D Dynamic Programming
video: 2d dynamic programming grid paths dsa
summary: DP with a two-dimensional state such as grid position, used for path counting and grid costs.

When the state needs two parameters (row and column, or two indices), use a **2D table**. Each cell is computed from neighbors that were already filled.

```text
Unique Paths (3x3):  1 1 1
                     1 2 3
                     1 3 6   <- answer
dp[r][c] = dp[r-1][c] + dp[r][c-1]
```

```js
// Unique Paths: O(m*n) time, O(n) space with a rolling row
function uniquePaths(m, n) {
  const dp = new Array(n).fill(1);
  for (let r = 1; r < m; r++)
    for (let c = 1; c < n; c++) dp[c] += dp[c - 1];
  return dp[n - 1];
}

// Minimum Path Sum: O(m*n)
function minPathSum(grid) {
  const m = grid.length, n = grid[0].length;
  const dp = grid.map(row => [...row]);
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++) {
      if (r === 0 && c === 0) continue;
      const up = r > 0 ? dp[r - 1][c] : Infinity;
      const left = c > 0 ? dp[r][c - 1] : Infinity;
      dp[r][c] += Math.min(up, left);
    }
  return dp[m - 1][n - 1];
}
```

### Key Points
- Define clearly what `dp[r][c]` means before writing the recurrence.
- Often the previous row alone is enough, reducing space to O(n).
- Problems: Unique Paths, Unique Paths II, Minimum Path Sum, Triangle, Maximal Square.

## Knapsack
video: 0/1 knapsack dynamic programming
summary: Choose items under a capacity limit to maximize value; the foundation for subset-sum style DP.

In the **0/1 knapsack**, each item can be taken or skipped once, with weight and value, under a capacity `W`. State: `dp[w]` = best value using capacity `w`. Iterate capacity **backward** so each item is used once.

```js
// 0/1 Knapsack: O(n * W) time, O(W) space
function knapsack(weights, values, W) {
  const dp = new Array(W + 1).fill(0);
  for (let i = 0; i < weights.length; i++)
    for (let w = W; w >= weights[i]; w--)
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
  return dp[W];
}

// Subset sum / Partition Equal Subset Sum
function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2) return false;
  const target = total / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;
  for (const x of nums)
    for (let s = target; s >= x; s--) dp[s] = dp[s] || dp[s - x];
  return dp[target];
}
```

### Key Points
- Backward loop = each item once (0/1). Forward loop = unlimited use (unbounded, like Coin Change).
- Many problems reduce to subset sum.
- Problems: Partition Equal Subset Sum, Target Sum, Last Stone Weight II, Coin Change II, Ones and Zeroes.

## Longest Increasing Subsequence
video: longest increasing subsequence lis dsa
summary: Find the longest subsequence of strictly increasing values, in O(n^2) DP or O(n log n) with binary search.

A **subsequence** keeps order but may skip elements. The **LIS** is the longest strictly increasing one. DP approach: `dp[i]` = length of LIS ending at `i`.

```js
// O(n^2) DP
function lisDP(nums) {
  const dp = new Array(nums.length).fill(1);
  let best = 1;
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++)
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    best = Math.max(best, dp[i]);
  }
  return best;
}

// O(n log n): tails[k] = smallest tail of an increasing subsequence of length k+1
function lengthOfLIS(nums) {
  const tails = [];
  for (const x of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1; else hi = mid;
    }
    tails[lo] = x;
  }
  return tails.length;
}
```

### Key Points
- The `tails` array is not the actual subsequence, only its length is correct.
- Use `<=` in the comparison for non-decreasing variants.
- Problems: Longest Increasing Subsequence, Number of LIS, Russian Doll Envelopes, Longest Divisible Subset.

## Longest Common Subsequence
video: longest common subsequence lcs dynamic programming
summary: A 2D DP on two strings that finds the longest subsequence appearing in both, in O(m*n).

**LCS** finds the longest sequence of characters that appears in both strings in the same order (not necessarily contiguous). State: `dp[i][j]` = LCS length of the first `i` chars of `a` and first `j` chars of `b`.

- If `a[i-1] === b[j-1]`: `dp[i][j] = dp[i-1][j-1] + 1`
- Otherwise: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`

```js
// Time O(m*n), Space O(m*n)
function lcs(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[m][n];
}
```

### Key Points
- The same table shape solves Edit Distance (insert, delete, replace) and Longest Palindromic Subsequence (LCS of a string and its reverse).
- Space can be reduced to two rows.
- Problems: Longest Common Subsequence, Edit Distance, Longest Palindromic Subsequence, Shortest Common Supersequence, Distinct Subsequences.

## Greedy Algorithms
video: greedy algorithm dsa interval scheduling
summary: Make the locally best choice at each step, which works when it leads to a global optimum.

A **greedy algorithm** picks the best option at each step without reconsidering. It is simpler and faster than DP but only correct when the **greedy choice property** holds, so you should justify it (or test against counterexamples).

```js
// Jump Game: can we reach the last index? O(n)
function canJump(nums) {
  let farthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) return false;
    farthest = Math.max(farthest, i + nums[i]);
  }
  return true;
}

// Non-overlapping Intervals: remove the minimum to avoid overlap. O(n log n)
function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);       // sort by end time
  let end = -Infinity, removed = 0;
  for (const [s, e] of intervals) {
    if (s >= end) end = e;
    else removed++;
  }
  return removed;
}
```

### Key Points
- Typical moves: sort first (by end time, ratio or deadline), then sweep once.
- Greedy fails for Coin Change with arbitrary coins (use DP).
- Problems: Jump Game, Jump Game II, Gas Station, Merge Intervals, Non-overlapping Intervals, Assign Cookies, Best Time to Buy and Sell Stock II.

## Segment Tree Overview
video: segment tree range query dsa
summary: A tree over an array that answers range queries and point updates in O(log n).

A **segment tree** stores aggregates (sum, min, max) of array ranges in a binary tree. The root covers the whole array; each node covers a segment, with children covering its left and right halves. It supports **range query** and **point update** in `O(log n)`, with `O(n)` build and `O(n)` space.

```text
array [2, 4, 1, 3]
          [0-3]=10
        /          \
    [0-1]=6        [2-3]=4
    /    \         /     \
 [0]=2  [1]=4   [2]=1   [3]=3
```

```js
// Iterative segment tree for range sums
class SegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.t = new Array(2 * this.n).fill(0);
    for (let i = 0; i < this.n; i++) this.t[this.n + i] = arr[i];
    for (let i = this.n - 1; i > 0; i--) this.t[i] = this.t[2 * i] + this.t[2 * i + 1];
  }
  update(i, val) {                          // O(log n)
    i += this.n; this.t[i] = val;
    for (i >>= 1; i >= 1; i >>= 1) this.t[i] = this.t[2 * i] + this.t[2 * i + 1];
  }
  query(l, r) {                             // sum of [l, r), O(log n)
    let sum = 0;
    for (l += this.n, r += this.n; l < r; l >>= 1, r >>= 1) {
      if (l & 1) sum += this.t[l++];
      if (r & 1) sum += this.t[--r];
    }
    return sum;
  }
}
```

### Key Points
- Use it when you have many queries mixed with updates; a prefix sum is better when the array never changes.
- Lazy propagation enables range updates in O(log n).
- A Fenwick tree (BIT) is a simpler alternative for prefix sums.
- Problems: Range Sum Query - Mutable, Count of Smaller Numbers After Self, Range Minimum Query.
