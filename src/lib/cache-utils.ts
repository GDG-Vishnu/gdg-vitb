/**
 * Base cache utilities for localStorage operations
 * Provides consistent caching interface across all pages
 */

export interface CacheConfig {
  key: string;
  timestampKey: string;
  duration: number; // in milliseconds
}

export interface CacheOptions<T> {
  fallback?: T;
  validator?: (data: unknown) => data is T;
}

/**
 * Generic cache manager class
 */
export class CacheManager<T> {
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.config = config;
  }

  /**
   * Check if we're in browser environment
   */
  private isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  /**
   * Get cached data with timestamp validation
   */
  get(options?: CacheOptions<T>): T | null {
    if (!this.isBrowser()) return null;

    try {
      const cached = localStorage.getItem(this.config.key);
      const timestamp = localStorage.getItem(this.config.timestampKey);

      if (!cached || !timestamp) {
        return options?.fallback || null;
      }

      // Check if cache is still valid
      const age = Date.now() - parseInt(timestamp, 10);
      if (age > this.config.duration) {
        // Cache expired, clean up
        this.clear();
        return options?.fallback || null;
      }

      const parsed = JSON.parse(cached) as T;

      // Validate data if validator provided
      if (options?.validator && !options.validator(parsed)) {
        console.warn(`Cache validation failed for key: ${this.config.key}`);
        this.clear();
        return options?.fallback || null;
      }

      return parsed;
    } catch (error) {
      console.error(`Error reading cache for key: ${this.config.key}`, error);
      this.clear(); // Clear corrupted cache
      return options?.fallback || null;
    }
  }

  /**
   * Set data to cache with timestamp
   */
  set(data: T): void {
    if (!this.isBrowser()) return;

    try {
      localStorage.setItem(this.config.key, JSON.stringify(data));
      localStorage.setItem(this.config.timestampKey, Date.now().toString());
    } catch (error) {
      console.error(`Error saving to cache for key: ${this.config.key}`, error);
      // Handle quota exceeded or other localStorage errors
      if (error instanceof DOMException && error.code === 22) {
        console.warn("localStorage quota exceeded, clearing old caches");
        this.clearExpiredCaches();
      }
    }
  }

  /**
   * Update existing cached data
   */
  update(updater: (current: T | null) => T): void {
    const current = this.get();
    const updated = updater(current);
    this.set(updated);
  }

  /**
   * Clear specific cache
   */
  clear(): void {
    if (!this.isBrowser()) return;

    try {
      localStorage.removeItem(this.config.key);
      localStorage.removeItem(this.config.timestampKey);
    } catch (error) {
      console.error(`Error clearing cache for key: ${this.config.key}`, error);
    }
  }

  /**
   * Check if cache exists and is valid
   */
  isValid(): boolean {
    if (!this.isBrowser()) return false;

    try {
      const timestamp = localStorage.getItem(this.config.timestampKey);
      if (!timestamp) return false;

      const age = Date.now() - parseInt(timestamp, 10);
      return age <= this.config.duration;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get cache age in milliseconds
   */
  getAge(): number | null {
    if (!this.isBrowser()) return null;

    try {
      const timestamp = localStorage.getItem(this.config.timestampKey);
      if (!timestamp) return null;

      return Date.now() - parseInt(timestamp, 10);
    } catch (error) {
      return null;
    }
  }

  /**
   * Clear all expired caches (utility method)
   */
  private clearExpiredCaches(): void {
    if (!this.isBrowser()) return;

    const keys = Object.keys(localStorage);
    const timestampKeys = keys.filter(
      (key) => key.includes("_timestamp_") || key.includes("_cache_timestamp")
    );

    timestampKeys.forEach((timestampKey) => {
      try {
        const timestamp = localStorage.getItem(timestampKey);
        if (timestamp) {
          const age = Date.now() - parseInt(timestamp, 10);
          // Remove caches older than 1 hour
          if (age > 60 * 60 * 1000) {
            localStorage.removeItem(timestampKey);
            // Try to find and remove corresponding data key
            const dataKey = timestampKey
              .replace("_timestamp", "")
              .replace("_cache_timestamp", "");
            localStorage.removeItem(dataKey);
          }
        }
      } catch (error) {
        console.warn(`Error clearing expired cache: ${timestampKey}`, error);
      }
    });
  }
}

/**
 * Create a cache manager instance
 */
export function createCacheManager<T>(config: CacheConfig): CacheManager<T> {
  return new CacheManager<T>(config);
}

/**
 * Cache duration constants
 */
export const CACHE_DURATIONS = {
  SHORT: 2 * 60 * 1000, // 2 minutes
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 15 * 60 * 1000, // 15 minutes
  VERY_LONG: 60 * 60 * 1000, // 1 hour
} as const;
