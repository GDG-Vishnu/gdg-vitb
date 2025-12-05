/**
 * Cache management for Admin Form Preview page
 * Handles caching of form previews, test submissions, and preview settings
 */

import { createCacheManager, CACHE_DURATIONS } from "@/lib/cache-utils";

// Form preview configuration
export type FormPreviewConfig = {
  formId: string;
  title: string;
  description?: string;
  sections: Array<{
    id: string;
    title: string;
    description?: string;
    fields: Array<{
      id: string;
      type: string;
      label: string;
      name: string;
      required: boolean;
      placeholder?: string;
      defaultValue?: any;
      options?: Array<{
        value: string;
        label: string;
      }>;
      validation?: {
        minLength?: number;
        maxLength?: number;
        pattern?: string;
        min?: number;
        max?: number;
      };
      styling?: {
        width?: string;
        alignment?: string;
      };
    }>;
  }>;
  settings: {
    isPublic: boolean;
    requireAuth: boolean;
    allowMultipleSubmissions: boolean;
    submissionLimit?: number;
    startDate?: Date;
    endDate?: Date;
    successMessage?: string;
    redirectUrl?: string;
  };
  styling: {
    theme: "DEFAULT" | "MODERN" | "MINIMAL" | "COLORFUL" | "DARK" | "CUSTOM";
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    fontFamily?: string;
    customCSS?: string;
  };
  status: "DRAFT" | "PREVIEW" | "PUBLISHED" | "ARCHIVED";
  lastUpdated: Date;
  version: number;
};

// Test submission for preview
export type PreviewTestSubmission = {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: Date;
  submittedBy?: string;
  isTestSubmission: boolean;
  validationResults?: Array<{
    fieldId: string;
    isValid: boolean;
    errors: string[];
  }>;
  processingTime: number; // in milliseconds
  userAgent?: string;
  deviceInfo?: {
    type: "DESKTOP" | "TABLET" | "MOBILE";
    browser: string;
    os: string;
  };
};

// Preview session data
export type PreviewSession = {
  formId: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  viewMode: "DESKTOP" | "TABLET" | "MOBILE";
  interactions: Array<{
    type:
      | "FIELD_FOCUS"
      | "FIELD_BLUR"
      | "VALUE_CHANGE"
      | "SECTION_EXPAND"
      | "SECTION_COLLAPSE"
      | "SUBMIT_ATTEMPT"
      | "VALIDATION_ERROR";
    fieldId?: string;
    sectionId?: string;
    timestamp: Date;
    value?: any;
    error?: string;
  }>;
  testSubmissions: string[]; // submission IDs
  performance: {
    loadTime: number;
    renderTime: number;
    validationTime: number;
    totalInteractionTime: number;
  };
  feedback?: {
    rating: number;
    comments: string;
    suggestions: string[];
  };
};

// Preview settings
export type PreviewSettings = {
  showFieldNames: boolean;
  showValidation: boolean;
  showTimestamps: boolean;
  autoSaveResponses: boolean;
  enableTestMode: boolean;
  simulateDelay: boolean;
  delayAmount: number; // in milliseconds
  deviceSimulation: "DESKTOP" | "TABLET" | "MOBILE" | "ALL";
  showDebugInfo: boolean;
  preserveTestData: boolean;
  maxTestSubmissions: number;
  autoRefresh: {
    enabled: boolean;
    interval: number; // in seconds
  };
  notifications: {
    onSubmission: boolean;
    onValidationError: boolean;
    onFormUpdate: boolean;
  };
};

// Form analytics for preview
export type FormPreviewAnalytics = {
  formId: string;
  previewSessions: number;
  testSubmissions: number;
  validationErrors: number;
  averageCompletionTime: number; // in minutes
  fieldInteractions: Record<
    string,
    {
      focuses: number;
      changes: number;
      errors: number;
      averageTimeSpent: number;
    }
  >;
  deviceBreakdown: {
    desktop: number;
    tablet: number;
    mobile: number;
  };
  mostCommonErrors: Array<{
    fieldId: string;
    fieldName: string;
    errorType: string;
    count: number;
  }>;
  abandonment: {
    totalAttempts: number;
    completions: number;
    abandonmentRate: number;
    commonExitPoints: Array<{
      sectionId: string;
      fieldId: string;
      count: number;
    }>;
  };
  lastCalculated: Date;
};

