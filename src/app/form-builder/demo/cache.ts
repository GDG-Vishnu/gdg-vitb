/**
 * Cache management for Form Builder Demo page
 * Handles caching of demo forms, sample data, and demo preferences
 */

import { createCacheManager, CACHE_DURATIONS } from "@/lib/cache-utils";

// Demo form template
export type DemoFormTemplate = {
  id: string;
  name: string;
  description: string;
  category:
    | "EVENT_REGISTRATION"
    | "MEMBERSHIP_APPLICATION"
    | "FEEDBACK_SURVEY"
    | "CONTACT_FORM"
    | "QUIZ"
    | "POLL"
    | "OTHER";
  thumbnail?: string;
  tags: string[];
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  estimatedTime: number; // in minutes
  popularity: number; // usage count
  structure: {
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
        options?: Array<{
          value: string;
          label: string;
        }>;
        validation?: {
          minLength?: number;
          maxLength?: number;
          pattern?: string;
        };
      }>;
    }>;
  };
  sampleData?: Record<string, any>;
  isOfficial: boolean; // whether it's provided by GDG or user-created
  createdAt: Date;
  lastUpdated: Date;
  version: string;
};

// Demo session tracking
export type DemoSession = {
  sessionId: string;
  templateId: string;
  templateName: string;
  startTime: Date;
  endTime?: Date;
  actions: Array<{
    type:
      | "TEMPLATE_LOADED"
      | "FIELD_ADDED"
      | "FIELD_REMOVED"
      | "FIELD_MODIFIED"
      | "SECTION_ADDED"
      | "SECTION_REMOVED"
      | "PREVIEW_OPENED"
      | "FORM_SAVED"
      | "FORM_EXPORTED";
    timestamp: Date;
    details?: any;
  }>;
  currentFormData?: any;
  hasUnsavedChanges: boolean;
  userFeedback?: {
    rating: number;
    comments: string;
    wouldRecommend: boolean;
  };
};

// Demo preferences
export type DemoPreferences = {
  favoriteCategories: string[];
  showTutorials: boolean;
  autoLoadLastTemplate: boolean;
  enableAnimations: boolean;
  preferredDifficulty: DemoFormTemplate["difficulty"];
  tourCompleted: boolean;
  hiddenFeatures: string[];
  customTemplates: string[]; // IDs of user-created templates
  recentTemplates: Array<{
    templateId: string;
    accessedAt: Date;
  }>;
  exportFormat: "JSON" | "HTML" | "REACT" | "VUE";
  codeStyle: "TYPESCRIPT" | "JAVASCRIPT" | "JSX";
};

// Demo tutorial step
export type DemoTutorialStep = {
  id: string;
  title: string;
  description: string;
  targetElement?: string; // CSS selector for highlighting
  position: "TOP" | "BOTTOM" | "LEFT" | "RIGHT" | "CENTER";
  action?: {
    type: "CLICK" | "TYPE" | "DRAG" | "WAIT";
    value?: string;
    duration?: number;
  };
  skippable: boolean;
  order: number;
};

// Sample form data for testing
export type SampleFormData = {
  templateId: string;
  variations: Array<{
    name: string;
    description: string;
    data: Record<string, any>;
    isComplete: boolean;
    hasErrors: boolean;
    validationResults?: Array<{
      fieldName: string;
      isValid: boolean;
      errors: string[];
    }>;
  }>;
  generatedAt: Date;
  lastUsed?: Date;
};

// Cache managers
export const demoFormTemplatesCache = createCacheManager<DemoFormTemplate[]>({
  key: "gdg_demo_form_templates_v2",
  timestampKey: "gdg_demo_form_templates_timestamp_v2",
  duration: CACHE_DURATIONS.LONG, // 15 minutes (templates don't change often)
});

export const demoSessionCache = createCacheManager<DemoSession | null>({
  key: "gdg_demo_session_v2",
  timestampKey: "gdg_demo_session_timestamp_v2",
  duration: CACHE_DURATIONS.MEDIUM, // 5 minutes
});

export const demoPreferencesCache = createCacheManager<DemoPreferences>({
  key: "gdg_demo_preferences_v2",
  timestampKey: "gdg_demo_preferences_timestamp_v2",
  duration: CACHE_DURATIONS.EXTRA_LONG, // 30 minutes (preferences persist)
});

