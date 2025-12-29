"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { UserRole, Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schemas
const publishFormSchema = z.object({
  formId: z.string().cuid("Invalid form ID"),
  isActive: z.boolean(),
});

const cloneFormSchema = z.object({
  formId: z.string().cuid("Invalid form ID"),
  title: z.string().min(1, "Title is required").optional(),
  includeSubmissions: z.boolean().default(false),
});

const validateFormSchema = z.object({
  formId: z.string().cuid("Invalid form ID"),
});

// Helper function to check admin permissions
async function checkAdminPermissions() {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session?.user) {
    redirect("/auth/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { id: true, role: true },
  });

  if (
    !currentUser ||
    (currentUser.role !== UserRole.ADMIN &&
      currentUser.role !== UserRole.ORGANIZER)
  ) {
    throw new Error("Unauthorized: Admin or Organizer access required");
  }

  return currentUser;
}

// Helper function to check if user owns the form or has permission
async function checkFormPermission(formId: string) {
  const currentUser = await checkAdminPermissions();

  const form = await prisma.form.findUnique({
    where: { id: formId },
    select: { id: true, createdBy: true },
  });

  if (!form) {
    throw new Error("Form not found");
  }

  // Allow admin and organizers, or the form creator
  if (
    currentUser.role === UserRole.ADMIN ||
    currentUser.role === UserRole.ORGANIZER ||
    form.createdBy === currentUser.id
  ) {
    return { currentUser, form };
  }

  throw new Error(
    "Unauthorized: You don't have permission to modify this form"
  );
}

// Publish or unpublish a form
export async function publishForm(
  publishData: z.infer<typeof publishFormSchema>
) {
  try {
    const validatedData = publishFormSchema.parse(publishData);
    await checkFormPermission(validatedData.formId);

    // If publishing, validate the form first
    if (validatedData.isActive) {
      const validation = await validateFormStructure(validatedData.formId);
      if (!validation.success) {
        return {
          success: false,
          error: `Cannot publish form: ${validation.error}`,
        };
      }
    }

    const form = await prisma.form.update({
      where: { id: validatedData.formId },
      data: {
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        updatedAt: true,
      },
    });

    revalidatePath("/admin/forms");
    revalidatePath(`/admin/forms/${validatedData.formId}`);

    return {
      success: true,
      data: form,
      message: `Form updated successfully`,
    };
  } catch (error) {
    console.error("Error publishing form:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to publish form",
    };
  }
}

