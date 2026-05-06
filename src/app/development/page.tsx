import type { Metadata } from "next";
import ComponentSandbox from "@/components/development/ComponentSandbox";

export const metadata: Metadata = {
  title: "Development Sandbox",
  description:
    "A local route for developing and validating components before moving them to production pages.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DevelopmentPage() {
  return <ComponentSandbox />;
}
