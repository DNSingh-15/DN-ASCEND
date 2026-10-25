---
name: DSA Fundamentals
icon: 🧮
category: DSA
track: dsa
color: #f43f5e
order: 20
description: Core problem-solving foundations: complexity analysis, arrays, strings, common patterns, recursion, sorting, searching and basic number theory.
---

## Time and Space Complexity
video: time complexity big o notation dsa
summary: Big-O describes how running time and memory grow as input size n grows.

**Time complexity** measures how the number of operations grows with input size `n`. **Space complexity** measures extra memory used. We use **Big-O** notation, which describes the worst-case growth rate and ignores constants and lower-order terms.

```text
O(1)        constant      array index, hash lookup
O(log n)    logarithmic   binary search
O(n)        linear        single loop
O(n log n)  linearithmic  merge sort, quick sort (avg)
O(n^2)      quadratic     nested loops, bubble sort
O(2^n)      exponential   naive subsets, naive fibonacci
O(n!)       factorial     all permutations
```

```js
function sumArray(arr) {      // Time O(n), Space O(1)
  let sum = 0;
  for (const x of arr) sum += x;
  return sum;
}

function hasPair(arr) {       // Time O(n^2), Space O(1)
  for (let i = 0; i < arr.length; i++)
    for (let j = i + 1; j < arr.length; j++)
      if (arr[i] === arr[j]) return true;
  return false;
}
```

### Key Points
- Drop constants and smaller terms: `O(2n + 5)` becomes `O(n)`.
- Sequential loops add (`O(n + m)`), nested loops multiply (`O(n * m)`).
- Recursion uses call-stack space: depth d means O(d) space.
- Typical constraint guide: n up to 10^5 needs O(n log n) or better; n up to 20 allows O(2^n).
- Interview tip: always state both time and space for your solution, then try to improve it.

## Arrays
video: arrays dsa basics javascript
summary: Arrays store elements in contiguous memory with O(1) index access and O(n) insert or delete in the middle.

An **array** stores elements in contiguous memory, so access by index is `O(1)`. Inserting or deleting in the middle shifts elements, costing `O(n)`. Appending at the end is amortized `O(1)`.

```text
index:   0   1   2   3   4
value: [ 5 | 2 | 8 | 1 | 9 ]
```

```js
const arr = [5, 2, 8, 1, 9];
arr[2];            // O(1) access
arr.push(7);       // O(1) amortized
arr.pop();         // O(1)
arr.unshift(0);    // O(n) shifts everything
arr.splice(2, 1);  // O(n) remove at index

// Find max: O(n) time, O(1) space
function findMax(a) {
  let max = -Infinity;
  for (const x of a) if (x > max) max = x;
  return max;
}

// Reverse in place: O(n) time, O(1) space
function reverse(a) {
  for (let i = 0, j = a.length - 1; i < j; i++, j--) [a[i], a[j]] = [a[j], a[i]];
  return a;
}
```

### Key Points
- Use arrays when you need fast random access and iteration.
- `map`, `filter`, `slice` create new arrays (O(n) extra space).
- Common problems: Find Maximum, Rotate Array, Move Zeroes, Remove Duplicates from Sorted Array, Kadane's Maximum Subarray.
- Kadane's idea: `cur = Math.max(x, cur + x)` while tracking the best.

## Strings
video: string problems dsa javascript
summary: Strings are immutable character sequences; build results with arrays and join to avoid O(n^2) copying.

A **string** is a sequence of characters. In JavaScript strings are **immutable**: every modification creates a new string. Repeated `+=` in a loop can cost `O(n^2)`, so collect pieces in an array and `join`.

```js
// Valid Palindrome: O(n) time, O(1) space
function isPalindrome(s) {
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++; r--;
  }
  return true;
}

// Anagram check with character counts: O(n) time, O(1) space (26 letters)
function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const count = new Array(26).fill(0);
  for (let i = 0; i < a.length; i++) {
    count[a.charCodeAt(i) - 97]++;
    count[b.charCodeAt(i) - 97]--;
  }
  return count.every(c => c === 0);
}
```

### Key Points
- Use `charCodeAt(i) - 97` to map `a-z` to 0-25.
- Frequency arrays or maps solve most anagram problems.
- Common problems: Reverse String, Valid Palindrome, Valid Anagram, Longest Common Prefix, First Unique Character, String Compression.

