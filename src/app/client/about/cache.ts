/**
 * Cache management for Client About page
 * Handles caching of about page content, team information, and organization details
 */

import { createCacheManager, CACHE_DURATIONS } from "@/lib/cache-utils";

// Organization information type
export type OrganizationInfo = {
  name: string;
  description: string;
  mission: string;
  vision: string;
  foundedYear: number;
  location: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  contact: {
    email: string;
    phone?: string;
    website?: string;
    socialMedia: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
      youtube?: string;
      github?: string;
    };
  };
  statistics: {
    memberCount: number;
    eventsOrganized: number;
    yearsActive: number;
    projectsCompleted: number;
  };
  logoUrl?: string;
  bannerUrl?: string;
  gallery?: string[];
};

// Core team member type
export type CoreTeamMember = {
  id: string;
  name: string;
  role: string;
  title?: string;
  bio: string;
  imageUrl?: string;
  joinedDate: Date;
  isActive: boolean;
  skills: string[];
  contact: {
    email: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  achievements: string[];
  currentProjects?: string[];
  displayOrder: number;
};

// Achievement/milestone type
export type Achievement = {
  id: string;
  title: string;
  description: string;
  date: Date;
  category: "EVENT" | "MILESTONE" | "AWARD" | "PROJECT" | "PARTNERSHIP";
  imageUrl?: string;
  relatedLinks?: Array<{
    title: string;
    url: string;
  }>;
  participants?: number;
  impact?: string;
};

// Partner/sponsor organization type
export type PartnerOrganization = {
  id: string;
  name: string;
  type: "SPONSOR" | "PARTNER" | "COLLABORATOR" | "SUPPORTER";
  logoUrl?: string;
  website?: string;
  description?: string;
  partnershipStart: Date;
  isActive: boolean;
  level?: "PLATINUM" | "GOLD" | "SILVER" | "BRONZE";
  contributions: string[];
};

// FAQ item type
export type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: "GENERAL" | "MEMBERSHIP" | "EVENTS" | "TECHNICAL" | "COMMUNITY";
  order: number;
  isPublished: boolean;
  lastUpdated: Date;
};

// Cache managers
export const organizationInfoCache = createCacheManager<OrganizationInfo>({
  key: "gdg_about_organization_v2",
  timestampKey: "gdg_about_organization_timestamp_v2",
  duration: CACHE_DURATIONS.LONG, // 15 minutes
});

export const coreTeamCache = createCacheManager<CoreTeamMember[]>({
  key: "gdg_about_core_team_v2",
  timestampKey: "gdg_about_core_team_timestamp_v2",
  duration: CACHE_DURATIONS.LONG, // 15 minutes
});

export const achievementsCache = createCacheManager<Achievement[]>({
  key: "gdg_about_achievements_v2",
  timestampKey: "gdg_about_achievements_timestamp_v2",
  duration: CACHE_DURATIONS.LONG, // 15 minutes
});

export const partnersCache = createCacheManager<PartnerOrganization[]>({
  key: "gdg_about_partners_v2",
  timestampKey: "gdg_about_partners_timestamp_v2",
  duration: CACHE_DURATIONS.LONG, // 15 minutes
});

export const faqCache = createCacheManager<FAQ[]>({
  key: "gdg_about_faq_v2",
  timestampKey: "gdg_about_faq_timestamp_v2",
  duration: CACHE_DURATIONS.LONG, // 15 minutes
});

/**
 * Organization information cache operations
 */
export const organizationManager = {
  /**
   * Get cached organization information
   */
  getOrganizationInfo(): OrganizationInfo | null {
    return organizationInfoCache.get({
      validator: (data): data is OrganizationInfo =>
        typeof data === "object" &&
        data !== null &&
        "name" in data &&
        "description" in data &&
        "mission" in data &&
        "location" in data &&
        "contact" in data,
    });
  },

  /**
   * Set organization information to cache
   */
  setOrganizationInfo(info: OrganizationInfo): void {
    organizationInfoCache.set(info);
  },

  /**
   * Update organization information
   */
  updateOrganizationInfo(
    updater: (current: OrganizationInfo | null) => OrganizationInfo
  ): void {
    organizationInfoCache.update(updater);
  },

  /**
   * Clear organization information cache
   */
  clearOrganizationInfo(): void {
    organizationInfoCache.clear();
  },

  /**
   * Check if organization info cache is valid
   */
  isOrganizationInfoValid(): boolean {
    return organizationInfoCache.isValid();
  },
};

