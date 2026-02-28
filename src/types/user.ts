import { Timestamp } from "firebase/firestore";

export type UserRole = "user" | "admin";

export interface UserSocialMedia {
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  branch: string;
  graduationYear: number;
  phoneNumber: string;
  profileUrl: string;
  socialMedia: UserSocialMedia;
  resumeUrl?: string;
  participations: string[];
  role: UserRole;
  isBlocked: boolean;
  profileCompleted: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Serialized version for JSON responses (Timestamps → ISO strings) */
export interface UserSerialized {
  id: string;
  name: string;
  email: string;
  branch: string;
  graduationYear: number;
  phoneNumber: string;
  profileUrl: string;
  socialMedia: UserSocialMedia;
  resumeUrl?: string | null;
  participations: string[];
  role: UserRole;
  isBlocked: boolean;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Fields required to create a new user (id & timestamps auto-generated) */
export type CreateUserInput = Omit<User, "id" | "createdAt" | "updatedAt">;

/** Fields that can be updated on an existing user */
export type UpdateUserInput = Partial<
  Omit<User, "id" | "email" | "createdAt" | "updatedAt">
>;
