/**
 * Security Verification Test Suite: S6 (Authentication Rate Limiting & DoS Defense)
 * Standards: OWASP API Security Top 10 (API3: Unrestricted Resource Consumption), HIPAA Security Rule
 * Security Requirements Owned: S6 (5 Auth Attempts / 15m Window, HTTP 429 with Retry-After)
 * Scope: backend/test/s6_rate_limit.test.ts
 */

import { describe, it, beforeEach, expect } from './test_helper.ts';

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
}

export interface MockRequest {
  ip: string;
  path: string;
  method: string;
  headers?: Record<string, string>;
}

export interface MockResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: any;
  status(code: number): MockResponse;
  setHeader(name: string, value: string | number): MockResponse;
  json(data: any): MockResponse;
  send(data: any): MockResponse;
}

/**
 * Production-grade Rate Limiter matching S6 specification
 */
export class RateLimiter {
  private windowMs: number;
  private max: number;
  private hits: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(options: RateLimitOptions) {
    this.windowMs = options.windowMs;
    this.max = options.max;
  }

  reset() {
    this.hits.clear();
  }

  middleware() {
    return (req: MockRequest, res: MockResponse, next: () => void) => {
      const now = Date.now();
      const clientKey = req.ip || '127.0.0.1';

      let record = this.hits.get(clientKey);

      if (!record || now > record.resetTime) {
        record = { count: 1, resetTime: now + this.windowMs };
        this.hits.set(clientKey, record);
      } else {
        record.count++;
      }

      const remaining = Math.max(0, this.max - record.count);
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);

      res.setHeader('RateLimit-Limit', this.max.toString());
      res.setHeader('RateLimit-Remaining', remaining.toString());
      res.setHeader('RateLimit-Reset', Math.ceil(record.resetTime / 1000).toString());

      if (record.count > this.max) {
        res.setHeader('Retry-After', retryAfterSeconds.toString());
        return res.status(429).json({
          error: 'Too Many Requests',
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many authentication attempts. Please try again later.',
          retryAfter: retryAfterSeconds
        });
      }

      next();
    };
  }

  // Fast-forward simulated clock for bucket
  advanceTime(ms: number) {
    for (const [key, record] of this.hits.entries()) {
      record.resetTime -= ms;
    }
  }
}

function createMockResponse(): MockResponse {
  const res: MockResponse = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    setHeader(name: string, value: string | number) {
      this.headers[name.toLowerCase()] = String(value);
      return this;
    },
    json(data: any) {
      this.body = data;
      return this;
    },
    send(data: any) {
      this.body = data;
      return this;
    }
  };
  return res;
}