/**
 * Core team cache operations
 */
export const coreTeamManager = {
  /**
   * Get cached core team members
   */
  getTeamMembers(): CoreTeamMember[] | null {
    return coreTeamCache.get({
      fallback: [],
      validator: (data): data is CoreTeamMember[] =>
        Array.isArray(data) &&
        data.every(
          (member) =>
            typeof member === "object" &&
            member !== null &&
            "id" in member &&
            "name" in member &&
            "role" in member &&
            "contact" in member
        ),
    });
  },

  /**
   * Set core team members to cache
   */
  setTeamMembers(members: CoreTeamMember[]): void {
    coreTeamCache.set(members);
  },

  /**
   * Get active team members sorted by display order
   */
  getActiveTeamMembers(): CoreTeamMember[] | null {
    const members = this.getTeamMembers();
    if (!members) return null;

    return members
      .filter((member) => member.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  },

  /**
   * Get team members by role/position
   */
  getTeamMembersByRole(role: string): CoreTeamMember[] | null {
    const members = this.getTeamMembers();
    if (!members) return null;

    return members
      .filter((member) =>
        member.role.toLowerCase().includes(role.toLowerCase())
      )
      .sort((a, b) => a.displayOrder - b.displayOrder);
  },

  /**
   * Get team member by ID
   */
  getTeamMemberById(memberId: string): CoreTeamMember | null {
    const members = this.getTeamMembers();
    if (!members) return null;

    return members.find((member) => member.id === memberId) || null;
  },

  /**
   * Search team members by name or skills
   */
  searchTeamMembers(query: string): CoreTeamMember[] | null {
    const members = this.getTeamMembers();
    if (!members) return null;

    const lowerQuery = query.toLowerCase();
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(lowerQuery) ||
        member.role.toLowerCase().includes(lowerQuery) ||
        member.bio.toLowerCase().includes(lowerQuery) ||
        member.skills.some((skill) => skill.toLowerCase().includes(lowerQuery))
    );
  },

  /**
   * Clear core team cache
   */
  clearTeamMembers(): void {
    coreTeamCache.clear();
  },

  /**
   * Check if team members cache is valid
   */
  isTeamMembersValid(): boolean {
    return coreTeamCache.isValid();
  },
};

/**
 * Achievements cache operations
 */
