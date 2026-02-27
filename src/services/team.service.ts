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
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import type { TeamMember, TeamMemberSerialized } from "@/types/team";

const COLLECTION = "team";

// ─── Helpers ────────────────────────────────────────────────

function serialize(
  id: string,
  data: Record<string, unknown>
): TeamMemberSerialized {
  return {
    id,
    imageUrl: data.imageUrl as string,
    logo: (data.logo as string) ?? null,
    name: data.name as string,
    designation: data.designation as string,
    position: (data.position as string) ?? null,
    linkedinUrl: (data.linkedinUrl as string) ?? null,
    mail: (data.mail as string) ?? null,
    dept_logo: (data.dept_logo as string) ?? null,
    bgColor: (data.bgColor as string) ?? null,
    rank: (data.rank as number) ?? 0,
    dept_rank: (data.dept_rank as number) ?? 0,
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

// ─── CRUD ───────────────────────────────────────────────────

export async function getAllTeamMembers(): Promise<TeamMemberSerialized[]> {
  const q = query(collection(db, COLLECTION), orderBy("name", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => serialize(d.id, d.data()));
}

export async function getTeamMemberById(
  id: string
): Promise<TeamMemberSerialized | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return serialize(snap.id, snap.data());
}

export async function createTeamMember(
  data: Omit<TeamMember, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateTeamMember(
  id: string,
  data: Partial<Omit<TeamMember, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTeamMember(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}

// ─── Real-Time Listeners ────────────────────────────────────

export function subscribeToTeamMembers(
  callback: (members: TeamMemberSerialized[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(collection(db, COLLECTION), orderBy("name", "asc"));
  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((d) => serialize(d.id, d.data())));
    },
    (err) => {
      console.error("[team.service] onSnapshot error:", err);
      onError?.(err);
    }
  );
}