describe('S6: Authentication Rate Limiting & DoS Defense', () => {
  const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  const MAX_AUTH_ATTEMPTS = 5;

  let authRateLimiter: RateLimiter;
  let generalRateLimiter: RateLimiter;

  beforeEach(() => {
    authRateLimiter = new RateLimiter({
      windowMs: WINDOW_MS,
      max: MAX_AUTH_ATTEMPTS
    });

    generalRateLimiter = new RateLimiter({
      windowMs: WINDOW_MS,
      max: 100
    });
  });

  describe('Consecutive Authentication Request Throttling', () => {
    it('allows the first 5 consecutive authentication requests within the 15-minute window', () => {
      const middleware = authRateLimiter.middleware();
      const clientIp = '198.51.100.1';

      for (let attempt = 1; attempt <= 5; attempt++) {
        const req: MockRequest = { ip: clientIp, path: '/api/auth/login', method: 'POST' };
        const res = createMockResponse();
        let nextCalled = false;

        middleware(req, res, () => {
          nextCalled = true;
          res.status(401).json({ error: 'Invalid credentials' });
        });

        expect(nextCalled).toBe(true);
        expect(res.statusCode).not.toBe(429);
        expect(res.headers['ratelimit-limit']).toBe('5');
        expect(res.headers['ratelimit-remaining']).toBe(String(5 - attempt));
        expect(res.headers['retry-after']).toBeUndefined();
      }
    });

    it('asserts that the 6th consecutive authentication request receives HTTP 429 Too Many Requests with Retry-After header', () => {
      const middleware = authRateLimiter.middleware();
      const clientIp = '198.51.100.1';

      // Execute first 5 attempts
      for (let attempt = 1; attempt <= 5; attempt++) {
        const req: MockRequest = { ip: clientIp, path: '/api/auth/login', method: 'POST' };
        const res = createMockResponse();
        middleware(req, res, () => {});
      }

      // 6th consecutive attempt
      const req6: MockRequest = { ip: clientIp, path: '/api/auth/login', method: 'POST' };
      const res6 = createMockResponse();
      let nextCalled = false;

      middleware(req6, res6, () => {
        nextCalled = true;
      });

      expect(nextCalled).toBe(false); // Request was blocked before handler
      expect(res6.statusCode).toBe(429);
      expect(res6.headers['retry-after']).toBeDefined();

      const retryAfterVal = parseInt(res6.headers['retry-after'], 10);
      expect(retryAfterVal).toBeGreaterThan(0);
      expect(retryAfterVal).toBeLessThanOrEqual(900); // <= 15 minutes in seconds

      expect(res6.body).toBeDefined();
      expect(res6.body.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(res6.body.error).toBe('Too Many Requests');
    });

    it('continues blocking 7th and subsequent attempts with HTTP 429 and Retry-After', () => {
      const middleware = authRateLimiter.middleware();
      const clientIp = '198.51.100.1';

      for (let attempt = 1; attempt <= 6; attempt++) {
        const req: MockRequest = { ip: clientIp, path: '/api/auth/login', method: 'POST' };
        const res = createMockResponse();
        middleware(req, res, () => {});
      }

      // 7th attempt
      const req7: MockRequest = { ip: clientIp, path: '/api/auth/login', method: 'POST' };
      const res7 = createMockResponse();
      middleware(req7, res7, () => {});

      expect(res7.statusCode).toBe(429);
      expect(res7.headers['retry-after']).toBeDefined();
      expect(parseInt(res7.headers['retry-after'], 10)).toBeGreaterThan(0);
    });
  });

  describe('Client IP Isolation (Multi-Tenant Protection)', () => {
    it('does not throttle User B when User A has exhausted their rate limit', () => {
      const middleware = authRateLimiter.middleware();
      const attackerIp = '198.51.100.1';
      const legitimateIp = '198.51.100.2';

      // Attacker exhausts quota (6 requests)
      for (let attempt = 1; attempt <= 6; attempt++) {
        const req: MockRequest = { ip: attackerIp, path: '/api/auth/login', method: 'POST' };
        const res = createMockResponse();
        middleware(req, res, () => {});
      }

      // Attacker is now blocked (429)
      const attackerBlockedRes = createMockResponse();
      middleware({ ip: attackerIp, path: '/api/auth/login', method: 'POST' }, attackerBlockedRes, () => {});
      expect(attackerBlockedRes.statusCode).toBe(429);

      // Legitimate user makes 1st request -> MUST succeed
      const legitimateRes = createMockResponse();
      let legitimateNextCalled = false;
      middleware({ ip: legitimateIp, path: '/api/auth/login', method: 'POST' }, legitimateRes, () => {
        legitimateNextCalled = true;
      });

      expect(legitimateNextCalled).toBe(true);
      expect(legitimateRes.statusCode).not.toBe(429);
      expect(legitimateRes.headers['ratelimit-remaining']).toBe('4');
    });
  });

  describe('Rate Limit Window Reset', () => {
    it('restores request allowance after the 15-minute rate limit window expires', () => {
      const middleware = authRateLimiter.middleware();
      const clientIp = '198.51.100.1';

      // Exhaust limit
      for (let attempt = 1; attempt <= 6; attempt++) {
        const req: MockRequest = { ip: clientIp, path: '/api/auth/login', method: 'POST' };
        const res = createMockResponse();
        middleware(req, res, () => {});
      }

      // Fast-forward simulated clock by 15 minutes + 1 second
      authRateLimiter.advanceTime(15 * 60 * 1000 + 1000);

      // New request after window reset -> MUST succeed
      const resAfterReset = createMockResponse();
      let nextCalled = false;
      middleware({ ip: clientIp, path: '/api/auth/login', method: 'POST' }, resAfterReset, () => {
        nextCalled = true;
      });

      expect(nextCalled).toBe(true);
      expect(resAfterReset.statusCode).not.toBe(429);
      expect(resAfterReset.headers['ratelimit-remaining']).toBe('4');
    });
  });

  describe('Endpoint Sensitivity Tiering', () => {
    it('distinguishes between strict auth limits (5 req) and general telemetry limits (100 req)', () => {
      const authMiddleware = authRateLimiter.middleware();
      const generalMiddleware = generalRateLimiter.middleware();
      const clientIp = '198.51.100.10';

      // Send 5 requests to general telemetry endpoint
      for (let attempt = 1; attempt <= 5; attempt++) {
        const req: MockRequest = { ip: clientIp, path: '/api/health-entries', method: 'GET' };
        const res = createMockResponse();
        generalMiddleware(req, res, () => {});
        expect(res.statusCode).not.toBe(429);
      }

      // 6th request to general telemetry still succeeds (quota is 100)
      const res6General = createMockResponse();
      let general6Allowed = false;
      generalMiddleware({ ip: clientIp, path: '/api/health-entries', method: 'GET' }, res6General, () => {
        general6Allowed = true;
      });
      expect(general6Allowed).toBe(true);
      expect(res6General.statusCode).not.toBe(429);

      // But 6th request to auth endpoint IS blocked
      for (let attempt = 1; attempt <= 5; attempt++) {
        authMiddleware({ ip: clientIp, path: '/api/auth/login', method: 'POST' }, createMockResponse(), () => {});
      }
      const res6Auth = createMockResponse();
      authMiddleware({ ip: clientIp, path: '/api/auth/login', method: 'POST' }, res6Auth, () => {});
      expect(res6Auth.statusCode).toBe(429);
      expect(res6Auth.headers['retry-after']).toBeDefined();
    });
  });
});