## Two Pointers
video: two pointers technique dsa
summary: Use two indices moving through data to replace a nested loop with a single O(n) pass.

The **two pointers** pattern uses two indices that move toward each other or in the same direction. It often turns an `O(n^2)` brute force into `O(n)`. It works best on **sorted arrays** or when you partition or compare from both ends.

```text
[1, 2, 4, 7, 11, 15]   target = 15
 L                R     1+15=16 > 15 -> move R
 L            R         1+11=12 < 15 -> move L
 ...
```

```js
// Two Sum on a sorted array: O(n) time, O(1) space
function twoSumSorted(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l < r) {
    const sum = nums[l] + nums[r];
    if (sum === target) return [l, r];
    if (sum < target) l++;
    else r--;
  }
  return [];
}
```

### Key Points
- Opposite ends: pair sums, palindromes, Container With Most Water.
- Same direction (slow/fast): Remove Duplicates, Move Zeroes.
- Extends to 3Sum: sort, fix one element, then two pointers on the rest (O(n^2)).
- Ask: "is the data sorted or can I sort it?"

## Sliding Window
video: sliding window technique dsa
summary: Maintain a moving window over a contiguous range, updating its state incrementally instead of recomputing.

The **sliding window** pattern handles problems about **contiguous subarrays or substrings**. Instead of recomputing each range, you add the new element entering the window and remove the one leaving it.

- **Fixed size**: window length is k.
- **Variable size**: expand the right edge, shrink the left edge while a condition is violated.

```js
// Max sum of subarray of size k: O(n) time, O(1) space
function maxSumK(nums, k) {
  let sum = 0, best = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    if (i >= k - 1) {
      best = Math.max(best, sum);
      sum -= nums[i - k + 1];
    }
  }
  return best;
}

// Longest substring without repeating characters: O(n)
function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    if (seen.has(s[right]) && seen.get(s[right]) >= left) left = seen.get(s[right]) + 1;
    seen.set(s[right], right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
```

### Key Points
- Keywords: "longest/shortest/maximum subarray or substring with condition".
- Problems: Longest Substring Without Repeating Characters, Minimum Window Substring, Max Consecutive Ones III, Permutation in String.
- Each pointer only moves forward, so total work is O(n).

## Prefix Sum
video: prefix sum array dsa
summary: Precompute running totals so any range sum is answered in O(1).

A **prefix sum** array stores cumulative totals: `prefix[i]` is the sum of the first `i` elements. Any range sum becomes a subtraction.

```text
nums   = [3, 1, 4, 1, 5]
prefix = [0, 3, 4, 8, 9, 14]
sum(l..r) = prefix[r + 1] - prefix[l]
sum(1..3) = prefix[4] - prefix[1] = 9 - 3 = 6
```

```js
function buildPrefix(nums) {          // O(n) build, O(n) space
  const p = [0];
  for (const x of nums) p.push(p[p.length - 1] + x);
  return p;
}
const rangeSum = (p, l, r) => p[r + 1] - p[l];   // O(1) per query

// Subarray Sum Equals K: prefix sum + hash map, O(n)
function subarraySum(nums, k) {
  const count = new Map([[0, 1]]);
  let sum = 0, res = 0;
  for (const x of nums) {
    sum += x;
    res += count.get(sum - k) || 0;
    count.set(sum, (count.get(sum) || 0) + 1);
  }
  return res;
}
```

### Key Points
- Use when there are many range queries on a static array.
- Problems: Range Sum Query, Subarray Sum Equals K, Product of Array Except Self, Pivot Index.
- The idea extends to 2D grids and difference arrays for range updates.

## Hashing and Hash Maps
video: hashing hash map dsa javascript
summary: Hash maps and sets give average O(1) lookup, insert and delete, trading memory for speed.

A **hash map** stores key-value pairs. A hash function converts the key to an index, giving **average O(1)** insert, lookup and delete. A **set** stores unique keys only. Collisions (two keys, same index) are handled by chaining or open addressing; worst case is O(n).

```js
// Two Sum: O(n) time, O(n) space
function twoSum(nums, target) {
  const seen = new Map();            // value -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}

// Contains Duplicate: O(n)
const hasDup = nums => new Set(nums).size !== nums.length;

// Frequency count
const freq = {};
for (const ch of "banana") freq[ch] = (freq[ch] || 0) + 1;
```

