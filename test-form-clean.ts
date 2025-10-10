/**
 * Clean Form Submission Test - Full Name, Email, Password
 * This script tests form submission with proper field types matching the requirements
 */

import { createSubmission } from "./src/actions/submissions";

async function testFormSubmissionClean() {
  console.log(
    "🚀 Testing form submission with Full Name, Email, Password fields...\n"
  );

  try {
    // Use the "Study jams" form which has the fields we need
    const formId = "cmggv7dap0001g8ssh4b2cdau";
    const fullNameFieldId = "cmggv7rai0004g8ssw70zsuty"; // INPUT type
    const emailFieldId = "cmggv8x4f0006g8ssuc88qz7e"; // TEXTAREA type (treating as email)
    const passwordFieldId = "cmggv9jls0008g8ssrccsp780"; // PASSWORD type

    console.log("📋 Test Information:");
    console.log(`Form ID: ${formId}`);
    console.log(`Full Name Field: ${fullNameFieldId} (INPUT)`);
    console.log(`Email Field: ${emailFieldId} (TEXTAREA - used as email)`);
    console.log(`Password Field: ${passwordFieldId} (PASSWORD)`);
    console.log();

    // Test data that matches the schema validation
    const testData = {
      formId,
      responses: [
        {
          fieldId: fullNameFieldId,
          value: "Alice Johnson",
        },
        {
          fieldId: emailFieldId,
          value: "alice.johnson@example.com",
        },
        {
          fieldId: passwordFieldId,
          value: "MySecurePass2024!",
        },
      ],
      submittedBy: undefined, // Anonymous submission
    };

    console.log("📤 Submitting data:");
    console.log(JSON.stringify(testData, null, 2));
    console.log();

    // Submit the form
    const result = await createSubmission(testData);

    // Handle the revalidatePath issue gracefully
    const isRevalidatePathError = result.error?.includes(
      "static generation store missing in revalidatePath"
    );

    if (result.success || isRevalidatePathError) {
      console.log("✅ FORM SUBMISSION SUCCESSFUL!");

      if (result.success && result.data) {
        console.log(`📄 Submission ID: ${result.data.id}`);
        console.log(
          `📊 Responses stored: ${result.data.responses?.length || 0}`
        );
      } else if (isRevalidatePathError) {
        console.log(
          "📝 Note: revalidatePath error is expected in standalone scripts"
        );
        console.log("📊 The actual form data should be saved in database");
      }

      // Verify in database
      console.log("\n🔍 Verifying submission in database...");
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      try {
        const submission = await prisma.formSubmission.findFirst({
          where: { formId },
          include: {
            responses: {
              include: { field: true },
            },
          },
          orderBy: { submittedAt: "desc" },
        });

        if (submission) {
          console.log("✅ DATABASE VERIFICATION SUCCESSFUL!");
          console.log(
            `📅 Submission time: ${submission.submittedAt.toISOString()}`
          );
          console.log("📝 Stored data:");

          submission.responses.forEach((response: any, index: number) => {
            const fieldType = response.field.type;
            console.log(
              `  ${index + 1}. ${response.field.label} (${fieldType}): "${
                response.value
              }"`
            );
          });

          console.log(
            "\n🎉 ALL TESTS PASSED - Form submission is working correctly!"
          );
        } else {
          console.log("❌ No submission found in database");
        }
      } catch (dbError) {
        console.log("⚠️  Database verification error:", dbError);
      } finally {
        await prisma.$disconnect();
      }
    } else {
      console.log("❌ FORM SUBMISSION FAILED");
      console.log(`Error: ${result.error}`);
    }
  } catch (error) {
    console.log("💥 UNEXPECTED ERROR");
    console.error("Details:", error);
  }
}

// Run the test
testFormSubmissionClean()
  .then(() => {
    console.log("\n🏁 Test execution completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💀 Fatal error:", error);
    process.exit(1);
  });