// Cache managers
export const formPreviewConfigCache = createCacheManager<
  Record<string, FormPreviewConfig>
>({
  key: "gdg_form_preview_configs_v2",
  timestampKey: "gdg_form_preview_configs_timestamp_v2",
  duration: CACHE_DURATIONS.SHORT, // 2 minutes (preview config changes frequently)
});

export const previewTestSubmissionsCache = createCacheManager<
  PreviewTestSubmission[]
>({
  key: "gdg_preview_test_submissions_v2",
  timestampKey: "gdg_preview_test_submissions_timestamp_v2",
  duration: CACHE_DURATIONS.SHORT, // 2 minutes
});

export const previewSessionsCache = createCacheManager<PreviewSession[]>({
  key: "gdg_preview_sessions_v2",
  timestampKey: "gdg_preview_sessions_timestamp_v2",
  duration: CACHE_DURATIONS.MEDIUM, // 5 minutes
});

export const previewSettingsCache = createCacheManager<PreviewSettings>({
  key: "gdg_preview_settings_v2",
  timestampKey: "gdg_preview_settings_timestamp_v2",
  duration: CACHE_DURATIONS.LONG, // 15 minutes (settings don't change often)
});

export const formPreviewAnalyticsCache = createCacheManager<
  Record<string, FormPreviewAnalytics>
>({
  key: "gdg_form_preview_analytics_v2",
  timestampKey: "gdg_form_preview_analytics_timestamp_v2",
  duration: CACHE_DURATIONS.MEDIUM, // 5 minutes
});

/**
 * Form preview config cache operations
 */
export const formPreviewConfigManager = {
  /**
   * Get cached preview configs
   */
  getConfigs(): Record<string, FormPreviewConfig> | null {
    return formPreviewConfigCache.get({
      fallback: {},
      validator: (data): data is Record<string, FormPreviewConfig> =>
        typeof data === "object" && data !== null,
    });
  },

  /**
   * Set preview configs to cache
   */
  setConfigs(configs: Record<string, FormPreviewConfig>): void {
    formPreviewConfigCache.set(configs);
  },

  /**
   * Get preview config by form ID
   */
  getConfigByFormId(formId: string): FormPreviewConfig | null {
    const configs = this.getConfigs();
    return configs?.[formId] || null;
  },

  /**
   * Set preview config for specific form
   */
  setConfigForForm(formId: string, config: FormPreviewConfig): void {
    formPreviewConfigCache.update((current) => ({
      ...(current || {}),
      [formId]: config,
    }));
  },

  /**
   * Update preview config for specific form
   */
  updateConfigForForm(
    formId: string,
    updater: (current: FormPreviewConfig | null) => FormPreviewConfig
  ): void {
    formPreviewConfigCache.update((current) => {
      const configs = current || {};
      return {
        ...configs,
        [formId]: updater(configs[formId] || null),
      };
    });
  },

  /**
   * Remove preview config for form
   */
  removeConfigForForm(formId: string): void {
    formPreviewConfigCache.update((current) => {
      if (!current) return current || {};

      const { [formId]: removed, ...remaining } = current;
      return remaining;
    });
  },

  /**
   * Get configs by status
   */
  getConfigsByStatus(
    status: FormPreviewConfig["status"]
  ): FormPreviewConfig[] | null {
    const configs = this.getConfigs();
    if (!configs) return null;

    return Object.values(configs).filter((config) => config.status === status);
  },

  /**
   * Clear preview configs cache
   */
  clearConfigs(): void {
    formPreviewConfigCache.clear();
  },

  /**
   * Check if configs cache is valid
   */
  isConfigsValid(): boolean {
    return formPreviewConfigCache.isValid();
  },
};

/**
 * Preview test submissions cache operations
 */
