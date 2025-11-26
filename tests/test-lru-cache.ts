/**
 * Test the LRU Cache implementation
 * Run with: pnpm test:lru
 */

import { LRUCache, LRUCacheWithTTL, LFUCache } from '../data-structures/lru-cache';

// ============================================================================
// Test 1: Basic Operations
// ============================================================================
function testBasicOperations() {
  console.log('\n=== Test 1: Basic Get/Put Operations ===');

  const cache = new LRUCache<number, string>(3);

  // Add items
  cache.put(1, 'one');
  cache.put(2, 'two');
  cache.put(3, 'three');

  console.log('Added: 1→one, 2→two, 3→three');
  cache.debug();

  // Get item (should exist)
  const val1 = cache.get(1);
  console.log(`\nGet key 1: ${val1} (expected: "one")`);
  console.log('After get(1), key 1 should be most recent:');
  cache.debug();

  // Get non-existent
  const val99 = cache.get(99);
  console.log(`\nGet key 99: ${val99} (expected: undefined)`);

  console.log(val1 === 'one' && val99 === undefined ? '✓ PASSED' : '✗ FAILED');
}

// ============================================================================
// Test 2: LRU Eviction
// ============================================================================
function testEviction() {
  console.log('\n=== Test 2: LRU Eviction (Capacity 3) ===');

  const cache = new LRUCache<number, string>(3);

  cache.put(1, 'one');
  cache.put(2, 'two');
  cache.put(3, 'three');

  console.log('Initial state (capacity 3):');
  cache.debug();

  // Add 4th item - should evict key 1 (least recently used)
  console.log('\nAdding key 4 (should evict key 1):');
  cache.put(4, 'four');
  cache.debug();

  const has1 = cache.has(1);
  const has4 = cache.has(4);

  console.log(`\nHas key 1: ${has1} (expected: false)`);
  console.log(`Has key 4: ${has4} (expected: true)`);

  console.log(!has1 && has4 ? '✓ PASSED' : '✗ FAILED');
}

// ============================================================================
// Test 3: Access Pattern Updates LRU Order
// ============================================================================
function testAccessPattern() {
  console.log('\n=== Test 3: Access Pattern Updates Order ===');

  const cache = new LRUCache<number, string>(3);

  cache.put(1, 'one');
  cache.put(2, 'two');
  cache.put(3, 'three');

  console.log('Initial state:');
  cache.debug();

  // Access key 1 (moves to front)
  console.log('\nAccess key 1 (moves to front):');
  cache.get(1);
  cache.debug();

  // Add key 4 - should evict key 2 (now least recently used)
  console.log('\nAdd key 4 (should evict key 2, not key 1):');
  cache.put(4, 'four');
  cache.debug();

  const has1 = cache.has(1);
  const has2 = cache.has(2);
  const has4 = cache.has(4);

  console.log(`\nHas key 1: ${has1} (expected: true - was accessed)`);
  console.log(`Has key 2: ${has2} (expected: false - was evicted)`);
  console.log(`Has key 4: ${has4} (expected: true - just added)`);

  console.log(has1 && !has2 && has4 ? '✓ PASSED' : '✗ FAILED');
}

// ============================================================================
// Test 4: Update Existing Key
// ============================================================================
function testUpdate() {
  console.log('\n=== Test 4: Update Existing Key ===');

  const cache = new LRUCache<number, string>(3);

  cache.put(1, 'one');
  cache.put(2, 'two');
  cache.put(3, 'three');

  console.log('Initial state:');
  cache.debug();

  // Update key 2
  console.log('\nUpdate key 2 to "TWO":');
  cache.put(2, 'TWO');
  cache.debug();

  const val2 = cache.get(2);
  const size = cache.size;

  console.log(`\nValue of key 2: ${val2} (expected: "TWO")`);
  console.log(`Cache size: ${size} (expected: 3 - no eviction)`);

  console.log(val2 === 'TWO' && size === 3 ? '✓ PASSED' : '✗ FAILED');
}

// ============================================================================
// Test 5: LeetCode Example Test Case
// ============================================================================
function testLeetCodeExample() {
  console.log('\n=== Test 5: LeetCode Official Test Case ===');

  const cache = new LRUCache<number, number>(2);
  const results: (number | undefined)[] = [];

  cache.put(1, 1);
  cache.put(2, 2);
  results.push(cache.get(1));       // returns 1
  cache.put(3, 3);                  // evicts key 2
  results.push(cache.get(2));       // returns undefined (not found)
  cache.put(4, 4);                  // evicts key 1
  results.push(cache.get(1));       // returns undefined (not found)
  results.push(cache.get(3));       // returns 3
  results.push(cache.get(4));       // returns 4

  console.log('Operations: put(1,1), put(2,2), get(1), put(3,3), get(2), put(4,4), get(1), get(3), get(4)');
  console.log(`Results: ${results.join(', ')}`);
  console.log('Expected: 1, undefined, undefined, 3, 4');

  const passed =
    results[0] === 1 &&
    results[1] === undefined &&
    results[2] === undefined &&
    results[3] === 3 &&
    results[4] === 4;

  console.log(passed ? '✓ PASSED' : '✗ FAILED');

  return passed;
}

