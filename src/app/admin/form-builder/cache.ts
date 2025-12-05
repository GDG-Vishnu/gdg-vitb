/**
 * Cache management for Admin Form Builder page
 * Handles caching of form drafts, field templates, and builder state
 */

import { createCacheManager, CACHE_DURATIONS } from "@/lib/cache-utils";

// Form field template type
export type FieldTemplate = {
  id: string;
  type:
    | "TEXT"
    | "TEXTAREA"
    | "SELECT"
    | "RADIO"
    | "CHECKBOX"
    | "EMAIL"
    | "PHONE"
    | "URL"
    | "NUMBER"
    | "DATE"
    | "TIME"
    | "FILE"
    | "RATING"
    | "SLIDER";
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  defaultValue?: any;
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    customMessage?: string;
  };
  options?: Array<{
    value: string;
    label: string;
    isDefault?: boolean;
  }>;
  properties?: {
    multiline?: boolean;
    rows?: number;
    multiple?: boolean;
    accept?: string; // for file fields
    step?: number; // for number fields
    scale?: number; // for rating/slider
  };
  styling?: {
    width?: "25%" | "50%" | "75%" | "100%";
    alignment?: "left" | "center" | "right";
    conditional?: {
      dependsOn: string;
      value: any;
      operator:
        | "equals"
        | "not_equals"
        | "contains"
        | "greater_than"
        | "less_than";
    };
  };
  category: "BASIC" | "ADVANCED" | "LAYOUT" | "CUSTOM";
  isSystem: boolean; // whether it's a predefined template or custom
  createdAt: Date;
  lastUsed?: Date;
  usageCount: number;
};

// Form section type
export type FormSection = {
  id: string;
  title: string;
  description?: string;
  isCollapsible: boolean;
  isCollapsed: boolean;
  order: number;
  fields: FieldTemplate[];
  styling?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
  };
};

