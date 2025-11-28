# TypeScript Best Practices Guide

A comprehensive guide to writing production-ready TypeScript code. Learn the patterns that distinguish junior from senior developers.

---

## 1. Const vs Let (Immutability)

**❌ Beginner Pattern:**
```typescript
let metadata: URLMetadata = {
  longUrl: request.longUrl,
  shortCode: request.customCode,
  // ...
};
let response: CreateURLResponse = {
  shortUrl: metadata.shortCode,
  // ...
};
return response;
```

**✅ Professional Pattern:**
```typescript
const metadata = this.createMetadata(
  request.longUrl,
  validatedCode,
  request.ttlSeconds,
  true
);
return this.createResponse(metadata);
```

**Why it matters:**
- `const` signals intent - this value won't change
- Prevents accidental reassignment bugs
- Better for TypeScript's control flow analysis
- Industry standard in modern TypeScript/JavaScript

**Rule:** Default to `const`. Only use `let` when you need to reassign.

---

## 2. Type Inference vs Explicit Annotations

**❌ Beginner Pattern:**
```typescript
let response: CreateURLResponse = {
  shortUrl: this.BASE_DOMAIN + "/" + metadata.shortCode,
  shortCode: metadata.shortCode,
  expiresAt: metadata.expiresAt,
}
```

**✅ Professional Pattern:**
```typescript
// TypeScript infers the type from function return type
return {
  shortUrl: `${this.BASE_DOMAIN}/${metadata.shortCode}`,
  shortCode: metadata.shortCode,
  expiresAt: metadata.expiresAt,
};
```

**Why it matters:**
- TypeScript is smart enough to infer types from context
- Reduces visual noise and redundancy
- The function's return type provides the contract
- Shows trust in TypeScript's type system

**Rule:** Let TypeScript infer when obvious. Annotate function signatures and interfaces.

---

## 3. Non-Null Assertions vs Type Narrowing

**❌ Beginner Pattern:**
```typescript
if (this.store.has(shortCode)) {
  let metadata = this.store.get(shortCode)!; // Using !
  metadata.clickCount++;
}
```

**✅ Professional Pattern:**
```typescript
const metadata = this.store.get(shortCode);

if (metadata === undefined) {
  throw new Error("Not found");
}

// TypeScript now knows metadata is defined
metadata.clickCount++;
```

**Why it matters:**
- Non-null assertion `!` bypasses TypeScript's safety
- Can cause runtime errors if assumptions are wrong
- Type narrowing proves to TypeScript the value exists
- More defensive programming

**Rule:** Avoid `!` operator. Use type guards and narrowing instead.

---

## 4. Strict Equality

**❌ Beginner Pattern:**
```typescript
if (request.customCode != undefined) { // Loose equality
  // ...
}
if (count == 0) { /* ... */ }
```

**✅ Professional Pattern:**
```typescript
if (request.customCode !== undefined) { // Strict equality
  // ...
}
if (count === 0) { /* ... */ }
```

**Why it matters:**
- `!=` treats `null` and `undefined` as equal
- `!==` is more explicit and predictable
- TypeScript's strict mode encourages `===`/`!==`
- Shows attention to detail

**Rule:** Always use `===` and `!==`. Never use `==` or `!=`.

---

## 5. DRY Principle (Don't Repeat Yourself)

**❌ Beginner Pattern:**
```typescript
createShortURL(request: CreateURLRequest): CreateURLResponse {
  if (request.customCode != undefined) {
    // 25 lines of metadata creation and response building
    const metadata = {
      longUrl: request.longUrl,
      shortCode: request.customCode,
      createdAt: Date.now(),
      expiresAt: request.ttlSeconds ? Date.now() + request.ttlSeconds * 1000 : null,
      // ...
    };
    this.store.set(request.customCode, metadata);
    return { shortUrl: `${this.BASE_DOMAIN}/${metadata.shortCode}`, /* ... */ };
  }

  // Another 25 lines of nearly identical code for auto-generated
  const shortCode = this.encodeBase62(this.counter++);
  const metadata = {
    longUrl: request.longUrl,
    shortCode: shortCode,
    createdAt: Date.now(),
    expiresAt: request.ttlSeconds ? Date.now() + request.ttlSeconds * 1000 : null,
    // ...
  };
  this.store.set(shortCode, metadata);
  return { shortUrl: `${this.BASE_DOMAIN}/${metadata.shortCode}`, /* ... */ };
}
```