### Key Points
- Use a map to replace an inner loop with a lookup ("have I seen the complement?").
- Problems: Two Sum, Group Anagrams, Contains Duplicate, Longest Consecutive Sequence, Top K Frequent Elements.
- Prefer `Map` over plain objects when keys are not strings or order matters.

## Recursion
video: recursion for beginners dsa
summary: A function that calls itself on a smaller problem, with a base case that stops the calls.

**Recursion** solves a problem by solving smaller versions of itself. Every recursive function needs:

1. A **base case** that stops recursion.
2. A **recursive case** that moves toward the base case.

Each call sits on the **call stack**, so depth d costs O(d) space and too much depth causes stack overflow.

```text
fact(3)
 -> 3 * fact(2)
        -> 2 * fact(1)
               -> 1   (base case)
```

```js
// Factorial: O(n) time, O(n) stack space
function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1);
}

// Power: O(log n) by halving
function power(x, n) {
  if (n === 0) return 1;
  const half = power(x, Math.floor(n / 2));
  return n % 2 === 0 ? half * half : half * half * x;
}

// Naive Fibonacci is O(2^n); memoization makes it O(n)
function fib(n, memo = {}) {
  if (n <= 1) return n;
  return memo[n] ??= fib(n - 1, memo) + fib(n - 2, memo);
}
```

### Key Points
- Think: "if I trust the function for n-1, how do I get n?"
- Problems: Factorial, Fibonacci, Power(x, n), Reverse a String, Tower of Hanoi, Sum of Digits.
- Overlapping subproblems lead to memoization and dynamic programming.

## Backtracking
video: backtracking subsets permutations dsa
summary: Build solutions step by step, undoing choices (backtrack) when a path cannot lead to a valid answer.

**Backtracking** explores all possibilities as a decision tree: choose, explore, then **undo** the choice. It prunes branches that cannot work, which is faster than blind brute force.

```text
subsets of [1,2]:
            []
        /        \
     [1]          []
    /   \        /   \
 [1,2]  [1]    [2]   []
```

```js
// Subsets: O(2^n * n) time
function subsets(nums) {
  const res = [];
  function dfs(start, path) {
    res.push([...path]);                 // record current choice set
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);                // choose
      dfs(i + 1, path);                  // explore
      path.pop();                        // undo
    }
  }
  dfs(0, []);
  return res;
}
```

### Key Points
- Template: choose, recurse, un-choose.
- Skip duplicates by sorting and checking `nums[i] === nums[i-1]`.
- Problems: Subsets, Permutations, Combination Sum, Generate Parentheses, N-Queens, Sudoku Solver, Word Search.
- Complexity is usually exponential or factorial; pruning is what makes it practical.

## Bit Manipulation
video: bit manipulation dsa tricks
summary: Use bitwise operators to solve problems with O(1) space and very fast operations.

Numbers are stored in binary, and bitwise operators work directly on those bits.

| Operator | Meaning | Example |
|----------|---------|---------|
| `&` | AND | `5 & 3 = 1` |
| `\|` | OR | `5 \| 3 = 7` |
| `^` | XOR | `5 ^ 3 = 6` |
| `<<` / `>>` | shift left/right | `1 << 3 = 8` |

XOR facts: `a ^ a = 0` and `a ^ 0 = a`, so duplicates cancel out.

```js
const isEven = n => (n & 1) === 0;
const isPowerOfTwo = n => n > 0 && (n & (n - 1)) === 0;
const getBit = (n, i) => (n >> i) & 1;
const setBit = (n, i) => n | (1 << i);
const clearBit = (n, i) => n & ~(1 << i);

// Single Number: every element appears twice except one. O(n) time, O(1) space
function singleNumber(nums) {
  let x = 0;
  for (const n of nums) x ^= n;
  return x;
}

// Count set bits (Brian Kernighan): O(number of set bits)
function countBits(n) {
  let c = 0;
  while (n) { n &= n - 1; c++; }
  return c;
}
```

### Key Points
- JavaScript bitwise operators work on 32-bit signed integers.
- Problems: Single Number, Number of 1 Bits, Power of Two, Missing Number, Subsets using bitmask.
- `n & (n - 1)` removes the lowest set bit.

