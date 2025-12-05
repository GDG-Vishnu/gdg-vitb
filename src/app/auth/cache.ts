/**
 * Cache management for Authentication pages
 * Handles caching of user sessions, login state, and auth preferences
 */

import { createCacheManager, CACHE_DURATIONS } from "@/lib/cache-utils";

// User session data
export type UserSession = {
  userId: string;
  email: string;
  name?: string;
  role: "ADMIN" | "USER" | "MODERATOR" | "GUEST";
  teamId?: string;
  teamRole?: "OWNER" | "ADMIN" | "MEMBER";
  avatar?: string;
  isEmailVerified: boolean;
  lastActive: Date;
  loginTimestamp: Date;
  expiresAt: Date;
  permissions: string[];
  preferences: {
    theme: "light" | "dark" | "system";
    language: string;
    timezone: string;
    notifications: boolean;
  };
  devices: Array<{
    deviceId: string;
    deviceName: string;
    lastUsed: Date;
    isCurrent: boolean;
  }>;
  securityFlags: {
    requiresPasswordChange: boolean;
    isTwoFactorEnabled: boolean;
    suspiciousActivity: boolean;
  };
};

// Login attempt tracking
export type LoginAttempt = {
  attemptId: string;
  email: string;
  timestamp: Date;
  success: boolean;
  errorCode?: string;
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
  location?: {
    country: string;
    city: string;
  };
  method:
    | "EMAIL_PASSWORD"
    | "GOOGLE_OAUTH"
    | "GITHUB_OAUTH"
    | "MAGIC_LINK"
    | "TWO_FACTOR";
  deviceInfo?: {
    browser: string;
    os: string;
    isMobile: boolean;
  };
};

// Authentication preferences
export type AuthPreferences = {
  rememberMe: boolean;
  preferredLoginMethod: "EMAIL_PASSWORD" | "GOOGLE_OAUTH" | "GITHUB_OAUTH";
  autoLogout: boolean;
  autoLogoutDuration: number; // in minutes
  showSecurityAlerts: boolean;
  enableTwoFactor: boolean;
  trustedDevices: string[]; // device IDs
  recentEmails: string[]; // for autocomplete
  passwordStrengthRequirements: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  sessionTimeout: number; // in minutes
};

// Password reset data
export type PasswordResetData = {
  resetId: string;
  email: string;
  token?: string;
  requestedAt: Date;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
  completed: boolean;
  verificationCode?: string;
  securityQuestions?: Array<{
    question: string;
    answer: string; // hashed
  }>;
};

// Email verification data
export type EmailVerificationData = {
  verificationId: string;
  email: string;
  userId?: string;
  code: string;
  sentAt: Date;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
  verified: boolean;
  resendCount: number;
  maxResends: number;
};

// OAuth state data
export type OAuthState = {
  provider: "GOOGLE" | "GITHUB" | "DISCORD" | "MICROSOFT";
  state: string;
  codeVerifier?: string; // for PKCE
  redirectUrl: string;
  scope: string[];
  createdAt: Date;
  expiresAt: Date;
  attemptId: string;
};

// Security event tracking
export type SecurityEvent = {
  eventId: string;
  userId?: string;
  email?: string;
  type:
    | "LOGIN_SUCCESS"
    | "LOGIN_FAILED"
    | "LOGOUT"
    | "PASSWORD_CHANGED"
    | "EMAIL_CHANGED"
    | "ACCOUNT_LOCKED"
    | "SUSPICIOUS_ACTIVITY"
    | "TWO_FACTOR_ENABLED"
    | "TWO_FACTOR_DISABLED";
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  location?: {
    country: string;
    city: string;
  };
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  resolved: boolean;
  details?: any;
};

// Cache managers
export const userSessionCache = createCacheManager<UserSession | null>({
  key: "gdg_user_session_v2",
  timestampKey: "gdg_user_session_timestamp_v2",
  duration: CACHE_DURATIONS.SHORT, // 2 minutes (session data changes frequently)
});

export const loginAttemptsCache = createCacheManager<LoginAttempt[]>({
  key: "gdg_login_attempts_v2",
  timestampKey: "gdg_login_attempts_timestamp_v2",
  duration: CACHE_DURATIONS.MEDIUM, // 5 minutes
});

