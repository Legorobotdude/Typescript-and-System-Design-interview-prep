# TypeScript & System Design Interview Prep

A comprehensive collection of TypeScript fundamentals and system design implementations for coding interviews.

## 📁 Project Structure

```
tutorial/
├── fundamentals/          # TypeScript language fundamentals
│   ├── typescript-fundamentals.ts    # Core TS features, types, generics
│   └── practical-examples.ts         # Common patterns & utilities
│
├── data-structures/       # Interview data structure implementations
│   ├── lru-cache.ts                  # LRU Cache with O(1) operations
│   ├── rate-limiter.ts               # Token bucket & sliding window
│   └── trie.ts                       # Trie (Prefix Tree) for string operations
│
├── system-design/         # System design concepts & patterns
│   └── system-design-concepts.md     # Guide to system design interviews
│
└── tests/                 # Test files
    ├── test-lru-cache.ts
    ├── test-rate-limiter.ts
    └── test-trie.ts
```

## 🚀 Quick Start

### Install Dependencies
```bash
pnpm install
```

### Run Tests
```bash
# Test LRU Cache
pnpm test:lru

# Test Rate Limiter
pnpm test:rate-limiter

# Test Trie
pnpm test:trie
```

## 📚 What's Included

### Fundamentals (`fundamentals/`)

**typescript-fundamentals.ts**
- Type system basics (primitives, arrays, tuples, enums)
- Interfaces vs Type aliases
- Functions & type inference
- Generics & constraints
- Utility types (Partial, Pick, Omit, Record, etc.)
- Union & literal types
- Type guards & narrowing
- Classes & access modifiers
- Async/await patterns
- Advanced patterns (mapped types, conditional types)

**practical-examples.ts**
- LRU Cache implementation
- Debounce & throttle functions
- Type-safe event emitter
- Async queue with concurrency control
- Deep clone with type preservation
- Retry logic with exponential backoff
- Memoization
- Promise utilities
- Trie data structure
- State machine

### Data Structures (`data-structures/`)

**lru-cache.ts** - LeetCode #146
- O(1) get and put operations
- Doubly linked list + hash map
- Proper eviction on capacity
- Bonus: LRU with TTL, LFU Cache

**rate-limiter.ts**
- Token bucket algorithm
- Sliding window implementation
- Distributed rate limiter (Redis-based)
- Express middleware integration

**trie.ts** - LeetCode #208
- Trie (Prefix Tree) implementation
- Autocomplete functionality
- Word frequency counting
- Wildcard search with '.' patterns
- Delete operations with proper cleanup

### System Design (`system-design/`)

**system-design-concepts.md**
- Scalability patterns (horizontal/vertical, load balancing)
- Caching strategies (levels, patterns, eviction)
- Database design (SQL vs NoSQL, indexing, normalization)
- API design (REST, GraphQL, rate limiting)
- Message queues & async processing
- Microservices architecture
- Security & authentication
- Monitoring & observability
- Common interview questions with solutions
- Back-of-envelope calculations

## 🎯 Interview Topics Covered

### TypeScript Specific
- ✅ Advanced type system features
- ✅ Generics and constraints
- ✅ Utility types
- ✅ Type guards and narrowing
- ✅ Design patterns in TypeScript

### Data Structures & Algorithms
- ✅ LRU Cache (LeetCode #146)
- ✅ Rate Limiting algorithms
- ✅ Trie (LeetCode #208)
- ✅ Event systems
- ✅ State machines

### System Design
- ✅ URL Shortener
- ✅ Rate Limiter
- ✅ Chat System
- ✅ Social Media Feed
- ✅ Notification System
- ✅ Caching strategies
- ✅ Database scaling
- ✅ Microservices patterns

## 💡 Study Path

1. **Week 1: TypeScript Fundamentals**
   - Study `typescript-fundamentals.ts`
   - Practice with `practical-examples.ts`
   - Implement your own utility functions

2. **Week 2: Data Structures**
   - Implement LRU Cache from scratch
   - Implement Rate Limiter
   - Understand time/space complexity

3. **Week 3: System Design**
   - Read `system-design-concepts.md`
   - Practice drawing system diagrams
   - Do mock interviews

## 🧪 Testing

All implementations include comprehensive test suites:
- Basic operations
- Edge cases
- Performance benchmarks
- Real interview test cases (LeetCode examples)

## 📖 Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [System Design Primer](https://github.com/donnemartin/system-design-primer)
- [LeetCode](https://leetcode.com/)

## 🤝 Contributing

Feel free to add more:
- Data structure implementations
- System design examples
- Interview questions
- Test cases

---

**Good luck with your interviews! 🚀**
