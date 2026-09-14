import { Timestamp } from "firebase/firestore";

export function serializeTimestamp(ts: Timestamp | null | undefined): string | null {
  return ts?.toDate?.().toISOString() ?? null;
}