export const previewTestSubmissionsManager = {
  /**
   * Get cached test submissions
   */
  getSubmissions(): PreviewTestSubmission[] | null {
    return previewTestSubmissionsCache.get({
      fallback: [],
      validator: (data): data is PreviewTestSubmission[] =>
        Array.isArray(data) &&
        data.every(
          (submission) =>
            typeof submission === "object" &&
            submission !== null &&
            "id" in submission &&
            "formId" in submission &&
            "data" in submission &&
            "isTestSubmission" in submission
        ),
    });
  },

  /**
   * Set test submissions to cache
   */
  setSubmissions(submissions: PreviewTestSubmission[]): void {
    previewTestSubmissionsCache.set(submissions);
  },

  /**
   * Add new test submission
   */
  addSubmission(newSubmission: PreviewTestSubmission): void {
    previewTestSubmissionsCache.update((current) => {
      if (!current) return [newSubmission];

      // Insert at beginning for most recent first, keep only last 50
      return [newSubmission, ...current].slice(0, 50);
    });
  },

  /**
   * Get submissions by form ID
   */
  getSubmissionsByFormId(formId: string): PreviewTestSubmission[] | null {
    const submissions = this.getSubmissions();
    if (!submissions) return null;

    return submissions.filter((submission) => submission.formId === formId);
  },

  /**
   * Get recent submissions for form
   */
  getRecentSubmissionsForForm(
    formId: string,
    limit: number = 10
  ): PreviewTestSubmission[] | null {
    const formSubmissions = this.getSubmissionsByFormId(formId);
    if (!formSubmissions) return null;

    return formSubmissions
      .sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      )
      .slice(0, limit);
  },

  /**
   * Get submission by ID
   */
  getSubmissionById(submissionId: string): PreviewTestSubmission | null {
    const submissions = this.getSubmissions();
    if (!submissions) return null;

    return (
      submissions.find((submission) => submission.id === submissionId) || null
    );
  },

  /**
   * Delete submission
   */
  deleteSubmission(submissionId: string): void {
    previewTestSubmissionsCache.update((current) => {
      if (!current) return current || [];

      return current.filter((submission) => submission.id !== submissionId);
    });
  },

  /**
   * Clear submissions for form
   */
  clearSubmissionsForForm(formId: string): void {
    previewTestSubmissionsCache.update((current) => {
      if (!current) return current || [];

      return current.filter((submission) => submission.formId !== formId);
    });
  },

  /**
   * Clear all test submissions
   */
  clearSubmissions(): void {
    previewTestSubmissionsCache.clear();
  },

  /**
   * Check if submissions cache is valid
   */
  isSubmissionsValid(): boolean {
    return previewTestSubmissionsCache.isValid();
  },
};

/**
 * Preview sessions cache operations
 */
export const previewSessionsManager = {
  /**
   * Get cached preview sessions
   */
  getSessions(): PreviewSession[] | null {
    return previewSessionsCache.get({
      fallback: [],
      validator: (data): data is PreviewSession[] =>
        Array.isArray(data) &&
        data.every(
          (session) =>
            typeof session === "object" &&
            session !== null &&
            "formId" in session &&
            "sessionId" in session &&
            "startTime" in session &&
            "interactions" in session
        ),
    });
  },

  /**
   * Set preview sessions to cache
   */
  setSessions(sessions: PreviewSession[]): void {
    previewSessionsCache.set(sessions);
  },

  /**
   * Start new preview session
   */
  startSession(
    formId: string,
    sessionId: string,
    viewMode: PreviewSession["viewMode"]
  ): PreviewSession {
    const newSession: PreviewSession = {
      formId,
      sessionId,
      startTime: new Date(),
      viewMode,
      interactions: [],
      testSubmissions: [],
      performance: {
        loadTime: 0,
        renderTime: 0,
        validationTime: 0,
        totalInteractionTime: 0,
      },
    };

    previewSessionsCache.update((current) => {
      if (!current) return [newSession];

      // Keep only last 20 sessions
      return [newSession, ...current].slice(0, 20);
    });

    return newSession;
  },

  /**
   * End preview session
   */
  endSession(sessionId: string): void {
    previewSessionsCache.update((current) => {
      if (!current) return current || [];

      return current.map((session) =>
        session.sessionId === sessionId
          ? { ...session, endTime: new Date() }
          : session
      );
    });
  },

  /**
   * Add interaction to session
   */
  addInteraction(
    sessionId: string,
    interaction: PreviewSession["interactions"][0]
  ): void {
    previewSessionsCache.update((current) => {
      if (!current) return current || [];

      return current.map((session) =>
        session.sessionId === sessionId
          ? {
              ...session,
              interactions: [...session.interactions, interaction],
            }
          : session
      );
    });
  },

  /**
   * Update session performance
   */
  updateSessionPerformance(
    sessionId: string,
    performance: Partial<PreviewSession["performance"]>
  ): void {
    previewSessionsCache.update((current) => {
      if (!current) return current || [];

      return current.map((session) =>
        session.sessionId === sessionId
          ? {
              ...session,
              performance: { ...session.performance, ...performance },
            }
          : session
      );
    });
  },

  /**
   * Add test submission to session
   */
  addSubmissionToSession(sessionId: string, submissionId: string): void {
    previewSessionsCache.update((current) => {
      if (!current) return current || [];

      return current.map((session) =>
        session.sessionId === sessionId
          ? {
              ...session,
              testSubmissions: [...session.testSubmissions, submissionId],
            }
          : session
      );
    });
  },

  /**
   * Get sessions by form ID
   */
  getSessionsByFormId(formId: string): PreviewSession[] | null {
    const sessions = this.getSessions();
    if (!sessions) return null;

    return sessions.filter((session) => session.formId === formId);
  },

  /**
   * Get active session
   */
  getActiveSession(formId: string): PreviewSession | null {
    const sessions = this.getSessionsByFormId(formId);
    if (!sessions) return null;

    return sessions.find((session) => !session.endTime) || null;
  },

  /**
   * Clear preview sessions cache
   */
  clearSessions(): void {
    previewSessionsCache.clear();
  },

  /**
   * Check if sessions cache is valid
   */
  isSessionsValid(): boolean {
    return previewSessionsCache.isValid();
  },
};

