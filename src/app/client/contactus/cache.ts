/**
 * Cache management for Client Contact Us page
 * Handles caching of contact information, contact forms, and inquiry data
 */

import { createCacheManager, CACHE_DURATIONS } from "@/lib/cache-utils";

// Contact information type
export type ContactInfo = {
  organization: {
    name: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  email: {
    general: string;
    support?: string;
    partnerships?: string;
    events?: string;
    media?: string;
  };
  phone: {
    primary?: string;
    secondary?: string;
    whatsapp?: string;
  };
  socialMedia: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    github?: string;
    discord?: string;
    telegram?: string;
  };
  officeHours: {
    weekdays?: string;
    weekends?: string;
    timezone: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    email: string;
  };
};

// Contact form submission type
export type ContactFormSubmission = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category:
    | "GENERAL"
    | "SUPPORT"
    | "PARTNERSHIP"
    | "EVENT"
    | "MEMBERSHIP"
    | "FEEDBACK"
    | "OTHER";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  submittedAt: Date;
  lastUpdated: Date;
  assignedTo?: string;
  response?: {
    message: string;
    respondedBy: string;
    respondedAt: Date;
  };
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
  isRead: boolean;
  tags: string[];
};

// FAQ for contact page
export type ContactFAQ = {
  id: string;
  question: string;
  answer: string;
  category: "GENERAL" | "TECHNICAL" | "MEMBERSHIP" | "EVENTS" | "PARTNERSHIPS";
  isPopular: boolean;
  order: number;
  lastUpdated: Date;
};

// Contact method type
export type ContactMethod = {
  id: string;
  type: "EMAIL" | "PHONE" | "CHAT" | "FORM" | "SOCIAL" | "VISIT";
  title: string;
  description: string;
  value: string; // email address, phone number, etc.
  icon?: string;
  isPreferred: boolean;
  isAvailable: boolean;
  responseTime?: string; // "within 24 hours", "immediate", etc.
  availabilityHours?: string;
};

// Office/meeting location type
export type MeetingLocation = {
  id: string;
  name: string;
  type: "OFFICE" | "COWORKING" | "UNIVERSITY" | "CAFE" | "ONLINE";
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  amenities: string[];
  capacity?: number;
  isPublic: boolean;
  contactPerson?: {
    name: string;
    role: string;
    email: string;
    phone?: string;
  };
  availabilityHours: {
    weekdays?: string;
    weekends?: string;
    timezone: string;
  };
  directions?: string;
  parkingInfo?: string;
  imageUrls?: string[];
};

// Cache managers
export const contactInfoCache = createCacheManager<ContactInfo>({
  key: "gdg_contact_info_v2",
  timestampKey: "gdg_contact_info_timestamp_v2",
  duration: CACHE_DURATIONS.EXTRA_LONG, // 30 minutes (contact info changes rarely)
});

export const contactFormSubmissionsCache = createCacheManager<
  ContactFormSubmission[]
>({
  key: "gdg_contact_submissions_v2",
  timestampKey: "gdg_contact_submissions_timestamp_v2",
  duration: CACHE_DURATIONS.SHORT, // 2 minutes (for user's own submissions)
});

export const contactFAQCache = createCacheManager<ContactFAQ[]>({
  key: "gdg_contact_faq_v2",
  timestampKey: "gdg_contact_faq_timestamp_v2",
  duration: CACHE_DURATIONS.LONG, // 15 minutes
});

export const contactMethodsCache = createCacheManager<ContactMethod[]>({
  key: "gdg_contact_methods_v2",
  timestampKey: "gdg_contact_methods_timestamp_v2",
  duration: CACHE_DURATIONS.LONG, // 15 minutes
});

export const meetingLocationsCache = createCacheManager<MeetingLocation[]>({
  key: "gdg_meeting_locations_v2",
  timestampKey: "gdg_meeting_locations_timestamp_v2",
  duration: CACHE_DURATIONS.LONG, // 15 minutes
});

/**
 * Contact information cache operations
 */
export const contactInfoManager = {
  /**
   * Get cached contact information
   */
  getContactInfo(): ContactInfo | null {
    return contactInfoCache.get({
      validator: (data): data is ContactInfo =>
        typeof data === "object" &&
        data !== null &&
        "organization" in data &&
        "email" in data &&
        "socialMedia" in data &&
        "officeHours" in data,
    });
  },

  /**
   * Set contact information to cache
   */
  setContactInfo(info: ContactInfo): void {
    contactInfoCache.set(info);
  },

  /**
   * Update contact information
   */
  updateContactInfo(
    updater: (current: ContactInfo | null) => ContactInfo
  ): void {
    contactInfoCache.update(updater);
  },

  /**
   * Get primary email
   */
  getPrimaryEmail(): string | null {
    const contactInfo = this.getContactInfo();
    return contactInfo?.email.general || null;
  },

  /**
   * Get email by type
   */
  getEmailByType(type: keyof ContactInfo["email"]): string | null {
    const contactInfo = this.getContactInfo();
    return contactInfo?.email[type] || null;
  },

  /**
   * Get social media links
   */
  getSocialMediaLinks(): ContactInfo["socialMedia"] | null {
    const contactInfo = this.getContactInfo();
    return contactInfo?.socialMedia || null;
  },

  /**
   * Clear contact information cache
   */
  clearContactInfo(): void {
    contactInfoCache.clear();
  },

  /**
   * Check if contact info cache is valid
   */
  isContactInfoValid(): boolean {
    return contactInfoCache.isValid();
  },
};

