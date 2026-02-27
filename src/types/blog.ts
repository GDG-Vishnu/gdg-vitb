import { Timestamp } from "firebase/firestore";

export interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  slug: string;
  imageUrl?: string;
  tags: string[];
  published: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/** Serialized version for JSON responses */
export interface BlogSerialized {
  id: string;
  title: string;
  content: string;
  author: string;
  slug: string;
  imageUrl?: string | null;
  tags: string[];
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}
