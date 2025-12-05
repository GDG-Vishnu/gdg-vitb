/**
 * Cache management for Admin Forms page
 * Handles caching of form configurations, submissions, and form-related operations
 */

import { createCacheManager, CACHE_DURATIONS } from "@/lib/cache-utils";

// Form configuration type (matching form builder structure)
export type FormConfig = {
  id: string;
  title: string;
  description?: string;
  isPublished: boolean;
  sections: FormSection[];
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  settings?: FormSettings;
};

export type FormSection = {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  order: number;
};

export type FormField = {
  id: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "textarea"
    | "select"
    | "radio"
    | "checkbox"
    | "date"
    | "file";
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  order: number;
};

export type FormSettings = {
  allowMultipleSubmissions: boolean;
  requireAuth: boolean;
  showProgressBar: boolean;
  confirmationMessage?: string;
  redirectUrl?: string;
};

// Form submission type
export type FormSubmission = {
  id: string;
  formId: string;
  userId?: string;
  submittedAt: Date;
  data: Record<string, any>;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewedBy?: string;
  reviewedAt?: Date;
  notes?: string;
};

// Form statistics type
export type FormStats = {
  totalForms: number;
  publishedForms: number;
  draftForms: number;
  totalSubmissions: number;
  submissionsToday: number;
  submissionsThisWeek: number;
  submissionsThisMonth: number;
  averageCompletionRate: number;
};

// Cache managers
export const formsListCache = createCacheManager<FormConfig[]>({
  key: "gdg_admin_forms_v2",
  timestampKey: "gdg_admin_forms_timestamp_v2",
  duration: CACHE_DURATIONS.MEDIUM, // 5 minutes
});

export const formSubmissionsCache = createCacheManager<FormSubmission[]>({
  key: "gdg_admin_submissions_v2",
  timestampKey: "gdg_admin_submissions_timestamp_v2",
  duration: CACHE_DURATIONS.SHORT, // 2 minutes (submissions change frequently)
});

export const formStatsCache = createCacheManager<FormStats>({
  key: "gdg_admin_form_stats_v2",
  timestampKey: "gdg_admin_form_stats_timestamp_v2",
  duration: CACHE_DURATIONS.MEDIUM, // 5 minutes
});

/**
 * Forms list cache operations
 */
