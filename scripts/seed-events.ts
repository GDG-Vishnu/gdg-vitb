import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const events = [
    {
      title: "GDG Build with AI",
      description: "Join us for an exciting workshop on building applications with Generative AI and Google Cloud.",
      Date: new Date("2025-10-15T10:00:00Z"),
      Time: "10:00 AM - 4:00 PM",
      venue: "Main Seminar Hall",
      organizer: "GDG On Campus Vishnu",
      coOrganizer: "CSE Department",
      keyHighlights: ["Hands-on with Gemini API", "Vertex AI basics", "Networking session"],
      tags: ["AI", "GenAI", "Google Cloud"],
      status: "Upcoming",
      Theme: ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#F8F9FA"],
      imageUrl: "https://images.unsplash.com/photo-1580757468214-c73f7062a5cb?q=80&w=1332&auto=format&fit=crop",
      isDone: false,
      MembersParticipated: 0,
      rank: 1,
    },
    {
      title: "Hack-a-tron 3.0",
      description: "Annual flagship hackathon of SVECW. 24 hours of innovation, coding, and prizes.",
      Date: new Date("2025-11-20T09:00:00Z"),
      Time: "Starting 9:00 AM",
      venue: "Auditorium",
      organizer: "GDG On Campus Vishnu",
      coOrganizer: "IT Department",
      keyHighlights: ["Exciting Prizes", "Mentorship", "Industry Judges"],
      tags: ["Hackathon", "Coding", "Competition"],
      status: "Upcoming",
      Theme: ["#EA4335", "#FBBC05", "#34A853", "#4285F4", "#F8F9FA"],
      imageUrl: "https://images.unsplash.com/photo-1594568284297-7c64464062b1?q=80&w=1170&auto=format&fit=crop",
      isDone: false,
      MembersParticipated: 0,
      rank: 2,
    },
    {
      title: "Google Cloud Study Jams",
      description: "Level up your cloud skills with Google Cloud Study Jams. Learn about Cloud Architecture and Data Engineering.",
      Date: new Date("2026-01-10T14:00:00Z"),
      Time: "2:00 PM - 5:00 PM",
      venue: "Lab 4, CSE Block",
      organizer: "GDG On Campus Vishnu",
      keyHighlights: ["Google Cloud Badges", "Practical Labs", "Expert Guidance"],
      tags: ["Cloud", "GCP", "Learning"],
      status: "Registration Open",
      Theme: ["#FBBC05", "#4285F4", "#34A853", "#EA4335", "#F8F9FA"],
      imageUrl: "https://images.unsplash.com/photo-1599454100789-b211e369bd04?q=80&w=1306&auto=format&fit=crop",
      isDone: false,
      MembersParticipated: 120,
      rank: 3,
    }
  ];

  console.log("Seeding events...");

  for (const event of events) {
    const createdEvent = await prisma.events.create({
      data: event,
    });
    console.log(`Created event: ${createdEvent.title} with ID: ${createdEvent.id}`);
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
