import React from "react";
import { Metadata } from "next";
import ContactUsPage from "@/app/client/contactus/page";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with GDG VITB. Have questions or want to collaborate? Reach out to us through our contact details or social handles.",
};

export default function Page() {
  return <ContactUsPage />;
}
