#!/usr/bin/env node
import { prisma } from "../src/lib/prisma";

async function main() {
  const rows = await prisma.teamMember.findMany({ select: { name: true } });

  if (!rows || rows.length === 0) {
    console.log("No TeamMember rows found.");
    return;
  }

  console.log(`Found ${rows.length} TeamMember(s):`);
  for (const r of rows) {
    console.log(`- ${r.name}`);
  }
}

main()
  .catch((err) => {
    console.error("Error querying TeamMember:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
