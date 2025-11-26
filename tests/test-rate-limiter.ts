/**
 * Test the Rate Limiter implementation
 * Run with: npx ts-node test-rate-limiter.ts
 * Or compile first: tsc test-rate-limiter.ts && node test-rate-limiter.js
 */

import { RateLimiter, SlidingWindowRateLimiter } from '../data-structures/rate-limiter';

// ============================================================================
// Helper function to wait
// ============================================================================
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================================
// Test 1: Basic Token Bucket
// ============================================================================
async function testBasicRateLimiter() {
  console.log('\n=== Test 1: Basic Token Bucket ===');

  const limiter = new RateLimiter({
    maxTokens: 5,        // 5 requests allowed
    refillRate: 1,       // 1 token per interval
    refillInterval: 1000 // Every 1 second
  });

  const userId = 'user123';

  // Make 5 requests - all should succeed
  console.log('\nMaking 5 requests (should all succeed):');
  for (let i = 1; i <= 5; i++) {
    const result = await limiter.limit(userId);
    console.log(`Request ${i}: ${result.allowed ? '✓ Allowed' : '✗ Denied'} - ${result.remaining} tokens remaining`);
  }

  // 6th request should fail
  console.log('\nMaking 6th request (should fail):');
  const result = await limiter.limit(userId);
  console.log(`Request 6: ${result.allowed ? '✓ Allowed' : '✗ Denied'}`);
  if (!result.allowed) {
    console.log(`  → Retry after ${result.retryAfter} seconds`);
    console.log(`  → Resets at ${result.resetAt.toISOString()}`);
  }

  // Wait for refill
  console.log('\nWaiting 2 seconds for token refill...');
  await sleep(2000);

  // Should have 2 more tokens now
  console.log('After waiting:');
  const status = limiter.getStatus(userId);
  console.log(`  → ${status.remaining} tokens available`);

  // Make 2 more requests
  for (let i = 7; i <= 8; i++) {
    const result = await limiter.limit(userId);
    console.log(`Request ${i}: ${result.allowed ? '✓ Allowed' : '✗ Denied'} - ${result.remaining} tokens remaining`);
  }

  limiter.destroy();
}

// ============================================================================
// Test 2: Multiple Users
// ============================================================================
async function testMultipleUsers() {
  console.log('\n=== Test 2: Multiple Users (Independent Limits) ===');

  const limiter = new RateLimiter({
    maxTokens: 3,
    refillRate: 1,
    refillInterval: 1000
  });

  const users = ['alice', 'bob', 'charlie'];

  for (const user of users) {
    console.log(`\n${user}:`);
    for (let i = 1; i <= 4; i++) {
      const result = await limiter.limit(user);
      console.log(`  Request ${i}: ${result.allowed ? '✓' : '✗'} (${result.remaining} left)`);
    }
  }

  limiter.destroy();
}

// ============================================================================
// Test 3: Burst Traffic Handling
// ============================================================================
async function testBurstTraffic() {
  console.log('\n=== Test 3: Burst Traffic (Allows Bursts, Limits Long-term) ===');

  const limiter = new RateLimiter({
    maxTokens: 10,       // Allow 10 request burst
    refillRate: 2,       // But only 2 per second sustained
    refillInterval: 1000
  });

  const userId = 'burst-user';

  // Initial burst of 10 requests
  console.log('\nBurst of 10 requests:');
  let allowed = 0, denied = 0;
  for (let i = 1; i <= 10; i++) {
    const result = await limiter.limit(userId);
    if (result.allowed) allowed++;
    else denied++;
  }
  console.log(`  ✓ Allowed: ${allowed}, ✗ Denied: ${denied}`);

  // Try 5 more immediately (should all fail)
  console.log('\n5 more requests immediately (should fail):');
  allowed = 0; denied = 0;
  for (let i = 1; i <= 5; i++) {
    const result = await limiter.limit(userId);
    if (result.allowed) allowed++;
    else denied++;
  }
  console.log(`  ✓ Allowed: ${allowed}, ✗ Denied: ${denied}`);

  // Wait 2 seconds (should get 4 more tokens: 2 per second * 2 seconds)
  console.log('\nWaiting 2 seconds...');
  await sleep(2000);

  console.log('Making 5 requests after wait:');
  allowed = 0; denied = 0;
  for (let i = 1; i <= 5; i++) {
    const result = await limiter.limit(userId);
    if (result.allowed) allowed++;
    else denied++;
  }
  console.log(`  ✓ Allowed: ${allowed}, ✗ Denied: ${denied}`);
  console.log('  (Should allow ~4 and deny ~1)');

  limiter.destroy();
}

// ============================================================================
// Test 4: Sliding Window Rate Limiter
// ============================================================================
async function testSlidingWindow() {
  console.log('\n=== Test 4: Sliding Window (100 requests per minute) ===');

  const limiter = new SlidingWindowRateLimiter(
    60000, // 60 second window
    10     // 10 requests per minute (reduced for demo)
  );

  const userId = 'sliding-user';

  // Make 10 requests - should all succeed
  console.log('\nMaking 10 requests:');
  let allowed = 0;
  for (let i = 1; i <= 12; i++) {
    const result = await limiter.limit(userId);
    if (result.allowed) allowed++;
    console.log(`Request ${i}: ${result.allowed ? '✓' : '✗'} (${result.remaining} left)`);
  }

  console.log(`\nTotal allowed: ${allowed}/12`);
}

// ============================================================================
// Test 5: Performance Test
// ============================================================================
async function testPerformance() {
  console.log('\n=== Test 5: Performance (1000 requests) ===');

  const limiter = new RateLimiter({
    maxTokens: 100,
    refillRate: 10,
    refillInterval: 1000
  });

  const startTime = Date.now();
  const promises = [];

  for (let i = 0; i < 1000; i++) {
    promises.push(limiter.limit(`user-${i % 10}`)); // 10 different users
  }

  await Promise.all(promises);
  const duration = Date.now() - startTime;

  console.log(`✓ Completed 1000 requests in ${duration}ms`);
  console.log(`  → ${(1000 / duration * 1000).toFixed(0)} requests/second`);

  limiter.destroy();
}

// ============================================================================
// Run All Tests
// ============================================================================
async function runAllTests() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║        Rate Limiter Implementation Tests          ║');
  console.log('╚════════════════════════════════════════════════════╝');

  try {
    await testBasicRateLimiter();
    await testMultipleUsers();
    await testBurstTraffic();
    await testSlidingWindow();
    await testPerformance();

    console.log('\n✓ All tests completed!\n');
  } catch (error) {
    console.error('\n✗ Test failed:', error);
  } finally {
    // Force exit since intervals might keep process alive
    process.exit(0);
  }
}

// Run if executed directly
if (require.main === module) {
  runAllTests();
}

export { runAllTests };