/**
 * Contact form submissions cache operations
 */
export const contactSubmissionsManager = {
  /**
   * Get cached contact form submissions (user's own)
   */
  getSubmissions(): ContactFormSubmission[] | null {
    return contactFormSubmissionsCache.get({
      fallback: [],
      validator: (data): data is ContactFormSubmission[] =>
        Array.isArray(data) &&
        data.every(
          (submission) =>
            typeof submission === "object" &&
            submission !== null &&
            "id" in submission &&
            "name" in submission &&
            "email" in submission &&
            "subject" in submission
        ),
    });
  },

  /**
   * Set contact submissions to cache
   */
  setSubmissions(submissions: ContactFormSubmission[]): void {
    contactFormSubmissionsCache.set(submissions);
  },

  /**
   * Add new contact submission
   */
  addSubmission(newSubmission: ContactFormSubmission): void {
    contactFormSubmissionsCache.update((current) => {
      if (!current) return [newSubmission];

      // Insert at beginning for most recent first
      return [newSubmission, ...current];
    });
  },

  /**
   * Update submission status
   */
  updateSubmissionStatus(
    submissionId: string,
    status: ContactFormSubmission["status"]
  ): void {
    contactFormSubmissionsCache.update((current) => {
      if (!current) return current || [];

      return current.map((submission) =>
        submission.id === submissionId
          ? { ...submission, status, lastUpdated: new Date() }
          : submission
      );
    });
  },

  /**
   * Mark submission as read
   */
  markAsRead(submissionId: string): void {
    contactFormSubmissionsCache.update((current) => {
      if (!current) return current || [];

      return current.map((submission) =>
        submission.id === submissionId
          ? { ...submission, isRead: true }
          : submission
      );
    });
  },

  /**
   * Add response to submission
   */
  addResponse(
    submissionId: string,
    response: ContactFormSubmission["response"]
  ): void {
    contactFormSubmissionsCache.update((current) => {
      if (!current) return current || [];

      return current.map((submission) =>
        submission.id === submissionId
          ? {
              ...submission,
              response,
              status: "RESOLVED" as const,
              lastUpdated: new Date(),
            }
          : submission
      );
    });
  },

  /**
   * Get submissions by category
   */
  getSubmissionsByCategory(
    category: ContactFormSubmission["category"]
  ): ContactFormSubmission[] | null {
    const submissions = this.getSubmissions();
    if (!submissions) return null;

    return submissions.filter((submission) => submission.category === category);
  },

  /**
   * Get submissions by status
   */
  getSubmissionsByStatus(
    status: ContactFormSubmission["status"]
  ): ContactFormSubmission[] | null {
    const submissions = this.getSubmissions();
    if (!submissions) return null;

    return submissions.filter((submission) => submission.status === status);
  },

  /**
   * Get pending submissions
   */
  getPendingSubmissions(): ContactFormSubmission[] | null {
    return this.getSubmissionsByStatus("PENDING");
  },

  /**
   * Clear contact submissions cache
   */
  clearSubmissions(): void {
    contactFormSubmissionsCache.clear();
  },

  /**
   * Check if submissions cache is valid
   */
  isSubmissionsValid(): boolean {
    return contactFormSubmissionsCache.isValid();
  },
};

/**
 * Contact FAQ cache operations
 */
