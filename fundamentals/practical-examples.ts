/**
 * Practical TypeScript Examples - Common Interview Problems
 */

// ============================================================================
// 1. LRU CACHE Implementation with TypeScript
// ============================================================================

class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, V>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }

    // Move to end (most recently used)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key: K, value: V): void {
    // Delete if exists (to update position)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Add to end
    this.cache.set(key, value);

    // Remove oldest if over capacity
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  size(): number {
    return this.cache.size;
  }
}

// ============================================================================
// 2. DEBOUNCE & THROTTLE with Proper Types
// ============================================================================

type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
};

function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), delay);
  };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================================================
// 3. EVENT EMITTER with Type Safety
// ============================================================================

type EventMap = Record<string, any>;
type EventKey<T extends EventMap> = string & keyof T;
type EventHandler<T> = (params: T) => void;

class TypedEventEmitter<Events extends EventMap> {
  private listeners: {
    [K in keyof Events]?: Array<EventHandler<Events[K]>>;
  } = {};

  on<K extends EventKey<Events>>(
    eventName: K,
    handler: EventHandler<Events[K]>
  ): void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName]!.push(handler);
  }

  off<K extends EventKey<Events>>(
    eventName: K,
    handler: EventHandler<Events[K]>
  ): void {
    const handlers = this.listeners[eventName];
    if (handlers) {
      this.listeners[eventName] = handlers.filter(h => h !== handler) as any;
    }
  }

  emit<K extends EventKey<Events>>(eventName: K, params: Events[K]): void {
    const handlers = this.listeners[eventName];
    if (handlers) {
      handlers.forEach(handler => handler(params));
    }
  }
}

// Usage example
interface MyEvents {
  userLoggedIn: { userId: string; timestamp: Date };
  messageReceived: { from: string; content: string };
  error: { code: number; message: string };
}

const emitter = new TypedEventEmitter<MyEvents>();

emitter.on("userLoggedIn", ({ userId, timestamp }) => {
  console.log(`User ${userId} logged in at ${timestamp}`);
});

// ============================================================================
// 4. ASYNC QUEUE with Concurrency Control
// ============================================================================

type Task<T> = () => Promise<T>;

class AsyncQueue {
  private queue: Array<() => Promise<void>> = [];
  private running = 0;

  constructor(private concurrency: number) {}

  async add<T>(task: Task<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const wrappedTask = async () => {
        try {
          this.running++;
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.running--;
          this.processNext();
        }
      };

      this.queue.push(wrappedTask);
      this.processNext();
    });
  }

  private processNext(): void {
    if (this.running < this.concurrency && this.queue.length > 0) {
      const task = this.queue.shift()!;
      task();
    }
  }

  get size(): number {
    return this.queue.length;
  }

  get activeCount(): number {
    return this.running;
  }
}

// ============================================================================
// 5. DEEP CLONE with Type Preservation
// ============================================================================

type Primitive = string | number | boolean | null | undefined | symbol | bigint;

function deepClone<T>(value: T): T {
  // Handle primitives
  if (value === null || typeof value !== "object") {
    return value;
  }

  // Handle Date
  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  // Handle Array
  if (Array.isArray(value)) {
    return value.map(item => deepClone(item)) as T;
  }

  // Handle Map
  if (value instanceof Map) {
    const cloned = new Map();
    value.forEach((val, key) => {
      cloned.set(deepClone(key), deepClone(val));
    });
    return cloned as T;
  }

  // Handle Set
  if (value instanceof Set) {
    const cloned = new Set();
    value.forEach(val => {
      cloned.add(deepClone(val));
    });
    return cloned as T;
  }

  // Handle Object
  const cloned = {} as T;
  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      cloned[key] = deepClone(value[key]);
    }
  }

  return cloned;
}

// ============================================================================
// 6. RETRY LOGIC with Exponential Backoff
// ============================================================================

interface RetryOptions {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let lastError: Error;
  let delay = options.initialDelay;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt === options.maxAttempts) {
        throw lastError;
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * options.backoffMultiplier, options.maxDelay);
    }
  }

  throw lastError!;
}

// ============================================================================
// 7. MEMOIZATION with Generic Type Support
// ============================================================================

type AnyFunction = (...args: any[]) => any;

function memoize<T extends AnyFunction>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Example: Fibonacci with memoization
const fibonacci = memoize((n: number): number => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

// ============================================================================
// 8. PROMISE UTILITIES
// ============================================================================

// Promise.all with type inference
async function promiseAll<T extends readonly unknown[] | []>(
  promises: T
): Promise<{ [K in keyof T]: Awaited<T[K]> }> {
  return Promise.all(promises) as any;
}

// Promise with timeout
function promiseWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Promise timeout")), timeoutMs)
    ),
  ]);
}

// Retry promise
async function retryPromise<T>(
  fn: () => Promise<T>,
  retries: number
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    return retryPromise(fn, retries - 1);
  }
}

// ============================================================================
// 9. TRIE Implementation for String Searching
// ============================================================================

class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord = false;
}

class Trie {
  private root = new TrieNode();

  insert(word: string): void {
    let current = this.root;

    for (const char of word) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
    }

    current.isEndOfWord = true;
  }

  search(word: string): boolean {
    const node = this.findNode(word);
    return node !== null && node.isEndOfWord;
  }

  startsWith(prefix: string): boolean {
    return this.findNode(prefix) !== null;
  }

  private findNode(str: string): TrieNode | null {
    let current = this.root;

    for (const char of str) {
      if (!current.children.has(char)) {
        return null;
      }
      current = current.children.get(char)!;
    }

    return current;
  }

  // Get all words with prefix
  getWordsWithPrefix(prefix: string): string[] {
    const node = this.findNode(prefix);
    if (!node) return [];

    const words: string[] = [];
    this.collectWords(node, prefix, words);
    return words;
  }

  private collectWords(node: TrieNode, prefix: string, words: string[]): void {
    if (node.isEndOfWord) {
      words.push(prefix);
    }

    for (const [char, childNode] of node.children) {
      this.collectWords(childNode, prefix + char, words);
    }
  }
}

// ============================================================================
// 10. STATE MACHINE with Type Safety
// ============================================================================

type State = string;
type Event = string;

interface Transition<S extends State, E extends Event> {
  from: S;
  event: E;
  to: S;
}

class StateMachine<S extends State, E extends Event> {
  private currentState: S;
  private transitions: Map<string, S> = new Map();

  constructor(initialState: S, transitions: Transition<S, E>[]) {
    this.currentState = initialState;

    for (const transition of transitions) {
      const key = `${transition.from}:${transition.event}`;
      this.transitions.set(key, transition.to);
    }
  }

  getCurrentState(): S {
    return this.currentState;
  }

  can(event: E): boolean {
    const key = `${this.currentState}:${event}`;
    return this.transitions.has(key);
  }

  transition(event: E): boolean {
    const key = `${this.currentState}:${event}`;
    const nextState = this.transitions.get(key);

    if (nextState) {
      this.currentState = nextState;
      return true;
    }

    return false;
  }
}

// Example: Order state machine
type OrderState = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
type OrderEvent = "confirm" | "ship" | "deliver" | "cancel";

const orderMachine = new StateMachine<OrderState, OrderEvent>("pending", [
  { from: "pending", event: "confirm", to: "confirmed" },
  { from: "pending", event: "cancel", to: "cancelled" },
  { from: "confirmed", event: "ship", to: "shipped" },
  { from: "confirmed", event: "cancel", to: "cancelled" },
  { from: "shipped", event: "deliver", to: "delivered" },
]);
