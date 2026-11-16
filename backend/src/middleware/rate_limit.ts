/**
 * Rate Limiting Middleware (S6 & OWASP API3)
 * Standards: OWASP API Security Top 10 (API3: Unrestricted Resource Consumption), HIPAA Security Rule
 * Security Requirements Owned: S6 (Authentication Rate Limiting & DoS Defense)
 * Scope: backend/src/middleware/rate_limit.ts
 */

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  statusCode?: number;
}

export interface RequestLike {
  ip?: string;
  headers?: Record<string, string | string[] | undefined>;
  path?: string;
  method?: string;
  [key: string]: any;
}

export interface ResponseLike {
  statusCode?: number;
  setHeader(name: string, value: string | number): any;
  status(code: number): any;
  json(data: any): any;
  [key: string]: any;
}

export class RateLimiter {
  private windowMs: number;
  private max: number;
  private message?: string;
  private hits: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(options: RateLimitOptions) {
    this.windowMs = options.windowMs;
    this.max = options.max;
    this.message = options.message;
  }

  reset(): void {
    this.hits.clear();
  }

  // Fast-forward simulated clock for bucket (for testing)
  advanceTime(ms: number): void {
    for (const record of this.hits.values()) {
      record.resetTime -= ms;
    }
  }

  middleware() {
    return (req: RequestLike, res: ResponseLike, next: (err?: any) => void) => {
      const now = Date.now();
      const clientIp = req.ip ||
        (req.headers && (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()) ||
        '127.0.0.1';

      let record = this.hits.get(clientIp);

      if (!record || now > record.resetTime) {
        record = { count: 1, resetTime: now + this.windowMs };
        this.hits.set(clientIp, record);
      } else {
        record.count++;
      }

      const remaining = Math.max(0, this.max - record.count);
      const retryAfterSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000));

      res.setHeader('RateLimit-Limit', this.max.toString());
      res.setHeader('RateLimit-Remaining', remaining.toString());
      res.setHeader('RateLimit-Reset', Math.ceil(record.resetTime / 1000).toString());

      if (record.count > this.max) {
        res.setHeader('Retry-After', retryAfterSeconds.toString());
        return res.status(429).json({
          error: 'Too Many Requests',
          code: 'RATE_LIMIT_EXCEEDED',
          message: this.message || 'Too many authentication attempts. Please try again later.',
          retryAfter: retryAfterSeconds
        });
      }

      next();
    };
  }
}

// Pre-configured rate limiters
// S6 Auth Rate Limiter: 5 attempts per 15 minutes per IP
export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts. Please try again later.'
});

// S6 General API Rate Limiter: 100 requests per 15 minutes per IP
export const apiRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'General API rate limit exceeded. Please try again later.'
});
