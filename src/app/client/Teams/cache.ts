/**
 * Cache management for Teams page
 * Handles caching of team members and team-related data
 */

import { createCacheManager, CACHE_DURATIONS } from "@/lib/cache-utils";

// Team member type definition
export type TeamMember = {
  id: number;
  name: string;
  email: string;
  role?: string;
  position?: string;
  avatar?: string | null;
  bio?: string | null;
  skills?: string[] | null;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  } | null;
  joinedDate?: string | null;
  isActive: boolean;
  teamName?: string;
  rank?: number;
};

// Team data type
export type Team = {
  id: number;
  name: string;
  description?: string | null;
  members: TeamMember[];
  leaderId?: number | null;
  createdAt: string;
  updatedAt: string;
};

// Cache managers
export const teamMembersCache = createCacheManager<TeamMember[]>({
  key: "gdg_team_members_v2",
  timestampKey: "gdg_team_members_timestamp_v2",
  duration: CACHE_DURATIONS.LONG, // 15 minutes
});

export const teamsCache = createCacheManager<Team[]>({
  key: "gdg_teams_list_v2",
  timestampKey: "gdg_teams_list_timestamp_v2",
  duration: CACHE_DURATIONS.LONG, // 15 minutes
});

/**
 * Team members cache operations
 */
export const teamMembersManager = {
  /**
   * Get cached team members
   */
  getMembers(): TeamMember[] | null {
    return teamMembersCache.get({
      fallback: [],
      validator: (data): data is TeamMember[] =>
        Array.isArray(data) &&
        data.every(
          (member) =>
            typeof member === "object" &&
            member !== null &&
            "id" in member &&
            "name" in member &&
            "email" in member
        ),
    });
  },

  /**
   * Set team members to cache
   */
  setMembers(members: TeamMember[]): void {
    teamMembersCache.set(members);
  },

  /**
   * Update team members in cache
   */
  updateMembers(updater: (current: TeamMember[]) => TeamMember[]): void {
    teamMembersCache.update((current) => updater(current || []));
  },

  /**
   * Add or update a single team member
   */
  updateMember(
    memberId: number,
    updater: (member: TeamMember) => TeamMember
  ): void {
    teamMembersCache.update((current) => {
      if (!current) return current || [];

      return current.map((member) =>
        member.id === memberId ? updater(member) : member
      );
    });
  },

  /**
   * Add new team member
   */
  addMember(newMember: TeamMember): void {
    teamMembersCache.update((current) => {
      if (!current) return [newMember];

      // Check if member already exists
      const exists = current.some((member) => member.id === newMember.id);
      if (exists) {
        // Update existing member
        return current.map((member) =>
          member.id === newMember.id ? newMember : member
        );
      } else {
        // Add new member
        return [...current, newMember];
      }
    });
  },

  /**
   * Remove team member
   */
  removeMember(memberId: number): void {
    teamMembersCache.update((current) => {
      if (!current) return current || [];

      return current.filter((member) => member.id !== memberId);
    });
  },

  /**
   * Get team members by team name
   */
  getMembersByTeam(teamName: string): TeamMember[] | null {
    const allMembers = this.getMembers();
    if (!allMembers) return null;

    return allMembers.filter(
      (member) => member.teamName?.toLowerCase() === teamName.toLowerCase()
    );
  },

  /**
   * Get team member by ID
   */
  getMemberById(memberId: number): TeamMember | null {
    const allMembers = this.getMembers();
    if (!allMembers) return null;

    return allMembers.find((member) => member.id === memberId) || null;
  },

  /**
   * Clear team members cache
   */
  clearMembers(): void {
    teamMembersCache.clear();
  },

  /**
   * Check if team members cache is valid
   */
  isMembersValid(): boolean {
    return teamMembersCache.isValid();
  },
};

/**
 * Teams list cache operations
 */