// ============================================================================
// Test 6: Order Verification
// ============================================================================
function testOrderVerification() {
  console.log('\n=== Test 6: Order Verification ===');

  const cache = new LRUCache<string, number>(4);

  cache.put('a', 1);
  cache.put('b', 2);
  cache.put('c', 3);
  cache.put('d', 4);

  console.log('Initial order:');
  console.log(`Keys: ${cache.keys().join(' -> ')}`);
  console.log('Expected: d -> c -> b -> a');

  // Access 'b' (moves to front)
  cache.get('b');
  console.log('\nAfter get("b"):');
  console.log(`Keys: ${cache.keys().join(' -> ')}`);
  console.log('Expected: b -> d -> c -> a');

  // Add 'e' (evicts 'a')
  cache.put('e', 5);
  console.log('\nAfter put("e", 5):');
  console.log(`Keys: ${cache.keys().join(' -> ')}`);
  console.log('Expected: e -> b -> d -> c');

  const keys = cache.keys();
  const passed =
    keys[0] === 'e' &&
    keys[1] === 'b' &&
    keys[2] === 'd' &&
    keys[3] === 'c';

  console.log(passed ? '✓ PASSED' : '✗ FAILED');

  return passed;
}

// ============================================================================
// Test 7: Edge Cases
// ============================================================================
function testEdgeCases() {
  console.log('\n=== Test 7: Edge Cases ===');

  // Capacity 1
  console.log('\nCapacity 1:');
  const cache1 = new LRUCache<number, string>(1);
  cache1.put(1, 'one');
  cache1.put(2, 'two'); // Should evict 1
  console.log(`Has key 1: ${cache1.has(1)} (expected: false)`);
  console.log(`Has key 2: ${cache1.has(2)} (expected: true)`);

  // Clear cache
  console.log('\nClear cache:');
  const cache2 = new LRUCache<number, string>(3);
  cache2.put(1, 'one');
  cache2.put(2, 'two');
  console.log(`Size before clear: ${cache2.size}`);
  cache2.clear();
  console.log(`Size after clear: ${cache2.size} (expected: 0)`);

  const passed =
    !cache1.has(1) &&
    cache1.has(2) &&
    cache2.size === 0;

  console.log(passed ? '✓ PASSED' : '✗ FAILED');

  return passed;
}

// ============================================================================
// Test 8: Performance Test
// ============================================================================
function testPerformance() {
  console.log('\n=== Test 8: Performance (10,000 operations) ===');

  const cache = new LRUCache<number, number>(1000);
  const start = Date.now();

  // 10,000 operations
  for (let i = 0; i < 10000; i++) {
    if (i % 2 === 0) {
      cache.put(i, i * 10);
    } else {
      cache.get(i - 1);
    }
  }

  const duration = Date.now() - start;
  const opsPerMs = 10000 / duration;

  console.log(`Completed 10,000 operations in ${duration}ms`);
  console.log(`Performance: ${opsPerMs.toFixed(0)} ops/ms`);
  console.log(`Final size: ${cache.size} (expected: 1000)`);

  console.log(cache.size === 1000 ? '✓ PASSED' : '✗ FAILED');
}

// ============================================================================
// Test 9: LRU with TTL
// ============================================================================
function testLRUWithTTL() {
  console.log('\n=== Test 9: LRU Cache with TTL ===');

  const cache = new LRUCacheWithTTL<string, number>(3, 100); // 100ms TTL

  cache.put('a', 1);
  console.log(`Immediate get: ${cache.get('a')} (expected: 1)`);

  setTimeout(() => {
    console.log(`After 150ms: ${cache.get('a')} (expected: undefined - expired)`);
  }, 150);

  console.log('(TTL test runs async - check output above)');
}

// ============================================================================
// Run All Tests
// ============================================================================
function runAllTests() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║           LRU Cache Implementation Tests          ║');
  console.log('╚════════════════════════════════════════════════════╝');

  let passed = 0;
  let total = 0;

  try {
    testBasicOperations(); total++;
    testEviction(); total++;
    testAccessPattern(); total++;
    testUpdate(); total++;

    if (testLeetCodeExample()) passed++; total++;
    if (testOrderVerification()) passed++; total++;
    if (testEdgeCases()) passed++; total++;

    testPerformance(); total++;
    testLRUWithTTL();

    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log(`║  Tests Passed: ${passed}/${total}${' '.repeat(38 - passed.toString().length - total.toString().length)}║`);
    console.log('╚════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('\n✗ Test failed with error:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run if executed directly
if (require.main === module) {
  runAllTests();
}

export { runAllTests };
