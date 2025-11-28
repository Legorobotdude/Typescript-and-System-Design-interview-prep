/**
 * URL Shortener Service
 *
 * System Design: A scalable URL shortening service similar to bit.ly
 *
 * Features:
 * - Generate short URLs using base62 encoding
 * - Custom short URLs with validation
 * - Expiration/TTL support
 * - Click tracking analytics
 * - In-memory storage (simulating a KV store like Redis)
 */


interface URLMetadata {
  longUrl: string;
  shortCode: string;
  createdAt: number;
  expiresAt: number | null;  // null means no expiration
  clickCount: number;
  customCode: boolean;
}

interface CreateURLRequest {
  longUrl: string;
  customCode?: string;  // Optional custom short code
  ttlSeconds?: number;  // Optional expiration time
}

interface CreateURLResponse {
  shortUrl: string;
  shortCode: string;
  expiresAt: number | null;
}

interface AnalyticsResponse {
  shortCode: string;
  longUrl: string;
  clickCount: number;
  createdAt: number;
  expiresAt: number | null;
}

export class URLShortenerService {
  // Simulates KV store (Redis/DynamoDB)
  private store: Map<string, URLMetadata> = new Map();

  // Counter for generating unique IDs (in production, this would be a distributed counter)
  private counter: number = 1000; // Start at 1000 for nicer looking codes

  // Base62 characters: 0-9, a-z, A-Z
  private readonly BASE62_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private readonly BASE_DOMAIN = 'short.ly';

  /**
   * Helper: Encode number to base62 string
   * Example: 1000 -> "G8"
   */
  private encodeBase62(num: number): string {
    if (num === 0) return this.BASE62_CHARS[0];

    let result = '';
    while (num > 0) {
      result = this.BASE62_CHARS[num % 62] + result;
      num = Math.floor(num / 62);
    }
    return result;
  }

  /**
   * Helper: Validate custom short code
   * - Must be 4-10 characters
   * - Only alphanumeric characters allowed
   */
  private isValidCustomCode(code: string): boolean {
    if (code.length < 4 || code.length > 10) return false;
    return /^[a-zA-Z0-9]+$/.test(code);
  }

  /**
   * Helper: Check if URL has expired
   */
  private isExpired(metadata: URLMetadata): boolean {
    if (metadata.expiresAt === null) return false;
    return Date.now() > metadata.expiresAt;
  }

  /**
   * Helper: Clean up expired URLs (would run as background job in production)
   */
  private cleanupExpired(): void {
    for (const [shortCode, metadata] of this.store.entries()) {
      if (this.isExpired(metadata)) {
        this.store.delete(shortCode);
      }
    }
  }

  /**
   * Create a shortened URL
   *
   * TODO(human): Implement this method
   *
   * Steps:
   * 1. Validate the request:
   *    - If customCode provided, validate it with isValidCustomCode()
   *    - Check if custom code already exists in store
   *
   * 2. Generate short code:
   *    - If customCode provided and valid, use it
   *    - Otherwise, generate using base62: encodeBase62(this.counter++)
   *    - Keep incrementing counter if collision detected (defensive coding)
   *
   * 3. Calculate expiration:
   *    - If ttlSeconds provided: expiresAt = Date.now() + (ttlSeconds * 1000)
   *    - Otherwise: expiresAt = null (no expiration)
   *
   * 4. Store metadata in this.store with shortCode as key
   *
   * 5. Return CreateURLResponse with shortUrl, shortCode, expiresAt
   *
   * Error cases:
   * - Throw error if custom code is invalid format
   * - Throw error if custom code already exists
   */
  createShortURL(request: CreateURLRequest): CreateURLResponse {
    // TODO(human): Implement this method
    throw new Error('Not implemented');
  }

  /**
   * Redirect: Get long URL from short code and increment click count
   *
   * TODO(human): Implement this method
   *
   * Steps:
   * 1. Look up shortCode in this.store
   * 2. If not found, throw error "Short URL not found"
   * 3. Check if expired using isExpired() helper
   *    - If expired, delete from store and throw error "Short URL has expired"
   * 4. Increment clickCount in metadata
   * 5. Return the longUrl
   *
   * This simulates the redirect operation. In production:
   * - This would return HTTP 301/302 redirect
   * - Click tracking might be async to reduce latency
   */
  getLongURL(shortCode: string): string {
    // TODO(human): Implement this method
    throw new Error('Not implemented');
  }

  /**
   * Get analytics for a short URL
   *
   * TODO(human): Implement this method
   *
   * Steps:
   * 1. Look up shortCode in this.store
   * 2. If not found, throw error "Short URL not found"
   * 3. Check if expired (optional: you might want to show analytics even for expired URLs)
   * 4. Return AnalyticsResponse with all metadata
   */
  getAnalytics(shortCode: string): AnalyticsResponse {
    // TODO(human): Implement this method
    throw new Error('Not implemented');
  }

  /**
   * Bonus: List all active (non-expired) URLs
   * Useful for admin dashboard
   */
  listActiveURLs(): URLMetadata[] {
    this.cleanupExpired();
    return Array.from(this.store.values());
  }

  /**
   * Bonus: Get total count of stored URLs
   */
  getTotalCount(): number {
    this.cleanupExpired();
    return this.store.size;
  }
}

// ============================================================================
// Example Usage (for testing your implementation)
// ============================================================================

/*
const service = new URLShortenerService();

// Create short URL with auto-generated code
const short1 = service.createShortURL({
  longUrl: 'https://www.example.com/very/long/url/path'
});
console.log('Short URL:', short1.shortUrl);

// Create short URL with custom code
const short2 = service.createShortURL({
  longUrl: 'https://github.com/anthropics/claude',
  customCode: 'claude'
});
console.log('Custom short URL:', short2.shortUrl);

// Create short URL with expiration (1 hour)
const short3 = service.createShortURL({
  longUrl: 'https://www.temporary-link.com',
  ttlSeconds: 3600
});
console.log('Expiring URL:', short3);

// Redirect (get long URL)
const longUrl = service.getLongURL('claude');
console.log('Redirecting to:', longUrl);

// Get analytics
const analytics = service.getAnalytics('claude');
console.log('Analytics:', analytics);
*/
