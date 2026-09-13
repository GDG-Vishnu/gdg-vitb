"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/lib/recruitment/hooks";
import { serializeTimestamp } from "@/lib/recruitment/serialize";
import type { RecruitmentRoleSerialized } from "@/types/recruitment";

export default function RecruitmentPage() {
  const { settings, ready: settingsReady } = useSettings();
  const { firebaseUser } = useAuth();
  const [openRoles, setOpenRoles] = useState<RecruitmentRoleSerialized[]>([]);
  const [allRoles, setAllRoles] = useState<RecruitmentRoleSerialized[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedRole, setAppliedRole] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseUser) return;
    const checkApp = async () => {
      try {
        const snap = await getDoc(doc(db, "recruitment_applications", firebaseUser.email!));
        if (snap.exists()) {
          setAppliedRole(snap.data().roleId);
        }
      } catch (err) {
        console.error("Failed to check application:", err);
      }
    };
    checkApp();
  }, [firebaseUser]);

  useEffect(() => {
    async function load() {
      try {
        // Fetch open roles
        const openQuery = query(
          collection(db, "recruitment_roles"),
          where("status", "in", ["open", "closing-soon"]),
        );
        const openSnap = await getDocs(openQuery);
        const open = openSnap.docs.map((d) => {
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
        setOpenRoles(open);

        // Fetch all roles for closed/coming-soon display
        const allSnap = await getDocs(collection(db, "recruitment_roles"));
        const all = allSnap.docs.map((d) => {
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
        setAllRoles(all);
      } catch (err) {
        console.error("[Recruitment] Failed to load roles:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const comingSoonRoles = allRoles.filter((r) => r.status === "coming-soon" || r.status === "draft");
  const closedRoles = allRoles.filter((r) => r.status === "closed" || r.status === "archived");
  const hasOpenRoles = openRoles.length > 0;
  const hasComingSoon = comingSoonRoles.length > 0;

  if (loading || !settingsReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">Loading recruitment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-4 md:py-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6 md:mb-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 md:mb-6">
            <Image
              src="/favicon.ico"
              alt="GDG Logo"
              width={96}
              height={96}
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                <span className="text-blue-600">GDG VITB</span>
                <span className="text-gray-400"> - </span>
                <span className="text-red-500">Recruitment</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-1">
                Vishnu Institute of Technology
              </p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Join Google Developer Groups at VITB and be part of an amazing
            community of developers, designers, and innovators.
          </p>
        </div>

        {/* ── Applied State ──────────────────────────────── */}
        {appliedRole && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl md:rounded-2xl p-8 sm:p-10 md:p-14 text-center mb-8">
            <div className="text-5xl sm:text-6xl mb-4">✅</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 mb-3">
              Application Submitted
            </h2>
            <p className="text-green-800 text-sm sm:text-base md:text-lg max-w-xl mx-auto">
              You have already applied to the <strong>{allRoles.find(r => r.id === appliedRole)?.title || appliedRole}</strong> department. We will get back to you soon.
            </p>
          </div>
        )}

        {/* ── Global Message ─────────────────────────────── */}
        {settings?.globalMessage && (
          <div className="mb-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
            <p className="text-blue-800 font-medium">{settings.globalMessage}</p>
          </div>
        )}

        {/* ── Inactive Banner ────────────────────────────── */}
        {settings && !settings.isRecruitmentActive && !hasOpenRoles && !appliedRole && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl md:rounded-2xl p-8 sm:p-10 md:p-14 text-center">
            <div className="text-5xl sm:text-6xl mb-4">🚫</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 mb-3">
              Hirings Closed
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto">
              Thank you for your interest! Recruitment for all positions is
              currently closed. Stay tuned for future openings.
            </p>
          </div>
        )}

        {/* ── Open Roles ─────────────────────────────────── */}
        {!appliedRole && hasOpenRoles && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {openRoles.map((role) => (
              <Link
                key={role.id}
                href={`/recruitment/${role.id}`}
                className="block bg-white border-2 rounded-2xl p-6 hover:shadow-lg transition-all group"
                style={{ borderColor: role.color }}
              >
                <div className="text-4xl mb-3">{role.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {role.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                <span
                  className="inline-block px-4 py-2 text-white text-sm font-semibold rounded-lg"
                  style={{ backgroundColor: role.color }}
                >
                  Apply Now
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* ── Coming Soon Roles ──────────────────────────── */}
        {!appliedRole && hasComingSoon && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {comingSoonRoles.map((role) => (
              <div
                key={role.id}
                className="block bg-white border-2 border-dashed rounded-2xl p-6 opacity-75"
                style={{ borderColor: role.color }}
              >
                <div className="text-4xl mb-3">{role.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{role.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                <span className="inline-block px-4 py-2 bg-gray-200 text-gray-600 text-sm font-semibold rounded-lg">
                  Coming Soon
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Closed Roles ───────────────────────────────── */}
        {!appliedRole && closedRoles.length > 0 && hasOpenRoles && (
          <div className="mt-10">
            <h2 className="text-lg font-bold text-gray-400 mb-4">Past Openings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {closedRoles.map((role) => (
                <div
                  key={role.id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{role.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-gray-700">{role.title}</h4>
                      <span className="text-xs text-gray-400 capitalize">{role.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
