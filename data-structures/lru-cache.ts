/**
 * LRU Cache Implementation
 *
 * Design and implement a data structure for Least Recently Used (LRU) cache.
 * It should support get and put operations in O(1) time complexity.
 *
 * LeetCode #146 - One of the most common interview questions!
 *
 * Key Concepts:
 * - Hash Map for O(1) lookups
 * - Doubly Linked List for O(1) insertions/deletions
 * - Move accessed items to front (most recent)
 * - Evict from back (least recent) when at capacity
 */

// ============================================================================
// DOUBLY LINKED LIST NODE
// ============================================================================

class DLLNode<K, V> {
  key: K;
  value: V;
  prev: DLLNode<K, V> | null = null;
  next: DLLNode<K, V> | null = null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

// ============================================================================
// LRU CACHE IMPLEMENTATION
// ============================================================================

class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, DLLNode<K, V>>;
  private head: DLLNode<K, V> | null = null; // Most recently used
  private tail: DLLNode<K, V> | null = null; // Least recently used

  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new Error("Capacity must be greater than 0");
    }
    this.capacity = capacity;
    this.cache = new Map();
  }

  /**
   * Get value by key. Returns undefined if not found.
   * Move the accessed node to head (most recently used).
   *
   * TODO(human): Implement this method
   * Time complexity: O(1)
   */
  get(key: K): V | undefined {
    // TODO(human): Implement this method
    // 1. Check if key exists in cache Map
    // 2. If not found, return undefined
    // 3. If found, get the node from the Map
    // 4. Move this node to head (it's now most recently used)
    // 5. Return the node's value

    throw new Error("Not implemented");
  }

  /**
   * Put key-value pair in cache.
   * If key exists, update value and move to head.
   * If key doesn't exist and at capacity, evict LRU item.
   *
   * TODO(human): Implement this method
   * Time complexity: O(1)
   */
  put(key: K, value: V): void {
    // TODO(human): Implement this method
    // 1. Check if key already exists
    //    - If yes: update value, move to head, done
    // 2. If key doesn't exist:
    //    - Check if at capacity
    //    - If at capacity: remove tail node (LRU item)
    //    - Create new node
    //    - Add to head
    //    - Add to Map

    throw new Error("Not implemented");
  }

  /**
   * Move a node to the head (mark as most recently used)
   */
  private moveToHead(node: DLLNode<K, V>): void {
    // If already at head, nothing to do
    if (node === this.head) return;

    // Remove from current position
    this.removeNode(node);

    // Add to head
    this.addToHead(node);
  }

  /**
   * Add a node to the head of the list
   */
  private addToHead(node: DLLNode<K, V>): void {
    node.next = this.head;
    node.prev = null;

    if (this.head) {
      this.head.prev = node;
    }

    this.head = node;

    // If list was empty, this is also the tail
    if (!this.tail) {
      this.tail = node;
    }
  }

  /**
   * Remove a node from the list
   */
  private removeNode(node: DLLNode<K, V>): void {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      // This was the head
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      // This was the tail
      this.tail = node.prev;
    }
  }

  /**
   * Remove the tail node (least recently used)
   */
  private removeTail(): DLLNode<K, V> | null {
    if (!this.tail) return null;

    const removed = this.tail;
    this.removeNode(removed);
    return removed;
  }

  /**
   * Get current size
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Check if cache contains key
   */
  has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * Clear the cache
   */
  clear(): void {
    this.cache.clear();
    this.head = null;
    this.tail = null;
  }

  /**
   * Get all keys in order from most to least recently used
   */
  keys(): K[] {
    const keys: K[] = [];
    let current = this.head;
    while (current) {
      keys.push(current.key);
      current = current.next;
    }
    return keys;
  }

  /**
   * Get all values in order from most to least recently used
   */
  values(): V[] {
    const values: V[] = [];
    let current = this.head;
    while (current) {
      values.push(current.value);
      current = current.next;
    }
    return values;
  }

  /**
   * Debug: Print cache state
   */
  debug(): void {
    console.log(`\nLRU Cache (${this.size}/${this.capacity}):`);
    let current = this.head;
    const items: string[] = [];
    while (current) {
      items.push(`${current.key}:${current.value}`);
      current = current.next;
    }
    console.log(`  [${items.join(' -> ')}]`);
    console.log(`  Head: ${this.head?.key}, Tail: ${this.tail?.key}`);
  }
}

// ============================================================================
// ADVANCED: LRU Cache with TTL (Time To Live)
// ============================================================================

interface CacheEntry<V> {
  value: V;
  expiresAt: number;
}

class LRUCacheWithTTL<K, V> {
  private cache: LRUCache<K, CacheEntry<V>>;
  private defaultTTL: number;

  constructor(capacity: number, defaultTTL: number = 60000) {
    this.cache = new LRUCache(capacity);
    this.defaultTTL = defaultTTL;
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);

    if (!entry) return undefined;

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      // Entry expired, treat as cache miss
      return undefined;
    }

    return entry.value;
  }

  put(key: K, value: V, ttl?: number): void {
    const expiresAt = Date.now() + (ttl ?? this.defaultTTL);
    this.cache.put(key, { value, expiresAt });
  }

  get size(): number {
    return this.cache.size;
  }
}

// ============================================================================
// ADVANCED: LFU Cache (Least Frequently Used)
// ============================================================================

/**
 * LFU Cache evicts the least frequently used item.
 * If there's a tie, evict the least recently used among them.
 */
class LFUCache<K, V> {
  private capacity: number;
  private cache: Map<K, { value: V; freq: number; lastUsed: number }>;
  private minFreq = 0;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    // Increment frequency
    entry.freq++;
    entry.lastUsed = Date.now();
    this.cache.set(key, entry);

    return entry.value;
  }

  put(key: K, value: V): void {
    if (this.capacity === 0) return;

    const existing = this.cache.get(key);

    if (existing) {
      // Update existing
      existing.value = value;
      existing.freq++;
      existing.lastUsed = Date.now();
      this.cache.set(key, existing);
      return;
    }

    // New key - check capacity
    if (this.cache.size >= this.capacity) {
      // Find least frequently used, then least recently used
      let minFreq = Infinity;
      let minLastUsed = Infinity;
      let keyToEvict: K | null = null;

      for (const [k, v] of this.cache.entries()) {
        if (v.freq < minFreq || (v.freq === minFreq && v.lastUsed < minLastUsed)) {
          minFreq = v.freq;
          minLastUsed = v.lastUsed;
          keyToEvict = k;
        }
      }

      if (keyToEvict !== null) {
        this.cache.delete(keyToEvict);
      }
    }

    // Add new entry
    this.cache.set(key, { value, freq: 1, lastUsed: Date.now() });
  }

  get size(): number {
    return this.cache.size;
  }
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

// Example 1: Basic LRU Cache
const cache = new LRUCache<number, string>(3);

// Example 2: String keys and object values
interface User {
  id: string;
  name: string;
}

const userCache = new LRUCache<string, User>(100);

// Example 3: LRU with TTL
const sessionCache = new LRUCacheWithTTL<string, { token: string }>(1000, 3600000); // 1 hour TTL

export { LRUCache, LRUCacheWithTTL, LFUCache };