// Validate form structure before publishing
export async function validateFormStructure(formId: string) {
  try {
    const validatedData = validateFormSchema.parse({ formId });
    await checkFormPermission(validatedData.formId);

    const form = await prisma.form.findUnique({
      where: { id: validatedData.formId },
      include: {
        sections: {
          include: {
            fields: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!form) {
      throw new Error("Form not found");
    }

    const issues = [];

    // Check if form has a name
    if (!form.name || form.name.trim() === "") {
      issues.push("Form must have a name");
    }

    // Check if form has at least one section
    if (form.sections.length === 0) {
      issues.push("Form must have at least one section");
    }

    // Check each section
    form.sections.forEach((section, sectionIndex) => {
      const sectionName = section.title || `Section ${sectionIndex + 1}`;

      // Check if section has at least one field
      if (section.fields.length === 0) {
        issues.push(`${sectionName} must have at least one field`);
      }

      // Check each field
      section.fields.forEach((field, fieldIndex) => {
        const fieldName = field.label || `Field ${fieldIndex + 1}`;

        // Check if field has a label
        if (!field.label || field.label.trim() === "") {
          issues.push(`${sectionName} > ${fieldName} must have a label`);
        }

        // Check field-specific validations
        if (
          field.type === "SELECT" ||
          field.type === "MULTISELECT" ||
          field.type === "RADIO" ||
          field.type === "CHECKBOX"
        ) {
          if (
            !field.options ||
            !Array.isArray(field.options) ||
            field.options.length === 0
          ) {
            issues.push(
              `${sectionName} > ${fieldName} must have at least one option`
            );
          }
        }
      });
    });

    if (issues.length > 0) {
      return {
        success: false,
        error: `Form validation failed: ${issues.join(", ")}`,
        issues,
      };
    }

    return {
      success: true,
      message: "Form structure is valid",
    };
  } catch (error) {
    console.error("Error validating form:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to validate form",
    };
  }
}

// Clone/duplicate a form
export async function cloneForm(cloneData: z.infer<typeof cloneFormSchema>) {
  try {
    const validatedData = cloneFormSchema.parse(cloneData);
    const { currentUser } = await checkFormPermission(validatedData.formId);

    // Get the original form with all related data
    const originalForm = await prisma.form.findUnique({
      where: { id: validatedData.formId },
      include: {
        sections: {
          include: {
            fields: true,
          },
          orderBy: { order: "asc" },
        },
        submissions: validatedData.includeSubmissions
          ? {
              include: {
                responses: true,
              },
            }
          : false,
      },
    });

    if (!originalForm) {
      throw new Error("Original form not found");
    }

    // Create the cloned form in a transaction
    const clonedForm = await prisma.$transaction(async (tx) => {
      // Create the new form
      const newForm = await tx.form.create({
        data: {
          name: validatedData.title || `${originalForm.name} (Copy)`,
          description: originalForm.description,
          imageUrl: originalForm.imageUrl,
          createdBy: currentUser.id,
        },
      });

      // Clone sections and fields
      for (const section of originalForm.sections) {
        const newSection = await tx.section.create({
          data: {
            formId: newForm.id,
            title: section.title,
            order: section.order,
          },
        });

        // Clone fields for this section
        for (const field of section.fields) {
          await tx.field.create({
            data: {
              sectionId: newSection.id,
              label: field.label,
              placeholder: field.placeholder,
              type: field.type,
              required: field.required,
              options: field.options as Prisma.InputJsonValue,
              defaultValue: field.defaultValue,
              order: field.order,
              validation: field.validation as Prisma.InputJsonValue,
              styling: field.styling as Prisma.InputJsonValue,
              logic: field.logic as Prisma.InputJsonValue,
            },
          });
        }
      }

      // Clone submissions if requested (simplified for current schema)
      if (validatedData.includeSubmissions && originalForm.submissions) {
        for (const submission of originalForm.submissions) {
          const newSubmission = await tx.formSubmission.create({
            data: {
              formId: newForm.id,
              submittedBy: submission.submittedBy,
              submittedAt: submission.submittedAt,
            },
          });

          // Clone responses if submission has responses property
          if (
            "responses" in submission &&
            Array.isArray(submission.responses)
          ) {
            for (const response of submission.responses) {
              // Find the corresponding field in the new form
              const originalField = await tx.field.findFirst({
                where: { id: response.fieldId },
                select: { label: true, sectionId: true },
              });

              if (originalField) {
                const originalSection = await tx.section.findFirst({
                  where: { id: originalField.sectionId },
                  select: { order: true },
                });

                const newSection = await tx.section.findFirst({
                  where: {
                    formId: newForm.id,
                    order: originalSection?.order,
                  },
                });

                const newField = await tx.field.findFirst({
                  where: {
                    sectionId: newSection?.id,
                    label: originalField.label,
                  },
                });

                if (newField) {
                  await tx.fieldResponse.create({
                    data: {
                      submissionId: newSubmission.id,
                      fieldId: newField.id,
                      value: response.value,
                    },
                  });
                }
              }
            }
          }
        }
      }

      return tx.form.findUnique({
        where: { id: newForm.id },
        include: {
          sections: {
            include: {
              fields: true,
            },
            orderBy: { order: "asc" },
          },
          _count: {
            select: { submissions: true },
          },
        },
      });
    });

    revalidatePath("/admin/forms");

    return {
      success: true,
      data: clonedForm,
      message: "Form cloned successfully",
    };
  } catch (error) {
    console.error("Error cloning form:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to clone form",
    };
  }
}

// Get form analytics and insights
export async function getFormAnalytics(formId: string) {
  try {
    await checkFormPermission(formId);

    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        sections: {
          include: {
            fields: true,
          },
        },
        submissions: {
          include: {
            responses: true,
          },
        },
      },
    });

    if (!form) {
      throw new Error("Form not found");
    }

    // Calculate basic stats
    const totalSubmissions = form.submissions.length;
    const totalFields = form.sections.reduce(
      (sum, section) => sum + section.fields.length,
      0
    );
    const requiredFields = form.sections.reduce(
      (sum, section) => sum + section.fields.filter((f) => f.required).length,
      0
    );

    // Calculate completion rates
    const fieldCompletionRates = new Map();
    form.sections.forEach((section) => {
      section.fields.forEach((field) => {
        const responses = form.submissions.reduce(
          (count, submission) =>
            count +
            (submission.responses.some((r) => r.fieldId === field.id) ? 1 : 0),
          0
        );

        fieldCompletionRates.set(field.id, {
          fieldLabel: field.label,
          completionRate:
            totalSubmissions > 0 ? responses / totalSubmissions : 0,
          responseCount: responses,
        });
      });
    });

    // Calculate drop-off points
    const sectionDropoffRates = form.sections.map((section) => {
      const sectionResponses = form.submissions.filter((submission) =>
        submission.responses.some((response) =>
          section.fields.some((field) => field.id === response.fieldId)
        )
      ).length;

      return {
        sectionTitle: section.title || `Section ${section.order + 1}`,
        completionRate:
          totalSubmissions > 0 ? sectionResponses / totalSubmissions : 0,
        responseCount: sectionResponses,
      };
    });

    // Calculate average completion time (if available in submission data)
    const avgCompletionTime = null;
    // Note: Current schema doesn't support metadata field for completion times

    return {
      success: true,
      data: {
        overview: {
          totalSubmissions,
          totalFields,
          requiredFields,
          createdAt: form.createdAt,
          updatedAt: form.updatedAt,
        },
        completion: {
          fieldCompletionRates: Array.from(fieldCompletionRates.values()),
          sectionDropoffRates,
          averageCompletionTime: avgCompletionTime
            ? Math.round(avgCompletionTime / 1000)
            : null, // in seconds
        },
        insights: generateFormInsights(
          totalSubmissions,
          Array.from(fieldCompletionRates.values()),
          sectionDropoffRates
        ),
      },
    };
  } catch (error) {
    console.error("Error fetching form analytics:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch form analytics",
    };
  }
}

// Generate insights based on form data
function generateFormInsights(
  totalSubmissions: number,
  fieldCompletionRates: Array<{
    fieldLabel: string;
    completionRate: number;
    responseCount: number;
  }>,
  sectionDropoffRates: Array<{
    sectionTitle: string;
    completionRate: number;
    responseCount: number;
  }>
): string[] {
  const insights = [];

  if (totalSubmissions === 0) {
    insights.push(
      "No submissions yet. Consider sharing your form to get responses."
    );
  } else {
    // Submission volume insights
    if (totalSubmissions < 10) {
      insights.push("Form is new. Collect more responses for better insights.");
    } else if (totalSubmissions > 100) {
      insights.push(
        "Great response volume! You have enough data for meaningful analysis."
      );
    }

    // Field completion insights
    const lowCompletionFields = fieldCompletionRates.filter(
      (f) => f.completionRate < 0.5
    );
    if (lowCompletionFields.length > 0) {
      insights.push(
        `${lowCompletionFields.length} field(s) have low completion rates. Consider making them optional or improving their clarity.`
      );
    }

    const highCompletionFields = fieldCompletionRates.filter(
      (f) => f.completionRate > 0.9
    );
    if (highCompletionFields.length > fieldCompletionRates.length * 0.8) {
      insights.push(
        "Most fields have high completion rates - great form design!"
      );
    }

    // Section drop-off insights
    const dropoffSections = sectionDropoffRates.filter(
      (s) => s.completionRate < 0.7
    );
    if (dropoffSections.length > 0) {
      insights.push(
        `Some sections have significant drop-off rates. Consider simplifying or shortening these sections.`
      );
    }

    // Overall completion insights
    const avgCompletion =
      fieldCompletionRates.reduce((sum, f) => sum + f.completionRate, 0) /
      fieldCompletionRates.length;
    if (avgCompletion < 0.6) {
      insights.push(
        "Overall completion rate is low. Consider reducing form length or improving user experience."
      );
    } else if (avgCompletion > 0.8) {
      insights.push(
        "Excellent overall completion rate! Your form is well-designed."
      );
    }
  }

  return insights;
}

// Reset form (delete all submissions)
export async function resetFormSubmissions(formId: string) {
  try {
    await checkFormPermission(formId);

    // Delete all submissions and their responses
    const deletedCount = await prisma.$transaction(async (tx) => {
      // Get submission count before deletion
      const count = await tx.formSubmission.count({
        where: { formId },
      });

      // Delete field responses first (due to foreign key constraints)
      await tx.fieldResponse.deleteMany({
        where: {
          submission: { formId },
        },
      });

      // Delete submissions
      await tx.formSubmission.deleteMany({
        where: { formId },
      });

      return count;
    });

    revalidatePath(`/admin/forms/${formId}`);
    revalidatePath(`/admin/forms/${formId}/submissions`);

    return {
      success: true,
      message: `Successfully deleted ${deletedCount} submission(s)`,
      deletedCount,
    };
  } catch (error) {
    console.error("Error resetting form submissions:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to reset form submissions",
    };
  }
}