export const authPreferencesCache = createCacheManager<AuthPreferences>({
  key: "gdg_auth_preferences_v2",
  timestampKey: "gdg_auth_preferences_timestamp_v2",
  duration: CACHE_DURATIONS.EXTRA_LONG, // 30 minutes (preferences persist)
});

export const passwordResetCache = createCacheManager<PasswordResetData | null>({
  key: "gdg_password_reset_v2",
  timestampKey: "gdg_password_reset_timestamp_v2",
  duration: CACHE_DURATIONS.MEDIUM, // 5 minutes
});

export const emailVerificationCache =
  createCacheManager<EmailVerificationData | null>({
    key: "gdg_email_verification_v2",
    timestampKey: "gdg_email_verification_timestamp_v2",
    duration: CACHE_DURATIONS.MEDIUM, // 5 minutes
  });

export const oauthStateCache = createCacheManager<OAuthState | null>({
  key: "gdg_oauth_state_v2",
  timestampKey: "gdg_oauth_state_timestamp_v2",
  duration: CACHE_DURATIONS.SHORT, // 2 minutes (OAuth states are short-lived)
});

export const securityEventsCache = createCacheManager<SecurityEvent[]>({
  key: "gdg_security_events_v2",
  timestampKey: "gdg_security_events_timestamp_v2",
  duration: CACHE_DURATIONS.LONG, // 15 minutes
});

/**
 * User session cache operations
 */
export const userSessionManager = {
  /**
   * Get cached user session
   */
  getSession(): UserSession | null {
    return userSessionCache.get({
      validator: (data): data is UserSession =>
        data !== null &&
        typeof data === "object" &&
        "userId" in data &&
        "email" in data &&
        "role" in data &&
        "loginTimestamp" in data &&
        "expiresAt" in data,
    });
  },

  /**
   * Set user session to cache
   */
  setSession(session: UserSession): void {
    userSessionCache.set(session);
  },

  /**
   * Update user session
   */
  updateSession(
    updater: (current: UserSession | null) => UserSession | null
  ): void {
    userSessionCache.update(updater);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const session = this.getSession();
    if (!session) return false;

    const now = new Date();
    const expiresAt = new Date(session.expiresAt);

    return now < expiresAt && session.isEmailVerified;
  },

  /**
   * Check if session is expired
   */
  isSessionExpired(): boolean {
    const session = this.getSession();
    if (!session) return true;

    const now = new Date();
    const expiresAt = new Date(session.expiresAt);

    return now >= expiresAt;
  },

  /**
   * Update last active timestamp
   */
  updateLastActive(): void {
    this.updateSession((current) => {
      if (!current) return current;

      return {
        ...current,
        lastActive: new Date(),
      };
    });
  },

  /**
   * Add device to session
   */
  addDevice(device: UserSession["devices"][0]): void {
    this.updateSession((current) => {
      if (!current) return current;

      // Remove existing device with same ID
      const devices = current.devices.filter(
        (d) => d.deviceId !== device.deviceId
      );

      return {
        ...current,
        devices: [device, ...devices],
      };
    });
  },

  /**
   * Update user preferences
   */
  updatePreferences(preferences: Partial<UserSession["preferences"]>): void {
    this.updateSession((current) => {
      if (!current) return current;

      return {
        ...current,
        preferences: {
          ...current.preferences,
          ...preferences,
        },
      };
    });
  },

  /**
   * Clear user session cache
   */
  clearSession(): void {
    userSessionCache.clear();
  },

  /**
   * Check if session cache is valid
   */
  isSessionValid(): boolean {
    return userSessionCache.isValid();
  },
};

/**
 * Login attempts cache operations
 */