## Basic Sorting
video: bubble sort selection sort insertion sort
summary: Simple O(n^2) sorts: bubble, selection and insertion, good for learning and small inputs.

Simple sorts compare and swap elements using nested loops, giving `O(n^2)` time and `O(1)` space.

- **Bubble sort**: repeatedly swap adjacent out-of-order pairs; largest values "bubble" to the end.
- **Selection sort**: repeatedly pick the minimum from the unsorted part and place it at the front.
- **Insertion sort**: insert each element into its correct place in the sorted left part. Best for nearly sorted data (O(n)).

```js
function bubbleSort(a) {               // O(n^2), best O(n) with early exit
  for (let i = 0; i < a.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < a.length - 1 - i; j++)
      if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; swapped = true; }
    if (!swapped) break;
  }
  return a;
}

function insertionSort(a) {            // O(n^2), best O(n)
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j--; }
    a[j + 1] = key;
  }
  return a;
}
```

### Key Points
- A **stable** sort keeps equal elements in original order: bubble and insertion are stable, selection is not.
- Selection sort always does O(n^2) comparisons but only O(n) swaps.
- Interview tip: know the best, average and worst case of each.

## Merge Sort
video: merge sort algorithm dsa
summary: Divide the array in half, sort each half recursively, then merge: O(n log n) always, stable.

**Merge sort** is a divide-and-conquer algorithm. Split the array in half, sort both halves recursively, then **merge** the two sorted halves.

```text
[5,2,4,1]
 /      \
[5,2]  [4,1]
 /  \    /  \
[5][2] [4][1]
 \  /    \  /
[2,5]   [1,4]
    \    /
  [1,2,4,5]
```

```js
// Time O(n log n) in all cases, Space O(n)
function mergeSort(a) {
  if (a.length <= 1) return a;
  const mid = a.length >> 1;
  const left = mergeSort(a.slice(0, mid));
  const right = mergeSort(a.slice(mid));
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length)
    out.push(left[i] <= right[j] ? left[i++] : right[j++]);
  return out.concat(left.slice(i), right.slice(j));
}
```

### Key Points
- Stable and guaranteed O(n log n); needs O(n) extra space.
- Great for linked lists and external sorting of huge data.
- The merge step also solves Merge Two Sorted Arrays and Count Inversions.
- Problems: Sort an Array, Merge Sorted Array, Sort List.

## Quick Sort
video: quick sort algorithm partition dsa
summary: Pick a pivot, partition smaller and larger elements around it, recurse: O(n log n) average, in place.

**Quick sort** picks a **pivot**, partitions the array so smaller elements go left and larger go right, then recurses on both sides. The pivot ends in its final position.

```js
// Average O(n log n), worst O(n^2), Space O(log n) stack
function quickSort(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return a;
  const p = partition(a, lo, hi);
  quickSort(a, lo, p - 1);
  quickSort(a, p + 1, hi);
  return a;
}

function partition(a, lo, hi) {        // Lomuto scheme
  const pivot = a[hi];
  let i = lo;
  for (let j = lo; j < hi; j++)
    if (a[j] < pivot) { [a[i], a[j]] = [a[j], a[i]]; i++; }
  [a[i], a[hi]] = [a[hi], a[i]];
  return i;
}
```

### Key Points
- The worst case happens on sorted input with a bad pivot; use a random or median pivot.
- In place but not stable.
- Quickselect uses the same partition to find the k-th largest element in O(n) average (Kth Largest Element).
- Problems: Sort Colors (3-way partition), Kth Largest Element in an Array.
- JavaScript `arr.sort()` sorts as strings by default; pass `(a, b) => a - b` for numbers.

## Linear Search
video: linear search algorithm dsa
summary: Scan elements one by one until the target is found; works on any array in O(n).

**Linear search** checks each element in order until it finds the target or reaches the end. It works on unsorted data and needs no preparation.

```js
// Time O(n), Space O(1)
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
```

### Key Points
- Best case O(1) (first element), worst case O(n).
- Use it for small or unsorted arrays; for sorted data prefer binary search.
- Built-ins: `indexOf`, `includes`, `find` all run in O(n).
- Related problems: Find Minimum, Second Largest, Check if Array is Sorted.

