"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { Download, Share2 } from "lucide-react";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import Footer from "@/components/footer/Footer";

const PROD_DOMAIN = "https://gdgvitb.in";

interface PublicProfile {
  name: string;
  email: string;
  branch: string;
  graduationYear: number;
  profileUrl: string;
}

export default function ProfileSharePage() {
  const params = useParams();
  const userId = params?.userId as string;
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const cardRef = useRef<HTMLDivElement>(null);

  // Production share URL (always points to gdgvitb.in)
  const shareUrl = `${PROD_DOMAIN}/profile-share/${userId}`;

  useEffect(() => {
    async function fetchProfile() {
      if (!userId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "client_users", userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const data = docSnap.data();

        // Check if user is blocked
        if (data.isBlocked) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        // Only expose public fields
        setProfile({
          name: data.name || "Anonymous",
          email: data.email || "",
          branch: data.branch || "N/A",
          graduationYear: data.graduationYear || 0,
          profileUrl: data.profileUrl || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userId]);

  // Generate QR code as data URL
  useEffect(() => {
    async function generateQR() {
      try {
        const dataUrl = await QRCode.toDataURL(shareUrl, {
          width: 200,
          margin: 2,
          color: { dark: "#000000", light: "#A8C9D3" },
          errorCorrectionLevel: "M",
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error("QR generation error:", err);
      }
    }
    if (userId) generateQR();
  }, [userId, shareUrl]);

  const handleDownload = async () => {
    if (!cardRef.current || !profile) return;

    try {
      toast.loading("Generating image...");

      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#A8C9D3",
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `profile-${profile.name.replace(/\s+/g, "-")}.png`;
      link.click();

      toast.dismiss();
      toast.success("Profile downloaded!");
    } catch (error) {
      console.error("Download error:", error);
      toast.dismiss();
      toast.error("Failed to download profile");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Failed to copy link");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
          <p className="text-lg font-[500] text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-[700] text-gray-800 mb-2">
            Profile Not Found
          </h1>
          <p className="text-gray-600">
            This profile doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
        style={{
          backgroundColor: "white",
          backgroundImage:
            "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="w-full max-w-[1400px]">
          {/* Profile Card */}
          <motion.div
            ref={cardRef}
            id="profile-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ backgroundColor: "#A8C9D3" }}
            className="rounded-[20px] sm:rounded-[28px] lg:rounded-[38px] p-[30px] sm:p-[40px] lg:p-[60px] flex flex-col lg:flex-row gap-[30px] sm:gap-[40px] lg:gap-[60px] shadow-2xl"
          >
            {/* Left: Profile Image */}
            <div className="flex justify-center lg:justify-start shrink-0">
              {profile.profileUrl ? (
                <img
                  src={profile.profileUrl}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] lg:w-[386px] lg:h-[386px] rounded-[12px] sm:rounded-[16px] lg:rounded-[20px] object-cover border-[2px] lg:border-[3px] border-black shadow-lg"
                />
              ) : (
                <div className="w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] lg:w-[386px] lg:h-[386px] rounded-[12px] sm:rounded-[16px] lg:rounded-[20px] bg-gray-700 border-[2px] lg:border-[3px] border-black flex items-center justify-center text-white text-6xl sm:text-7xl lg:text-8xl font-[700]">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Center: Profile Info */}
            <div className="flex-1 flex flex-col gap-[20px] sm:gap-[26px] lg:gap-[32px] justify-center">
              {/* Name */}
              <div>
                <p className="text-[16px] sm:text-[20px] lg:text-[24px] font-[700] tracking-[0.12em] text-black uppercase mb-1">
                  Name
                </p>
                <p className="text-[18px] sm:text-[20px] lg:text-[22px] font-[400] text-black">
                  {profile.name}
                </p>
              </div>

              {/* Email */}
              <div>
                <p className="text-[16px] sm:text-[20px] lg:text-[24px] font-[700] tracking-[0.12em] text-black uppercase mb-1">
                  Email
                </p>
                <p className="text-[18px] sm:text-[20px] lg:text-[22px] font-[400] text-black break-all">
                  {profile.email}
                </p>
              </div>

              {/* Branch + Graduation Year */}
              <div className="flex flex-col sm:flex-row gap-[20px] sm:gap-[40px] lg:gap-[100px]">
                {/* Branch */}
                <div>
                  <p className="text-[16px] sm:text-[20px] lg:text-[24px] font-[700] tracking-[0.12em] text-black uppercase mb-1">
                    Branch
                  </p>
                  <p className="text-[18px] sm:text-[20px] lg:text-[22px] font-[400] text-black">
                    {profile.branch}
                  </p>
                </div>

                {/* Graduation Year */}
                <div>
                  <p className="text-[16px] sm:text-[20px] lg:text-[24px] font-[700] tracking-[0.12em] text-black uppercase mb-1">
                    Graduation
                  </p>
                  <p className="text-[18px] sm:text-[20px] lg:text-[22px] font-[400] text-black">
                    {profile.graduationYear}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: QR Code */}
            {qrDataUrl && (
              <div className="flex flex-col items-center justify-center shrink-0 gap-3">
                <div className="rounded-[12px] overflow-hidden border-[2px] border-black shadow-md">
                  <img
                    src={qrDataUrl}
                    alt="Scan to view profile"
                    className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] lg:w-[200px] lg:h-[200px]"
                  />
                </div>
                <p className="text-[11px] sm:text-[12px] lg:text-[14px] font-[600] text-black/70 text-center tracking-wide">
                  Scan to view profile
                </p>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-[20px] sm:gap-[30px] lg:gap-[40px] mt-[30px] sm:mt-[40px] lg:mt-[50px] justify-center"
          >
            {/* Share Button */}
            <motion.button
              onClick={handleShare}
              whileTap={{ scale: 0.98 }}
              className="bg-[#E6C6C6] p-[16px] sm:p-[20px] lg:p-[24px] rounded-[8px] flex items-center justify-center gap-[12px] sm:gap-[14px] lg:gap-[16px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 border-2 border-black"
            >
              <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
              <span className="text-[16px] sm:text-[18px] lg:text-[20px] font-[700] text-black">
                Share Profile
              </span>
            </motion.button>

            {/* Download Button */}
            <motion.button
              onClick={handleDownload}
              whileTap={{ scale: 0.98 }}
              className="bg-[#B7D9B0] p-[16px] sm:p-[20px] lg:p-[24px] rounded-[8px] flex items-center justify-center gap-[12px] sm:gap-[14px] lg:gap-[16px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 border-2 border-black"
            >
              <Download className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
              <span className="text-[16px] sm:text-[18px] lg:text-[20px] font-[700] text-black">
                Download Profile
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
}
