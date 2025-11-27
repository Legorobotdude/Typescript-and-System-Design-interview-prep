/**
 * TEST SUITE: MinStack
 *
 * Comprehensive tests for MinStack implementation
 * Tests cover basic operations, edge cases, and LeetCode scenarios
 */

import { MinStack, SpaceOptimizedMinStack } from "../data-structures/min-stack";

// Test counter
let testsPassed = 0;
let testsFailed = 0;

// Helper function for test assertions
function assert(condition: boolean, testName: string, details?: string): void {
  if (condition) {
    testsPassed++;
    console.log(`✅ PASS: ${testName}`);
    if (details) console.log(`   ${details}`);
  } else {
    testsFailed++;
    console.log(`❌ FAIL: ${testName}`);
    if (details) console.log(`   ${details}`);
  }
}

function assertEquals(
  actual: any,
  expected: any,
  testName: string,
  details?: string
): void {
  const passed = actual === expected;
  assert(
    passed,
    testName,
    details || `Expected: ${expected}, Got: ${actual}`
  );
}

console.log("=".repeat(60));
console.log("MIN STACK TEST SUITE");
console.log("=".repeat(60));
console.log();

/**
 * TEST 1: Basic Operations
 * Tests fundamental push, pop, top, getMin operations
 */
console.log("TEST 1: Basic Operations");
console.log("-".repeat(60));
try {
  const stack = new MinStack();

  stack.push(5);
  assertEquals(stack.top(), 5, "Push 5, top should be 5");
  assertEquals(stack.getMin(), 5, "Min should be 5");

  stack.push(3);
  assertEquals(stack.top(), 3, "Push 3, top should be 3");
  assertEquals(stack.getMin(), 3, "Min should be 3");

  stack.push(7);
  assertEquals(stack.top(), 7, "Push 7, top should be 7");
  assertEquals(stack.getMin(), 3, "Min should still be 3");

  stack.pop();
  assertEquals(stack.top(), 3, "After pop, top should be 3");
  assertEquals(stack.getMin(), 3, "Min should still be 3");

  stack.pop();
  assertEquals(stack.top(), 5, "After pop, top should be 5");
  assertEquals(stack.getMin(), 5, "Min should be 5");

  console.log();
} catch (error) {
  testsFailed++;
  console.log(`❌ FAIL: Test 1 threw error: ${error}`);
  console.log();
}

/**
 * TEST 2: LeetCode Example 1
 * Official LeetCode test case from problem description
 */
console.log("TEST 2: LeetCode Example 1");
console.log("-".repeat(60));
try {
  const minStack = new MinStack();

  minStack.push(-2);
  assertEquals(minStack.getMin(), -2, "After push(-2), min should be -2");

  minStack.push(0);
  assertEquals(minStack.getMin(), -2, "After push(0), min should be -2");

  minStack.push(-3);
  assertEquals(minStack.getMin(), -3, "After push(-3), min should be -3");
  assertEquals(minStack.top(), -3, "Top should be -3");

  minStack.pop();
  assertEquals(minStack.top(), 0, "After pop, top should be 0");
  assertEquals(minStack.getMin(), -2, "After pop, min should be -2");

  console.log();
} catch (error) {
  testsFailed++;
  console.log(`❌ FAIL: Test 2 threw error: ${error}`);
  console.log();
}

/**
 * TEST 3: Duplicate Minimums
 * Critical test: ensures duplicates are handled correctly
 */
console.log("TEST 3: Duplicate Minimums");
console.log("-".repeat(60));
try {
  const stack = new MinStack();

  stack.push(1);
  stack.push(1);
  stack.push(1);
  assertEquals(stack.getMin(), 1, "Min should be 1");

  stack.pop();
  assertEquals(stack.getMin(), 1, "After pop, min should still be 1");

  stack.pop();
  assertEquals(stack.getMin(), 1, "After second pop, min should still be 1");

  stack.pop();
  assert(stack.isEmpty(), "Stack should be empty after all pops");

  console.log();
} catch (error) {
  testsFailed++;
  console.log(`❌ FAIL: Test 3 threw error: ${error}`);
  console.log();
}

/**
 * TEST 4: Negative Numbers
 * Tests with all negative numbers
 */
console.log("TEST 4: Negative Numbers");
console.log("-".repeat(60));
try {
  const stack = new MinStack();

  stack.push(-5);
  stack.push(-10);
  stack.push(-3);
  assertEquals(stack.getMin(), -10, "Min should be -10");

  stack.pop();
  assertEquals(stack.getMin(), -10, "Min should still be -10");

  stack.pop();
  assertEquals(stack.getMin(), -5, "Min should be -5");

  console.log();
} catch (error) {
  testsFailed++;
  console.log(`❌ FAIL: Test 4 threw error: ${error}`);
  console.log();
}

/**
 * TEST 5: Descending Order
 * Push in descending order (each new element is min)
 */
console.log("TEST 5: Descending Order");
console.log("-".repeat(60));
try {
  const stack = new MinStack();

  stack.push(10);
  assertEquals(stack.getMin(), 10, "Min should be 10");

  stack.push(8);
  assertEquals(stack.getMin(), 8, "Min should be 8");

  stack.push(5);
  assertEquals(stack.getMin(), 5, "Min should be 5");

  stack.push(2);
  assertEquals(stack.getMin(), 2, "Min should be 2");

  // Pop and verify mins update correctly
  stack.pop();
  assertEquals(stack.getMin(), 5, "After pop, min should be 5");

  stack.pop();
  assertEquals(stack.getMin(), 8, "After pop, min should be 8");

  console.log();
} catch (error) {
  testsFailed++;
  console.log(`❌ FAIL: Test 5 threw error: ${error}`);
  console.log();
}

