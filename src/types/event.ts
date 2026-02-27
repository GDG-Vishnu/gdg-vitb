import { Timestamp } from "firebase/firestore";

export interface Event {
  id: string;
  rank: number;
  title: string;
  description: string;
  Date: Timestamp | string;
  Time: string;
  venue: string;
  organizer: string;
  coOrganizer?: string;
  keyHighlights: string[];
  tags: string[];
  status: string;
  eventGallery: string[];
  imageUrl?: string;
  coverUrl?: string;
  isDone: boolean;
  MembersParticipated: number;
  Theme: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/** Serialized version for JSON responses (Timestamps converted to ISO strings) */
export interface EventSerialized {
  id: string;
  rank: number;
  title: string;
  description: string;
  Date: string | null;
  Time: string;
  venue: string;
  organizer: string;
  coOrganizer?: string | null;
  keyHighlights: string[];
  tags: string[];
  status: string;
  eventGallery: string[];
  imageUrl?: string | null;
  coverUrl?: string | null;
  isDone: boolean;
  MembersParticipated: number;
  Theme: string[];
  createdAt?: string;
  updatedAt?: string;
}