## Binary Search
video: binary search algorithm dsa
summary: Repeatedly halve a sorted search space by comparing with the middle element: O(log n).

**Binary search** finds a target in a **sorted** array by comparing it with the middle element and discarding half of the range each step.

```text
[1, 3, 5, 7, 9, 11, 13]   target = 11
 L        M          R    7 < 11 -> L = M + 1
              L  M   R    11 found
```

```js
// Time O(log n), Space O(1)
function binarySearch(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);   // avoids overflow in other languages
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

// Lower bound: first index with nums[i] >= target
function lowerBound(nums, target) {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
```

### Key Points
- Requires sorted or monotonic data.
- Off-by-one errors are the main bug; decide whether `hi` is inclusive or exclusive and stay consistent.
- Problems: Binary Search, Search Insert Position, First and Last Position, Search in Rotated Sorted Array, Find Peak Element.

## Binary Search on Answer
video: binary search on answer dsa
summary: Binary search over the range of possible answers when feasibility is monotonic.

Sometimes the array is not what you search; you binary search the **answer itself**. If you can write a function `canDo(x)` that is **monotonic** (false, false, true, true...), you can find the smallest `x` that works in `O(log range * cost of check)`.

```js
// Koko Eating Bananas: min speed k to finish within h hours
function minEatingSpeed(piles, h) {
  const canFinish = k =>
    piles.reduce((hours, p) => hours + Math.ceil(p / k), 0) <= h;

  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (canFinish(mid)) hi = mid;      // mid works, try smaller
    else lo = mid + 1;                 // too slow
  }
  return lo;
}
// Time O(n log max), Space O(1)
```

### Key Points
- Recognize phrases like "minimize the maximum" or "maximize the minimum".
- Steps: define the range, write the feasibility check, search for the boundary.
- Problems: Koko Eating Bananas, Capacity to Ship Packages, Split Array Largest Sum, Square Root (integer sqrt), Aggressive Cows.

## GCD and Number Theory
video: gcd euclidean algorithm prime number dsa
summary: Euclid's algorithm computes GCD fast; primes, modulo and LCM appear often in interview problems.

The **GCD** (greatest common divisor) of two numbers is the largest number dividing both. **Euclid's algorithm** uses `gcd(a, b) = gcd(b, a % b)` and runs in `O(log min(a, b))`. **LCM** follows: `lcm(a, b) = a / gcd(a, b) * b`.

```js
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a / gcd(a, b)) * b;

// Primality test: O(sqrt n)
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

// Fast modular exponentiation: O(log exp)
function modPow(base, exp, mod) {
  let result = 1n, b = BigInt(base) % BigInt(mod), e = BigInt(exp);
  const m = BigInt(mod);
  while (e > 0n) {
    if (e & 1n) result = (result * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return result;
}
```

### Key Points
- Many problems ask for the answer "modulo 10^9 + 7" to avoid overflow.
- Check divisors only up to sqrt(n).
- Problems: Count Primes, GCD of Strings, Pow(x, n), Fizz Buzz, Happy Number.

## Sieve of Eratosthenes
video: sieve of eratosthenes prime numbers dsa
summary: Find all primes up to n by crossing out multiples of each prime, in O(n log log n).

The **Sieve of Eratosthenes** finds all primes up to `n`. Start with everything marked prime, then for each prime `p` mark its multiples (starting at `p*p`) as composite.

```text
n = 20: 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20
cross multiples of 2 -> 3 5 7 9 11 13 15 17 19
cross multiples of 3 -> 5 7 11 13 17 19
primes: 2 3 5 7 11 13 17 19
```

```js
// Time O(n log log n), Space O(n)
function sieve(n) {
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let p = 2; p * p <= n; p++) {
    if (isPrime[p]) {
      for (let m = p * p; m <= n; m += p) isPrime[m] = false;
    }
  }
  const primes = [];
  for (let i = 2; i <= n; i++) if (isPrime[i]) primes.push(i);
  return primes;
}
```

### Key Points
- Much faster than testing each number with `isPrime` (O(n sqrt n)).
- Start marking at `p*p` because smaller multiples were already crossed out.
- Problems: Count Primes, Prime Factorization using a smallest-prime-factor sieve.