export const contactFAQManager = {
  /**
   * Get cached contact FAQ items
   */
  getFAQs(): ContactFAQ[] | null {
    return contactFAQCache.get({
      fallback: [],
      validator: (data): data is ContactFAQ[] =>
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
   * Set contact FAQ items to cache
   */
  setFAQs(faqs: ContactFAQ[]): void {
    contactFAQCache.set(faqs);
  },

  /**
   * Get FAQs sorted by order
   */
  getSortedFAQs(): ContactFAQ[] | null {
    const faqs = this.getFAQs();
    if (!faqs) return null;

    return faqs.sort((a, b) => a.order - b.order);
  },

  /**
   * Get popular FAQs
   */
  getPopularFAQs(): ContactFAQ[] | null {
    const faqs = this.getFAQs();
    if (!faqs) return null;

    return faqs
      .filter((faq) => faq.isPopular)
      .sort((a, b) => a.order - b.order);
  },

  /**
   * Get FAQs by category
   */
  getFAQsByCategory(category: ContactFAQ["category"]): ContactFAQ[] | null {
    const faqs = this.getFAQs();
    if (!faqs) return null;

    return faqs
      .filter((faq) => faq.category === category)
      .sort((a, b) => a.order - b.order);
  },

  /**
   * Search FAQs
   */
  searchFAQs(query: string): ContactFAQ[] | null {
    const faqs = this.getFAQs();
    if (!faqs) return null;

    const lowerQuery = query.toLowerCase();
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(lowerQuery) ||
        faq.answer.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Clear contact FAQ cache
   */
  clearFAQs(): void {
    contactFAQCache.clear();
  },

  /**
   * Check if FAQ cache is valid
   */
  isFAQsValid(): boolean {
    return contactFAQCache.isValid();
  },
};

/**
 * Contact methods cache operations
 */
export const contactMethodsManager = {
  /**
   * Get cached contact methods
   */
  getContactMethods(): ContactMethod[] | null {
    return contactMethodsCache.get({
      fallback: [],
      validator: (data): data is ContactMethod[] =>
        Array.isArray(data) &&
        data.every(
          (method) =>
            typeof method === "object" &&
            method !== null &&
            "id" in method &&
            "type" in method &&
            "title" in method &&
            "value" in method
        ),
    });
  },

  /**
   * Set contact methods to cache
   */
  setContactMethods(methods: ContactMethod[]): void {
    contactMethodsCache.set(methods);
  },

  /**
   * Get available contact methods
   */
  getAvailableContactMethods(): ContactMethod[] | null {
    const methods = this.getContactMethods();
    if (!methods) return null;

    return methods.filter((method) => method.isAvailable);
  },

  /**
   * Get preferred contact methods
   */
  getPreferredContactMethods(): ContactMethod[] | null {
    const methods = this.getAvailableContactMethods();
    if (!methods) return null;

    return methods.filter((method) => method.isPreferred);
  },

  /**
   * Get contact methods by type
   */
  getContactMethodsByType(type: ContactMethod["type"]): ContactMethod[] | null {
    const methods = this.getAvailableContactMethods();
    if (!methods) return null;

    return methods.filter((method) => method.type === type);
  },

  /**
   * Clear contact methods cache
   */
  clearContactMethods(): void {
    contactMethodsCache.clear();
  },

  /**
   * Check if contact methods cache is valid
   */
  isContactMethodsValid(): boolean {
    return contactMethodsCache.isValid();
  },
};

/**
 * Meeting locations cache operations
 */
export const meetingLocationsManager = {
  /**
   * Get cached meeting locations
   */
  getLocations(): MeetingLocation[] | null {
    return meetingLocationsCache.get({
      fallback: [],
      validator: (data): data is MeetingLocation[] =>
        Array.isArray(data) &&
        data.every(
          (location) =>
            typeof location === "object" &&
            location !== null &&
            "id" in location &&
            "name" in location &&
            "type" in location &&
            "address" in location
        ),
    });
  },

  /**
   * Set meeting locations to cache
   */
  setLocations(locations: MeetingLocation[]): void {
    meetingLocationsCache.set(locations);
  },

  /**
   * Get public meeting locations
   */
  getPublicLocations(): MeetingLocation[] | null {
    const locations = this.getLocations();
    if (!locations) return null;

    return locations.filter((location) => location.isPublic);
  },

  /**
   * Get locations by type
   */
  getLocationsByType(type: MeetingLocation["type"]): MeetingLocation[] | null {
    const locations = this.getPublicLocations();
    if (!locations) return null;

    return locations.filter((location) => location.type === type);
  },

  /**
   * Get main office location
   */
  getMainOffice(): MeetingLocation | null {
    const offices = this.getLocationsByType("OFFICE");
    if (!offices || offices.length === 0) return null;

    // Return the first office or one marked as primary
    return offices[0];
  },

  /**
   * Clear meeting locations cache
   */
  clearLocations(): void {
    meetingLocationsCache.clear();
  },

  /**
   * Check if locations cache is valid
   */
  isLocationsValid(): boolean {
    return meetingLocationsCache.isValid();
  },
};

/**
 * Migration utility to move data from old cache keys
 */
export const migrateContactCache = {
  /**
   * Migrate from old cache format to new format
   */
  migrate(): void {
    if (typeof window === "undefined") return;

    try {
      // Migrate contact info
      const oldInfoKeys = [
        "gdg_contact_info_v1",
        "contact_info_cache",
        "organization_contact_cache",
      ];

      oldInfoKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const contactInfo = JSON.parse(oldData) as ContactInfo;
            contactInfoManager.setContactInfo(contactInfo);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated contact info cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate contact info cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });

      // Migrate contact submissions (user's own)
      const oldSubmissionKeys = [
        "gdg_contact_submissions_v1",
        "contact_form_submissions_cache",
        "user_contact_submissions_cache",
      ];

      oldSubmissionKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const submissions = JSON.parse(oldData) as ContactFormSubmission[];
            contactSubmissionsManager.setSubmissions(submissions);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated contact submissions cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate contact submissions cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });
    } catch (error) {
      console.error("Error migrating contact page cache:", error);
    }
  },
};

/**
 * Initialize contact page cache (call this when the contact page loads)
 */
export function initContactCache(): void {
  migrateContactCache.migrate();
}
