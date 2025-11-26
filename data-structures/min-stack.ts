/**
 * MIN STACK
 *
 * Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.
 *
 * LeetCode #155: Min Stack
 * Difficulty: Medium
 *
 * PROBLEM:
 * Implement MinStack class with these operations:
 * - push(val): Push element val onto the stack
 * - pop(): Remove the element on the top of the stack
 * - top(): Get the top element
 * - getMin(): Retrieve the minimum element in the stack
 *
 * All operations must run in O(1) time complexity.
 *
 * CONSTRAINTS:
 * - -2^31 <= val <= 2^31 - 1
 * - pop, top and getMin will always be called on non-empty stacks
 * - At most 3 * 10^4 calls will be made to push, pop, top, and getMin
 *
 * EXAMPLES:
 *
 * Example 1:
 * Input:
 * ["MinStack","push","push","push","getMin","pop","top","getMin"]
 * [[],[-2],[0],[-3],[],[],[],[]]
 *
 * Output: [null,null,null,null,-3,null,0,-2]
 *
 * Explanation:
 * MinStack minStack = new MinStack();
 * minStack.push(-2);
 * minStack.push(0);
 * minStack.push(-3);
 * minStack.getMin(); // return -3
 * minStack.pop();
 * minStack.top();    // return 0
 * minStack.getMin(); // return -2
 */

/**
 * Approach: Two-Stack Solution
 *
 * Use two stacks:
 * 1. Main stack: stores all elements
 * 2. Min stack: stores minimum values
 *
 * When pushing:
 * - Always push to main stack
 * - Push to min stack if value <= current minimum
 *
 * When popping:
 * - Pop from main stack
 * - If popped value equals current minimum, pop from min stack too
 *
 * Time: O(1) for all operations
 * Space: O(n) where n is number of elements
 */
class MinStack {
  private stack: number[];
  private minStack: number[];

  constructor() {
    this.stack = [];
    this.minStack = [];
  }

  /**
   * Push element onto stack
   * TODO(human): Implement this method
   *
   * Hints:
   * 1. Always push val to main stack
   * 2. For minStack: compare val with current minimum
   * 3. What should you do if minStack is empty?
   * 4. Should you push if val equals current min? (Yes! Handle duplicates)
   */
  push(val: number): void {
    // TODO(human): Implement this method
    throw new Error("Not implemented");
  }

  /**
   * Remove element on top of stack
   * TODO(human): Implement this method
   *
   * Hints:
   * 1. Pop from main stack first
   * 2. Check if popped value is the current minimum
   * 3. If yes, also pop from minStack
   */
  pop(): void {
    // TODO(human): Implement this method
    throw new Error("Not implemented");
  }

  /**
   * Get the top element
   * Helper method - already implemented for you
   */
  top(): number {
    if (this.stack.length === 0) {
      throw new Error("Stack is empty");
    }
    return this.stack[this.stack.length - 1];
  }

  /**
   * Get the minimum element
   * TODO(human): Implement this method
   *
   * Hints:
   * 1. The answer is at the top of minStack
   * 2. What if minStack is empty?
   */
  getMin(): number {
    // TODO(human): Implement this method
    throw new Error("Not implemented");
  }

  /**
   * Helper: Check if stack is empty
   */
  isEmpty(): boolean {
    return this.stack.length === 0;
  }

  /**
   * Helper: Get stack size
   */
  size(): number {
    return this.stack.length;
  }
}

/**
 * ADVANCED VARIATION: Space-Optimized Min Stack
 *
 * Challenge: Can you optimize space by only storing minimum values
 * when they change, along with their frequency?
 *
 * This reduces space from O(n) worst case to O(k) where k is the
 * number of distinct minimums.
 */
interface MinStackEntry {
  value: number;
  count: number;
}

class SpaceOptimizedMinStack {
  private stack: number[];
  private minStack: MinStackEntry[];

  constructor() {
    this.stack = [];
    this.minStack = [];
  }

  /**
   * TODO(human): Implement space-optimized push
   *
   * Strategy:
   * - Push to main stack as before
   * - For minStack: if new min, push {value, count: 1}
   * - If equals current min, increment count
   */
  push(val: number): void {
    // TODO(human): Implement this method
    throw new Error("Not implemented");
  }

  /**
   * TODO(human): Implement space-optimized pop
   *
   * Strategy:
   * - Pop from main stack
   * - If popped equals current min, decrement count
   * - If count becomes 0, pop from minStack
   */
  pop(): void {
    // TODO(human): Implement this method
    throw new Error("Not implemented");
  }

  top(): number {
    if (this.stack.length === 0) {
      throw new Error("Stack is empty");
    }
    return this.stack[this.stack.length - 1];
  }

  /**
   * TODO(human): Implement getMin for space-optimized version
   */
  getMin(): number {
    // TODO(human): Implement this method
    throw new Error("Not implemented");
  }

  isEmpty(): boolean {
    return this.stack.length === 0;
  }

  size(): number {
    return this.stack.length;
  }
}

/**
 * EXPERT VARIATION: Single-Stack Min Stack
 *
 * Ultimate challenge: Can you implement MinStack using only ONE stack?
 *
 * Hint: When pushing a new minimum, store both the value AND the previous
 * minimum in a clever way (perhaps push old min first, then new value).
 * Mark special entries so you know when to pop twice.
 */

// Export for testing
export { MinStack, SpaceOptimizedMinStack };

/**
 * USAGE EXAMPLES
 */
if (require.main === module) {
  console.log("=== MinStack Basic Example ===\n");

  const minStack = new MinStack();

  console.log("Operations:");
  console.log("push(-2)");
  minStack.push(-2);

  console.log("push(0)");
  minStack.push(0);

  console.log("push(-3)");
  minStack.push(-3);

  console.log(`getMin() -> ${minStack.getMin()}`); // -3
  console.log(`top() -> ${minStack.top()}`);       // -3

  console.log("pop()");
  minStack.pop();

  console.log(`top() -> ${minStack.top()}`);       // 0
  console.log(`getMin() -> ${minStack.getMin()}`); // -2

  console.log("\n=== Duplicate Minimums Example ===\n");

  const stack2 = new MinStack();
  console.log("push(1), push(1), push(1)");
  stack2.push(1);
  stack2.push(1);
  stack2.push(1);

  console.log(`getMin() -> ${stack2.getMin()}`); // 1
  console.log("pop()");
  stack2.pop();
  console.log(`getMin() -> ${stack2.getMin()}`); // 1 (still!)
}