export const loginAttemptsManager = {
  /**
   * Get cached login attempts
   */
  getAttempts(): LoginAttempt[] | null {
    return loginAttemptsCache.get({
      fallback: [],
      validator: (data): data is LoginAttempt[] =>
        Array.isArray(data) &&
        data.every(
          (attempt) =>
            typeof attempt === "object" &&
            attempt !== null &&
            "attemptId" in attempt &&
            "email" in attempt &&
            "timestamp" in attempt &&
            "success" in attempt
        ),
    });
  },

  /**
   * Set login attempts to cache
   */
  setAttempts(attempts: LoginAttempt[]): void {
    loginAttemptsCache.set(attempts);
  },

  /**
   * Add login attempt
   */
  addAttempt(attempt: LoginAttempt): void {
    loginAttemptsCache.update((current) => {
      const attempts = current || [];

      // Keep only last 50 attempts
      return [attempt, ...attempts].slice(0, 50);
    });
  },

  /**
   * Get failed attempts for email
   */
  getFailedAttemptsForEmail(
    email: string,
    timeWindow: number = 15
  ): LoginAttempt[] {
    const attempts = this.getAttempts();
    if (!attempts) return [];

    const cutoffTime = new Date(Date.now() - timeWindow * 60 * 1000); // timeWindow in minutes

    return attempts.filter(
      (attempt) =>
        attempt.email.toLowerCase() === email.toLowerCase() &&
        !attempt.success &&
        new Date(attempt.timestamp) > cutoffTime
    );
  },

  /**
   * Get successful attempts for email
   */
  getSuccessfulAttemptsForEmail(email: string): LoginAttempt[] {
    const attempts = this.getAttempts();
    if (!attempts) return [];

    return attempts.filter(
      (attempt) =>
        attempt.email.toLowerCase() === email.toLowerCase() && attempt.success
    );
  },

  /**
   * Check if email is temporarily locked
   */
  isEmailLocked(
    email: string,
    maxAttempts: number = 5,
    timeWindow: number = 15
  ): boolean {
    const failedAttempts = this.getFailedAttemptsForEmail(email, timeWindow);
    return failedAttempts.length >= maxAttempts;
  },

  /**
   * Get time until email unlock
   */
  getTimeUntilUnlock(email: string, timeWindow: number = 15): number {
    const failedAttempts = this.getFailedAttemptsForEmail(email, timeWindow);
    if (failedAttempts.length === 0) return 0;

    const oldestAttempt = failedAttempts[failedAttempts.length - 1];
    const unlockTime = new Date(
      new Date(oldestAttempt.timestamp).getTime() + timeWindow * 60 * 1000
    );
    const now = new Date();

    return Math.max(0, unlockTime.getTime() - now.getTime());
  },

  /**
   * Clear login attempts cache
   */
  clearAttempts(): void {
    loginAttemptsCache.clear();
  },

  /**
   * Check if attempts cache is valid
   */
  isAttemptsValid(): boolean {
    return loginAttemptsCache.isValid();
  },
};

/**
 * Auth preferences cache operations
 */
export const authPreferencesManager = {
  /**
   * Get cached auth preferences
   */
  getPreferences(): AuthPreferences | null {
    return authPreferencesCache.get({
      validator: (data): data is AuthPreferences =>
        typeof data === "object" &&
        data !== null &&
        "rememberMe" in data &&
        "preferredLoginMethod" in data &&
        "autoLogout" in data,
    });
  },

  /**
   * Set auth preferences to cache
   */
  setPreferences(preferences: AuthPreferences): void {
    authPreferencesCache.set(preferences);
  },

  /**
   * Update auth preferences
   */
  updatePreferences(
    updater: (current: AuthPreferences | null) => AuthPreferences
  ): void {
    authPreferencesCache.update(updater);
  },

  /**
   * Get preferences with defaults
   */
  getPreferencesWithDefaults(): AuthPreferences {
    return this.getPreferences() || this.getDefaultPreferences();
  },

  /**
   * Get default preferences
   */
  getDefaultPreferences(): AuthPreferences {
    return {
      rememberMe: false,
      preferredLoginMethod: "EMAIL_PASSWORD",
      autoLogout: true,
      autoLogoutDuration: 60, // 1 hour
      showSecurityAlerts: true,
      enableTwoFactor: false,
      trustedDevices: [],
      recentEmails: [],
      passwordStrengthRequirements: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: false,
      },
      sessionTimeout: 120, // 2 hours
    };
  },

  /**
   * Add recent email
   */
  addRecentEmail(email: string): void {
    this.updatePreferences((current) => {
      const prefs = current || this.getDefaultPreferences();
      const recentEmails = prefs.recentEmails.filter((e) => e !== email);

      return {
        ...prefs,
        recentEmails: [email, ...recentEmails].slice(0, 5), // keep only last 5
      };
    });
  },

  /**
   * Add trusted device
   */
  addTrustedDevice(deviceId: string): void {
    this.updatePreferences((current) => {
      const prefs = current || this.getDefaultPreferences();

      if (prefs.trustedDevices.includes(deviceId)) return prefs;

      return {
        ...prefs,
        trustedDevices: [...prefs.trustedDevices, deviceId],
      };
    });
  },

  /**
   * Remove trusted device
   */
  removeTrustedDevice(deviceId: string): void {
    this.updatePreferences((current) => {
      const prefs = current || this.getDefaultPreferences();

      return {
        ...prefs,
        trustedDevices: prefs.trustedDevices.filter((id) => id !== deviceId),
      };
    });
  },

  /**
   * Clear auth preferences cache
   */
  clearPreferences(): void {
    authPreferencesCache.clear();
  },

  /**
   * Check if preferences cache is valid
   */
  isPreferencesValid(): boolean {
    return authPreferencesCache.isValid();
  },
};

