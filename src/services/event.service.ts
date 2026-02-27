import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import type { Event, EventSerialized } from "@/types/event";

const COLLECTION = "events";

// ─── Helpers ────────────────────────────────────────────────

/** Convert Firestore doc → serialized plain object */
function serialize(
  id: string,
  data: Record<string, unknown>
): EventSerialized {
  return {
    id,
    rank: (data.rank as number) ?? 0,
    title: data.title as string,
    description: data.description as string,
    Date:
      data.Date instanceof Timestamp
        ? data.Date.toDate().toISOString()
        : (data.Date as string) ?? null,
    Time: data.Time as string,
    venue: data.venue as string,
    organizer: data.organizer as string,
    coOrganizer: (data.coOrganizer as string) ?? null,
    keyHighlights: (data.keyHighlights as string[]) ?? [],
    tags: (data.tags as string[]) ?? [],
    status: data.status as string,
    eventGallery: (data.eventGallery as string[]) ?? [],
    imageUrl: (data.imageUrl as string) ?? null,
    coverUrl: (data.coverUrl as string) ?? null,
    isDone: (data.isDone as boolean) ?? false,
    MembersParticipated: (data.MembersParticipated as number) ?? 0,
    Theme: (data.Theme as string[]) ?? [],
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : undefined,
    updatedAt:
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate().toISOString()
        : undefined,
  };
}

// ─── CRUD (client-side — uses Firebase Client SDK) ──────────

/** Get all events ordered by rank ascending */
export async function getAllEvents(): Promise<EventSerialized[]> {
  const q = query(collection(db, COLLECTION), orderBy("rank", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => serialize(d.id, d.data()));
}

/** Get a single event by document id */
export async function getEventById(
  id: string
): Promise<EventSerialized | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return serialize(snap.id, snap.data());
}

/** Create a new event — returns the created document id */
export async function createEvent(
  data: Omit<Event, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/** Update an existing event */
export async function updateEvent(
  id: string,
  data: Partial<Omit<Event, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/** Delete an event */
export async function deleteEvent(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}

// ─── Real-Time Listeners ────────────────────────────────────

/**
 * Subscribe to all events, ordered by rank.
 * Returns an unsubscribe function.
 *
 * Usage in a React component:
 * ```ts
 * useEffect(() => {
 *   const unsub = subscribeToEvents((events) => setEvents(events));
 *   return () => unsub();
 * }, []);
 * ```
 */
export function subscribeToEvents(
  callback: (events: EventSerialized[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(collection(db, COLLECTION), orderBy("rank", "asc"));
  return onSnapshot(
    q,
    (snap) => {
      const events = snap.docs.map((d) => serialize(d.id, d.data()));
      callback(events);
    },
    (err) => {
      console.error("[event.service] onSnapshot error:", err);
      onError?.(err);
    }
  );
}

/**
 * Subscribe to a single event by id.
 * Returns an unsubscribe function.
 */
export function subscribeToEvent(
  id: string,
  callback: (event: EventSerialized | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const ref = doc(db, COLLECTION, id);
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        callback(null);
        return;
      }
      callback(serialize(snap.id, snap.data()));
    },
    (err) => {
      console.error("[event.service] onSnapshot error:", err);
      onError?.(err);
    }
  );
}
