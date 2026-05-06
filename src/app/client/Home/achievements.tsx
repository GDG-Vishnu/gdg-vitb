"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, Sparkles } from "lucide-react";

type Achievement = {
  title: string;
  subtitle: string;
  description: string;
  timeline: string;
  image: string;
  color: string;
};

const achievements: Achievement[] = [
     {
    title: "Google Solution Challenge 2025",
    subtitle: "2 teams selected among 64,000 global teams",
    description:
      "Two GDG VITB teams were selected in the global Top 10 and Top 5 in Google Solution Challenge 2025, out of 64,000 teams.",
    timeline: "2025 - Global Top 105",
    image:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1777201561/fvg4jbm0ju1ktvgll7kq.svg",
    color: "bg-[#FFE7A5]",
  },
  {
    title: "Study Jams Tier 1 Completion",
    subtitle: "2025 Cohort 2: 142 completions and Top 2 in India",
    description:
      "In Study Jams Tier 1 (2025 Cohort 2), 142 members successfully completed, received goodies, and GDG VITB ranked Top 2 in India.",
    timeline: "2025 - Study Jams Tier 1",
    image:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1777201565/zknuuualmfgjhijgvq3y.svg",
    color: "bg-[#C3ECF6]",
  },
 
  {
    title: "Tech Sprint Tier 1 Achieved",
    subtitle: "Hackatron 3.0 plus three workshop-based events",
    description:
      "We successfully completed Tier 1 in Tech Sprint by organizing one hackathon (Hackatron 3.0) and three workshop-based events.",
    timeline: "2025-26 - Tech Sprint Tier 1",
    image:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1777201580/nrcy7yoqjxdsomey9nsh.svg",
    color: "bg-[#CCF6C5]",
  },
];

export default function AchievementsSection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 my-14 sm:my-18 lg:my-22">
      <div className="mx-auto max-w-7xl border-4 border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative overflow-hidden border-b-4 border-black bg-[#F8D8D8] px-6 py-8 sm:px-10 sm:py-10">
          <div className="absolute -left-10 top-6 h-24 w-24 rotate-12 border-4 border-black bg-yellow-300 opacity-25" />
          <div className="absolute -right-10 bottom-6 h-28 w-28 -rotate-12 rounded-full border-4 border-black bg-blue-300 opacity-25" />

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-black/70 font-productSans">
                Hall Of Achievements
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black text-black font-productSans">
                Big Wins, Bold Builds
              </h2>
              <p className="mt-2 max-w-3xl text-sm sm:text-base text-black/75 font-productSans">
                A timeline of milestones that shaped GDG OnCampus VITB into a
                build-first community.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start border-2 border-black bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-bold font-productSans">
                3 Signature Highlights
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3 lg:p-8">
          {achievements.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="h-full"
            >
              <Card
                className={`${item.color} h-full border-4 transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]`}
              >
                <div className="relative border-b-4 border-black bg-white aspect-square">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute left-3 top-3">
                    <Badge variant={index % 2 === 0 ? "accent" : "secondary"}>
                      <Sparkles className="mr-1 h-3 w-3" />
                      Achievement
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-black text-black font-productSans">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-black/70 font-medium font-productSans">
                    {item.subtitle}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-1">
                  <p className="text-sm leading-relaxed text-black/80 font-productSans">
                    {item.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full border border-black bg-black" />
                    <span className="h-[2px] flex-1 bg-black/60" />
                    <Badge variant="success" className="whitespace-nowrap">
                      {item.timeline}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
