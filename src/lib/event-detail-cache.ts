// Browser-side per-event detail cache.
// Event detail data (title, description, gallery, speakers, FAQs, rules) is
// essentially static. The only field that changes is `status`.
// This prevents a network round-trip every time the user opens the same event.

const TTL_MS = 5 * 60 * 1000; // 5 minutes — matches the server-side cache

const _cache = new Map<string, { data: unknown; expiresAt: number }>();
const _inflight = new Map<string, Promise<unknown>>();

/**
 * Fetch a single event by ID, returning the cached copy if still fresh.
 * Concurrent callers for the same ID share the same in-flight request.
 */
export async function fetchEventDetail<T = unknown>(id: string): Promise<T> {
  const cached = _cache.get(id);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data as T;
  }

  const existing = _inflight.get(id);
  if (existing) return existing as Promise<T>;

  const promise = (async () => {
    const res = await fetch(`/api/events/${id}`);
    if (!res.ok) {
      if (res.status === 404) throw new Error("Event not found");
      throw new Error("Failed to fetch event");
    }
    const data = await res.json();
    _cache.set(id, { data, expiresAt: Date.now() + TTL_MS });
    return data;
  })().finally(() => {
    _inflight.delete(id);
  });

  _inflight.set(id, promise);
  return promise as Promise<T>;
}

/** Invalidate a specific event (e.g. after status change or registration). */
export function invalidateEventDetail(id: string): void {
  _cache.delete(id);
}
