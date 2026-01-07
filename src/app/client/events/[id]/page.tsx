"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function LegacyEventRedirect() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const eventId = params.id as string;
    if (eventId) {
      router.replace(`/events/${eventId}`);
    } else {
      router.replace("/events");
    }
  }, [params.id, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
        <div className="w-16 h-16 border-4 border-black border-l-transparent rounded-full animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-black mb-2">Redirecting...</h1>
        <p className="text-gray-600">
          We've updated our URLs. Moving you to the new event page.
        </p>
      </div>
    </div>
  );
}
