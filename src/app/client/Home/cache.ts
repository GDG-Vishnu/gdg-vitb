/**
 * Cache management for Client Home page
 * Handles caching of home page data, featured content, and public information
 */

import { createCacheManager, CACHE_DURATIONS } from "@/lib/cache-utils";

// Featured event type for home page
export type FeaturedEvent = {
  id: string;
  title: string;
  description?: string;
  venue: string;
  date: Date;
  time: string;
  category:
    | "WORKSHOP"
    | "SEMINAR"
    | "MEETUP"
    | "CONFERENCE"
    | "HACKATHON"
    | "OTHER";
  bannerImage?: string;
  registrationCount: number;
  capacity: number;
  isFeatured: boolean;
  tags: string[];
};

// News/announcement type
export type Announcement = {
  id: string;
  title: string;
  content: string;
  type: "NEWS" | "ANNOUNCEMENT" | "UPDATE" | "EVENT";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  isPublished: boolean;
  publishedAt: Date;
  expiresAt?: Date;
  author: {
    name: string;
    role: string;
  };
  tags: string[];
  imageUrl?: string;
};

// Statistics for home page display
export type HomeStats = {
  totalMembers: number;
  upcomingEvents: number;
  completedEvents: number;
  totalProjects: number;
  communityGrowth: {
    monthlyGrowth: number;
    yearlyGrowth: number;
  };
  eventStats: {
    averageAttendance: number;
    totalAttendees: number;
  };
};

// Featured project/showcase type
export type FeaturedProject = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  technologies: string[];
  author: {
    name: string;
    avatar?: string;
  };
  githubUrl?: string;
  liveUrl?: string;
  createdAt: Date;
  likes: number;
  isFeatured: boolean;
};

// Upcoming workshop/session type
export type UpcomingSession = {
  id: string;
  title: string;
  instructor: string;
  date: Date;
  duration: number; // in minutes
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  topics: string[];
  maxParticipants: number;
  currentParticipants: number;
  isRegistrationOpen: boolean;
};

// Cache managers
export const featuredEventsCache = createCacheManager<FeaturedEvent[]>({
  key: "gdg_home_featured_events_v2",
  timestampKey: "gdg_home_featured_events_timestamp_v2",
  duration: CACHE_DURATIONS.MEDIUM, // 5 minutes
});

export const announcementsCache = createCacheManager<Announcement[]>({
  key: "gdg_home_announcements_v2",
  timestampKey: "gdg_home_announcements_timestamp_v2",
  duration: CACHE_DURATIONS.SHORT, // 2 minutes
});

export const homeStatsCache = createCacheManager<HomeStats>({
  key: "gdg_home_stats_v2",
  timestampKey: "gdg_home_stats_timestamp_v2",
  duration: CACHE_DURATIONS.LONG, // 15 minutes
});

export const featuredProjectsCache = createCacheManager<FeaturedProject[]>({
  key: "gdg_home_featured_projects_v2",
  timestampKey: "gdg_home_featured_projects_timestamp_v2",
  duration: CACHE_DURATIONS.LONG, // 15 minutes
});

export const upcomingSessionsCache = createCacheManager<UpcomingSession[]>({
  key: "gdg_home_upcoming_sessions_v2",
  timestampKey: "gdg_home_upcoming_sessions_timestamp_v2",
  duration: CACHE_DURATIONS.MEDIUM, // 5 minutes
});

/**
 * Featured events cache operations
 */
