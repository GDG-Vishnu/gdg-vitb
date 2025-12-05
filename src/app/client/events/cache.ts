/**
 * Cache management for Events page
 * Handles caching of events list and individual event details
 */

import { createCacheManager, CACHE_DURATIONS } from "@/lib/cache-utils";

// Event type definition
export type Event = {
  id: number;
  title: string;
  description: string | null;
  Date: string | null;
  Time: string | null;
  venue: string | null;
  organizer: string | null;
  coOrganizer: string | null;
  keyHighlights: string[] | null;
  tags: string[] | null;
  status: string | null;
  Theme: string[] | null;
  imageUrl?: string | null;
  coverUrl?: string | null;
  rank: number;
  isDone: boolean;
  MembersParticipated: number;
};

// Cache managers
export const eventsListCache = createCacheManager<Event[]>({
  key: "gdg_events_list_v2",
  timestampKey: "gdg_events_list_timestamp_v2",
  duration: CACHE_DURATIONS.MEDIUM, // 5 minutes
});

export const eventDetailCache = createCacheManager<Event>({
  key: "gdg_event_detail_v2",
  timestampKey: "gdg_event_detail_timestamp_v2",
  duration: CACHE_DURATIONS.MEDIUM, // 5 minutes
});

/**
 * Events list cache operations
 */
export const eventsCache = {
  /**
   * Get cached events list
   */
  getList(): Event[] | null {
    return eventsListCache.get({
      fallback: [],
      validator: (data): data is Event[] =>
        Array.isArray(data) &&
        data.every(
          (item) =>
            typeof item === "object" &&
            item !== null &&
            "id" in item &&
            "title" in item
        ),
    });
  },

  /**
   * Set events list to cache
   */
  setList(events: Event[]): void {
    eventsListCache.set(events);
  },

  /**
   * Update events list in cache
   */
  updateList(updater: (current: Event[]) => Event[]): void {
    eventsListCache.update((current) => updater(current || []));
  },

  /**
   * Add or update a single event in the list
   */
  updateEvent(eventId: number, updater: (event: Event) => Event): void {
    eventsListCache.update((current) => {
      if (!current) return current || [];

      return current.map((event) =>
        event.id === eventId ? updater(event) : event
      );
    });
  },

  /**
   * Add new event to the list
   */
  addEvent(newEvent: Event): void {
    eventsListCache.update((current) => {
      if (!current) return [newEvent];

      // Check if event already exists
      const exists = current.some((event) => event.id === newEvent.id);
      if (exists) {
        // Update existing event
        return current.map((event) =>
          event.id === newEvent.id ? newEvent : event
        );
      } else {
        // Add new event
        return [...current, newEvent];
      }
    });
  },

  /**
   * Remove event from the list
   */
  removeEvent(eventId: number): void {
    eventsListCache.update((current) => {
      if (!current) return current || [];

      return current.filter((event) => event.id !== eventId);
    });
  },

  /**
   * Clear events list cache
   */
  clearList(): void {
    eventsListCache.clear();
  },

  /**
   * Check if events list cache is valid
   */
  isListValid(): boolean {
    return eventsListCache.isValid();
  },
};

/**
 * Individual event detail cache operations
 */
export const eventDetailsCache = {
  /**
   * Get cached event detail by ID
   */
  getDetail(eventId: number): Event | null {
    const cacheKey = `gdg_event_${eventId}_v2`;
    const timestampKey = `gdg_event_${eventId}_timestamp_v2`;

    const detailCache = createCacheManager<Event>({
      key: cacheKey,
      timestampKey,
      duration: CACHE_DURATIONS.MEDIUM,
    });

    return detailCache.get({
      validator: (data): data is Event =>
        typeof data === "object" &&
        data !== null &&
        "id" in data &&
        "title" in data &&
        (data as any).id === eventId,
    });
  },

  /**
   * Set event detail to cache
   */
  setDetail(event: Event): void {
    const cacheKey = `gdg_event_${event.id}_v2`;
    const timestampKey = `gdg_event_${event.id}_timestamp_v2`;

    const detailCache = createCacheManager<Event>({
      key: cacheKey,
      timestampKey,
      duration: CACHE_DURATIONS.MEDIUM,
    });

    detailCache.set(event);

    // Also update in events list cache if exists
    eventsCache.updateEvent(event.id, () => event);
  },

  /**
   * Update event detail in cache
   */
  updateDetail(
    eventId: number,
    updater: (event: Event | null) => Event | null
  ): void {
    const cacheKey = `gdg_event_${eventId}_v2`;
    const timestampKey = `gdg_event_${eventId}_timestamp_v2`;

    const detailCache = createCacheManager<Event>({
      key: cacheKey,
      timestampKey,
      duration: CACHE_DURATIONS.MEDIUM,
    });

    const current = detailCache.get();
    const updated = updater(current);

    if (updated) {
      detailCache.set(updated);
      // Also update in events list cache
      eventsCache.updateEvent(eventId, () => updated);
    }
  },

  /**
   * Clear event detail cache
   */
  clearDetail(eventId: number): void {
    const cacheKey = `gdg_event_${eventId}_v2`;
    const timestampKey = `gdg_event_${eventId}_timestamp_v2`;

    const detailCache = createCacheManager<Event>({
      key: cacheKey,
      timestampKey,
      duration: CACHE_DURATIONS.MEDIUM,
    });

    detailCache.clear();
  },

  /**
   * Clear all event detail caches
   */
  clearAllDetails(): void {
    if (typeof window === "undefined") return;

    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (
        key.startsWith("gdg_event_") &&
        key.includes("_v2") &&
        !key.includes("list")
      ) {
        localStorage.removeItem(key);
      }
    });
  },
};

/**
 * Migration utility to move data from old cache keys
 */
export const migrateEventsCache = {
  /**
   * Migrate from old cache format to new format
   */
  migrate(): void {
    if (typeof window === "undefined") return;

    try {
      // Check for old events cache
      const oldEvents = localStorage.getItem("gdg_events_v1");
      const oldTimestamp = localStorage.getItem("gdg_events_timestamp_v1");

      if (oldEvents && oldTimestamp) {
        const events = JSON.parse(oldEvents) as Event[];
        eventsCache.setList(events);

        // Clean up old cache
        localStorage.removeItem("gdg_events_v1");
        localStorage.removeItem("gdg_events_timestamp_v1");

        console.log("Migrated events cache to new format");
      }

      // Migrate individual event caches if they exist
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (
          key.startsWith("gdg_event_") &&
          !key.includes("_v2") &&
          !key.includes("timestamp")
        ) {
          const eventData = localStorage.getItem(key);
          if (eventData) {
            try {
              const event = JSON.parse(eventData) as Event;
              eventDetailsCache.setDetail(event);
              localStorage.removeItem(key);
              // Also remove timestamp if exists
              const timestampKey = `${key}_timestamp`;
              localStorage.removeItem(timestampKey);
            } catch (error) {
              console.warn(`Failed to migrate event cache: ${key}`, error);
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.error("Error migrating events cache:", error);
    }
  },
};

/**
 * Initialize events cache (call this when the events page loads)
 */
export function initEventsCache(): void {
  migrateEventsCache.migrate();
}
