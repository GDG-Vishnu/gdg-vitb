"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/app/client/Home/navbar";
import LoadingTeam from "@/components/loadingPage/loading_team";
import Footer from "@/components/footer/Footer";
import MemberCard from "./MemberCard";

type TeamMember = {
  bgColor?: string | null;
  logo?: string | null;
  id: string;
  imageUrl?: string | null;
  name: string;
  designation?: string | null;
  position?: string | null;
  rank?: number | null;
  dept_rank?: number | null;
  dept_logo?: string | null;
  linkedinUrl?: string | null;
  mail?: string | null;
};

export default function TeamsPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    let mounted = true;

    // Fetch team data directly from API
    (async () => {
      try {
        const res = await fetch("/api/teams/list");
        if (!res.ok) throw new Error("Failed to fetch team members");
        const data = await res.json();
        // console.log("team data:", data);
        if (!mounted) return;
        setTeam(data || []);
      } catch (err) {
        console.error("Failed to fetch team members:", err);
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

      <div className="w-full flex justify-center mt-6 px-4">
        <a
          href="#team"
          className="
      group inline-flex items-center justify-center
      bg-black text-white rounded-full shadow-lg
      px-6 sm:px-8 py-2 sm:py-3
      transition-transform duration-500
      
    "
          style={{ borderRadius: 9999, gap: "0.75rem" }}
        >
          <span
            className="
        text-lg sm:text-2xl md:text-3xl lg:text-4xl
        font-semibold tracking-wider text-center font-productSans
      "
          >
            MEET THE TEAM
          </span>

          <span
            className="
        bg-black rounded-full flex items-center justify-center
        text-black
        transition-transform duration-500
      "
          >
            <img
              src="https://res.cloudinary.com/dlupkibvq/image/upload/v1760852238/Frame_15_gaqrwq.png"
              className="
          w-[36px] h-[36px]
          sm:w-[42px] sm:h-[42px]
          md:w-[50px] md:h-[50px]
          group-hover:rotate-180 transition-transform duration-500
        "
              alt=""
            />
          </span>
        </a>
      </div>

      {/* Main content area - leave remaining content for later */}
      <div className="relative z-10 flex flex-col items-center justify-start pt-6 px-4">
        <h1 className="text-lg text-center md:text-2xl font-bold mb-4 text-stone-950 font-productSans">
          {" "}
          Bringing ideas to life through technology and community.
        </h1>
        {/* Add Teams content here */}

        <div className="mt-8 w-full">
          {loading && (
            <LoadingTeam variant="section" message="Loading team members..." />
          )}
          {!loading && team.length === 0 && (
            <div className="col-span-full text-center font-productSans">
              No team members found.
            </div>
          )}

          {!loading && team.length > 0 && (
            // Group members by position and render a section per position
            <div id="team" className="space-y-8 w-full">
              {Object.entries(
                // sort by dept_rank (ascending), then rank, then name, then group by position
                team
                  .slice()
                  .sort((a, b) => {
                    // First sort by dept_rank (department position on page)
                    const dra =
                      typeof a.dept_rank === "number" ? a.dept_rank : 0;
                    const drb =
                      typeof b.dept_rank === "number" ? b.dept_rank : 0;
                    if (dra !== drb) return dra - drb;
                    // Then sort by rank within the position
                    const ra = typeof a.rank === "number" ? a.rank : 0;
                    const rb = typeof b.rank === "number" ? b.rank : 0;
                    if (ra !== rb) return ra - rb;
                    // Finally sort by name
                    return (a.name || "").localeCompare(b.name || "");
                  })
                  .reduce<Record<string, TeamMember[]>>((acc, member) => {
                    const pos = (member.position || "").trim() || "Unspecified";
                    if (!acc[pos]) acc[pos] = [];
                    acc[pos].push(member);
                    return acc;
                  }, {})
              ).map(([position, members]) => (
                <section
                  key={position}
                  aria-labelledby={`pos-${position}`}
                  className="flex flex-col items-center w-full"
                >
                  <div
                    style={{
                      backgroundColor: members[0]?.bgColor || undefined,
                    }}
                    className="
  w-[330px]            /* mobile default */
  h-[54px]
  sm:w-[370px]         /* optional - keeps 370px on small screens */
  lg:w-[800px]         /* large screen width */
  text-center
  rounded-[100px]
  items-center
  justify-center
  flex
  border-2
  border-stone-900
"
                  >
                    <h2
                      id={`pos-${position}`}
                      className="text-xl font-semibold  sm:m-1 p-2 text-center text-stone-950 font-productSans"
                    >
                      {position}
                    </h2>
                    {/* <img src={members[0].dept_logo || "/default-logo.png"} alt={`${position} logo`} />*/}
                  </div>
                  <div className="h-4"></div>
                  {/* Mobile: horizontal scroll */}
                  <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 md:hidden">
                    <div className="flex gap-6 px-4 min-w-max justify-center">
                      {members.map((m) => (
                        <div key={m.id} className="flex-shrink-0">
                          <MemberCard
                            id={m.id}
                            imageUrl={m.imageUrl || "/file.svg"}
                            name={m.name}
                            designation={m.designation || "MEMBER"}
                            position={m.position || undefined}
                            linkedinUrl={m.linkedinUrl || undefined}
                            mail={m.mail || undefined}
                            bgColor={m.bgColor || undefined}
                            logo={m.logo || undefined}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Desktop: 3-2-3-2 pattern when more than 4 members, otherwise centered flex */}
                  <div className="hidden md:block w-full px-4">
                    {members.length > 4 ? (
                      <div className="space-y-6">
                        {(() => {
                          const rows = [];
                          let index = 0;
                          while (index < members.length) {
                            const isFirstRow = rows.length % 2 === 0;
                            const cardsInRow = isFirstRow ? 3 : 2;
                            const rowMembers = members.slice(
                              index,
                              index + cardsInRow
                            );
                            rows.push(
                              <div
                                key={index}
                                className="flex gap-6 justify-center"
                              >
                                {rowMembers.map((m) => (
                                  <div key={m.id} className="flex-shrink-0">
                                    <MemberCard
                                      id={m.id}
                                      imageUrl={m.imageUrl || "/file.svg"}
                                      name={m.name}
                                      designation={m.designation || "MEMBER"}
                                      position={m.position || undefined}
                                      linkedinUrl={m.linkedinUrl || undefined}
                                      mail={m.mail || undefined}
                                      bgColor={m.bgColor || undefined}
                                      logo={m.logo || undefined}
                                    />
                                  </div>
                                ))}
                              </div>
                            );
                            index += cardsInRow;
                          }
                          return rows;
                        })()}
                      </div>
                    ) : (
                      <div className="flex gap-6 justify-center">
                        {members.map((m) => (
                          <div key={m.id} className="flex-shrink-0">
                            <MemberCard
                              id={m.id}
                              imageUrl={m.imageUrl || "/file.svg"}
                              name={m.name}
                              designation={m.designation || "MEMBER"}
                              position={m.position || undefined}
                              linkedinUrl={m.linkedinUrl || undefined}
                              mail={m.mail || undefined}
                              bgColor={m.bgColor || undefined}
                              logo={m.logo || undefined}
                            />
                          </div>
                        ))}
                      </div>
                    )}
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