/**
 * TEST 6: Ascending Order
 * Push in ascending order (first element always min)
 */
console.log("TEST 6: Ascending Order");
console.log("-".repeat(60));
try {
  const stack = new MinStack();

  stack.push(1);
  stack.push(3);
  stack.push(5);
  stack.push(10);

  assertEquals(stack.getMin(), 1, "Min should be 1");

  stack.pop();
  assertEquals(stack.getMin(), 1, "Min should still be 1");

  stack.pop();
  assertEquals(stack.getMin(), 1, "Min should still be 1");

  stack.pop();
  assertEquals(stack.getMin(), 1, "Min should still be 1");

  console.log();
} catch (error) {
  testsFailed++;
  console.log(`❌ FAIL: Test 6 threw error: ${error}`);
  console.log();
}

/**
 * TEST 7: Single Element
 * Edge case with only one element
 */
console.log("TEST 7: Single Element");
console.log("-".repeat(60));
try {
  const stack = new MinStack();

  stack.push(42);
  assertEquals(stack.top(), 42, "Top should be 42");
  assertEquals(stack.getMin(), 42, "Min should be 42");
  assertEquals(stack.size(), 1, "Size should be 1");

  stack.pop();
  assert(stack.isEmpty(), "Stack should be empty after pop");
  assertEquals(stack.size(), 0, "Size should be 0");

  console.log();
} catch (error) {
  testsFailed++;
  console.log(`❌ FAIL: Test 7 threw error: ${error}`);
  console.log();
}

/**
 * TEST 8: Large Numbers (Constraint Testing)
 * Tests with numbers near -2^31 and 2^31 - 1
 */
console.log("TEST 8: Large Numbers");
console.log("-".repeat(60));
try {
  const stack = new MinStack();

  const max = Math.pow(2, 31) - 1;
  const min = -Math.pow(2, 31);

  stack.push(max);
  assertEquals(stack.getMin(), max, `Min should be ${max}`);

  stack.push(0);
  assertEquals(stack.getMin(), 0, "Min should be 0");

  stack.push(min);
  assertEquals(stack.getMin(), min, `Min should be ${min}`);

  stack.pop();
  assertEquals(stack.getMin(), 0, "After pop, min should be 0");

  console.log();
} catch (error) {
  testsFailed++;
  console.log(`❌ FAIL: Test 8 threw error: ${error}`);
  console.log();
}

/**
 * TEST 9: Alternating Min Values
 * Tests min tracking with alternating patterns
 */
console.log("TEST 9: Alternating Min Values");
console.log("-".repeat(60));
try {
  const stack = new MinStack();

  stack.push(5);
  stack.push(1); // new min
  stack.push(10);
  stack.push(0); // new min
  stack.push(20);

  assertEquals(stack.getMin(), 0, "Min should be 0");

  stack.pop(); // remove 20
  assertEquals(stack.getMin(), 0, "Min should still be 0");

  stack.pop(); // remove 0
  assertEquals(stack.getMin(), 1, "Min should now be 1");

  stack.pop(); // remove 10
  assertEquals(stack.getMin(), 1, "Min should still be 1");

  stack.pop(); // remove 1
  assertEquals(stack.getMin(), 5, "Min should now be 5");

  console.log();
} catch (error) {
  testsFailed++;
  console.log(`❌ FAIL: Test 9 threw error: ${error}`);
  console.log();
}

/**
 * TEST 10: Stress Test
 * Tests with many operations
 */
console.log("TEST 10: Stress Test (1000 operations)");
console.log("-".repeat(60));
try {
  const stack = new MinStack();
  let currentMin = Infinity;

  // Push 1000 random values
  const values: number[] = [];
  for (let i = 0; i < 1000; i++) {
    const val = Math.floor(Math.random() * 2000) - 1000; // -1000 to 1000
    values.push(val);
    stack.push(val);
    currentMin = Math.min(currentMin, val);
  }

  assertEquals(
    stack.getMin(),
    currentMin,
    "Min should match tracked minimum"
  );
  assertEquals(stack.size(), 1000, "Size should be 1000");

  // Pop half
  for (let i = 0; i < 500; i++) {
    stack.pop();
  }

  assertEquals(stack.size(), 500, "Size should be 500 after popping half");

  // Recalculate expected min
  const remainingMin = Math.min(...values.slice(0, 500));
  assertEquals(
    stack.getMin(),
    remainingMin,
    "Min should match minimum of remaining values"
  );

  console.log();
} catch (error) {
  testsFailed++;
  console.log(`❌ FAIL: Test 10 threw error: ${error}`);
  console.log();
}

/**
 * TEST SUMMARY
 */
console.log("=".repeat(60));
console.log("TEST SUMMARY");
console.log("=".repeat(60));
console.log(`Total Tests: ${testsPassed + testsFailed}`);
console.log(`✅ Passed: ${testsPassed}`);
console.log(`❌ Failed: ${testsFailed}`);
console.log();

if (testsFailed === 0) {
  console.log("🎉 All tests passed! Your MinStack implementation is correct!");
  console.log();
  console.log("Next Steps:");
  console.log("1. Try implementing SpaceOptimizedMinStack");
  console.log("2. Consider the single-stack variation");
  console.log("3. Analyze time/space complexity of your solution");
} else {
  console.log("Some tests failed. Review the implementation and try again.");
  console.log();
  console.log("Common Issues:");
  console.log("- Are you handling duplicate minimums correctly?");
  console.log("- Are you popping from minStack when appropriate?");
  console.log("- Check edge cases with single elements");
}

// Exit cleanly
process.exit(testsFailed === 0 ? 0 : 1);
