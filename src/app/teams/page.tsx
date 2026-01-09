import React from "react";
import { Metadata } from "next";
import TeamsPage from "@/app/client/Teams/page";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the passionate team behind GDG VITB. Discover the organizers, leads, and core members driving our community aimed at Vishnu Institute of Technology.",
};

export default function Page() {
  return <TeamsPage />;
}
