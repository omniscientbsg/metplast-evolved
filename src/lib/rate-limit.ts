// Lightweight in-memory rate limiter for Route Handlers.
//
// NOTE ON SERVERLESS: state lives in each server instance's memory. On
// Vercel that means the limit is enforced per lambda instance, which stops
// single-source floods and abusive loops (the common case), but does not
// give a hard global guarantee across many concurrent instances. For a
// strict global limit, swap `hit()` for a shared store (Upstash Redis via
// @upstash/ratelimit). See docs/SECURITY.md for the upgrade path.

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

/** Fixed-window limiter. Returns whether the call is allowed. */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();

  // Opportunistic sweep so the map can't grow unbounded.
  if (store.size > 5000 && Math.random() < 0.02) {
    for (const [k, b] of store) if (b.resetAt <= now) store.delete(k);
  }

  const bucket = store.get(key);
  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true, remaining: limit - bucket.count, retryAfter: 0 };
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

/** Standard 429 response with a Retry-After header. */
export function tooManyRequests(retryAfter: number): Response {
  return new Response(
    JSON.stringify({ error: 'Too many requests. Please slow down and try again shortly.' }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(Math.max(1, retryAfter)),
      },
    }
  );
}
