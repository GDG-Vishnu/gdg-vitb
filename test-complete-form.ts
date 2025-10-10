/**
 * Complete Form Creation and Submission Test
 * This script creates a new form with Full Name, Email, Password fields and tests submission
 */

import { PrismaClient } from "@prisma/client";
import { createSubmission } from "./src/actions/submissions";

const prisma = new PrismaClient();

async function createTestFormAndSubmit() {
  console.log(
    "🚀 Creating test form with Full Name, Email, Password fields and testing submission...\n"
  );

  try {
    // Create a new form with proper field structure
    console.log("📝 Creating new form...");

    const form = await prisma.form.create({
      data: {
        name: "User Registration Form",
        description: "Test form with full name, email, and password fields",
      },
    });

    console.log(`✅ Created form: "${form.name}" (ID: ${form.id})`);

    // Create a section
    console.log("📁 Creating form section...");

    const section = await prisma.section.create({
      data: {
        title: "User Information",
        order: 0,
        formId: form.id,
      },
    });

    console.log(`✅ Created section: "${section.title}" (ID: ${section.id})`);

    // Create fields: Full Name (INPUT), Email (INPUT), Password (PASSWORD)
    console.log("📝 Creating form fields...");

    const fields = await prisma.field.createMany({
      data: [
        {
          label: "Full Name",
          placeholder: "Enter your full name",
          type: "INPUT",
          required: true,
          order: 0,
          sectionId: section.id,
          validation: JSON.stringify({ minLength: 2, maxLength: 100 }),
          styling: JSON.stringify({}),
          logic: JSON.stringify({}),
        },
        {
          label: "Email Address",
          placeholder: "Enter your email",
          type: "INPUT",
          required: true,
          order: 1,
          sectionId: section.id,
          validation: JSON.stringify({
            pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
            message: "Please enter a valid email address",
          }),
          styling: JSON.stringify({}),
          logic: JSON.stringify({}),
        },
        {
          label: "Password",
          placeholder: "Enter your password",
          type: "PASSWORD",
          required: true,
          order: 2,
          sectionId: section.id,
          validation: JSON.stringify({
            minLength: 8,
            pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)",
            message:
              "Password must be at least 8 characters with uppercase, lowercase, and number",
          }),
          styling: JSON.stringify({}),
          logic: JSON.stringify({}),
        },
      ],
    });

    console.log(`✅ Created ${fields.count} fields`);

    // Get the created fields with their IDs
    const createdFields = await prisma.field.findMany({
      where: { sectionId: section.id },
      orderBy: { order: "asc" },
    });

    console.log("\n📋 Form structure:");
    createdFields.forEach((field, index) => {
      console.log(
        `  ${index + 1}. ${field.label} (${field.type}) - ID: ${field.id}`
      );
    });

    // Test form submission
    console.log("\n📤 Testing form submission...");

    const testSubmissionData = {
      formId: form.id,
      responses: [
        {
          fieldId: createdFields[0].id, // Full Name
          value: "John Smith",
        },
        {
          fieldId: createdFields[1].id, // Email
          value: "john.smith@example.com",
        },
        {
          fieldId: createdFields[2].id, // Password
          value: "SecurePass123!",
        },
      ],
      submittedBy: undefined,
    };

    console.log("📋 Submission data:");
    console.log(JSON.stringify(testSubmissionData, null, 2));
    console.log();

    // Submit the form
    const result = await createSubmission(testSubmissionData);

    // Handle result
    const isRevalidatePathError = result.error?.includes(
      "static generation store missing in revalidatePath"
    );

    if (result.success || isRevalidatePathError) {
      console.log("✅ FORM SUBMISSION SUCCESSFUL!");

      if (result.success && result.data) {
        console.log(`📄 Submission ID: ${result.data.id}`);
      } else if (isRevalidatePathError) {
        console.log(
          "📝 Note: revalidatePath error is expected in standalone scripts"
        );
      }

      // Verify submission in database
      console.log("\n🔍 Verifying submission in database...");

      const submission = await prisma.formSubmission.findFirst({
        where: { formId: form.id },
        include: {
          form: true,
          responses: {
            include: { field: true },
            orderBy: { field: { order: "asc" } },
          },
        },
      });

      if (submission) {
        console.log("✅ DATABASE VERIFICATION SUCCESSFUL!");
        console.log(
          `📅 Submission time: ${submission.submittedAt.toISOString()}`
        );
        console.log(`📄 Form: "${submission.form.name}"`);
        console.log("📝 Submitted data:");

        submission.responses.forEach((response: any, index: number) => {
          const field = response.field;
          console.log(
            `  ${index + 1}. ${field.label} (${field.type}${
              field.required ? ", required" : ""
            }): "${response.value}"`
          );
        });

        console.log("\n🎉 COMPLETE SUCCESS!");
        console.log("✅ Form created with proper schema");
        console.log("✅ Fields created with validation rules");
        console.log("✅ Form submission processed successfully");
        console.log("✅ Data stored correctly in database");
      } else {
        console.log("❌ No submission found in database");
      }
    } else {
      console.log("❌ FORM SUBMISSION FAILED");
      console.log(`Error: ${result.error}`);
    }

    console.log("\n📊 Final form summary:");
    console.log(`Form ID: ${form.id}`);
    console.log(
      `Field IDs: ${createdFields.map((f) => `${f.label}=${f.id}`).join(", ")}`
    );
  } catch (error) {
    console.log("💥 ERROR OCCURRED");
    console.error("Details:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the complete test
createTestFormAndSubmit()
  .then(() => {
    console.log("\n🏁 Complete test execution finished.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💀 Fatal error:", error);
    process.exit(1);
  });