export const achievementsManager = {
  /**
   * Get cached achievements
   */
  getAchievements(): Achievement[] | null {
    return achievementsCache.get({
      fallback: [],
      validator: (data): data is Achievement[] =>
        Array.isArray(data) &&
        data.every(
          (achievement) =>
            typeof achievement === "object" &&
            achievement !== null &&
            "id" in achievement &&
            "title" in achievement &&
            "date" in achievement &&
            "category" in achievement
        ),
    });
  },

  /**
   * Set achievements to cache
   */
  setAchievements(achievements: Achievement[]): void {
    achievementsCache.set(achievements);
  },

  /**
   * Get achievements by category
   */
  getAchievementsByCategory(
    category: Achievement["category"]
  ): Achievement[] | null {
    const achievements = this.getAchievements();
    if (!achievements) return null;

    return achievements
      .filter((achievement) => achievement.category === category)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  /**
   * Get recent achievements (last 12 months)
   */
  getRecentAchievements(): Achievement[] | null {
    const achievements = this.getAchievements();
    if (!achievements) return null;

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    return achievements
      .filter((achievement) => new Date(achievement.date) >= oneYearAgo)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  /**
   * Get major milestones
   */
  getMajorMilestones(): Achievement[] | null {
    const achievements = this.getAchievements();
    if (!achievements) return null;

    return achievements
      .filter((achievement) => achievement.category === "MILESTONE")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  /**
   * Clear achievements cache
   */
  clearAchievements(): void {
    achievementsCache.clear();
  },

  /**
   * Check if achievements cache is valid
   */
  isAchievementsValid(): boolean {
    return achievementsCache.isValid();
  },
};

/**
 * Partners cache operations
 */
export const partnersManager = {
  /**
   * Get cached partners
   */
  getPartners(): PartnerOrganization[] | null {
    return partnersCache.get({
      fallback: [],
      validator: (data): data is PartnerOrganization[] =>
        Array.isArray(data) &&
        data.every(
          (partner) =>
            typeof partner === "object" &&
            partner !== null &&
            "id" in partner &&
            "name" in partner &&
            "type" in partner
        ),
    });
  },

  /**
   * Set partners to cache
   */
  setPartners(partners: PartnerOrganization[]): void {
    partnersCache.set(partners);
  },

  /**
   * Get active partners
   */
  getActivePartners(): PartnerOrganization[] | null {
    const partners = this.getPartners();
    if (!partners) return null;

    return partners.filter((partner) => partner.isActive);
  },

  /**
   * Get partners by type
   */
  getPartnersByType(
    type: PartnerOrganization["type"]
  ): PartnerOrganization[] | null {
    const partners = this.getActivePartners();
    if (!partners) return null;

    return partners.filter((partner) => partner.type === type);
  },

  /**
   * Get sponsors by level
   */
  getSponsorsByLevel(): Record<string, PartnerOrganization[]> | null {
    const sponsors = this.getPartnersByType("SPONSOR");
    if (!sponsors) return null;

    const groupedSponsors = sponsors.reduce((acc, sponsor) => {
      const level = sponsor.level || "BRONZE";
      if (!acc[level]) acc[level] = [];
      acc[level].push(sponsor);
      return acc;
    }, {} as Record<string, PartnerOrganization[]>);

    return groupedSponsors;
  },

  /**
   * Clear partners cache
   */
  clearPartners(): void {
    partnersCache.clear();
  },

  /**
   * Check if partners cache is valid
   */
  isPartnersValid(): boolean {
    return partnersCache.isValid();
  },
};

/**
 * FAQ cache operations
 */
export const faqManager = {
  /**
   * Get cached FAQ items
   */
  getFAQs(): FAQ[] | null {
    return faqCache.get({
      fallback: [],
      validator: (data): data is FAQ[] =>
        Array.isArray(data) &&
        data.every(
          (faq) =>
            typeof faq === "object" &&
            faq !== null &&
            "id" in faq &&
            "question" in faq &&
            "answer" in faq &&
            "category" in faq
        ),
    });
  },

  /**
   * Set FAQ items to cache
   */
  setFAQs(faqs: FAQ[]): void {
    faqCache.set(faqs);
  },

  /**
   * Get published FAQs sorted by order
   */
  getPublishedFAQs(): FAQ[] | null {
    const faqs = this.getFAQs();
    if (!faqs) return null;

    return faqs
      .filter((faq) => faq.isPublished)
      .sort((a, b) => a.order - b.order);
  },

  /**
   * Get FAQs by category
   */
  getFAQsByCategory(category: FAQ["category"]): FAQ[] | null {
    const faqs = this.getPublishedFAQs();
    if (!faqs) return null;

    return faqs.filter((faq) => faq.category === category);
  },

  /**
   * Search FAQs
   */
  searchFAQs(query: string): FAQ[] | null {
    const faqs = this.getPublishedFAQs();
    if (!faqs) return null;

    const lowerQuery = query.toLowerCase();
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(lowerQuery) ||
        faq.answer.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Clear FAQ cache
   */
  clearFAQs(): void {
    faqCache.clear();
  },

  /**
   * Check if FAQ cache is valid
   */
  isFAQsValid(): boolean {
    return faqCache.isValid();
  },
};

/**
 * Migration utility to move data from old cache keys
 */
export const migrateAboutCache = {
  /**
   * Migrate from old cache format to new format
   */
  migrate(): void {
    if (typeof window === "undefined") return;

    try {
      // Migrate organization info
      const oldOrgKeys = [
        "gdg_about_organization_v1",
        "about_organization_cache",
        "org_info_cache",
      ];

      oldOrgKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const orgInfo = JSON.parse(oldData) as OrganizationInfo;
            organizationManager.setOrganizationInfo(orgInfo);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated organization info cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate organization info cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });

      // Migrate team members
      const oldTeamKeys = [
        "gdg_about_core_team_v1",
        "about_team_cache",
        "core_team_cache",
      ];

      oldTeamKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const teamMembers = JSON.parse(oldData) as CoreTeamMember[];
            coreTeamManager.setTeamMembers(teamMembers);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated team members cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate team members cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });

      // Migrate achievements
      const oldAchievementKeys = [
        "gdg_about_achievements_v1",
        "about_achievements_cache",
        "milestones_cache",
      ];

      oldAchievementKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const achievements = JSON.parse(oldData) as Achievement[];
            achievementsManager.setAchievements(achievements);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated achievements cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate achievements cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });
    } catch (error) {
      console.error("Error migrating about page cache:", error);
    }
  },
};

/**
 * Initialize about page cache (call this when the about page loads)
 */
export function initAboutCache(): void {
  migrateAboutCache.migrate();
}