/**
 * Preview settings cache operations
 */
export const previewSettingsManager = {
  /**
   * Get cached preview settings
   */
  getSettings(): PreviewSettings | null {
    return previewSettingsCache.get({
      validator: (data): data is PreviewSettings =>
        typeof data === "object" &&
        data !== null &&
        "showFieldNames" in data &&
        "enableTestMode" in data &&
        "deviceSimulation" in data,
    });
  },

  /**
   * Set preview settings to cache
   */
  setSettings(settings: PreviewSettings): void {
    previewSettingsCache.set(settings);
  },

  /**
   * Update preview settings
   */
  updateSettings(
    updater: (current: PreviewSettings | null) => PreviewSettings
  ): void {
    previewSettingsCache.update(updater);
  },

  /**
   * Get settings with defaults
   */
  getSettingsWithDefaults(): PreviewSettings {
    return this.getSettings() || this.getDefaultSettings();
  },

  /**
   * Get default settings
   */
  getDefaultSettings(): PreviewSettings {
    return {
      showFieldNames: false,
      showValidation: true,
      showTimestamps: false,
      autoSaveResponses: true,
      enableTestMode: true,
      simulateDelay: false,
      delayAmount: 500,
      deviceSimulation: "DESKTOP",
      showDebugInfo: false,
      preserveTestData: true,
      maxTestSubmissions: 50,
      autoRefresh: {
        enabled: false,
        interval: 30,
      },
      notifications: {
        onSubmission: true,
        onValidationError: true,
        onFormUpdate: false,
      },
    };
  },

  /**
   * Toggle setting
   */
  toggleSetting(key: keyof PreviewSettings): void {
    this.updateSettings((current) => {
      const settings = current || this.getDefaultSettings();
      return {
        ...settings,
        [key]: !settings[key as keyof PreviewSettings],
      };
    });
  },

  /**
   * Clear preview settings cache
   */
  clearSettings(): void {
    previewSettingsCache.clear();
  },

  /**
   * Check if settings cache is valid
   */
  isSettingsValid(): boolean {
    return previewSettingsCache.isValid();
  },
};

/**
 * Form preview analytics cache operations
 */
