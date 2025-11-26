/**
 * Rate Limiter System Design Implementation
 *
 * This implements a distributed rate limiter using the Token Bucket algorithm.
 * Common interview question that demonstrates:
 * - Algorithm design
 * - Concurrency handling
 * - Time-based logic
 * - System design thinking
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface RateLimitConfig {
  maxTokens: number;      // Maximum tokens in bucket
  refillRate: number;     // Tokens added per second
  refillInterval: number; // Milliseconds between refills
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  retryAfter?: number; // Seconds to wait if denied
}

interface TokenBucket {
  tokens: number;
  lastRefill: number; // Timestamp in milliseconds
}

// ============================================================================
// RATE LIMITER IMPLEMENTATION
// ============================================================================

class RateLimiter {
  private buckets: Map<string, TokenBucket> = new Map();
  private config: RateLimitConfig;
  private cleanupInterval: NodeJS.Timeout;

  constructor(config: RateLimitConfig) {
    this.config = config;

    // Cleanup old buckets every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  /**
   * Check if a request is allowed and consume a token if so
   * TODO(human): Implement the core token bucket algorithm here
   */
  async limit(key: string, tokensRequested: number = 1): Promise<RateLimitResult> {
    // TODO(human): Implement this method
    // 1. Get or create bucket for this key
    // 2. Refill tokens based on time elapsed since last refill
    // 3. Check if enough tokens available
    // 4. If yes: consume tokens and return allowed
    // 5. If no: return denied with retry information

    throw new Error("Not implemented");
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refillTokens(bucket: TokenBucket): void {
    const now = Date.now();
    const timePassed = now - bucket.lastRefill;
    const intervalsElapsed = Math.floor(timePassed / this.config.refillInterval);

    if (intervalsElapsed > 0) {
      const tokensToAdd = intervalsElapsed * this.config.refillRate;
      bucket.tokens = Math.min(
        this.config.maxTokens,
        bucket.tokens + tokensToAdd
      );
      bucket.lastRefill = now;
    }
  }

  /**
   * Get current status without consuming tokens
   */
  getStatus(key: string): RateLimitResult {
    const bucket = this.buckets.get(key);

    if (!bucket) {
      return {
        allowed: true,
        remaining: this.config.maxTokens,
        resetAt: new Date(Date.now() + this.config.refillInterval)
      };
    }

    // Create temporary bucket to check status without mutation
    const tempBucket = { ...bucket };
    this.refillTokens(tempBucket);

    return {
      allowed: tempBucket.tokens >= 1,
      remaining: Math.floor(tempBucket.tokens),
      resetAt: new Date(bucket.lastRefill + this.config.refillInterval)
    };
  }

  /**
   * Reset rate limit for a specific key
   */
  reset(key: string): void {
    this.buckets.delete(key);
  }

  /**
   * Remove buckets that haven't been used in over 5 minutes
   */
  private cleanup(): void {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

    for (const [key, bucket] of this.buckets.entries()) {
      if (bucket.lastRefill < fiveMinutesAgo) {
        this.buckets.delete(key);
      }
    }
  }

  /**
   * Cleanup on shutdown
   */
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.buckets.clear();
  }
}

// ============================================================================
// ADVANCED: SLIDING WINDOW RATE LIMITER
// ============================================================================

interface WindowEntry {
  timestamp: number;
  count: number;
}

/**
 * Sliding Window Log algorithm - more precise but uses more memory
 */
class SlidingWindowRateLimiter {
  private windows: Map<string, WindowEntry[]> = new Map();
  private readonly windowSize: number; // milliseconds
  private readonly maxRequests: number;

  constructor(windowSize: number, maxRequests: number) {
    this.windowSize = windowSize;
    this.maxRequests = maxRequests;
  }