export const demoTutorialCache = createCacheManager<DemoTutorialStep[]>({
  key: "gdg_demo_tutorial_steps_v2",
  timestampKey: "gdg_demo_tutorial_steps_timestamp_v2",
  duration: CACHE_DURATIONS.LONG, // 15 minutes
});

export const sampleFormDataCache = createCacheManager<
  Record<string, SampleFormData>
>({
  key: "gdg_sample_form_data_v2",
  timestampKey: "gdg_sample_form_data_timestamp_v2",
  duration: CACHE_DURATIONS.MEDIUM, // 5 minutes
});

/**
 * Demo form templates cache operations
 */
export const demoFormTemplatesManager = {
  /**
   * Get cached demo form templates
   */
  getTemplates(): DemoFormTemplate[] | null {
    return demoFormTemplatesCache.get({
      fallback: [],
      validator: (data): data is DemoFormTemplate[] =>
        Array.isArray(data) &&
        data.every(
          (template) =>
            typeof template === "object" &&
            template !== null &&
            "id" in template &&
            "name" in template &&
            "category" in template &&
            "structure" in template
        ),
    });
  },

  /**
   * Set demo form templates to cache
   */
  setTemplates(templates: DemoFormTemplate[]): void {
    demoFormTemplatesCache.set(templates);
  },

  /**
   * Get template by ID
   */
  getTemplateById(templateId: string): DemoFormTemplate | null {
    const templates = this.getTemplates();
    if (!templates) return null;

    return templates.find((template) => template.id === templateId) || null;
  },

  /**
   * Get templates by category
   */
  getTemplatesByCategory(
    category: DemoFormTemplate["category"]
  ): DemoFormTemplate[] | null {
    const templates = this.getTemplates();
    if (!templates) return null;

    return templates.filter((template) => template.category === category);
  },

  /**
   * Get templates by difficulty
   */
  getTemplatesByDifficulty(
    difficulty: DemoFormTemplate["difficulty"]
  ): DemoFormTemplate[] | null {
    const templates = this.getTemplates();
    if (!templates) return null;

    return templates.filter((template) => template.difficulty === difficulty);
  },

  /**
   * Get official templates
   */
  getOfficialTemplates(): DemoFormTemplate[] | null {
    const templates = this.getTemplates();
    if (!templates) return null;

    return templates.filter((template) => template.isOfficial);
  },

  /**
   * Get user-created templates
   */
  getUserTemplates(): DemoFormTemplate[] | null {
    const templates = this.getTemplates();
    if (!templates) return null;

    return templates.filter((template) => !template.isOfficial);
  },

  /**
   * Get popular templates
   */
  getPopularTemplates(limit: number = 10): DemoFormTemplate[] | null {
    const templates = this.getTemplates();
    if (!templates) return null;

    return templates
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit);
  },

  /**
   * Search templates
   */
  searchTemplates(query: string): DemoFormTemplate[] | null {
    const templates = this.getTemplates();
    if (!templates) return null;

    const lowerQuery = query.toLowerCase();
    return templates.filter(
      (template) =>
        template.name.toLowerCase().includes(lowerQuery) ||
        template.description.toLowerCase().includes(lowerQuery) ||
        template.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  },

  /**
   * Add user template
   */
  addUserTemplate(template: DemoFormTemplate): void {
    demoFormTemplatesCache.update((current) => {
      if (!current) return [template];

      return [template, ...current];
    });
  },

  /**
   * Update template popularity
   */
  updateTemplatePopularity(templateId: string): void {
    demoFormTemplatesCache.update((current) => {
      if (!current) return current || [];

      return current.map((template) =>
        template.id === templateId
          ? { ...template, popularity: template.popularity + 1 }
          : template
      );
    });
  },

  /**
   * Clear demo templates cache
   */
  clearTemplates(): void {
    demoFormTemplatesCache.clear();
  },

  /**
   * Check if templates cache is valid
   */
  isTemplatesValid(): boolean {
    return demoFormTemplatesCache.isValid();
  },
};

/**
 * Demo session cache operations
 */