// Form draft type (work-in-progress form)
export type FormDraft = {
  id: string;
  title: string;
  description?: string;
  category:
    | "EVENT"
    | "MEMBERSHIP"
    | "FEEDBACK"
    | "SURVEY"
    | "REGISTRATION"
    | "APPLICATION"
    | "OTHER";
  sections: FormSection[];
  settings: {
    isPublic: boolean;
    requireAuth: boolean;
    allowMultipleSubmissions: boolean;
    submissionLimit?: number;
    startDate?: Date;
    endDate?: Date;
    successMessage?: string;
    redirectUrl?: string;
    emailNotifications: {
      enabled: boolean;
      recipients: string[];
      template?: string;
    };
    autoApprove: boolean;
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
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  lastModifiedBy: string;
  version: number;
  autosaveEnabled: boolean;
  lastAutosave?: Date;
};

// Form builder state type
export type FormBuilderState = {
  activeFormId?: string;
  activeSectionId?: string;
  activeFieldId?: string;
  sidebarTab: "FIELDS" | "SECTIONS" | "SETTINGS" | "PREVIEW" | "STYLE";
  isDragging: boolean;
  draggedItem?: {
    type: "FIELD" | "SECTION";
    id: string;
    data: any;
  };
  undoStack: Array<{
    action: string;
    data: any;
    timestamp: Date;
  }>;
  redoStack: Array<{
    action: string;
    data: any;
    timestamp: Date;
  }>;
  clipboard?: {
    type: "FIELD" | "SECTION";
    data: any;
    timestamp: Date;
  };
  viewMode: "DESKTOP" | "TABLET" | "MOBILE";
  showFieldIds: boolean;
  showValidation: boolean;
  autoSave: {
    enabled: boolean;
    interval: number; // in seconds
    lastSave?: Date;
  };
};

// Field validation result type
export type FieldValidationResult = {
  fieldId: string;
  isValid: boolean;
  errors: Array<{
    type: "REQUIRED" | "FORMAT" | "LENGTH" | "RANGE" | "CUSTOM";
    message: string;
  }>;
  warnings?: Array<{
    type: "ACCESSIBILITY" | "USABILITY" | "PERFORMANCE";
    message: string;
    suggestion?: string;
  }>;
};

// Form analytics for builder
export type FormBuilderAnalytics = {
  formId: string;
  buildTime: number; // total time spent building in minutes
  fieldsAdded: number;
  fieldsRemoved: number;
  sectionsAdded: number;
  sectionsRemoved: number;
  saves: number;
  previews: number;
  validationErrors: number;
  lastActivity: Date;
  sessionsCount: number;
};

// Cache managers
export const formDraftsCache = createCacheManager<FormDraft[]>({
  key: "gdg_form_drafts_v2",
  timestampKey: "gdg_form_drafts_timestamp_v2",
  duration: CACHE_DURATIONS.SHORT, // 2 minutes (frequent changes)
});

export const fieldTemplatesCache = createCacheManager<FieldTemplate[]>({
  key: "gdg_field_templates_v2",
  timestampKey: "gdg_field_templates_timestamp_v2",
  duration: CACHE_DURATIONS.LONG, // 15 minutes
});

export const formBuilderStateCache = createCacheManager<FormBuilderState>({
  key: "gdg_form_builder_state_v2",
  timestampKey: "gdg_form_builder_state_timestamp_v2",
  duration: CACHE_DURATIONS.MEDIUM, // 5 minutes
});

export const formBuilderAnalyticsCache = createCacheManager<
  Record<string, FormBuilderAnalytics>
>({
  key: "gdg_form_builder_analytics_v2",
  timestampKey: "gdg_form_builder_analytics_timestamp_v2",
  duration: CACHE_DURATIONS.LONG, // 15 minutes
});

/**
 * Form drafts cache operations
 */
export const formDraftsManager = {
  /**
   * Get cached form drafts
   */
  getDrafts(): FormDraft[] | null {
    return formDraftsCache.get({
      fallback: [],
      validator: (data): data is FormDraft[] =>
        Array.isArray(data) &&
        data.every(
          (draft) =>
            typeof draft === "object" &&
            draft !== null &&
            "id" in draft &&
            "title" in draft &&
            "sections" in draft &&
            "settings" in draft
        ),
    });
  },

  /**
   * Set form drafts to cache
   */
  setDrafts(drafts: FormDraft[]): void {
    formDraftsCache.set(drafts);
  },

  /**
   * Get draft by ID
   */
  getDraftById(draftId: string): FormDraft | null {
    const drafts = this.getDrafts();
    if (!drafts) return null;

    return drafts.find((draft) => draft.id === draftId) || null;
  },

  /**
   * Add new draft
   */
  addDraft(newDraft: FormDraft): void {
    formDraftsCache.update((current) => {
      if (!current) return [newDraft];

      return [newDraft, ...current];
    });
  },

  /**
   * Update existing draft
   */
  updateDraft(draftId: string, updater: (draft: FormDraft) => FormDraft): void {
    formDraftsCache.update((current) => {
      if (!current) return current || [];

      return current.map((draft) =>
        draft.id === draftId
          ? {
              ...updater(draft),
              lastModified: new Date(),
              version: draft.version + 1,
            }
          : draft
      );
    });
  },

  /**
   * Delete draft
   */
  deleteDraft(draftId: string): void {
    formDraftsCache.update((current) => {
      if (!current) return current || [];

      return current.filter((draft) => draft.id !== draftId);
    });
  },

  /**
   * Duplicate draft
   */
  duplicateDraft(draftId: string): FormDraft | null {
    const originalDraft = this.getDraftById(draftId);
    if (!originalDraft) return null;

    const duplicatedDraft: FormDraft = {
      ...originalDraft,
      id: `${originalDraft.id}_copy_${Date.now()}`,
      title: `${originalDraft.title} (Copy)`,
      status: "DRAFT",
      createdAt: new Date(),
      lastModified: new Date(),
      version: 1,
      lastAutosave: undefined,
    };

    this.addDraft(duplicatedDraft);
    return duplicatedDraft;
  },

  /**
   * Get drafts by status
   */
  getDraftsByStatus(status: FormDraft["status"]): FormDraft[] | null {
    const drafts = this.getDrafts();
    if (!drafts) return null;

    return drafts.filter((draft) => draft.status === status);
  },

  /**
   * Get recent drafts
   */
  getRecentDrafts(limit: number = 5): FormDraft[] | null {
    const drafts = this.getDrafts();
    if (!drafts) return null;

    return drafts
      .sort(
        (a, b) =>
          new Date(b.lastModified).getTime() -
          new Date(a.lastModified).getTime()
      )
      .slice(0, limit);
  },

  /**
   * Auto-save draft
   */
  autoSaveDraft(
    draftId: string,
    updater: (draft: FormDraft) => FormDraft
  ): void {
    this.updateDraft(draftId, (draft) => ({
      ...updater(draft),
      lastAutosave: new Date(),
    }));
  },

  /**
   * Clear form drafts cache
   */
  clearDrafts(): void {
    formDraftsCache.clear();
  },

  /**
   * Check if drafts cache is valid
   */
  isDraftsValid(): boolean {
    return formDraftsCache.isValid();
  },
};

/**
 * Field templates cache operations
 */
export const fieldTemplatesManager = {
  /**
   * Get cached field templates
   */
  getTemplates(): FieldTemplate[] | null {
    return fieldTemplatesCache.get({
      fallback: [],
      validator: (data): data is FieldTemplate[] =>
        Array.isArray(data) &&
        data.every(
          (template) =>
            typeof template === "object" &&
            template !== null &&
            "id" in template &&
            "type" in template &&
            "name" in template &&
            "label" in template
        ),
    });
  },

  /**
   * Set field templates to cache
   */
  setTemplates(templates: FieldTemplate[]): void {
    fieldTemplatesCache.set(templates);
  },

  /**
   * Get templates by category
   */
  getTemplatesByCategory(
    category: FieldTemplate["category"]
  ): FieldTemplate[] | null {
    const templates = this.getTemplates();
    if (!templates) return null;

    return templates.filter((template) => template.category === category);
  },

  /**
   * Get system templates
   */
  getSystemTemplates(): FieldTemplate[] | null {
    const templates = this.getTemplates();
    if (!templates) return null;

    return templates.filter((template) => template.isSystem);
  },

  /**
   * Get custom templates
   */
  getCustomTemplates(): FieldTemplate[] | null {
    const templates = this.getTemplates();
    if (!templates) return null;

    return templates.filter((template) => !template.isSystem);
  },

  /**
   * Get popular templates (by usage)
   */
  getPopularTemplates(limit: number = 10): FieldTemplate[] | null {
    const templates = this.getTemplates();
    if (!templates) return null;

    return templates
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  },

  /**
   * Add custom template
   */
  addCustomTemplate(template: FieldTemplate): void {
    fieldTemplatesCache.update((current) => {
      if (!current) return [template];

      return [template, ...current];
    });
  },

  /**
   * Update template usage
   */
  updateTemplateUsage(templateId: string): void {
    fieldTemplatesCache.update((current) => {
      if (!current) return current || [];

      return current.map((template) =>
        template.id === templateId
          ? {
              ...template,
              usageCount: template.usageCount + 1,
              lastUsed: new Date(),
            }
          : template
      );
    });
  },

  /**
   * Search templates
   */
  searchTemplates(query: string): FieldTemplate[] | null {
    const templates = this.getTemplates();
    if (!templates) return null;

    const lowerQuery = query.toLowerCase();
    return templates.filter(
      (template) =>
        template.name.toLowerCase().includes(lowerQuery) ||
        template.label.toLowerCase().includes(lowerQuery) ||
        template.description?.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Clear field templates cache
   */
  clearTemplates(): void {
    fieldTemplatesCache.clear();
  },

  /**
   * Check if templates cache is valid
   */
  isTemplatesValid(): boolean {
    return fieldTemplatesCache.isValid();
  },
};

/**
 * Form builder state cache operations
 */
export const formBuilderStateManager = {
  /**
   * Get cached builder state
   */
  getState(): FormBuilderState | null {
    return formBuilderStateCache.get({
      validator: (data): data is FormBuilderState =>
        typeof data === "object" &&
        data !== null &&
        "sidebarTab" in data &&
        "isDragging" in data &&
        "undoStack" in data &&
        "redoStack" in data &&
        "viewMode" in data,
    });
  },

  /**
   * Set builder state to cache
   */
  setState(state: FormBuilderState): void {
    formBuilderStateCache.set(state);
  },

  /**
   * Update builder state
   */
  updateState(
    updater: (current: FormBuilderState | null) => FormBuilderState
  ): void {
    formBuilderStateCache.update(updater);
  },

  /**
   * Set active form
   */
  setActiveForm(formId: string): void {
    this.updateState((current) => ({
      ...(current || this.getDefaultState()),
      activeFormId: formId,
      activeSectionId: undefined,
      activeFieldId: undefined,
    }));
  },

  /**
   * Set active section
   */
  setActiveSection(sectionId: string): void {
    this.updateState((current) => ({
      ...(current || this.getDefaultState()),
      activeSectionId: sectionId,
      activeFieldId: undefined,
    }));
  },

  /**
   * Set active field
   */
  setActiveField(fieldId: string): void {
    this.updateState((current) => ({
      ...(current || this.getDefaultState()),
      activeFieldId: fieldId,
    }));
  },

  /**
   * Switch sidebar tab
   */
  setSidebarTab(tab: FormBuilderState["sidebarTab"]): void {
    this.updateState((current) => ({
      ...(current || this.getDefaultState()),
      sidebarTab: tab,
    }));
  },

  /**
   * Set view mode
   */
  setViewMode(mode: FormBuilderState["viewMode"]): void {
    this.updateState((current) => ({
      ...(current || this.getDefaultState()),
      viewMode: mode,
    }));
  },

  /**
   * Add to undo stack
   */
  addToUndoStack(action: string, data: any): void {
    this.updateState((current) => {
      const state = current || this.getDefaultState();
      const undoItem = { action, data, timestamp: new Date() };

      return {
        ...state,
        undoStack: [undoItem, ...state.undoStack].slice(0, 50), // limit to 50 items
        redoStack: [], // clear redo stack when new action is added
      };
    });
  },

  /**
   * Perform undo
   */
  undo(): { action: string; data: any } | null {
    const state = this.getState();
    if (!state || state.undoStack.length === 0) return null;

    const [undoItem, ...restUndo] = state.undoStack;

    this.updateState((current) => ({
      ...(current || this.getDefaultState()),
      undoStack: restUndo,
      redoStack: [undoItem, ...state.redoStack],
    }));

    return undoItem;
  },

  /**
   * Perform redo
   */
  redo(): { action: string; data: any } | null {
    const state = this.getState();
    if (!state || state.redoStack.length === 0) return null;

    const [redoItem, ...restRedo] = state.redoStack;

    this.updateState((current) => ({
      ...(current || this.getDefaultState()),
      redoStack: restRedo,
      undoStack: [redoItem, ...state.undoStack],
    }));

    return redoItem;
  },

  /**
   * Set clipboard
   */
  setClipboard(type: "FIELD" | "SECTION", data: any): void {
    this.updateState((current) => ({
      ...(current || this.getDefaultState()),
      clipboard: { type, data, timestamp: new Date() },
    }));
  },

  /**
   * Get default state
   */
  getDefaultState(): FormBuilderState {
    return {
      sidebarTab: "FIELDS",
      isDragging: false,
      undoStack: [],
      redoStack: [],
      viewMode: "DESKTOP",
      showFieldIds: false,
      showValidation: true,
      autoSave: {
        enabled: true,
        interval: 30, // 30 seconds
      },
    };
  },

  /**
   * Clear builder state cache
   */
  clearState(): void {
    formBuilderStateCache.clear();
  },

  /**
   * Check if state cache is valid
   */
  isStateValid(): boolean {
    return formBuilderStateCache.isValid();
  },
};

/**
 * Form builder analytics cache operations
 */
export const formBuilderAnalyticsManager = {
  /**
   * Get cached analytics
   */
  getAnalytics(): Record<string, FormBuilderAnalytics> | null {
    return formBuilderAnalyticsCache.get({
      fallback: {},
      validator: (data): data is Record<string, FormBuilderAnalytics> =>
        typeof data === "object" && data !== null,
    });
  },

  /**
   * Set analytics to cache
   */
  setAnalytics(analytics: Record<string, FormBuilderAnalytics>): void {
    formBuilderAnalyticsCache.set(analytics);
  },

  /**
   * Get analytics for specific form
   */
  getFormAnalytics(formId: string): FormBuilderAnalytics | null {
    const analytics = this.getAnalytics();
    return analytics?.[formId] || null;
  },

  /**
   * Update form analytics
   */
  updateFormAnalytics(
    formId: string,
    updater: (current: FormBuilderAnalytics | null) => FormBuilderAnalytics
  ): void {
    formBuilderAnalyticsCache.update((current) => {
      const analytics = current || {};
      return {
        ...analytics,
        [formId]: updater(analytics[formId] || null),
      };
    });
  },

  /**
   * Track form activity
   */
  trackActivity(formId: string, activity: Partial<FormBuilderAnalytics>): void {
    this.updateFormAnalytics(formId, (current) => {
      const defaultAnalytics: FormBuilderAnalytics = {
        formId,
        buildTime: 0,
        fieldsAdded: 0,
        fieldsRemoved: 0,
        sectionsAdded: 0,
        sectionsRemoved: 0,
        saves: 0,
        previews: 0,
        validationErrors: 0,
        lastActivity: new Date(),
        sessionsCount: 0,
      };

      return {
        ...defaultAnalytics,
        ...current,
        ...activity,
        lastActivity: new Date(),
      };
    });
  },

  /**
   * Clear analytics cache
   */
  clearAnalytics(): void {
    formBuilderAnalyticsCache.clear();
  },

  /**
   * Check if analytics cache is valid
   */
  isAnalyticsValid(): boolean {
    return formBuilderAnalyticsCache.isValid();
  },
};

/**
 * Migration utility to move data from old cache keys
 */
export const migrateFormBuilderCache = {
  /**
   * Migrate from old cache format to new format
   */
  migrate(): void {
    if (typeof window === "undefined") return;

    try {
      // Migrate form drafts
      const oldDraftKeys = [
        "gdg_form_drafts_v1",
        "form_builder_drafts_cache",
        "admin_form_drafts_cache",
      ];

      oldDraftKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const drafts = JSON.parse(oldData) as FormDraft[];
            formDraftsManager.setDrafts(drafts);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated form drafts cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate form drafts cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });

      // Migrate field templates
      const oldTemplateKeys = [
        "gdg_field_templates_v1",
        "form_field_templates_cache",
        "builder_templates_cache",
      ];

      oldTemplateKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const templates = JSON.parse(oldData) as FieldTemplate[];
            fieldTemplatesManager.setTemplates(templates);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated field templates cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate field templates cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });

      // Migrate builder state
      const oldStateKeys = [
        "gdg_form_builder_state_v1",
        "form_builder_state_cache",
        "builder_ui_state_cache",
      ];

      oldStateKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const state = JSON.parse(oldData) as FormBuilderState;
            formBuilderStateManager.setState(state);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated form builder state cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate form builder state cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });
    } catch (error) {
      console.error("Error migrating form builder cache:", error);
    }
  },
};

/**
 * Initialize form builder cache (call this when the form builder page loads)
 */
export function initFormBuilderCache(): void {
  migrateFormBuilderCache.migrate();
}
