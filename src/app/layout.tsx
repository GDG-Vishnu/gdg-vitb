import type { Metadata } from "next";
import { Geist, Geist_Mono, Red_Hat_Display } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "@/components/providers";
import { productSans } from "./font";
import CursorSpark from "./client/CursorSpark";
import BackToTop from "@/components/ui/back_to_top";

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
  title: "GDG VITB",
  description: "GDG On Campus at Vishnu Institute of Technology , Bhimavaram is a  student driven community that incubates student ideas from prototyping to product development with full technical and other support , and conducting hackathons , workshops in different aspects in technical knowledge .It's not just a normal club , it is an student driven and engaged community",
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
      >
        <Providers>
          <SpeedInsights />
          <CursorSpark />
          {children}
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