export const formPreviewAnalyticsManager = {
  /**
   * Get cached analytics
   */
  getAnalytics(): Record<string, FormPreviewAnalytics> | null {
    return formPreviewAnalyticsCache.get({
      fallback: {},
      validator: (data): data is Record<string, FormPreviewAnalytics> =>
        typeof data === "object" && data !== null,
    });
  },

  /**
   * Set analytics to cache
   */
  setAnalytics(analytics: Record<string, FormPreviewAnalytics>): void {
    formPreviewAnalyticsCache.set(analytics);
  },

  /**
   * Get analytics for specific form
   */
  getFormAnalytics(formId: string): FormPreviewAnalytics | null {
    const analytics = this.getAnalytics();
    return analytics?.[formId] || null;
  },

  /**
   * Recalculate analytics from cached data
   */
  recalculateAnalytics(formId: string): FormPreviewAnalytics {
    const sessions = previewSessionsManager.getSessionsByFormId(formId) || [];
    const submissions =
      previewTestSubmissionsManager.getSubmissionsByFormId(formId) || [];

    // Calculate analytics from sessions and submissions
    const analytics: FormPreviewAnalytics = {
      formId,
      previewSessions: sessions.length,
      testSubmissions: submissions.length,
      validationErrors: 0,
      averageCompletionTime: 0,
      fieldInteractions: {},
      deviceBreakdown: {
        desktop: 0,
        tablet: 0,
        mobile: 0,
      },
      mostCommonErrors: [],
      abandonment: {
        totalAttempts: sessions.length,
        completions: submissions.length,
        abandonmentRate:
          sessions.length > 0
            ? ((sessions.length - submissions.length) / sessions.length) * 100
            : 0,
        commonExitPoints: [],
      },
      lastCalculated: new Date(),
    };

    // Process sessions for detailed analytics
    sessions.forEach((session) => {
      // Device breakdown
      if (session.viewMode === "DESKTOP") analytics.deviceBreakdown.desktop++;
      else if (session.viewMode === "TABLET")
        analytics.deviceBreakdown.tablet++;
      else if (session.viewMode === "MOBILE")
        analytics.deviceBreakdown.mobile++;

      // Process interactions
      session.interactions.forEach((interaction) => {
        if (interaction.fieldId) {
          if (!analytics.fieldInteractions[interaction.fieldId]) {
            analytics.fieldInteractions[interaction.fieldId] = {
              focuses: 0,
              changes: 0,
              errors: 0,
              averageTimeSpent: 0,
            };
          }

          const fieldStats = analytics.fieldInteractions[interaction.fieldId];
          if (interaction.type === "FIELD_FOCUS") fieldStats.focuses++;
          else if (interaction.type === "VALUE_CHANGE") fieldStats.changes++;
          else if (interaction.type === "VALIDATION_ERROR") fieldStats.errors++;
        }
      });
    });

    // Calculate completion times
    const completedSessions = sessions.filter((session) => session.endTime);
    if (completedSessions.length > 0) {
      const totalTime = completedSessions.reduce((sum, session) => {
        const duration =
          new Date(session.endTime!).getTime() -
          new Date(session.startTime).getTime();
        return sum + duration;
      }, 0);
      analytics.averageCompletionTime =
        totalTime / completedSessions.length / (1000 * 60); // convert to minutes
    }

    // Store calculated analytics
    formPreviewAnalyticsCache.update((current) => ({
      ...(current || {}),
      [formId]: analytics,
    }));

    return analytics;
  },

  /**
   * Clear analytics cache
   */
  clearAnalytics(): void {
    formPreviewAnalyticsCache.clear();
  },

  /**
   * Check if analytics cache is valid
   */
  isAnalyticsValid(): boolean {
    return formPreviewAnalyticsCache.isValid();
  },
};

/**
 * Migration utility to move data from old cache keys
 */
export const migrateFormPreviewCache = {
  /**
   * Migrate from old cache format to new format
   */
  migrate(): void {
    if (typeof window === "undefined") return;

    try {
      // Migrate preview configs
      const oldConfigKeys = [
        "gdg_form_preview_configs_v1",
        "form_preview_cache",
        "admin_form_preview_cache",
      ];

      oldConfigKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const configs = JSON.parse(oldData) as Record<
              string,
              FormPreviewConfig
            >;
            formPreviewConfigManager.setConfigs(configs);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated form preview configs cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate form preview configs cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });

      // Migrate test submissions
      const oldSubmissionKeys = [
        "gdg_preview_test_submissions_v1",
        "form_test_submissions_cache",
        "preview_submissions_cache",
      ];

      oldSubmissionKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const submissions = JSON.parse(oldData) as PreviewTestSubmission[];
            previewTestSubmissionsManager.setSubmissions(submissions);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated preview test submissions cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate preview test submissions cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });

      // Migrate preview settings
      const oldSettingsKeys = [
        "gdg_preview_settings_v1",
        "form_preview_settings_cache",
        "preview_ui_settings_cache",
      ];

      oldSettingsKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const settings = JSON.parse(oldData) as PreviewSettings;
            previewSettingsManager.setSettings(settings);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated form preview settings cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate form preview settings cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });
    } catch (error) {
      console.error("Error migrating form preview cache:", error);
    }
  },
};

/**
 * Initialize form preview cache (call this when the form preview page loads)
 */
export function initFormPreviewCache(): void {
  migrateFormPreviewCache.migrate();
}
