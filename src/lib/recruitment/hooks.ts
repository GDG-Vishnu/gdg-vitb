"use client";

import { useEffect, useState } from "react";
import {
  getDoc,
  getDocs,
  doc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import type { RecruitmentSettings, RecruitmentRoleSerialized } from "@/types/recruitment";
import { serializeTimestamp } from "@/lib/recruitment/serialize";

// ── Single-fetch settings hook ─────────────────────────────────

export function useSettings() {
  const [settings, setSettings] = useState<RecruitmentSettings | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const d = await getDoc(doc(db, "recruitment_settings", "global"));
        if (!d.exists()) {
          setSettings(null);
        } else {
          const data = d.data();
          setSettings({
            id: d.id,
            isRecruitmentActive: data.isRecruitmentActive ?? false,
            globalMessage: data.globalMessage ?? "",
            allowedEmailDomain: data.allowedEmailDomain ?? "@vishnu.edu.in",
            maxResumeSizeMB: data.maxResumeSizeMB ?? 5,
            maxTaskFileSizeMB: data.maxTaskFileSizeMB ?? 10,
            allowedResumeTypes: data.allowedResumeTypes ?? [".pdf", ".doc", ".docx"],
            allowedTaskTypes: data.allowedTaskTypes ?? [".doc", ".docx"],
            notifyOnApplication: data.notifyOnApplication ?? false,
            notificationEmails: data.notificationEmails ?? [],
            scriptUrl: data.scriptUrl ?? null,
            updatedAt: data.updatedAt,
          });
        }
      } catch (err) {
        console.error("[useSettings] Fetch error:", err);
      } finally {
        setReady(true);
      }
    }
    fetchSettings();
  }, []);

  return { settings, ready };
}

// ── Single-fetch role hook ──────────────────────────────

export function useRole(roleId: string) {
  const [role, setRole] = useState<RecruitmentRoleSerialized | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleId) {
      setLoading(false);
      return;
    }

    async function fetchRole() {
      try {
        const d = await getDoc(doc(db, "recruitment_roles", roleId));
        if (!d.exists()) {
          setRole(null);
        } else {
          const data = d.data();
          setRole({
            id: d.id,
            title: data.title,
            description: data.description,
            icon: data.icon,
            color: data.color,
            status: data.status,
            maxApplications: data.maxApplications,
            applicationStart: serializeTimestamp(data.applicationStart),
            applicationEnd: serializeTimestamp(data.applicationEnd),
            sections: data.sections,
            fields: data.fields,
            createdBy: data.createdBy,
            createdAt: serializeTimestamp(data.createdAt) ?? new Date().toISOString(),
            updatedAt: serializeTimestamp(data.updatedAt) ?? new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error("[useRole] Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRole();
  }, [roleId]);

  return { role, loading };
}

// ── Single-fetch open roles list hook ──────────────────────────

export function useOpenRoles() {
  const [roles, setRoles] = useState<RecruitmentRoleSerialized[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOpenRoles() {
      try {
        const q = query(
          collection(db, "recruitment_roles"),
          where("status", "in", ["open", "closing-soon"]),
        );
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title,
            description: data.description,
            icon: data.icon,
            color: data.color,
            status: data.status,
            maxApplications: data.maxApplications,
            applicationStart: serializeTimestamp(data.applicationStart),
            applicationEnd: serializeTimestamp(data.applicationEnd),
            sections: data.sections,
            fields: data.fields,
            createdBy: data.createdBy,
            createdAt: serializeTimestamp(data.createdAt) ?? new Date().toISOString(),
            updatedAt: serializeTimestamp(data.updatedAt) ?? new Date().toISOString(),
          };
        });
        setRoles(list);
      } catch (err) {
        console.error("[useOpenRoles] Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOpenRoles();
  }, []);

  return { roles, loading };
}
