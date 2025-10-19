import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleTeamMembers = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
    name: "Asha Rao",
    designation: "Lead Organizer",
    position: "Web",
    linkedinUrl: "https://www.linkedin.com/in/asharao",
    mail: "asha.rao@example.com",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1545996124-7d0a64b8d6c7?w=400&q=80",
    name: "Vikram Singh",
    designation: "Coordinator",
    position: "Mobile",
    linkedinUrl: "https://www.linkedin.com/in/vikramsingh",
    mail: "vikram.singh@example.com",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1545467260-6b0b6f1ef2a9?w=400&q=80",
    name: "Priya Menon",
    designation: "Speaker",
    position: "Data",
    linkedinUrl: "https://www.linkedin.com/in/priyamenon",
    mail: "priya.menon@example.com",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1545420338-6a7e5e0d0d6b?w=400&q=80",
    name: "Ganesh",
    designation: "Lead",
    position: "Android",
    linkedinUrl: "https://www.linkedin.com/in/ganesh",
    mail: "ganesh@example.com",
  },
];

async function main() {
  console.log("Seeding TeamMember sample data...");

  try {
    // Use createMany for faster insertion and skip duplicates if any
    const result = await prisma.teamMember.createMany({
      data: sampleTeamMembers,
      skipDuplicates: true,
    });

    console.log(`Inserted ${result.count ?? 0} TeamMember(s)`);

    // Optionally print inserted rows (small number)
    const all = await prisma.teamMember.findMany({ take: 10 });
    console.log("Sample TeamMember rows:", all);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
