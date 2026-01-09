import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Stay updated with upcoming and past events at GDG VITB. Join our workshops, sessions, and tech talks.",
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