export const formsManager = {
  /**
   * Get cached forms list
   */
  getForms(): FormConfig[] | null {
    return formsListCache.get({
      fallback: [],
      validator: (data): data is FormConfig[] =>
        Array.isArray(data) &&
        data.every(
          (form) =>
            typeof form === "object" &&
            form !== null &&
            "id" in form &&
            "title" in form &&
            "isPublished" in form &&
            Array.isArray(form.sections)
        ),
    });
  },

  /**
   * Set forms to cache
   */
  setForms(forms: FormConfig[]): void {
    formsListCache.set(forms);
  },

  /**
   * Update forms in cache
   */
  updateForms(updater: (current: FormConfig[]) => FormConfig[]): void {
    formsListCache.update((current) => updater(current || []));
  },

  /**
   * Update a single form
   */
  updateForm(formId: string, updater: (form: FormConfig) => FormConfig): void {
    formsListCache.update((current) => {
      if (!current) return current || [];

      return current.map((form) => (form.id === formId ? updater(form) : form));
    });
  },

  /**
   * Add new form
   */
  addForm(newForm: FormConfig): void {
    formsListCache.update((current) => {
      if (!current) return [newForm];

      // Check if form already exists
      const exists = current.some((form) => form.id === newForm.id);
      if (exists) {
        // Update existing form
        return current.map((form) => (form.id === newForm.id ? newForm : form));
      } else {
        // Add new form (insert at beginning for recent forms first)
        return [newForm, ...current];
      }
    });
  },

  /**
   * Remove form
   */
  removeForm(formId: string): void {
    formsListCache.update((current) => {
      if (!current) return current || [];

      return current.filter((form) => form.id !== formId);
    });
  },

  /**
   * Get form by ID
   */
  getFormById(formId: string): FormConfig | null {
    const allForms = this.getForms();
    if (!allForms) return null;

    return allForms.find((form) => form.id === formId) || null;
  },

  /**
   * Get published forms
   */
  getPublishedForms(): FormConfig[] | null {
    const allForms = this.getForms();
    if (!allForms) return null;

    return allForms.filter((form) => form.isPublished);
  },

  /**
   * Get draft forms
   */
  getDraftForms(): FormConfig[] | null {
    const allForms = this.getForms();
    if (!allForms) return null;

    return allForms.filter((form) => !form.isPublished);
  },

  /**
   * Search forms by title or description
   */
  searchForms(query: string): FormConfig[] | null {
    const allForms = this.getForms();
    if (!allForms) return null;

    const lowerQuery = query.toLowerCase();
    return allForms.filter(
      (form) =>
        form.title.toLowerCase().includes(lowerQuery) ||
        form.description?.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Toggle form published status
   */
  toggleFormPublished(formId: string): void {
    this.updateForm(formId, (form) => ({
      ...form,
      isPublished: !form.isPublished,
      updatedAt: new Date(),
    }));
  },

  /**
   * Clear forms cache
   */
  clearForms(): void {
    formsListCache.clear();
  },

  /**
   * Check if forms cache is valid
   */
  isFormsValid(): boolean {
    return formsListCache.isValid();
  },
};

/**
 * Form submissions cache operations
 */
export const submissionsManager = {
  /**
   * Get cached submissions
   */
  getSubmissions(): FormSubmission[] | null {
    return formSubmissionsCache.get({
      fallback: [],
      validator: (data): data is FormSubmission[] =>
        Array.isArray(data) &&
        data.every(
          (submission) =>
            typeof submission === "object" &&
            submission !== null &&
            "id" in submission &&
            "formId" in submission &&
            "submittedAt" in submission &&
            "data" in submission
        ),
    });
  },

  /**
   * Set submissions to cache
   */
  setSubmissions(submissions: FormSubmission[]): void {
    formSubmissionsCache.set(submissions);
  },

  /**
   * Update submissions in cache
   */
  updateSubmissions(
    updater: (current: FormSubmission[]) => FormSubmission[]
  ): void {
    formSubmissionsCache.update((current) => updater(current || []));
  },

  /**
   * Add new submission
   */
  addSubmission(newSubmission: FormSubmission): void {
    formSubmissionsCache.update((current) => {
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
    status: FormSubmission["status"],
    reviewedBy?: string,
    notes?: string
  ): void {
    formSubmissionsCache.update((current) => {
      if (!current) return current || [];

      return current.map((submission) =>
        submission.id === submissionId
          ? {
              ...submission,
              status,
              reviewedBy,
              reviewedAt: new Date(),
              notes,
            }
          : submission
      );
    });
  },

  /**
   * Get submissions by form ID
   */
  getSubmissionsByForm(formId: string): FormSubmission[] | null {
    const allSubmissions = this.getSubmissions();
    if (!allSubmissions) return null;

    return allSubmissions.filter((submission) => submission.formId === formId);
  },

  /**
   * Get submissions by status
   */
  getSubmissionsByStatus(
    status: FormSubmission["status"]
  ): FormSubmission[] | null {
    const allSubmissions = this.getSubmissions();
    if (!allSubmissions) return null;

    return allSubmissions.filter((submission) => submission.status === status);
  },

  /**
   * Get pending submissions (requiring review)
   */
  getPendingSubmissions(): FormSubmission[] | null {
    return this.getSubmissionsByStatus("PENDING");
  },

  /**
   * Remove submission
   */
  removeSubmission(submissionId: string): void {
    formSubmissionsCache.update((current) => {
      if (!current) return current || [];

      return current.filter((submission) => submission.id !== submissionId);
    });
  },

  /**
   * Clear submissions cache
   */
  clearSubmissions(): void {
    formSubmissionsCache.clear();
  },

  /**
   * Check if submissions cache is valid
   */
  isSubmissionsValid(): boolean {
    return formSubmissionsCache.isValid();
  },
};

/**
 * Form statistics cache operations
 */
export const formStatsManager = {
  /**
   * Get cached form statistics
   */
  getStats(): FormStats | null {
    return formStatsCache.get({
      validator: (data): data is FormStats =>
        typeof data === "object" &&
        data !== null &&
        "totalForms" in data &&
        "totalSubmissions" in data &&
        typeof (data as any).totalForms === "number",
    });
  },

  /**
   * Set form statistics to cache
   */
  setStats(stats: FormStats): void {
    formStatsCache.set(stats);
  },

  /**
   * Update form statistics
   */
  updateStats(updater: (current: FormStats | null) => FormStats): void {
    formStatsCache.update(updater);
  },

  /**
   * Recalculate statistics from cached forms and submissions
   */
  recalculateFromCache(): FormStats | null {
    const forms = formsManager.getForms();
    const submissions = submissionsManager.getSubmissions();

    if (!forms || !submissions) return null;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const stats: FormStats = {
      totalForms: forms.length,
      publishedForms: forms.filter((form) => form.isPublished).length,
      draftForms: forms.filter((form) => !form.isPublished).length,
      totalSubmissions: submissions.length,
      submissionsToday: submissions.filter(
        (s) => new Date(s.submittedAt) >= today
      ).length,
      submissionsThisWeek: submissions.filter(
        (s) => new Date(s.submittedAt) >= weekAgo
      ).length,
      submissionsThisMonth: submissions.filter(
        (s) => new Date(s.submittedAt) >= monthAgo
      ).length,
      averageCompletionRate: 85, // This would need additional tracking
    };

    this.setStats(stats);
    return stats;
  },

  /**
   * Clear form statistics cache
   */
  clearStats(): void {
    formStatsCache.clear();
  },

  /**
   * Check if form statistics cache is valid
   */
  isStatsValid(): boolean {
    return formStatsCache.isValid();
  },
};

/**
 * Migration utility to move data from old cache keys
 */
export const migrateFormsCache = {
  /**
   * Migrate from old cache format to new format
   */
  migrate(): void {
    if (typeof window === "undefined") return;

    try {
      // Check for old forms cache
      const oldFormKeys = [
        "gdg_admin_forms_v1",
        "gdg_forms_list_v1",
        "admin_forms_cache",
        "form_configs_cache",
      ];

      oldFormKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const forms = JSON.parse(oldData) as FormConfig[];
            formsManager.setForms(forms);

            localStorage.removeItem(oldKey);
            console.log(`Migrated forms cache from ${oldKey} to new format`);
          } catch (error) {
            console.warn(
              `Failed to migrate forms cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });

      // Migrate submissions cache
      const oldSubmissionKeys = [
        "gdg_admin_submissions_v1",
        "admin_submissions_cache",
        "form_submissions_cache",
      ];

      oldSubmissionKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const submissions = JSON.parse(oldData) as FormSubmission[];
            submissionsManager.setSubmissions(submissions);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated submissions cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate submissions cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });

      // Migrate form stats
      const oldStatsKeys = [
        "gdg_admin_form_stats_v1",
        "admin_form_stats_cache",
      ];

      oldStatsKeys.forEach((oldKey) => {
        const oldStats = localStorage.getItem(oldKey);
        if (oldStats) {
          try {
            const stats = JSON.parse(oldStats) as FormStats;
            formStatsManager.setStats(stats);

            localStorage.removeItem(oldKey);
            console.log(`Migrated form stats from ${oldKey} to new format`);
          } catch (error) {
            console.warn(`Failed to migrate form stats from ${oldKey}:`, error);
            localStorage.removeItem(oldKey);
          }
        }
      });
    } catch (error) {
      console.error("Error migrating forms cache:", error);
    }
  },
};

/**
 * Initialize forms cache (call this when the admin forms page loads)
 */
export function initFormsCache(): void {
  migrateFormsCache.migrate();
}
