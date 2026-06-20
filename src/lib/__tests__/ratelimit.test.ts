import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDbGet = vi.fn(() => ({ cnt: 0 }));

vi.mock('@/lib/db', () => ({
  default: {
    prepare: vi.fn(() => ({ get: mockDbGet })),
  },
}));

// Import after mocks are established
import { checkRateLimit, getRateLimitStatus, RateLimitError } from '../ratelimit';

describe('ratelimit', () => {
  beforeEach(() => {
    mockDbGet.mockReturnValue({ cnt: 0 });
    process.env['RATE_LIMIT_PER_IP_HOUR'] = '3';
    process.env['RATE_LIMIT_QUEUE_DEPTH'] = '10';
  });

  it('allows first request from new IP', () => {
    expect(() => checkRateLimit('192.168.1.1')).not.toThrow();
  });

  it('throws RateLimitError when queue depth exceeded', () => {
    mockDbGet.mockReturnValue({ cnt: 99 });
    expect(() => checkRateLimit('10.0.0.1')).toThrow(RateLimitError);
  });

  it('RateLimitError has correct name', () => {
    mockDbGet.mockReturnValue({ cnt: 99 });
    let caught: unknown;
    try { checkRateLimit('10.0.0.2'); } catch (e) { caught = e; }
    expect(caught).toBeInstanceOf(RateLimitError);
    expect((caught as RateLimitError).name).toBe('RateLimitError');
  });

  it('getRateLimitStatus returns remaining and resetAt', () => {
    const status = getRateLimitStatus('172.16.0.1');
    expect(typeof status.remaining).toBe('number');
    expect(status.resetAt).toBeGreaterThan(Date.now());
  });

  it('getRateLimitStatus decrements remaining after checkRateLimit', () => {
    const ip = '172.16.0.2';
    const before = getRateLimitStatus(ip).remaining;
    checkRateLimit(ip);
    const after = getRateLimitStatus(ip).remaining;
    expect(after).toBe(before - 1);
  });
});
