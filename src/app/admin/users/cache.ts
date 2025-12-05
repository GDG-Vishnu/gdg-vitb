/**
 * Cache management for Admin Users page
 * Handles caching of users data and user-related operations
 */

import { createCacheManager, CACHE_DURATIONS } from "@/lib/cache-utils";

// User type definition (matching Prisma schema)
export type User = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: "USER" | "ADMIN" | "MODERATOR";
  createdAt: Date;
  updatedAt: Date;
  isActive?: boolean;
  lastLogin?: Date | null;
};

// User statistics type
export type UserStats = {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  moderatorUsers: number;
  newUsersThisMonth: number;
  userGrowthRate: number;
};

// Cache managers
export const usersListCache = createCacheManager<User[]>({
  key: "gdg_admin_users_v2",
  timestampKey: "gdg_admin_users_timestamp_v2",
  duration: CACHE_DURATIONS.MEDIUM, // 5 minutes
});

export const userStatsCache = createCacheManager<UserStats>({
  key: "gdg_admin_user_stats_v2",
  timestampKey: "gdg_admin_user_stats_timestamp_v2",
  duration: CACHE_DURATIONS.MEDIUM, // 5 minutes
});

/**
 * Users list cache operations
 */
export const usersManager = {
  /**
   * Get cached users list
   */
  getUsers(): User[] | null {
    return usersListCache.get({
      fallback: [],
      validator: (data): data is User[] =>
        Array.isArray(data) &&
        data.every(
          (user) =>
            typeof user === "object" &&
            user !== null &&
            "id" in user &&
            "email" in user &&
            "role" in user
        ),
    });
  },

  /**
   * Set users to cache
   */
  setUsers(users: User[]): void {
    usersListCache.set(users);
  },

  /**
   * Update users in cache
   */
  updateUsers(updater: (current: User[]) => User[]): void {
    usersListCache.update((current) => updater(current || []));
  },

  /**
   * Update a single user
   */
  updateUser(userId: string, updater: (user: User) => User): void {
    usersListCache.update((current) => {
      if (!current) return current || [];

      return current.map((user) => (user.id === userId ? updater(user) : user));
    });
  },

  /**
   * Add new user
   */
  addUser(newUser: User): void {
    usersListCache.update((current) => {
      if (!current) return [newUser];

      // Check if user already exists
      const exists = current.some((user) => user.id === newUser.id);
      if (exists) {
        // Update existing user
        return current.map((user) => (user.id === newUser.id ? newUser : user));
      } else {
        // Add new user
        return [...current, newUser];
      }
    });
  },

  /**
   * Remove user
   */
  removeUser(userId: string): void {
    usersListCache.update((current) => {
      if (!current) return current || [];

      return current.filter((user) => user.id !== userId);
    });
  },

  /**
   * Get user by ID
   */
  getUserById(userId: string): User | null {
    const allUsers = this.getUsers();
    if (!allUsers) return null;

    return allUsers.find((user) => user.id === userId) || null;
  },

  /**
   * Get users by role
   */
  getUsersByRole(role: User["role"]): User[] | null {
    const allUsers = this.getUsers();
    if (!allUsers) return null;

    return allUsers.filter((user) => user.role === role);
  },

  /**
   * Search users by name or email
   */
  searchUsers(query: string): User[] | null {
    const allUsers = this.getUsers();
    if (!allUsers) return null;

    const lowerQuery = query.toLowerCase();
    return allUsers.filter(
      (user) =>
        user.name?.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Clear users cache
   */
  clearUsers(): void {
    usersListCache.clear();
  },

  /**
   * Check if users cache is valid
   */
  isUsersValid(): boolean {
    return usersListCache.isValid();
  },
};

/**
 * User statistics cache operations
 */
export const userStatsManager = {
  /**
   * Get cached user statistics
   */
  getStats(): UserStats | null {
    return userStatsCache.get({
      validator: (data): data is UserStats =>
        typeof data === "object" &&
        data !== null &&
        "totalUsers" in data &&
        "activeUsers" in data &&
        typeof (data as any).totalUsers === "number",
    });
  },

  /**
   * Set user statistics to cache
   */
  setStats(stats: UserStats): void {
    userStatsCache.set(stats);
  },

  /**
   * Update user statistics
   */
  updateStats(updater: (current: UserStats | null) => UserStats): void {
    userStatsCache.update(updater);
  },

  /**
   * Recalculate statistics from cached users
   */
  recalculateFromUsers(): UserStats | null {
    const users = usersManager.getUsers();
    if (!users) return null;

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats: UserStats = {
      totalUsers: users.length,
      activeUsers: users.filter((user) => user.isActive !== false).length,
      adminUsers: users.filter((user) => user.role === "ADMIN").length,
      moderatorUsers: users.filter((user) => user.role === "MODERATOR").length,
      newUsersThisMonth: users.filter(
        (user) => new Date(user.createdAt) >= thisMonth
      ).length,
      userGrowthRate: 0, // This would need historical data
    };

    this.setStats(stats);
    return stats;
  },

  /**
   * Clear user statistics cache
   */
  clearStats(): void {
    userStatsCache.clear();
  },

  /**
   * Check if user statistics cache is valid
   */
  isStatsValid(): boolean {
    return userStatsCache.isValid();
  },
};

/**
 * Migration utility to move data from old cache keys
 */
export const migrateUsersCache = {
  /**
   * Migrate from old cache format to new format
   */
  migrate(): void {
    if (typeof window === "undefined") return;

    try {
      // Check for old users cache
      const oldKeys = [
        "gdg_admin_users_v1",
        "gdg_users_list_v1",
        "admin_users_cache",
      ];

      oldKeys.forEach((oldKey) => {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const users = JSON.parse(oldData) as User[];
            usersManager.setUsers(users);

            // Clean up old cache
            localStorage.removeItem(oldKey);

            console.log(`Migrated users cache from ${oldKey} to new format`);
          } catch (error) {
            console.warn(
              `Failed to migrate users cache from ${oldKey}:`,
              error
            );
            localStorage.removeItem(oldKey);
          }
        }
      });

      // Migrate user stats if they exist
      const oldStatsKeys = [
        "gdg_admin_user_stats_v1",
        "admin_user_stats_cache",
      ];

      oldStatsKeys.forEach((oldKey) => {
        const oldStats = localStorage.getItem(oldKey);
        if (oldStats) {
          try {
            const stats = JSON.parse(oldStats) as UserStats;
            userStatsManager.setStats(stats);

            localStorage.removeItem(oldKey);
            console.log(`Migrated user stats from ${oldKey} to new format`);
          } catch (error) {
            console.warn(`Failed to migrate user stats from ${oldKey}:`, error);
            localStorage.removeItem(oldKey);
          }
        }
      });
    } catch (error) {
      console.error("Error migrating users cache:", error);
    }
  },
};

/**
 * Initialize users cache (call this when the admin users page loads)
 */
export function initUsersCache(): void {
  migrateUsersCache.migrate();
}