**✅ Professional Pattern:**
```typescript
// Extract helpers for repeated logic
private createMetadata(longUrl: string, shortCode: string, ttlSeconds?: number): URLMetadata {
  return {
    longUrl,
    shortCode,
    createdAt: Date.now(),
    expiresAt: ttlSeconds !== undefined ? Date.now() + ttlSeconds * 1000 : null,
    clickCount: 0,
    customCode: false,
  };
}

private createResponse(metadata: URLMetadata): CreateURLResponse {
  return {
    shortUrl: `${this.BASE_DOMAIN}/${metadata.shortCode}`,
    shortCode: metadata.shortCode,
    expiresAt: metadata.expiresAt,
  };
}

createShortURL(request: CreateURLRequest): CreateURLResponse {
  if (request.customCode !== undefined) {
    const validatedCode = this.validateAndGetCustomCode(request.customCode);
    const metadata = this.createMetadata(request.longUrl, validatedCode, request.ttlSeconds);
    this.store.set(validatedCode, metadata);
    return this.createResponse(metadata);
  }

  const shortCode = this.generateUniqueCode();
  const metadata = this.createMetadata(request.longUrl, shortCode, request.ttlSeconds);
  this.store.set(shortCode, metadata);
  return this.createResponse(metadata);
}
```

**Why it matters:**
- Single source of truth for metadata/response creation
- Easier to maintain - change logic in one place
- Easier to test - can unit test helpers separately
- Shows system design thinking

**Rule:** If you copy-paste code, extract it into a helper function.

---

## 6. Template Literals vs String Concatenation

**❌ Beginner Pattern:**
```typescript
shortUrl: this.BASE_DOMAIN + "/" + metadata.shortCode,
errorMsg: "Error on line " + lineNum + ": " + message,
```

**✅ Professional Pattern:**
```typescript
shortUrl: `${this.BASE_DOMAIN}/${metadata.shortCode}`,
errorMsg: `Error on line ${lineNum}: ${message}`,
```

**Why it matters:**
- More readable, especially with multiple interpolations
- Standard in modern JavaScript/TypeScript
- Easier to include complex expressions
- Shows you're current with ES6+ features

**Rule:** Use backticks `` `${var}` `` for all string interpolation.

---

## 7. Early Returns vs Deep Nesting

**❌ Beginner Pattern:**
```typescript
getLongURL(shortCode: string): string {
  if (this.store.has(shortCode)) {
    let metadata = this.store.get(shortCode)!;
    if (metadata.expiresAt != undefined && metadata.expiresAt < Date.now()) {
      this.store.delete(shortCode);
      throw new Error("Expired");
    }
    metadata.clickCount++;
    return metadata.longUrl;
  } else {
    throw new Error("Url not found");
  }
}
```

**✅ Professional Pattern:**
```typescript
getLongURL(shortCode: string): string {
  const metadata = this.store.get(shortCode);

  if (metadata === undefined) {
    throw new Error("Not found");
  }

  if (this.isExpired(metadata)) {
    this.store.delete(shortCode);
    throw new Error("Expired");
  }

  metadata.clickCount++;
  return metadata.longUrl;
}
```

**Why it matters:**
- Flatter code is easier to read
- Error cases handled upfront
- Happy path is clear at the end
- Reduces cognitive load

**Rule:** Handle error cases early with guard clauses, then handle the happy path.

---

## 8. Custom Error Classes

