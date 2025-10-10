/**
 * Check Latest Submissions
 * This script checks the database for the latest form submissions
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkSubmissions() {
  console.log("🔍 Checking latest form submissions...\n");

  try {
    const submissions = await prisma.formSubmission.findMany({
      include: {
        form: true,
        responses: {
          include: {
            field: true,
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
      take: 5, // Get last 5 submissions
    });

    console.log(`📋 Found ${submissions.length} submission(s):\n`);

    for (const submission of submissions) {
      console.log(`📄 Submission ID: ${submission.id}`);
      console.log(`   Form: "${submission.form.name}"`);
      console.log(`   Submitted At: ${submission.submittedAt.toISOString()}`);
      console.log(`   Responses: ${submission.responses.length}`);

      for (const response of submission.responses) {
        console.log(
          `   📝 ${response.field.label}: ${JSON.stringify(response.value)}`
        );
      }
      console.log();
    }

    if (submissions.length === 0) {
      console.log("⚠️  No submissions found in database.");
    }
  } catch (error) {
    console.error("💥 Error checking submissions:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSubmissions();
