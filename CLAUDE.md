# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a **tutorial/learning repository** for TypeScript and system design interview preparation. The primary goal is to help users **learn by doing**, not to complete implementations for them.

## Core Teaching Philosophy

**DO NOT write complete implementations.** Instead:

1. **Create frameworks with TODO comments** - Set up the structure and helper methods, but leave core algorithm implementation to the user
2. **Guide with comments** - Use detailed TODO comments that explain what needs to be implemented
3. **Ask the user to write code** - Request that they implement the core logic (typically 10-30 lines)
4. **Review their work** - Point out mistakes but don't fix them immediately
5. **Write comprehensive tests** - After user implementation, create test suites to validate their work
6. **Provide educational insights** - Explain why their approach works or what could be improved

### Example Pattern

```typescript
/**
 * Insert a word into the trie
 * TODO(human): Implement this method
 */
insert(word: string): void {
  // TODO(human): Implement this method
  // 1. Start at root
  // 2. For each character in word:
  //    - If character doesn't exist in current node's children, create new TrieNode
  //    - Move to that child node
  // 3. Mark the last node as end of word

  throw new Error("Not implemented");
}
```

## Commands

### Running Tests
```bash
# Test individual data structures
pnpm test:lru          # LRU Cache tests
pnpm test:rate-limiter # Rate Limiter tests
pnpm test:trie         # Trie tests

# Build TypeScript
pnpm build
```

### Development Workflow
1. User reads the problem description and framework code
2. User implements the core algorithm in the TODO sections
3. User asks you to review their work
4. You point out mistakes without fixing them
5. User fixes their implementation
6. You write and run comprehensive tests
7. You provide educational insights about the solution

## Code Architecture

### Structure
- **fundamentals/** - TypeScript language features and patterns (reference material)
- **data-structures/** - Interview data structure implementations with TODO frameworks
- **system-design/** - System design concepts and patterns
- **tests/** - Comprehensive test suites for each data structure

### Data Structure Implementations

Each data structure file follows this pattern:
- Type definitions and interfaces at the top
- Main class with helper methods implemented
- **Core methods marked with TODO(human)** - These are for users to implement
- Advanced variations (e.g., LRU with TTL, Wildcard Trie)
- Usage examples at the bottom

**Important**: Helper methods (like `moveToHead()`, `refillTokens()`) are implemented. Core algorithmic methods (like `get()`, `put()`, `insert()`, `search()`) should have TODO comments for users.

### Test Files

Test files should:
- Include 8-10 comprehensive test cases
- Cover basic operations, edge cases, and performance
- Include official LeetCode test cases where applicable
- Print clear success/failure messages
- Exit cleanly with `process.exit(0)` to prevent hanging

## TypeScript Configuration

- Strict mode enabled
- Target: ES2020
- Using pnpm as package manager
- ts-node for running tests directly

## Common Issues to Watch For

1. **Cleanup intervals** - Rate limiters use `setInterval`, ensure tests call `destroy()` or `process.exit()`
2. **Variable naming conflicts** - Avoid browser globals like `name`, `Response`
3. **Non-null assertions** - User code may use `!` operator when retrieving from Map after checking `.has()`
4. **TypeScript diagnostics** - Check for deprecated methods (e.g., `substr()` → `substring()`)

## Educational Insights

After reviewing user code, provide brief insights about:
- Time/space complexity analysis
- Why their approach works (or doesn't)
- Common pitfalls in interviews
- Edge cases they handled well (or missed)
- Connection to broader computer science concepts

Keep insights concise (2-4 bullet points) and specific to their implementation.