export const teamsManager = {
  /**
   * Get cached teams list
   */
  getTeams(): Team[] | null {
    return teamsCache.get({
      fallback: [],
      validator: (data): data is Team[] =>
        Array.isArray(data) &&
        data.every(
          (team) =>
            typeof team === "object" &&
            team !== null &&
            "id" in team &&
            "name" in team &&
            "members" in team &&
            Array.isArray((team as any).members)
        ),
    });
  },

  /**
   * Set teams to cache
   */
  setTeams(teams: Team[]): void {
    teamsCache.set(teams);

    // Also cache all team members
    const allMembers = teams.flatMap((team) => team.members);
    teamMembersManager.setMembers(allMembers);
  },

  /**
   * Update teams in cache
   */
  updateTeams(updater: (current: Team[]) => Team[]): void {
    teamsCache.update((current) => {
      const updated = updater(current || []);

      // Update team members cache as well
      const allMembers = updated.flatMap((team) => team.members);
      teamMembersManager.setMembers(allMembers);

      return updated;
    });
  },

  /**
   * Update a single team
   */
  updateTeam(teamId: number, updater: (team: Team) => Team): void {
    teamsCache.update((current) => {
      if (!current) return current || [];

      const updated = current.map((team) =>
        team.id === teamId ? updater(team) : team
      );

      // Update team members cache
      const allMembers = updated.flatMap((team) => team.members);
      teamMembersManager.setMembers(allMembers);

      return updated;
    });
  },

  /**
   * Add new team
   */
  addTeam(newTeam: Team): void {
    teamsCache.update((current) => {
      if (!current) {
        teamMembersManager.setMembers(newTeam.members);
        return [newTeam];
      }

      // Check if team already exists
      const exists = current.some((team) => team.id === newTeam.id);
      const updated = exists
        ? current.map((team) => (team.id === newTeam.id ? newTeam : team))
        : [...current, newTeam];

      // Update team members cache
      const allMembers = updated.flatMap((team) => team.members);
      teamMembersManager.setMembers(allMembers);

      return updated;
    });
  },

  /**
   * Remove team
   */
  removeTeam(teamId: number): void {
    teamsCache.update((current) => {
      if (!current) return current || [];

      const updated = current.filter((team) => team.id !== teamId);

      // Update team members cache
      const allMembers = updated.flatMap((team) => team.members);
      teamMembersManager.setMembers(allMembers);

      return updated;
    });
  },

  /**
   * Get team by ID
   */
  getTeamById(teamId: number): Team | null {
    const allTeams = this.getTeams();
    if (!allTeams) return null;

    return allTeams.find((team) => team.id === teamId) || null;
  },

  /**
   * Get team by name
   */
  getTeamByName(teamName: string): Team | null {
    const allTeams = this.getTeams();
    if (!allTeams) return null;

    return (
      allTeams.find(
        (team) => team.name.toLowerCase() === teamName.toLowerCase()
      ) || null
    );
  },

  /**
   * Clear teams cache
   */
  clearTeams(): void {
    teamsCache.clear();
    // Also clear team members since they're related
    teamMembersManager.clearMembers();
  },

  /**
   * Check if teams cache is valid
   */
  isTeamsValid(): boolean {
    return teamsCache.isValid();
  },
};

/**
 * Migration utility to move data from old cache keys
 */
export const migrateTeamsCache = {
  /**
   * Migrate from old cache format to new format
   */
  migrate(): void {
    if (typeof window === "undefined") return;

    try {
      // Check for old team members cache
      const oldKey = "gdg_team_members_v1";
      const oldMembers = localStorage.getItem(oldKey);

      if (oldMembers) {
        const members = JSON.parse(oldMembers) as TeamMember[];
        teamMembersManager.setMembers(members);

        // Clean up old cache
        localStorage.removeItem(oldKey);

        console.log("Migrated team members cache to new format");
      }

      // Check for other old cache keys and migrate them
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (
          key.startsWith("gdg_team") &&
          !key.includes("_v2") &&
          key !== oldKey
        ) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              // Try to parse and migrate based on data structure
              const parsed = JSON.parse(data);

              if (Array.isArray(parsed)) {
                // Assume it's team members
                teamMembersManager.setMembers(parsed);
              }

              localStorage.removeItem(key);
            } catch (error) {
              console.warn(`Failed to migrate team cache: ${key}`, error);
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.error("Error migrating teams cache:", error);
    }
  },
};

/**
 * Initialize teams cache (call this when the teams page loads)
 */
export function initTeamsCache(): void {
  migrateTeamsCache.migrate();
}