export const featuredEventsManager = {
  /**
   * Get cached featured events
   */
  getEvents(): FeaturedEvent[] | null {
    return featuredEventsCache.get({
      fallback: [],
      validator: (data): data is FeaturedEvent[] =>
        Array.isArray(data) &&
        data.every(
          (event) =>
            typeof event === "object" &&
            event !== null &&
            "id" in event &&
            "title" in event &&
            "isFeatured" in event
        ),
    });
  },

  /**
   * Set featured events to cache
   */
  setEvents(events: FeaturedEvent[]): void {
    featuredEventsCache.set(events);
  },

  /**
   * Get events by category
   */
  getEventsByCategory(
    category: FeaturedEvent["category"]
  ): FeaturedEvent[] | null {
    const events = this.getEvents();
    if (!events) return null;

    return events.filter((event) => event.category === category);
  },

  /**
   * Get upcoming events (next 30 days)
   */
  getUpcomingEvents(): FeaturedEvent[] | null {
    const events = this.getEvents();
    if (!events) return null;

    const now = new Date();
    const thirtyDaysFromNow = new Date(
      now.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    return events
      .filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= thirtyDaysFromNow;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  /**
   * Search featured events
   */
  searchEvents(query: string): FeaturedEvent[] | null {
    const events = this.getEvents();
    if (!events) return null;

    const lowerQuery = query.toLowerCase();
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(lowerQuery) ||
        event.description?.toLowerCase().includes(lowerQuery) ||
        event.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  },

  /**
   * Clear featured events cache
   */
  clearEvents(): void {
    featuredEventsCache.clear();
  },

  /**
   * Check if events cache is valid
   */
  isEventsValid(): boolean {
    return featuredEventsCache.isValid();
  },
};

/**
 * Announcements cache operations
 */
export const announcementsManager = {
  /**
   * Get cached announcements
   */
  getAnnouncements(): Announcement[] | null {
    return announcementsCache.get({
      fallback: [],
      validator: (data): data is Announcement[] =>
        Array.isArray(data) &&
        data.every(
          (announcement) =>
            typeof announcement === "object" &&
            announcement !== null &&
            "id" in announcement &&
            "title" in announcement &&
            "type" in announcement &&
            "isPublished" in announcement
        ),
    });
  },

  /**
   * Set announcements to cache
   */
  setAnnouncements(announcements: Announcement[]): void {
    announcementsCache.set(announcements);
  },

  /**
   * Get active announcements (published and not expired)
   */
  getActiveAnnouncements(): Announcement[] | null {
    const announcements = this.getAnnouncements();
    if (!announcements) return null;

    const now = new Date();
    return announcements
      .filter(
        (announcement) =>
          announcement.isPublished &&
          (!announcement.expiresAt || new Date(announcement.expiresAt) > now)
      )
      .sort((a, b) => {
        // Sort by priority first, then by date
        const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return (
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      });
  },

  /**
   * Get announcements by type
   */
  getAnnouncementsByType(type: Announcement["type"]): Announcement[] | null {
    const announcements = this.getAnnouncements();
    if (!announcements) return null;

    return announcements.filter((announcement) => announcement.type === type);
  },

  /**
   * Get urgent announcements
   */
  getUrgentAnnouncements(): Announcement[] | null {
    const announcements = this.getActiveAnnouncements();
    if (!announcements) return null;

    return announcements.filter(
      (announcement) => announcement.priority === "URGENT"
    );
  },

  /**
   * Clear announcements cache
   */
  clearAnnouncements(): void {
    announcementsCache.clear();
  },

  /**
   * Check if announcements cache is valid
   */
  isAnnouncementsValid(): boolean {
    return announcementsCache.isValid();
  },
};

/**
 * Home statistics cache operations
 */
export const homeStatsManager = {
  /**
   * Get cached home statistics
   */
  getStats(): HomeStats | null {
    return homeStatsCache.get({
      validator: (data): data is HomeStats =>
        typeof data === "object" &&
        data !== null &&
        "totalMembers" in data &&
        "upcomingEvents" in data &&
        "communityGrowth" in data &&
        "eventStats" in data,
    });
  },

  /**
   * Set home statistics to cache
   */
  setStats(stats: HomeStats): void {
    homeStatsCache.set(stats);
  },

  /**
   * Update statistics
   */
  updateStats(updater: (current: HomeStats | null) => HomeStats): void {
    homeStatsCache.update(updater);
  },

  /**
   * Clear statistics cache
   */
  clearStats(): void {
    homeStatsCache.clear();
  },

  /**
   * Check if statistics cache is valid
   */
  isStatsValid(): boolean {
    return homeStatsCache.isValid();
  },
};

/**
 * Featured projects cache operations
 */
export const featuredProjectsManager = {
  /**
   * Get cached featured projects
   */
  getProjects(): FeaturedProject[] | null {
    return featuredProjectsCache.get({
      fallback: [],
      validator: (data): data is FeaturedProject[] =>
        Array.isArray(data) &&
        data.every(
          (project) =>
            typeof project === "object" &&
            project !== null &&
            "id" in project &&
            "title" in project &&
            "author" in project
        ),
    });
  },

  /**
   * Set featured projects to cache
   */
  setProjects(projects: FeaturedProject[]): void {
    featuredProjectsCache.set(projects);
  },

  /**
   * Get projects by technology
   */
  getProjectsByTechnology(technology: string): FeaturedProject[] | null {
    const projects = this.getProjects();
    if (!projects) return null;

    return projects.filter((project) =>
      project.technologies.some((tech) =>
        tech.toLowerCase().includes(technology.toLowerCase())
      )
    );
  },

  /**
   * Get most liked projects
   */
  getMostLikedProjects(limit: number = 5): FeaturedProject[] | null {
    const projects = this.getProjects();
    if (!projects) return null;

    return [...projects].sort((a, b) => b.likes - a.likes).slice(0, limit);
  },

  /**
   * Clear featured projects cache
   */
  clearProjects(): void {
    featuredProjectsCache.clear();
  },

  /**
   * Check if projects cache is valid
   */
  isProjectsValid(): boolean {
    return featuredProjectsCache.isValid();
  },
};

/**
 * Upcoming sessions cache operations
 */
export const upcomingSessionsManager = {
  /**
   * Get cached upcoming sessions
   */
  getSessions(): UpcomingSession[] | null {
    return upcomingSessionsCache.get({
      fallback: [],
      validator: (data): data is UpcomingSession[] =>
        Array.isArray(data) &&
        data.every(
          (session) =>
            typeof session === "object" &&
            session !== null &&
            "id" in session &&
            "title" in session &&
            "instructor" in session
        ),
    });
  },

  /**
   * Set upcoming sessions to cache
   */
  setSessions(sessions: UpcomingSession[]): void {
    upcomingSessionsCache.set(sessions);
  },

  /**
   * Get sessions by level
   */
  getSessionsByLevel(
    level: UpcomingSession["level"]
  ): UpcomingSession[] | null {
    const sessions = this.getSessions();
    if (!sessions) return null;

    return sessions.filter((session) => session.level === level);
  },

  /**
   * Get sessions with open registration
   */
  getOpenRegistrationSessions(): UpcomingSession[] | null {
    const sessions = this.getSessions();
    if (!sessions) return null;

    return sessions.filter(
      (session) =>
        session.isRegistrationOpen &&
        session.currentParticipants < session.maxParticipants
    );
  },

  /**
   * Clear upcoming sessions cache
   */
  clearSessions(): void {
    upcomingSessionsCache.clear();
  },

  /**
   * Check if sessions cache is valid
   */
  isSessionsValid(): boolean {
    return upcomingSessionsCache.isValid();
  },
};

/**
 * Migration utility to move data from old cache keys
 */
export const migrateHomeCache = {
  /**
   * Migrate from old cache format to new format
   */
  migrate(): void {
    if (typeof window === "undefined") return;

    try {
      // Migrate featured events
      const oldEventKeys = [
        "gdg_home_featured_events_v1",
        "home_events_cache",
        "featured_events_cache",
      ];

      oldEventKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const events = JSON.parse(oldData) as FeaturedEvent[];
            featuredEventsManager.setEvents(events);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated home events cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate home events cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });

      // Migrate announcements
      const oldAnnouncementKeys = [
        "gdg_home_announcements_v1",
        "home_announcements_cache",
        "news_cache",
      ];

      oldAnnouncementKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const announcements = JSON.parse(oldData) as Announcement[];
            announcementsManager.setAnnouncements(announcements);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated home announcements cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate home announcements cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });

      // Migrate home stats
      const oldStatsKeys = ["gdg_home_stats_v1", "home_statistics_cache"];

      oldStatsKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const stats = JSON.parse(oldData) as HomeStats;
            homeStatsManager.setStats(stats);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated home stats cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate home stats cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });
    } catch (error) {
      console.error("Error migrating home page cache:", error);
    }
  },
};

/**
 * Initialize home page cache (call this when the home page loads)
 */
export function initHomeCache(): void {
  migrateHomeCache.migrate();
}
