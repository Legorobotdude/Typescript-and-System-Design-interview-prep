/**
 * URL Shortener Service Tests
 *
 * Comprehensive test suite covering:
 * - Auto-generated short codes
 * - Custom short codes
 * - Expiration/TTL
 * - Click tracking
 * - Error handling
 * - Edge cases
 */

// Test your refactored version
import { URLShortenerService } from '../system-design/url-shortener';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  console.log('🧪 Running URL Shortener Tests\n');

  // Test 1: Basic auto-generated short URL
  console.log('Test 1: Auto-generated short URL');
  const service1 = new URLShortenerService();
  const result1 = service1.createShortURL({
    longUrl: 'https://www.example.com/very/long/url/path'
  });
  assert(result1.shortCode.length > 0, 'Short code should be generated');
  assert(result1.shortUrl.includes('short.ly'), 'Short URL should include domain');
  assert(result1.expiresAt === null, 'Should not expire by default');
  console.log(`  Generated: ${result1.shortUrl}\n`);

  // Test 2: Retrieve URL and verify click tracking
  console.log('Test 2: Redirect and click tracking');
  const longUrl1 = service1.getLongURL(result1.shortCode);
  assert(longUrl1 === 'https://www.example.com/very/long/url/path', 'Should return correct long URL');

  const analytics1 = service1.getAnalytics(result1.shortCode);
  assert(analytics1.clickCount === 1, 'Click count should be 1 after first access');

  service1.getLongURL(result1.shortCode); // Access again
  const analytics2 = service1.getAnalytics(result1.shortCode);
  assert(analytics2.clickCount === 2, 'Click count should increment to 2');
  console.log(`  Click count: ${analytics2.clickCount}\n`);

  // Test 3: Custom short codes
  console.log('Test 3: Custom short codes');
  const service2 = new URLShortenerService();
  const result2 = service2.createShortURL({
    longUrl: 'https://github.com/anthropics/claude',
    customCode: 'claude'
  });
  assert(result2.shortCode === 'claude', 'Should use custom code');
  assert(result2.shortUrl === 'short.ly/claude', 'Should include custom code in URL');

  const longUrl2 = service2.getLongURL('claude');
  assert(longUrl2 === 'https://github.com/anthropics/claude', 'Custom code should redirect correctly');
  console.log(`  Custom URL: ${result2.shortUrl}\n`);

  // Test 4: Invalid custom code (too short)
  console.log('Test 4: Invalid custom code validation');
  const service3 = new URLShortenerService();
  try {
    service3.createShortURL({
      longUrl: 'https://example.com',
      customCode: 'abc' // Only 3 chars, needs 4+
    });
    assert(false, 'Should throw error for invalid custom code');
  } catch (e) {
    assert(true, 'Should reject custom code that is too short');
  }

  // Test 5: Invalid custom code (special characters)
  try {
    service3.createShortURL({
      longUrl: 'https://example.com',
      customCode: 'test@123'
    });
    assert(false, 'Should throw error for special characters');
  } catch (e) {
    assert(true, 'Should reject custom code with special characters');
  }
  console.log();

  // Test 6: Duplicate custom codes
  console.log('Test 6: Duplicate custom code prevention');
  const service4 = new URLShortenerService();
  service4.createShortURL({
    longUrl: 'https://example1.com',
    customCode: 'test123'
  });

  try {
    service4.createShortURL({
      longUrl: 'https://example2.com',
      customCode: 'test123' // Same code
    });
    assert(false, 'Should throw error for duplicate custom code');
  } catch (e) {
    assert(true, 'Should reject duplicate custom codes');
  }
  console.log();

  // Test 7: URL with TTL/expiration
  console.log('Test 7: URL expiration');
  const service5 = new URLShortenerService();
  const result3 = service5.createShortURL({
    longUrl: 'https://temporary-link.com',
    ttlSeconds: 1 // Expires in 1 second
  });

  assert(result3.expiresAt !== null, 'Should have expiration timestamp');
  assert(result3.expiresAt! > Date.now(), 'Expiration should be in future');

  // Should work before expiration
  const longUrl3 = service5.getLongURL(result3.shortCode);
  assert(longUrl3 === 'https://temporary-link.com', 'Should work before expiration');

  // Wait for expiration
  console.log('  Waiting for URL to expire...');
  await sleep(1100); // Wait 1.1 seconds

  try {
    service5.getLongURL(result3.shortCode);
    assert(false, 'Should throw error for expired URL');
  } catch (e) {
    assert(true, 'Should reject expired URL');
  }
  console.log();

  // Test 8: Analytics for expired URL (should still work)
  console.log('Test 8: Analytics for expired URL');
  const service6 = new URLShortenerService();
  const result4 = service6.createShortURL({
    longUrl: 'https://test.com',
    ttlSeconds: 1
  });

  service6.getLongURL(result4.shortCode); // Access once
  await sleep(1100); // Wait for expiration

  // Analytics should still be accessible even after expiration
  // (This is a design choice - some systems allow this for historical data)
  const analytics3 = service6.getAnalytics(result4.shortCode);
  assert(analytics3.clickCount === 1, 'Analytics should show historical click data');
  console.log();

  // Test 9: Non-existent short code
  console.log('Test 9: Non-existent short code handling');
  const service7 = new URLShortenerService();
  try {
    service7.getLongURL('nonexistent');
    assert(false, 'Should throw error for non-existent code');
  } catch (e) {
    assert(true, 'Should reject non-existent short code');
  }

  try {
    service7.getAnalytics('nonexistent');
    assert(false, 'Should throw error for non-existent code analytics');
  } catch (e) {
    assert(true, 'Should reject analytics for non-existent code');
  }
  console.log();

  // Test 10: Multiple URLs and collision handling
  console.log('Test 10: Multiple URLs and uniqueness');
  const service8 = new URLShortenerService();
  const urls: string[] = [];

  for (let i = 0; i < 100; i++) {
    const result = service8.createShortURL({
      longUrl: `https://example.com/page${i}`
    });
    urls.push(result.shortCode);
  }

  // All codes should be unique
  const uniqueCodes = new Set(urls);
  assert(uniqueCodes.size === 100, 'All generated codes should be unique');
  assert(service8.getTotalCount() === 100, 'Total count should be 100');
  console.log(`  Generated 100 unique short codes\n`);

  // Test 11: List active URLs
  console.log('Test 11: List active URLs');
  const service9 = new URLShortenerService();

  // Create 3 URLs: 2 permanent, 1 expiring
  service9.createShortURL({ longUrl: 'https://perm1.com' });
  service9.createShortURL({ longUrl: 'https://perm2.com' });
  service9.createShortURL({
    longUrl: 'https://temp.com',
    ttlSeconds: 1
  });

  assert(service9.getTotalCount() === 3, 'Should have 3 URLs initially');

  await sleep(1100); // Wait for one to expire

  const activeUrls = service9.listActiveURLs();
  assert(activeUrls.length === 2, 'Should have 2 active URLs after cleanup');
  assert(service9.getTotalCount() === 2, 'Total count should be 2 after cleanup');
  console.log();

  // Test 12: Base62 encoding verification
  console.log('Test 12: Base62 encoding pattern');
  const service10 = new URLShortenerService();
  const result5 = service10.createShortURL({
    longUrl: 'https://test.com'
  });

  // Should only contain alphanumeric characters (base62)
  const isBase62 = /^[a-zA-Z0-9]+$/.test(result5.shortCode);
  assert(isBase62, 'Short code should only contain base62 characters');
  console.log(`  Short code format: ${result5.shortCode}\n`);

  console.log('🎉 All tests passed!\n');

  console.log('Summary:');
  console.log('✅ Auto-generated short codes work');
  console.log('✅ Custom short codes validated properly');
  console.log('✅ Click tracking increments correctly');
  console.log('✅ Expiration/TTL enforced');
  console.log('✅ Error handling for invalid inputs');
  console.log('✅ Uniqueness guaranteed across 100+ URLs');
  console.log('✅ Analytics accessible for active URLs');

  process.exit(0);
}

runTests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
