import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hack-A-Tron 3.0",
  description:
    "Participate in Hack-A-Tron 3.0, the flagship hackathon by GDG VITB. Innovate, build, and showcase your solutions.",
};

export default function HackATronLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
