/**
 * Form Submission Test Script
 * This script tests the form submission functionality by directly calling the createSubmission action
 */

import { createSubmission } from "./src/actions/submissions";

async function testFormSubmission() {
  console.log("🚀 Starting form submission test...\n");

  try {
    // Test form data - using the "Study jams" form which has Full Name, Email, and Password fields
    const testFormId = "cmggv7dap0001g8ssh4b2cdau"; // Study jams form

    // Actual field IDs from the database
    const fullNameFieldId = "cmggv7rai0004g8ssw70zsuty"; // Full Name field
    const emailFieldId = "cmggv8x4f0006g8ssuc88qz7e"; // testing (textarea) - we'll use as email
    const passwordFieldId = "cmggv9jls0008g8ssrccsp780"; // Testing (password) field

    console.log("📋 Test Data:");
    console.log(`  Form ID: ${testFormId}`);
    console.log(`  Field 1 (Full Name): ${fullNameFieldId}`);
    console.log(`  Field 2 (Email/Textarea): ${emailFieldId}`);
    console.log(`  Field 3 (Password): ${passwordFieldId}\n`);

    // Test submission data matching full name, email, password pattern
    const submissionData = {
      formId: testFormId,
      responses: [
        {
          fieldId: fullNameFieldId,
          value: "John Doe Test User",
        },
        {
          fieldId: emailFieldId,
          value: "john.doe@example.com",
        },
        {
          fieldId: passwordFieldId,
          value: "SecurePassword123!",
        },
      ],
      submittedBy: undefined, // Anonymous submission
    };

    console.log("📤 Submitting test data:");
    console.log(JSON.stringify(submissionData, null, 2));
    console.log();

    // Call the submission function
    const result = await createSubmission(submissionData);

    console.log("📨 Submission Result:");
    console.log(JSON.stringify(result, null, 2));

    if (result.success) {
      console.log("\n✅ SUCCESS: Form submission completed!");
      console.log(`📄 Submission ID: ${result.data?.id}`);
      console.log(`📊 Response count: ${result.data?.responses?.length || 0}`);

      if (result.data?.responses) {
        console.log("\n📝 Submitted responses:");
        result.data.responses.forEach((response: any, index: number) => {
          console.log(
            `  ${index + 1}. ${
              response.field?.label || "Unknown field"
            }: ${JSON.stringify(response.value)}`
          );
        });
      }
    } else {
      // Check if the error is just the revalidatePath issue
      if (
        result.error?.includes(
          "static generation store missing in revalidatePath"
        )
      ) {
        console.log(
          "\n⚠️  PARTIAL SUCCESS: Form data saved but revalidatePath failed!"
        );
        console.log(
          "📝 This is expected when running outside of Next.js request context"
        );
        console.log(
          "🔍 The form submission was likely saved to the database successfully"
        );

        // Verify in database
        console.log("\n🔍 Verifying data in database...");
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();

        try {
          const latestSubmission = await prisma.formSubmission.findFirst({
            where: { formId: submissionData.formId },
            include: {
              responses: {
                include: { field: true },
              },
            },
            orderBy: { submittedAt: "desc" },
          });

          if (latestSubmission) {
            console.log(
              `✅ VERIFIED: Found submission ${latestSubmission.id} in database`
            );
            console.log(
              `📅 Submitted at: ${latestSubmission.submittedAt.toISOString()}`
            );
            console.log("📝 Responses:");
            latestSubmission.responses.forEach(
              (response: any, index: number) => {
                console.log(
                  `  ${index + 1}. ${response.field.label}: ${JSON.stringify(
                    response.value
                  )}`
                );
              }
            );
          } else {
            console.log("❌ No matching submission found in database");
          }
        } catch (dbError) {
          console.log("⚠️  Could not verify database:", dbError);
        } finally {
          await prisma.$disconnect();
        }
      } else {
        console.log("\n❌ FAILED: Form submission failed!");
        console.log(`📛 Error: ${result.error}`);
      }
    }
  } catch (error) {
    console.log("\n💥 EXCEPTION: Unexpected error occurred!");
    console.error("Error details:", error);
  }
}

// Run the test
testFormSubmission()
  .then(() => {
    console.log("\n🏁 Test completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💀 Fatal error:", error);
    process.exit(1);
  });
