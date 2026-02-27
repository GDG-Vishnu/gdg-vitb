import { Timestamp } from "firebase/firestore";

export interface TeamMember {
  id: string;
  imageUrl: string;
  logo?: string;
  name: string;
  designation: string;
  position?: string;
  linkedinUrl?: string;
  mail?: string;
  dept_logo?: string;
  bgColor?: string;
  rank: number;
  dept_rank: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/** Serialized version for JSON responses */
export interface TeamMemberSerialized {
  id: string;
  imageUrl: string;
  logo?: string | null;
  name: string;
  designation: string;
  position?: string | null;
  linkedinUrl?: string | null;
  mail?: string | null;
  dept_logo?: string | null;
  bgColor?: string | null;
  rank: number;
  dept_rank: number;
  createdAt?: string;
  updatedAt?: string;
}
