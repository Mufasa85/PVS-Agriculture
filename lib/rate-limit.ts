/**
 * Limiteur de débit en mémoire (fenêtre fixe), suffisant pour une instance
 * unique. Pour du multi-instance, utiliser un store partagé (Redis…).
 */
type Bucket = { count: number; resetAt: number };

const globalForRateLimit = globalThis as unknown as {
  __rateLimitBuckets?: Map<string, Bucket>;
};

const buckets = (globalForRateLimit.__rateLimitBuckets ??= new Map());

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { success: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, retryAfter: 0 };
  }

  bucket.count += 1;

  if (bucket.count > limit) {
    return {
      success: false,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  return { success: true, retryAfter: 0 };
}
