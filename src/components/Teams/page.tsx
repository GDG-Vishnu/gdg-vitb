"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Home/navbar";
import Footer from "@/app/client/footer/Footer";
import MemberCard from "./MemberCard";

type TeamMember = {
  id: string;
  imageUrl?: string | null;
  name: string;
  designation?: string | null;
  position?: string | null;
  linkedinUrl?: string | null;
  mail?: string | null;
};

export default function TeamsPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/teams/list");
        if (!res.ok) throw new Error("Failed to fetch team members");
        const data = await res.json();
        if (!mounted) return;
        setTeam(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-white relative overflow-hidden "
      style={{
        backgroundColor: "white",
        backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      {/* Site navbar */}
      <Navbar />

      {/* Meet the Team CTA */}

      <div className="w-full flex justify-center mt-6">
        <a
          href="#team"
          className="group inline-flex items-center bg-black text-white rounded-full px-8 py-3 shadow-lg"
          style={{
            borderRadius: 9999,
            gap: "1rem",
          }1}
        >
          <span className="text-4xl font-semibold tracking-wider ">
            MEET THE TEAM
          </span>
          <span className=" bg-black rounded-full flex items-center justify-center text-black transform transition-transform duration-500">
            <img
              src="https://res.cloudinary.com/dlupkibvq/image/upload/v1760852238/Frame_15_gaqrwq.png"
              className="w-[50px] h-[50px] group-hover:rotate-180 transition-transform duration-500"
              alt=""
            />
          </span>
        </a>
      </div>

      {/* Main content area - leave remaining content for later */}
      <div className="relative z-10 flex flex-col items-center justify-start pt-6 px-4">
        <h1 className="text-lg md:text-2xl font-bold mb-4">
          {" "}
          Bringing ideas to life through technology and community.
        </h1>
        {/* Add Teams content here */}

        <div className="mt-8 w-full">
          {loading && <div>Loading team members...</div>}
          {!loading && team.length === 0 && (
            <div className="col-span-full text-center">
              No team members found.
            </div>
          )}

          {!loading && team.length > 0 && (
            // Group members by position and render a section per position
            <div id="team" className="space-y-8 ">
              {Object.entries(
                team.reduce<Record<string, TeamMember[]>>((acc, member) => {
                  const pos = (member.position || "").trim() || "Unspecified";
                  if (!acc[pos]) acc[pos] = [];
                  acc[pos].push(member);
                  return acc;
                }, {})
              ).map(([position, members]) => (
                <section
                  key={position}
                  aria-labelledby={`pos-${position}`}
                  className=""
                >
                  <h2
                    id={`pos-${position}`}
                    className="text-xl font-semibold mb-4 text-center"
                  >
                    {position}
                  </h2>
                  <div className="flex flex-wrap justify-center gap-6">
                    {members.map((m) => (
                      <MemberCard
                        key={m.id}
                        id={m.id}
                        imageUrl={m.imageUrl || "/file.svg"}
                        name={m.name}
                        designation={m.designation || "MEMBER"}
                        position={m.position || undefined}
                        linkedinUrl={m.linkedinUrl || undefined}
                        mail={m.mail || undefined}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Footer */}

      <Footer />
    </div>
  );
}
