import { Timestamp } from "firebase/firestore";

export type EventStatus = "upcoming" | "ongoing" | "completed";

export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  coverUrl: string;
  date: Timestamp;
  endDate: Timestamp;
  venue: string;
  organizer: string;
  coOrganizer: string;
  theme: string[];
  tags: string[];
  keyHighlights: string[];
  eventGallery: string[];
  membersParticipated: number;
  rank: number;
  status: EventStatus;
  isDone: boolean;
  registrationEnabled: boolean;
  teamSizeMin: number;
  teamSizeMax: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Serialized version for JSON responses (Timestamps → ISO strings) */
export interface EventSerialized {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  coverUrl: string | null;
  date: string | null;
  endDate: string | null;
  venue: string;
  organizer: string;
  coOrganizer: string | null;
  theme: string[];
  tags: string[];
  keyHighlights: string[];
  eventGallery: string[];
  membersParticipated: number;
  rank: number;
  status: EventStatus;
  isDone: boolean;
  registrationEnabled: boolean;
  teamSizeMin: number;
  teamSizeMax: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Fields required to create a new event (id & timestamps auto-generated) */
export type CreateEventInput = Omit<Event, "id" | "createdAt" | "updatedAt">;

/** Fields that can be updated on an existing event */
export type UpdateEventInput = Partial<
  Omit<Event, "id" | "createdAt" | "updatedAt">
>;
