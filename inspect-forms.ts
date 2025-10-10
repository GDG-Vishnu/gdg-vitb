/**
 * Form Structure Inspector
 * This script fetches the form structure to get the correct field IDs for testing
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function inspectFormStructure() {
  console.log("🔍 Inspecting form structure...\n");

  try {
    // Find forms in the database
    const forms = await prisma.form.findMany({
      include: {
        sections: {
          include: {
            fields: true,
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });

    console.log(`📋 Found ${forms.length} form(s) in database:\n`);

    for (const form of forms) {
      console.log(`📄 Form: "${form.name}" (ID: ${form.id})`);
      console.log(`   Description: ${form.description || "No description"}`);
      console.log(`   Created: ${form.createdAt.toISOString()}`);
      console.log(`   Submissions: ${form._count.submissions}`);
      console.log(`   Sections: ${form.sections.length}\n`);

      // Show sections and fields
      for (const section of form.sections) {
        console.log(
          `   📁 Section: "${section.title || "Untitled Section"}" (ID: ${
            section.id
          })`
        );
        console.log(`      Order: ${section.order}`);
        console.log(`      Fields: ${section.fields.length}`);

        for (const field of section.fields) {
          console.log(`      📝 Field: "${field.label}" (ID: ${field.id})`);
          console.log(`         Type: ${field.type}`);
          console.log(`         Required: ${field.required}`);
          console.log(`         Order: ${field.order}`);
          if (field.options) {
            console.log(`         Options: ${JSON.stringify(field.options)}`);
          }
          if (field.validation) {
            console.log(
              `         Validation: ${JSON.stringify(field.validation)}`
            );
          }
          console.log();
        }
        console.log();
      }
      console.log("─".repeat(50) + "\n");
    }

    if (forms.length === 0) {
      console.log("⚠️  No forms found in database. Create a form first.");
    }
  } catch (error) {
    console.error("💥 Error inspecting forms:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the inspection
inspectFormStructure()
  .then(() => {
    console.log("🏁 Inspection completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💀 Fatal error:", error);
    process.exit(1);
  });
