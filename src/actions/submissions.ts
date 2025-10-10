"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schemas
const createSubmissionSchema = z.object({
  formId: z.string().cuid("Invalid form ID"),
  responses: z.array(
    z.object({
      fieldId: z.string().cuid("Invalid field ID"),
      value: z.any(), // JSON field for flexible response data
    })
  ),
  submittedBy: z.string().optional(), // Can be anonymous
  metadata: z.any().optional(), // JSON field for additional data like IP, user agent, etc.
});

const updateSubmissionSchema = z.object({
  id: z.string().cuid("Invalid submission ID"),
  responses: z
    .array(
      z.object({
        fieldId: z.string().cuid("Invalid field ID"),
        value: z.any(), // JSON field for flexible response data
      })
    )
    .optional(),
  metadata: z.any().optional(),
});

const getSubmissionsSchema = z.object({
  formId: z.string().cuid("Invalid form ID"),
  page: z.number().int().min(1, "Page must be at least 1").default(1),
  limit: z
    .number()
    .int()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .default(20),
  search: z.string().optional(),
  sortBy: z.enum(["submittedAt", "submittedBy"]).default("submittedAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

// Helper function to check admin permissions
async function checkAdminPermissions() {
  const session = await getServerSession(authOptions);

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
    "Unauthorized: You don't have permission to access this form"
  );
}

// Helper function to check submission permission
async function checkSubmissionPermission(submissionId: string) {
  const currentUser = await checkAdminPermissions();

  const submission = await prisma.formSubmission.findUnique({
    where: { id: submissionId },
    include: {
      form: {
        select: { id: true, createdBy: true },
      },
    },
  });

  if (!submission) {
    throw new Error("Submission not found");
  }

  const form = submission.form;

  // Allow admin and organizers, or the form creator
  if (
    currentUser.role === UserRole.ADMIN ||
    currentUser.role === UserRole.ORGANIZER ||
    form.createdBy === currentUser.id
  ) {
    return { currentUser, submission, form };
  }

  throw new Error(
    "Unauthorized: You don't have permission to access this submission"
  );
}

// Create a new form submission (can be used by public forms)
export async function createSubmission(
  submissionData: z.infer<typeof createSubmissionSchema>
) {
  try {
    console.log("🔍 Server: Received submission data:", submissionData);

    const validatedData = createSubmissionSchema.parse(submissionData);
    console.log("🔍 Server: Validated data:", validatedData);

    // Check if form exists (simplified for current schema)
    const form = await prisma.form.findUnique({
      where: { id: validatedData.formId },
      include: {
        sections: {
          include: {
            fields: {
              select: { id: true, required: true, type: true },
            },
          },
        },
      },
    });

    console.log("🔍 Server: Found form:", form ? "Yes" : "No");
    if (form) {
      console.log(
        "🔍 Server: Form fields count:",
        form.sections.flatMap((s) => s.fields).length
      );
    }

    if (!form) {
      throw new Error("Form not found");
    }

    // Note: Current schema doesn't support isActive or requiresAuth fields

    // Validate that all required fields have responses
    const allFields = form.sections.flatMap((section) => section.fields);
    const requiredFields = allFields.filter((field) => field.required);
    const responseFieldIds = validatedData.responses.map((r) => r.fieldId);

    const missingRequiredFields = requiredFields.filter(
      (field) => !responseFieldIds.includes(field.id)
    );

    if (missingRequiredFields.length > 0) {
      throw new Error(
        `Missing required fields: ${missingRequiredFields.length} field(s)`
      );
    }

    // Validate that all response field IDs belong to the form
    const validFieldIds = allFields.map((field) => field.id);
    const invalidFieldIds = responseFieldIds.filter(
      (fieldId) => !validFieldIds.includes(fieldId)
    );

    if (invalidFieldIds.length > 0) {
      throw new Error("Some response fields don't belong to this form");
    }

    // Create submission with responses in a transaction
    console.log("🚀 Server: Creating submission in transaction...");
    const submission = await prisma.$transaction(async (tx) => {
      const newSubmission = await tx.formSubmission.create({
        data: {
          formId: validatedData.formId,
          submittedBy: validatedData.submittedBy,
        },
      });

      console.log("✅ Server: Created submission:", newSubmission.id);

      // Create field responses
      const responseData = validatedData.responses.map((response) => ({
        submissionId: newSubmission.id,
        fieldId: response.fieldId,
        value: response.value,
      }));

      console.log("🔍 Server: Creating field responses:", responseData);

      await tx.fieldResponse.createMany({
        data: responseData,
      });

      console.log("✅ Server: Created field responses");

      // Return submission with responses
      return tx.formSubmission.findUnique({
        where: { id: newSubmission.id },
        include: {
          responses: {
            include: {
              field: {
                select: { label: true, type: true },
              },
            },
          },
        },
      });
    });

    console.log("✅ Server: Transaction completed successfully");

    // Don't revalidate for public submissions to avoid auth issues
    revalidatePath(`/admin/forms/${validatedData.formId}/submissions`);

    return {
      success: true,
      data: submission,
    };
  } catch (error) {
    console.error("Error creating submission:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit form",
    };
  }
}

// Get submissions for a form (admin only)
export async function getFormSubmissions(
  params: z.infer<typeof getSubmissionsSchema>
) {
  try {
    const validatedParams = getSubmissionsSchema.parse(params);
    await checkFormPermission(validatedParams.formId);

    const { page, limit, search, sortBy, sortOrder, dateFrom, dateTo } =
      validatedParams;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: {
      formId: string;
      OR?: Array<{
        submittedBy?: { contains: string; mode: "insensitive" };
        responses?: {
          some: {
            value: {
              path: string;
              string_contains: string;
            };
          };
        };
      }>;
      submittedAt?: {
        gte?: Date;
        lte?: Date;
      };
    } = {
      formId: validatedParams.formId,
    };

    if (search) {
      where.OR = [
        { submittedBy: { contains: search, mode: "insensitive" } },
        {
          responses: {
            some: {
              value: {
                path: "$",
                string_contains: search,
              },
            },
          },
        },
      ];
    }

    if (dateFrom || dateTo) {
      where.submittedAt = {};
      if (dateFrom) where.submittedAt.gte = new Date(dateFrom);
      if (dateTo) where.submittedAt.lte = new Date(dateTo);
    }

    // Get submissions with count
    const [submissions, totalCount] = await Promise.all([
      prisma.formSubmission.findMany({
        where,
        include: {
          responses: {
            include: {
              field: {
                select: { id: true, label: true, type: true },
              },
            },
          },
          _count: {
            select: { responses: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.formSubmission.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      data: {
        submissions,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching submissions:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch submissions",
    };
  }
}

// Get a single submission with all details (admin only)
export async function getSubmissionById(submissionId: string) {
  try {
    if (!submissionId) {
      throw new Error("Submission ID is required");
    }

    await checkSubmissionPermission(submissionId);

    const detailedSubmission = await prisma.formSubmission.findUnique({
      where: { id: submissionId },
      include: {
        form: {
          select: { id: true, name: true },
        },
        responses: {
          include: {
            field: {
              include: {
                section: {
                  select: { title: true, order: true },
                },
              },
            },
          },
          orderBy: {
            field: {
              order: "asc",
            },
          },
        },
      },
    });

    return {
      success: true,
      data: detailedSubmission,
    };
  } catch (error) {
    console.error("Error fetching submission:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch submission",
    };
  }
}

// Update a submission (admin only)
export async function updateSubmission(
  submissionData: z.infer<typeof updateSubmissionSchema>
) {
  try {
    const validatedData = updateSubmissionSchema.parse(submissionData);
    const { form } = await checkSubmissionPermission(validatedData.id);

    // Update submission in a transaction
    const updatedSubmission = await prisma.$transaction(async (tx) => {
      // Update responses if provided
      if (validatedData.responses) {
        // Delete existing responses
        await tx.fieldResponse.deleteMany({
          where: { submissionId: validatedData.id },
        });

        // Create new responses
        await tx.fieldResponse.createMany({
          data: validatedData.responses.map((response) => ({
            submissionId: validatedData.id,
            fieldId: response.fieldId,
            value: response.value,
          })),
        });
      }

      // Return updated submission with responses
      return tx.formSubmission.findUnique({
        where: { id: validatedData.id },
        include: {
          responses: {
            include: {
              field: {
                select: { label: true, type: true },
              },
            },
          },
        },
      });
    });

    revalidatePath(`/admin/forms/${form.id}/submissions`);

    return {
      success: true,
      data: updatedSubmission,
    };
  } catch (error) {
    console.error("Error updating submission:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update submission",
    };
  }
}

// Delete a submission (admin only)
export async function deleteSubmission(submissionId: string) {
  try {
    if (!submissionId) {
      throw new Error("Submission ID is required");
    }

    const { form } = await checkSubmissionPermission(submissionId);

    // Delete submission (cascade will handle responses)
    await prisma.formSubmission.delete({
      where: { id: submissionId },
    });

    revalidatePath(`/admin/forms/${form.id}/submissions`);

    return {
      success: true,
      message: "Submission deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting submission:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete submission",
    };
  }
}

// Get submission statistics for a form (admin only)
export async function getFormSubmissionStats(formId: string) {
  try {
    await checkFormPermission(formId);

    const stats = await prisma.formSubmission.aggregate({
      where: { formId },
      _count: { id: true },
    });

    // Get submissions by day for the last 30 days (simplified approach)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSubmissions = await prisma.formSubmission.findMany({
      where: {
        formId,
        submittedAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        submittedAt: true,
      },
    });

    // Process daily stats to fill missing days
    const dailySubmissions = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayCount = recentSubmissions.filter((submission) => {
        const submissionDate = new Date(submission.submittedAt);
        submissionDate.setHours(0, 0, 0, 0);
        return submissionDate.getTime() === date.getTime();
      }).length;

      dailySubmissions.push({
        date: date.toISOString().split("T")[0],
        count: dayCount,
      });
    }

    // Get completion rate (responses vs required fields)
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        sections: {
          include: {
            fields: {
              select: { id: true, required: true },
            },
          },
        },
      },
    });

    const requiredFieldsCount =
      form?.sections.flatMap((s) => s.fields).filter((f) => f.required)
        .length || 0;

    const avgResponsesPerSubmission = await prisma.fieldResponse.groupBy({
      by: ["submissionId"],
      where: {
        submission: { formId },
      },
      _count: { id: true },
    });

    const avgCompletionRate =
      avgResponsesPerSubmission.length > 0
        ? avgResponsesPerSubmission.reduce(
            (sum, stat) => sum + stat._count.id,
            0
          ) /
          (avgResponsesPerSubmission.length * Math.max(requiredFieldsCount, 1))
        : 0;

    return {
      success: true,
      data: {
        totalSubmissions: stats._count.id,
        dailySubmissions,
        averageCompletionRate: Math.min(avgCompletionRate, 1), // Cap at 100%
        requiredFieldsCount,
      },
    };
  } catch (error) {
    console.error("Error fetching submission stats:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch submission statistics",
    };
  }
}

// Export submissions to CSV (admin only)
export async function exportSubmissions(formId: string) {
  try {
    await checkFormPermission(formId);

    const submissions = await prisma.formSubmission.findMany({
      where: { formId },
      include: {
        responses: {
          include: {
            field: {
              select: { id: true, label: true, type: true },
              include: {
                section: {
                  select: { title: true, order: true },
                },
              },
            },
          },
          orderBy: {
            field: {
              order: "asc",
            },
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    // Get all unique fields for CSV headers
    const allFields = new Map();
    submissions.forEach((submission) => {
      submission.responses.forEach((response) => {
        if (!allFields.has(response.field.id)) {
          allFields.set(response.field.id, {
            id: response.field.id,
            label: response.field.label,
            type: response.field.type,
            sectionTitle: response.field.section.title,
            sectionOrder: response.field.section.order,
          });
        }
      });
    });

    const fields = Array.from(allFields.values()).sort((a, b) => {
      if (a.sectionOrder !== b.sectionOrder) {
        return a.sectionOrder - b.sectionOrder;
      }
      return a.label.localeCompare(b.label);
    });

    // Build CSV data
    const csvData = submissions.map((submission) => {
      const row: Record<string, string> = {
        "Submission ID": submission.id,
        "Submitted By": submission.submittedBy || "Anonymous",
        "Submitted At": submission.submittedAt.toISOString(),
      };

      // Add field responses
      fields.forEach((field) => {
        const response = submission.responses.find(
          (r) => r.field.id === field.id
        );
        const value = response?.value;

        // Format value based on field type
        let formattedValue = "";
        if (value !== null && value !== undefined) {
          if (typeof value === "object") {
            formattedValue = JSON.stringify(value);
          } else {
            formattedValue = String(value);
          }
        }

        row[field.label] = formattedValue;
      });

      return row;
    });

    return {
      success: true,
      data: csvData,
    };
  } catch (error) {
    console.error("Error exporting submissions:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to export submissions",
    };
  }
}