  async limit(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - this.windowSize;

    // Get or create window for this key
    let entries = this.windows.get(key) || [];

    // Remove old entries outside the window
    entries = entries.filter(entry => entry.timestamp > windowStart);

    // Count total requests in window
    const totalRequests = entries.reduce((sum, entry) => sum + entry.count, 0);

    if (totalRequests >= this.maxRequests) {
      const oldestEntry = entries[0];
      const resetAt = new Date(oldestEntry.timestamp + this.windowSize);
      const retryAfter = Math.ceil((oldestEntry.timestamp + this.windowSize - now) / 1000);

      return {
        allowed: false,
        remaining: 0,
        resetAt,
        retryAfter
      };
    }

    // Add new entry
    entries.push({ timestamp: now, count: 1 });
    this.windows.set(key, entries);

    return {
      allowed: true,
      remaining: this.maxRequests - totalRequests - 1,
      resetAt: new Date(now + this.windowSize)
    };
  }
}

// ============================================================================
// DISTRIBUTED RATE LIMITER (Using Redis-like storage)
// ============================================================================

interface RateLimitStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, expiryMs: number): Promise<void>;
  increment(key: string): Promise<number>;
  expire(key: string, expiryMs: number): Promise<void>;
}

/**
 * Distributed rate limiter that can work across multiple servers
 */
class DistributedRateLimiter {
  constructor(
    private store: RateLimitStore,
    private config: RateLimitConfig
  ) {}

  async limit(key: string): Promise<RateLimitResult> {
    const bucketKey = `ratelimit:${key}`;
    const now = Date.now();

    // Get current bucket state
    const data = await this.store.get(bucketKey);
    let bucket: TokenBucket;

    if (data) {
      bucket = JSON.parse(data);
    } else {
      bucket = {
        tokens: this.config.maxTokens,
        lastRefill: now
      };
    }

    // Refill tokens
    const timePassed = now - bucket.lastRefill;
    const intervalsElapsed = Math.floor(timePassed / this.config.refillInterval);

    if (intervalsElapsed > 0) {
      const tokensToAdd = intervalsElapsed * this.config.refillRate;
      bucket.tokens = Math.min(
        this.config.maxTokens,
        bucket.tokens + tokensToAdd
      );
      bucket.lastRefill = now;
    }

    // Check and consume token
    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      await this.store.set(
        bucketKey,
        JSON.stringify(bucket),
        this.config.refillInterval * 2
      );

      return {
        allowed: true,
        remaining: Math.floor(bucket.tokens),
        resetAt: new Date(bucket.lastRefill + this.config.refillInterval)
      };
    }

    const retryAfter = Math.ceil(
      (this.config.refillInterval - timePassed) / 1000
    );

    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(bucket.lastRefill + this.config.refillInterval),
      retryAfter
    };
  }
}

// ============================================================================
// MIDDLEWARE INTEGRATION EXAMPLE
// ============================================================================

type Request = { ip: string; user?: { id: string } };
type Response = { status: (code: number) => Response; json: (data: any) => void };
type NextFunction = () => void;

/**
 * Express-style middleware for rate limiting
 */
function createRateLimitMiddleware(limiter: RateLimiter) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = req.user?.id || req.ip;

    try {
      const result = await limiter.limit(key);

      // Add rate limit headers (standard practice)
      // X-RateLimit-Limit: Maximum requests allowed
      // X-RateLimit-Remaining: Requests remaining
      // X-RateLimit-Reset: When the limit resets

      if (!result.allowed) {
        res.status(429).json({
          error: "Too many requests",
          retryAfter: result.retryAfter,
          resetAt: result.resetAt
        });
        return;
      }

      next();
    } catch (error) {
      // On error, allow the request (fail open)
      console.error("Rate limiter error:", error);
      next();
    }
  };
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

// Example 1: Basic usage
const limiter = new RateLimiter({
  maxTokens: 10,        // 10 requests
  refillRate: 1,        // 1 token per interval
  refillInterval: 1000  // Every 1 second
});

// Example 2: Different limits for different users
const apiLimiter = new RateLimiter({
  maxTokens: 100,
  refillRate: 10,
  refillInterval: 1000
});

const freeTierLimiter = new RateLimiter({
  maxTokens: 10,
  refillRate: 1,
  refillInterval: 1000
});

// Example 3: Sliding window for more precise control
const slidingLimiter = new SlidingWindowRateLimiter(
  60000,  // 1 minute window
  100     // 100 requests per minute
);

export {
  RateLimiter,
  SlidingWindowRateLimiter,
  DistributedRateLimiter,
  createRateLimitMiddleware,
  type RateLimitConfig,
  type RateLimitResult
};