**❌ Beginner Pattern:**
```typescript
throw new Error("Invalid or used custom code");
throw new Error("Expired");
throw new Error("Url not found");
```

**✅ Professional Pattern:**
```typescript
class InvalidCustomCodeError extends Error {
  constructor(code: string) {
    super(`Invalid custom code: "${code}". Must be 4-10 alphanumeric characters.`);
    this.name = 'InvalidCustomCodeError';
  }
}

class URLExpiredError extends Error {
  constructor(code: string) {
    super(`Short URL "${code}" has expired.`);
    this.name = 'URLExpiredError';
  }
}

throw new InvalidCustomCodeError(code);
throw new URLExpiredError(shortCode);
```

**Why it matters:**
- Type-safe error handling with try/catch
- Can catch specific error types
- Better error messages with context
- Production-ready error handling

**Usage:**
```typescript
try {
  service.getLongURL(code);
} catch (error) {
  if (error instanceof URLExpiredError) {
    return res.status(410).json({ error: 'URL expired' });
  } else if (error instanceof URLNotFoundError) {
    return res.status(404).json({ error: 'URL not found' });
  }
  throw error; // Re-throw unexpected errors
}
```

**Rule:** Create custom error classes for domain-specific errors.

---

## Interview Impact Checklist

### Junior-Level Code Shows:
- ✅ Understands TypeScript basics
- ✅ Can implement business logic correctly
- ✅ Functional code that passes tests

### Senior-Level Code Shows:
- ✅ **Deep type system knowledge** (narrowing, inference)
- ✅ **Writes maintainable code** (DRY, helpers)
- ✅ **Follows industry best practices** (const, strict equality, template literals)
- ✅ **Thinks about error handling** (custom error classes)
- ✅ **Values code readability** (early returns, flat structure)
- ✅ **Production-ready mindset** (immutability, type safety)

---

## Quick Reference: The 8 Rules

1. **Const over let** - Default to `const`, only use `let` when you need to reassign
2. **Trust type inference** - Don't annotate when TypeScript can infer
3. **Avoid `!` operator** - Use type narrowing instead
4. **Strict equality** - Always use `===` and `!==`
5. **Extract helpers** - DRY principle for repeated logic
6. **Template literals** - Use `` `${var}` `` over `"" + var`
7. **Early returns** - Handle errors upfront, happy path at end
8. **Custom errors** - Type-safe error handling for production

---

## Practice Exercise

Try refactoring your code using these patterns:
1. Replace `let` → `const` where variables aren't reassigned
2. Remove unnecessary type annotations (trust inference)
3. Replace `!` with proper type narrowing
4. Replace `!=`/`==` with `!==`/`===`
5. Extract duplicate logic into helper methods
6. Replace string concatenation with template literals
7. Refactor nested if/else to early returns
8. Add custom error classes for domain errors

Compare before/after - you'll see code become more readable and maintainable!

---

## Common Pitfalls

### Pitfall 1: Template Literal Syntax
```typescript
// ❌ Single quotes - won't interpolate!
const url = '${domain}/${code}'; // Literal string

// ✅ Backticks - will interpolate
const url = `${domain}/${code}`; // "example.com/abc123"
```

### Pitfall 2: Const with Objects
```typescript
const user = { name: 'Alice', age: 25 };

// ❌ Cannot reassign reference
user = { name: 'Bob', age: 30 }; // Error!

// ✅ Can mutate properties
user.age = 26; // OK - we're mutating, not reassigning
```

### Pitfall 3: Loose Equality Edge Cases
```typescript
0 == false        // true ❌
'' == false       // true ❌
null == undefined // true ❌
'5' == 5          // true ❌

0 === false        // false ✅
'' === false       // false ✅
null === undefined // false ✅
'5' === 5          // false ✅
```

---

This guide represents industry-standard TypeScript practices used at major tech companies. Master these patterns to write professional, maintainable code! 🚀
