// Browser-side module cache for the events list.
// Shared across all client navigations within the same tab session.
// Both /events and /events/ongoing hit the same API endpoint — this ensures
// only ONE network request is ever made within the TTL window no matter how
// many users or pages consume the list.

const TTL_MS = 2 * 60 * 1000; // 2 minutes

let _cache: { data: unknown[]; expiresAt: number } | null = null;
let _inflight: Promise<unknown[]> | null = null;

/**
 * Fetch the events list, returning the cached copy if it's still fresh.
 * Concurrent callers share the same in-flight request (request dedup).
 */
export async function fetchEventList<T = unknown>(): Promise<T[]> {
  // Fresh cache hit — return immediately, no network
  if (_cache && Date.now() < _cache.expiresAt) {
    return _cache.data as T[];
  }

  // Deduplicate concurrent requests (e.g. two components mounting at once)
  if (_inflight) {
    return _inflight as Promise<T[]>;
  }

  _inflight = (async () => {
    const res = await fetch("/api/events/list");
    if (!res.ok) throw new Error("Failed to fetch events");
    const data = await res.json();
    const list: unknown[] = Array.isArray(data) ? data : [];
    _cache = { data: list, expiresAt: Date.now() + TTL_MS };
    return list;
  })().finally(() => {
    _inflight = null;
  });

  return _inflight as Promise<T[]>;
}

/** Call this after a successful registration to force a fresh fetch next time. */
export function invalidateEventListCache(): void {
  _cache = null;
}
