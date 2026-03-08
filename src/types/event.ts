import { Timestamp } from "firebase/firestore";

export type EventStatus = "UPCOMING" | "ONGOING" | "COMPLETED";
export type EventMode = "ONLINE" | "OFFLINE" | "HYBRID";
export type EventType = "WORKSHOP" | "HACKATHON";

export interface EventOfficial {
  role: "GUEST" | "SPEAKER" | "JURY";
  name: string;
  email: string;
  bio?: string;
  expertise?: string;
  profileUrl?: string;
  linkedinUrl?: string;
}

export interface Event {
  id: string; // eventId (Firestore doc ID)
  title: string;
  description: string;
  bannerImage: string;
  posterImage: string;
  startDate: Timestamp | null;
  endDate: Timestamp | null;
  venue: string;
  mode: EventMode;
  status: EventStatus;
  eventType: EventType;
  maxParticipants: number;
  registrationStart: Timestamp | null;
  registrationEnd: Timestamp | null;
  isRegistrationOpen: boolean;
  createdBy: string;
  tags: string[];
  keyHighlights: string[];
  eligibilityCriteria: {
    yearOfGrad: boolean[];
    Dept: string[];
  };
  executiveBoard: {
    organiser: string;
    coOrganiser: string;
    facilitator: string;
  };
  eventOfficials: EventOfficial[];
  faqs: { question: string; answer: string }[];
  rules: { rule: string }[];
  eventGallery: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Serialized version for JSON responses (Timestamps → ISO strings) */
export interface EventSerialized {
  id: string;
  title: string;
  description: string;
  bannerImage: string | null;
  posterImage: string | null;
  startDate: string | null;
  endDate: string | null;
  venue: string;
  mode: EventMode;
  status: EventStatus;
  eventType: EventType;
  maxParticipants: number;
  registrationStart: string | null;
  registrationEnd: string | null;
  isRegistrationOpen: boolean;
  createdBy: string;
  tags: string[];
  keyHighlights: string[];
  eligibilityCriteria: {
    yearOfGrad: boolean[];
    Dept: string[];
  };
  executiveBoard: {
    organiser: string;
    coOrganiser: string;
    facilitator: string;
  };
  eventOfficials: EventOfficial[];
  faqs: { question: string; answer: string }[];
  rules: { rule: string }[];
  eventGallery: string[];
  Theme: string[];
  createdAt?: string;
  updatedAt?: string;
}

/** Fields required to create a new event (id & timestamps auto-generated) */
export type CreateEventInput = Omit<Event, "id" | "createdAt" | "updatedAt">;

/** Fields that can be updated on an existing event */
export type UpdateEventInput = Partial<
  Omit<Event, "id" | "createdAt" | "updatedAt">
>;
