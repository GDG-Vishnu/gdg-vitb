import type { Metadata } from "next";
import { Geist, Geist_Mono, Red_Hat_Display } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "@/components/providers";
import { productSans } from "./font";
import CursorSpark from "./client/CursorSpark";
import BackToTop from "@/components/ui/back_to_top";
import ChatBox from "@/components/chat/ChatBox";
import Navbar from "@/features/layout/components/Navbar/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const redHatDisplay = Red_Hat_Display({
  variable: "--font-red-hat-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default:
      "GDG VITB - Google Developer Group On Campus Vishnu Institute of Technology",
    template: "%s | GDG VITB",
  },
  description:
    "GDG On Campus at Vishnu Institute of Technology, Bhimavaram is a student-driven community that incubates student ideas from prototyping to product development with full technical and other support, conducting hackathons, workshops in different aspects of technical knowledge. It is a student-driven  Google Supported and engaged community.",

  // Essential SEO Meta Tags
  keywords: [
    "GDG VITB",
    "Google Developer Group",
    "Vishnu Institute of Technology",
    "VITB",
    "Bhimavaram",
    "Student Community",
    "Tech Community",
    "Hackathons",
    "Workshops",
    "Programming",
    "Development",
    "Google Technologies",
    "Android Development",
    "Web Development",
    "Machine Learning",
    "AI",
    "Cloud Computing",
    "Flutter",
    "Firebase",
    "Google Cloud Platform",
  ],

  authors: [{ name: "GDG VITB Team" }],
  creator: "GDG VITB",
  publisher: "GDG On Campus - Vishnu Institute of Technology",

  // Open Graph (Facebook, LinkedIn)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gdgvitb.in",
    title: "GDG VITB ",
    description:
      "Join GDG VITB, a vibrant student-driven tech community at Vishnu Institute of Technology. Participate in hackathons, workshops, and collaborative projects to enhance your technical skills.",
    siteName: "GDG VITB",
    images: [
      {
        url: "https://res.cloudinary.com/dlupkibvq/image/upload/v1766903285/vqbqthkdildhpgbtocgp.png",
        width: 1200,
        height: 630,
        alt: "GDG VITB - Google Developer Group Logo",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "GDG VITB - Google Developer Group",
    description:
      "Student-driven tech community at VITB. Join us for hackathons, workshops, and innovation!",
    site: "@gdgvitb",
    creator: "@gdgvitb",
    images: [
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766903285/vqbqthkdildhpgbtocgp.png",
    ],
  },

  // Additional SEO
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification for search engines
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
    yandex: "ada79044abb1797c",
  },

  // Canonical URL
  alternates: {
    canonical: "https://gdgvitb.in",
  },

  // Icons and manifest
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",

  // Additional metadata
  category: "Technology",
  classification: "Educational Technology Community",

  // Structured data for rich snippets
  other: {
    "og:region": "Andhra Pradesh, India",
    "og:country-name": "India",
    "geo.region": "IN-AP",
    "geo.placename": "Bhimavaram",
    "geo.position": "16.5449;81.5212",
    ICBM: "16.5449, 81.5212",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${redHatDisplay.variable} ${productSans.variable} antialiased overflow-y-auto hide-scrollbar`}
        suppressHydrationWarning={true}
        style={{
          backgroundColor: "white",
          backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      >
        <Providers>
          <SpeedInsights />
          <CursorSpark />
          <Navbar />
          {children}
          <BackToTop />
          <ChatBox />
        </Providers>
      </body>
    </html>
  );
}
