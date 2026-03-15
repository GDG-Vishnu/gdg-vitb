// Browser-side module cache for the teams list.
// Team data is essentially static for the entire user session —
// no need to re-fetch on every page visit.
// Shared across all client navigations within the same tab.

const TTL_MS = 60 * 60 * 1000; // 1 hour — teams rarely change

let _cache: { data: unknown[]; expiresAt: number } | null = null;
let _inflight: Promise<unknown[]> | null = null;

/**
 * Fetch the team members list, returning the cached copy if still fresh.
 * Concurrent callers share the same in-flight request (request dedup).
 */
export async function fetchTeamList<T = unknown>(): Promise<T[]> {
  // Fresh cache hit — return immediately, no network
  if (_cache && Date.now() < _cache.expiresAt) {
    return _cache.data as T[];
  }

  // Deduplicate concurrent requests
  if (_inflight) {
    return _inflight as Promise<T[]>;
  }

  _inflight = (async () => {
    const res = await fetch("/api/teams/list");
    if (!res.ok) throw new Error("Failed to fetch team members");
    const data = await res.json();
    const list: unknown[] = Array.isArray(data) ? data : [];
    _cache = { data: list, expiresAt: Date.now() + TTL_MS };
    return list;
  })().finally(() => {
    _inflight = null;
  });

  return _inflight as Promise<T[]>;
}
