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
import type { Blog, BlogSerialized } from "@/types/blog";

const COLLECTION = "blogs";

// ─── Helpers ────────────────────────────────────────────────

function serialize(
  id: string,
  data: Record<string, unknown>
): BlogSerialized {
  return {
    id,
    title: data.title as string,
    content: data.content as string,
    author: data.author as string,
    slug: data.slug as string,
    imageUrl: (data.imageUrl as string) ?? null,
    tags: (data.tags as string[]) ?? [],
    published: (data.published as boolean) ?? false,
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

export async function getAllBlogs(
  publishedOnly = true
): Promise<BlogSerialized[]> {
  let q;
  if (publishedOnly) {
    q = query(
      collection(db, COLLECTION),
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );
  } else {
    q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => serialize(d.id, d.data()));
}

export async function getBlogById(
  id: string
): Promise<BlogSerialized | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return serialize(snap.id, snap.data());
}

export async function getBlogBySlug(
  slug: string
): Promise<BlogSerialized | null> {
  const q = query(collection(db, COLLECTION), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return serialize(d.id, d.data());
}

export async function createBlog(
  data: Omit<Blog, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateBlog(
  id: string,
  data: Partial<Omit<Blog, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBlog(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}

// ─── Real-Time Listeners ────────────────────────────────────

export function subscribeToBlogs(
  callback: (blogs: BlogSerialized[]) => void,
  onError?: (error: Error) => void,
  publishedOnly = true
): Unsubscribe {
  let q;
  if (publishedOnly) {
    q = query(
      collection(db, COLLECTION),
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );
  } else {
    q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  }
  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((d) => serialize(d.id, d.data())));
    },
    (err) => {
      console.error("[blog.service] onSnapshot error:", err);
      onError?.(err);
    }
  );
}