export const demoSessionManager = {
  /**
   * Get current demo session
   */
  getCurrentSession(): DemoSession | null {
    return demoSessionCache.get({
      validator: (data): data is DemoSession =>
        data !== null &&
        typeof data === "object" &&
        "sessionId" in data &&
        "templateId" in data &&
        "startTime" in data &&
        "actions" in data,
    });
  },

  /**
   * Start new demo session
   */
  startSession(templateId: string, templateName: string): DemoSession {
    const newSession: DemoSession = {
      sessionId: `demo_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      templateId,
      templateName,
      startTime: new Date(),
      actions: [
        {
          type: "TEMPLATE_LOADED",
          timestamp: new Date(),
          details: { templateId, templateName },
        },
      ],
      hasUnsavedChanges: false,
    };

    demoSessionCache.set(newSession);
    return newSession;
  },

  /**
   * End current session
   */
  endSession(): void {
    demoSessionCache.update((current) => {
      if (!current) return null;

      return {
        ...current,
        endTime: new Date(),
      };
    });
  },

  /**
   * Add action to current session
   */
  addAction(action: DemoSession["actions"][0]): void {
    demoSessionCache.update((current) => {
      if (!current) return current;

      return {
        ...current,
        actions: [...current.actions, action],
      };
    });
  },

  /**
   * Update form data in session
   */
  updateFormData(formData: any): void {
    demoSessionCache.update((current) => {
      if (!current) return current;

      return {
        ...current,
        currentFormData: formData,
        hasUnsavedChanges: true,
      };
    });
  },

  /**
   * Mark session as saved
   */
  markAsSaved(): void {
    demoSessionCache.update((current) => {
      if (!current) return current;

      return {
        ...current,
        hasUnsavedChanges: false,
      };
    });
  },

  /**
   * Add user feedback to session
   */
  addFeedback(feedback: DemoSession["userFeedback"]): void {
    demoSessionCache.update((current) => {
      if (!current) return current;

      return {
        ...current,
        userFeedback: feedback,
      };
    });
  },

  /**
   * Clear demo session cache
   */
  clearSession(): void {
    demoSessionCache.clear();
  },

  /**
   * Check if session cache is valid
   */
  isSessionValid(): boolean {
    return demoSessionCache.isValid();
  },
};

/**
 * Demo preferences cache operations
 */
export const demoPreferencesManager = {
  /**
   * Get cached demo preferences
   */
  getPreferences(): DemoPreferences | null {
    return demoPreferencesCache.get({
      validator: (data): data is DemoPreferences =>
        typeof data === "object" &&
        data !== null &&
        "favoriteCategories" in data &&
        "showTutorials" in data &&
        "tourCompleted" in data,
    });
  },

  /**
   * Set demo preferences to cache
   */
  setPreferences(preferences: DemoPreferences): void {
    demoPreferencesCache.set(preferences);
  },

  /**
   * Update demo preferences
   */
  updatePreferences(
    updater: (current: DemoPreferences | null) => DemoPreferences
  ): void {
    demoPreferencesCache.update(updater);
  },

  /**
   * Get preferences with defaults
   */
  getPreferencesWithDefaults(): DemoPreferences {
    return this.getPreferences() || this.getDefaultPreferences();
  },

  /**
   * Get default preferences
   */
  getDefaultPreferences(): DemoPreferences {
    return {
      favoriteCategories: [],
      showTutorials: true,
      autoLoadLastTemplate: false,
      enableAnimations: true,
      preferredDifficulty: "BEGINNER",
      tourCompleted: false,
      hiddenFeatures: [],
      customTemplates: [],
      recentTemplates: [],
      exportFormat: "JSON",
      codeStyle: "TYPESCRIPT",
    };
  },

  /**
   * Add to recent templates
   */
  addToRecent(templateId: string): void {
    this.updatePreferences((current) => {
      const prefs = current || this.getDefaultPreferences();
      const recentTemplates = prefs.recentTemplates.filter(
        (rt) => rt.templateId !== templateId
      );

      return {
        ...prefs,
        recentTemplates: [
          { templateId, accessedAt: new Date() },
          ...recentTemplates,
        ].slice(0, 10), // keep only last 10
      };
    });
  },

  /**
   * Add favorite category
   */
  addFavoriteCategory(category: string): void {
    this.updatePreferences((current) => {
      const prefs = current || this.getDefaultPreferences();

      if (prefs.favoriteCategories.includes(category)) return prefs;

      return {
        ...prefs,
        favoriteCategories: [...prefs.favoriteCategories, category],
      };
    });
  },

  /**
   * Remove favorite category
   */
  removeFavoriteCategory(category: string): void {
    this.updatePreferences((current) => {
      const prefs = current || this.getDefaultPreferences();

      return {
        ...prefs,
        favoriteCategories: prefs.favoriteCategories.filter(
          (cat) => cat !== category
        ),
      };
    });
  },

  /**
   * Mark tour as completed
   */
  completeTour(): void {
    this.updatePreferences((current) => ({
      ...(current || this.getDefaultPreferences()),
      tourCompleted: true,
    }));
  },

  /**
   * Hide feature
   */
  hideFeature(featureId: string): void {
    this.updatePreferences((current) => {
      const prefs = current || this.getDefaultPreferences();

      if (prefs.hiddenFeatures.includes(featureId)) return prefs;

      return {
        ...prefs,
        hiddenFeatures: [...prefs.hiddenFeatures, featureId],
      };
    });
  },

  /**
   * Clear demo preferences cache
   */
  clearPreferences(): void {
    demoPreferencesCache.clear();
  },

  /**
   * Check if preferences cache is valid
   */
  isPreferencesValid(): boolean {
    return demoPreferencesCache.isValid();
  },
};

/**
 * Sample form data cache operations
 */
export const sampleFormDataManager = {
  /**
   * Get cached sample form data
   */
  getSampleData(): Record<string, SampleFormData> | null {
    return sampleFormDataCache.get({
      fallback: {},
      validator: (data): data is Record<string, SampleFormData> =>
        typeof data === "object" && data !== null,
    });
  },

  /**
   * Set sample form data to cache
   */
  setSampleData(sampleData: Record<string, SampleFormData>): void {
    sampleFormDataCache.set(sampleData);
  },

  /**
   * Get sample data for template
   */
  getSampleDataForTemplate(templateId: string): SampleFormData | null {
    const allData = this.getSampleData();
    return allData?.[templateId] || null;
  },

  /**
   * Add sample data for template
   */
  addSampleDataForTemplate(
    templateId: string,
    sampleData: SampleFormData
  ): void {
    sampleFormDataCache.update((current) => ({
      ...(current || {}),
      [templateId]: sampleData,
    }));
  },

  /**
   * Update last used timestamp
   */
  updateLastUsed(templateId: string): void {
    sampleFormDataCache.update((current) => {
      if (!current || !current[templateId]) return current || {};

      return {
        ...current,
        [templateId]: {
          ...current[templateId],
          lastUsed: new Date(),
        },
      };
    });
  },

  /**
   * Clear sample form data cache
   */
  clearSampleData(): void {
    sampleFormDataCache.clear();
  },

  /**
   * Check if sample data cache is valid
   */
  isSampleDataValid(): boolean {
    return sampleFormDataCache.isValid();
  },
};

/**
 * Migration utility to move data from old cache keys
 */
export const migrateDemoCache = {
  /**
   * Migrate from old cache format to new format
   */
  migrate(): void {
    if (typeof window === "undefined") return;

    try {
      // Migrate demo templates
      const oldTemplateKeys = [
        "gdg_demo_form_templates_v1",
        "form_demo_templates_cache",
        "demo_templates_cache",
      ];

      oldTemplateKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const templates = JSON.parse(oldData) as DemoFormTemplate[];
            demoFormTemplatesManager.setTemplates(templates);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated demo templates cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate demo templates cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });

      // Migrate demo preferences
      const oldPreferencesKeys = [
        "gdg_demo_preferences_v1",
        "form_demo_preferences_cache",
        "demo_user_preferences_cache",
      ];

      oldPreferencesKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const preferences = JSON.parse(oldData) as DemoPreferences;
            demoPreferencesManager.setPreferences(preferences);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated demo preferences cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate demo preferences cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });

      // Clean up old session data (usually not needed to migrate as it's temporary)
      const oldSessionKeys = [
        "gdg_demo_session_v1",
        "form_demo_session_cache",
        "demo_current_session_cache",
      ];

      oldSessionKeys.forEach((oldKey) => {
        localStorage.removeItem(oldKey);
      });
    } catch (error) {
      console.error("Error migrating demo cache:", error);
    }
  },
};

/**
 * Initialize demo cache (call this when the demo page loads)
 */
export function initDemoCache(): void {
  migrateDemoCache.migrate();
}