/**
 * Security events cache operations
 */
export const securityEventsManager = {
  /**
   * Get cached security events
   */
  getEvents(): SecurityEvent[] | null {
    return securityEventsCache.get({
      fallback: [],
      validator: (data): data is SecurityEvent[] =>
        Array.isArray(data) &&
        data.every(
          (event) =>
            typeof event === "object" &&
            event !== null &&
            "eventId" in event &&
            "type" in event &&
            "timestamp" in event &&
            "severity" in event
        ),
    });
  },

  /**
   * Set security events to cache
   */
  setEvents(events: SecurityEvent[]): void {
    securityEventsCache.set(events);
  },

  /**
   * Add security event
   */
  addEvent(event: SecurityEvent): void {
    securityEventsCache.update((current) => {
      const events = current || [];

      // Keep only last 100 events
      return [event, ...events].slice(0, 100);
    });
  },

  /**
   * Get unresolved events
   */
  getUnresolvedEvents(): SecurityEvent[] {
    const events = this.getEvents();
    if (!events) return [];

    return events.filter((event) => !event.resolved);
  },

  /**
   * Get events by severity
   */
  getEventsBySeverity(severity: SecurityEvent["severity"]): SecurityEvent[] {
    const events = this.getEvents();
    if (!events) return [];

    return events.filter((event) => event.severity === severity);
  },

  /**
   * Mark event as resolved
   */
  resolveEvent(eventId: string): void {
    securityEventsCache.update((current) => {
      if (!current) return current || [];

      return current.map((event) =>
        event.eventId === eventId ? { ...event, resolved: true } : event
      );
    });
  },

  /**
   * Clear security events cache
   */
  clearEvents(): void {
    securityEventsCache.clear();
  },

  /**
   * Check if events cache is valid
   */
  isEventsValid(): boolean {
    return securityEventsCache.isValid();
  },
};

/**
 * Migration utility to move data from old cache keys
 */
export const migrateAuthCache = {
  /**
   * Migrate from old cache format to new format
   */
  migrate(): void {
    if (typeof window === "undefined") return;

    try {
      // Migrate user session
      const oldSessionKeys = [
        "gdg_user_session_v1",
        "user_session_cache",
        "auth_session_data",
        "current_user_session",
      ];

      oldSessionKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const session = JSON.parse(oldData) as UserSession;
            userSessionManager.setSession(session);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated user session cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate user session cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });

      // Migrate auth preferences
      const oldPreferencesKeys = [
        "gdg_auth_preferences_v1",
        "auth_user_preferences",
        "login_preferences_cache",
      ];

      oldPreferencesKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const preferences = JSON.parse(oldData) as AuthPreferences;
            authPreferencesManager.setPreferences(preferences);

            localStorage.removeItem(oldKey);
            console.log(
              `Migrated auth preferences cache from ${oldKey} to new format`
            );
          } catch (error) {
            console.warn(
              `Failed to migrate auth preferences cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });

      // Clean up old temporary data
      const oldTempKeys = [
        "gdg_login_attempts_v1",
        "gdg_password_reset_v1",
        "gdg_email_verification_v1",
        "gdg_oauth_state_v1",
        "login_temp_data",
        "password_reset_temp",
        "oauth_temp_state",
      ];

      oldTempKeys.forEach((oldKey) => {
        localStorage.removeItem(oldKey);
      });
    } catch (error) {
      console.error("Error migrating auth cache:", error);
    }
  },
};

/**
 * Initialize auth cache (call this when auth pages load)
 */
export function initAuthCache(): void {
  migrateAuthCache.migrate();
}
