import { Metadata } from "next";
import ClientPage from "./client/page";

export const metadata: Metadata = {
  description:
    "Welcome to Google Developer Group (GDG) on Campus Vishnu Institute of Technology. Join our community to learn, share, and connect with fellow developers.",
};

export default function Home() {
  return <ClientPage />;
}
