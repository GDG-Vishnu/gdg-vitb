/**
 * Cache management for Admin Events Management page
 * Handles caching of events management data, analytics, and admin-specific operations
 */

import { createCacheManager, CACHE_DURATIONS } from "@/lib/cache-utils";

// Event type with admin-specific fields
export type AdminEvent = {
  id: string;
  title: string;
  description?: string;
  venue: string;
  date: Date;
  time: string;
  duration?: number;
  category:
    | "WORKSHOP"
    | "SEMINAR"
    | "MEETUP"
    | "CONFERENCE"
    | "HACKATHON"
    | "OTHER";
  status: "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";
  capacity: number;
  registrationCount: number;
  isPublic: boolean;
  requiresApproval: boolean;
  registrationDeadline?: Date;
  bannerImage?: string;
  tags: string[];
  organizer: {
    id: string;
    name: string;
    email: string;
  };
  speakers?: EventSpeaker[];
  agenda?: EventAgendaItem[];
  resources?: EventResource[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
};

export type EventSpeaker = {
  id: string;
  name: string;
  title?: string;
  company?: string;
  bio?: string;
  image?: string;
  email?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
};

export type EventAgendaItem = {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  speaker?: string;
  type: "SESSION" | "BREAK" | "LUNCH" | "NETWORKING";
  location?: string;
};

export type EventResource = {
  id: string;
  title: string;
  type: "DOCUMENT" | "LINK" | "VIDEO" | "SLIDE";
  url: string;
  description?: string;
  isPublic: boolean;
};

// Event registration with admin details
export type EventRegistration = {
  id: string;
  eventId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  registeredAt: Date;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "ATTENDED";
  notes?: string;
  checkInTime?: Date;
  feedback?: {
    rating: number;
    comment?: string;
    submittedAt: Date;
  };
};

// Event analytics type
export type EventAnalytics = {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  totalRegistrations: number;
  averageAttendanceRate: number;
  popularCategories: Array<{
    category: AdminEvent["category"];
    count: number;
  }>;
  registrationTrends: Array<{
    date: string;
    registrations: number;
  }>;
  topEvents: Array<{
    eventId: string;
    title: string;
    registrationCount: number;
    attendanceRate: number;
  }>;
};

// Cache managers
export const adminEventsListCache = createCacheManager<AdminEvent[]>({
  key: "gdg_admin_events_manage_v2",
  timestampKey: "gdg_admin_events_manage_timestamp_v2",
  duration: CACHE_DURATIONS.MEDIUM, // 5 minutes
});

export const eventRegistrationsCache = createCacheManager<EventRegistration[]>({
  key: "gdg_admin_event_registrations_v2",
  timestampKey: "gdg_admin_event_registrations_timestamp_v2",
  duration: CACHE_DURATIONS.SHORT, // 2 minutes (registrations change frequently)
});

export const eventAnalyticsCache = createCacheManager<EventAnalytics>({
  key: "gdg_admin_event_analytics_v2",
  timestampKey: "gdg_admin_event_analytics_timestamp_v2",
  duration: CACHE_DURATIONS.LONG, // 15 minutes
});

/**
 * Admin events management cache operations
 */
export const adminEventsManager = {
  /**
   * Get cached admin events
   */
  getEvents(): AdminEvent[] | null {
    return adminEventsListCache.get({
      fallback: [],
      validator: (data): data is AdminEvent[] =>
        Array.isArray(data) &&
        data.every(
          (event) =>
            typeof event === "object" &&
            event !== null &&
            "id" in event &&
            "title" in event &&
            "status" in event &&
            "organizer" in event
        ),
    });
  },

  /**
   * Set admin events to cache
   */
  setEvents(events: AdminEvent[]): void {
    adminEventsListCache.set(events);
  },

  /**
   * Update events in cache
   */
  updateEvents(updater: (current: AdminEvent[]) => AdminEvent[]): void {
    adminEventsListCache.update((current) => updater(current || []));
  },

  /**
   * Update a single event
   */
  updateEvent(
    eventId: string,
    updater: (event: AdminEvent) => AdminEvent
  ): void {
    adminEventsListCache.update((current) => {
      if (!current) return current || [];

      return current.map((event) =>
        event.id === eventId
          ? {
              ...updater(event),
              updatedAt: new Date(),
              lastModifiedBy: "current_user", // This should come from auth context
            }
          : event
      );
    });
  },

  /**
   * Add new event
   */
  addEvent(newEvent: AdminEvent): void {
    adminEventsListCache.update((current) => {
      if (!current) return [newEvent];

      // Check if event already exists
      const exists = current.some((event) => event.id === newEvent.id);
      if (exists) {
        return current.map((event) =>
          event.id === newEvent.id ? newEvent : event
        );
      } else {
        // Add new event (insert at beginning for recent first)
        return [newEvent, ...current];
      }
    });
  },

  /**
   * Remove event
   */
  removeEvent(eventId: string): void {
    adminEventsListCache.update((current) => {
      if (!current) return current || [];

      return current.filter((event) => event.id !== eventId);
    });
  },

  /**
   * Get event by ID
   */
  getEventById(eventId: string): AdminEvent | null {
    const allEvents = this.getEvents();
    if (!allEvents) return null;

    return allEvents.find((event) => event.id === eventId) || null;
  },

  /**
   * Get events by status
   */
  getEventsByStatus(status: AdminEvent["status"]): AdminEvent[] | null {
    const allEvents = this.getEvents();
    if (!allEvents) return null;

    return allEvents.filter((event) => event.status === status);
  },

  /**
   * Get events by category
   */
  getEventsByCategory(category: AdminEvent["category"]): AdminEvent[] | null {
    const allEvents = this.getEvents();
    if (!allEvents) return null;

    return allEvents.filter((event) => event.category === category);
  },

  /**
   * Search events
   */
  searchEvents(query: string): AdminEvent[] | null {
    const allEvents = this.getEvents();
    if (!allEvents) return null;

    const lowerQuery = query.toLowerCase();
    return allEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(lowerQuery) ||
        event.description?.toLowerCase().includes(lowerQuery) ||
        event.venue.toLowerCase().includes(lowerQuery) ||
        event.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  },

  /**
   * Update event status
   */
  updateEventStatus(eventId: string, status: AdminEvent["status"]): void {
    this.updateEvent(eventId, (event) => ({
      ...event,
      status,
    }));
  },

  /**
   * Publish event
   */
  publishEvent(eventId: string): void {
    this.updateEventStatus(eventId, "PUBLISHED");
  },

  /**
   * Cancel event
   */
  cancelEvent(eventId: string): void {
    this.updateEventStatus(eventId, "CANCELLED");
  },

  /**
   * Mark event as completed
   */
  completeEvent(eventId: string): void {
    this.updateEventStatus(eventId, "COMPLETED");
  },

  /**
   * Clear admin events cache
   */
  clearEvents(): void {
    adminEventsListCache.clear();
  },

  /**
   * Check if events cache is valid
   */
  isEventsValid(): boolean {
    return adminEventsListCache.isValid();
  },
};

/**
 * Event registrations cache operations
 */
export const eventRegistrationsManager = {
  /**
   * Get cached event registrations
   */
  getRegistrations(): EventRegistration[] | null {
    return eventRegistrationsCache.get({
      fallback: [],
      validator: (data): data is EventRegistration[] =>
        Array.isArray(data) &&
        data.every(
          (reg) =>
            typeof reg === "object" &&
            reg !== null &&
            "id" in reg &&
            "eventId" in reg &&
            "userId" in reg &&
            "user" in reg
        ),
    });
  },

  /**
   * Set registrations to cache
   */
  setRegistrations(registrations: EventRegistration[]): void {
    eventRegistrationsCache.set(registrations);
  },

  /**
   * Get registrations for specific event
   */
  getRegistrationsByEvent(eventId: string): EventRegistration[] | null {
    const allRegistrations = this.getRegistrations();
    if (!allRegistrations) return null;

    return allRegistrations.filter((reg) => reg.eventId === eventId);
  },

  /**
   * Update registration status
   */
  updateRegistrationStatus(
    registrationId: string,
    status: EventRegistration["status"],
    notes?: string
  ): void {
    eventRegistrationsCache.update((current) => {
      if (!current) return current || [];

      return current.map((reg) =>
        reg.id === registrationId ? { ...reg, status, notes } : reg
      );
    });
  },

  /**
   * Mark attendance
   */
  markAttendance(registrationId: string): void {
    eventRegistrationsCache.update((current) => {
      if (!current) return current || [];

      return current.map((reg) =>
        reg.id === registrationId
          ? {
              ...reg,
              status: "ATTENDED" as const,
              checkInTime: new Date(),
            }
          : reg
      );
    });
  },

  /**
   * Add registration feedback
   */
  addFeedback(registrationId: string, rating: number, comment?: string): void {
    eventRegistrationsCache.update((current) => {
      if (!current) return current || [];

      return current.map((reg) =>
        reg.id === registrationId
          ? {
              ...reg,
              feedback: {
                rating,
                comment,
                submittedAt: new Date(),
              },
            }
          : reg
      );
    });
  },

  /**
   * Clear registrations cache
   */
  clearRegistrations(): void {
    eventRegistrationsCache.clear();
  },

  /**
   * Check if registrations cache is valid
   */
  isRegistrationsValid(): boolean {
    return eventRegistrationsCache.isValid();
  },
};

/**
 * Event analytics cache operations
 */
export const eventAnalyticsManager = {
  /**
   * Get cached event analytics
   */
  getAnalytics(): EventAnalytics | null {
    return eventAnalyticsCache.get({
      validator: (data): data is EventAnalytics =>
        typeof data === "object" &&
        data !== null &&
        "totalEvents" in data &&
        "totalRegistrations" in data &&
        Array.isArray((data as any).popularCategories),
    });
  },

  /**
   * Set analytics to cache
   */
  setAnalytics(analytics: EventAnalytics): void {
    eventAnalyticsCache.set(analytics);
  },

  /**
   * Recalculate analytics from cached data
   */
  recalculateFromCache(): EventAnalytics | null {
    const events = adminEventsManager.getEvents();
    const registrations = eventRegistrationsManager.getRegistrations();

    if (!events || !registrations) return null;

    // Calculate category distribution
    const categoryCounts = events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<AdminEvent["category"], number>);

    const popularCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({
        category: category as AdminEvent["category"],
        count,
      }))
      .sort((a, b) => b.count - a.count);

    // Calculate attendance rates for top events
    const eventRegistrationCounts = registrations.reduce((acc, reg) => {
      if (!acc[reg.eventId]) {
        acc[reg.eventId] = { total: 0, attended: 0 };
      }
      acc[reg.eventId].total++;
      if (reg.status === "ATTENDED") {
        acc[reg.eventId].attended++;
      }
      return acc;
    }, {} as Record<string, { total: number; attended: number }>);

    const topEvents = events
      .map((event) => ({
        eventId: event.id,
        title: event.title,
        registrationCount: eventRegistrationCounts[event.id]?.total || 0,
        attendanceRate: eventRegistrationCounts[event.id]
          ? (eventRegistrationCounts[event.id].attended /
              eventRegistrationCounts[event.id].total) *
            100
          : 0,
      }))
      .sort((a, b) => b.registrationCount - a.registrationCount)
      .slice(0, 10);

    const analytics: EventAnalytics = {
      totalEvents: events.length,
      upcomingEvents: events.filter(
        (e) => e.status === "PUBLISHED" && new Date(e.date) > new Date()
      ).length,
      completedEvents: events.filter((e) => e.status === "COMPLETED").length,
      cancelledEvents: events.filter((e) => e.status === "CANCELLED").length,
      totalRegistrations: registrations.length,
      averageAttendanceRate:
        topEvents.length > 0
          ? topEvents.reduce((sum, e) => sum + e.attendanceRate, 0) /
            topEvents.length
          : 0,
      popularCategories,
      registrationTrends: [], // This would need historical data
      topEvents,
    };

    this.setAnalytics(analytics);
    return analytics;
  },

  /**
   * Clear analytics cache
   */
  clearAnalytics(): void {
    eventAnalyticsCache.clear();
  },

  /**
   * Check if analytics cache is valid
   */
  isAnalyticsValid(): boolean {
    return eventAnalyticsCache.isValid();
  },
};

/**
 * Migration utility to move data from old cache keys
 */
export const migrateEventsManageCache = {
  /**
   * Migrate from old cache format to new format
   */
  migrate(): void {
    if (typeof window === "undefined") return;

    try {
      // Check for old admin events cache
      const oldEventKeys = [
        "gdg_admin_events_manage_v1",
        "admin_events_cache",
        "events_management_cache",
      ];

      oldEventKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const events = JSON.parse(oldData) as AdminEvent[];
            adminEventsManager.setEvents(events);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated admin events cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate admin events cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });

      // Migrate registrations cache
      const oldRegKeys = [
        "gdg_admin_event_registrations_v1",
        "admin_registrations_cache",
        "event_registrations_cache",
      ];

      oldRegKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const registrations = JSON.parse(oldData) as EventRegistration[];
            eventRegistrationsManager.setRegistrations(registrations);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated event registrations cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate event registrations cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });
    } catch (error) {
      console.error("Error migrating events management cache:", error);
    }
  },
};

/**
 * Initialize events management cache (call this when the admin events page loads)
 */
export function initEventsManageCache(): void {
  migrateEventsManageCache.migrate();
}
