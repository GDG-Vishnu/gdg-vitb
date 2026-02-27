"use client";

import { useEffect, useState } from "react";
import {
  subscribeToEvents,
  subscribeToEvent,
} from "@/services/event.service";
import { subscribeToTeamMembers } from "@/services/team.service";
import { subscribeToBlogs } from "@/services/blog.service";
import type { EventSerialized } from "@/types/event";
import type { TeamMemberSerialized } from "@/types/team";
import type { BlogSerialized } from "@/types/blog";

// ─── Events ─────────────────────────────────────────────────

/**
 * Real-time hook: subscribes to the full events collection.
 * Updates automatically when the admin dashboard writes changes.
 */
export function useEvents() {
  const [events, setEvents] = useState<EventSerialized[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsub = subscribeToEvents(
      (data) => {
        setEvents(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { events, loading, error };
}

/**
 * Real-time hook: subscribes to a single event document.
 */
export function useEvent(id: string | undefined) {
  const [event, setEvent] = useState<EventSerialized | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const unsub = subscribeToEvent(
      id,
      (data) => {
        setEvent(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [id]);

  return { event, loading, error };
}

// ─── Team ───────────────────────────────────────────────────

export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMemberSerialized[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsub = subscribeToTeamMembers(
      (data) => {
        setMembers(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { members, loading, error };
}

// ─── Blogs ──────────────────────────────────────────────────

export function useBlogs(publishedOnly = true) {
  const [blogs, setBlogs] = useState<BlogSerialized[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsub = subscribeToBlogs(
      (data) => {
        setBlogs(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
      publishedOnly
    );
    return () => unsub();
  }, [publishedOnly]);

  return { blogs, loading, error };
}
