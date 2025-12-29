"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schemas
const createFormSchema = z.object({
  name: z
    .string()
    .min(1, "Form name is required")
    .max(255, "Form name too long"),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

const updateFormSchema = z.object({
  id: z.string().cuid(),
  name: z
    .string()
    .min(1, "Form name is required")
    .max(255, "Form name too long")
    .optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
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

// Helper function to check if user can view forms (everyone except participants)
async function checkViewPermissions() {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session?.user) {
    redirect("/auth/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { id: true, role: true },
  });

  if (!currentUser || currentUser.role === UserRole.PARTICIPANT) {
    throw new Error("Unauthorized: Participants cannot access forms");
  }

  return currentUser;
}

// Create a new form
export async function createForm(formData: z.infer<typeof createFormSchema>) {
  try {
    const currentUser = await checkAdminPermissions();

    // Validate input
    const validatedData = createFormSchema.parse(formData);

    // Create form with default section
    const form = await prisma.form.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        imageUrl: validatedData.imageUrl || null,
        createdBy: currentUser.id,
        sections: {
          create: {
            title: "Section 1",
            order: 0,
          },
        },
      },
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

    revalidatePath("/admin/forms");

    return {
      success: true,
      data: form,
    };
  } catch (error) {
    console.error("Error creating form:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create form",
    };
  }
}

// Get all forms with basic info
export async function getAllForms() {
  try {
    await checkViewPermissions();

    const forms = await prisma.form.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            sections: true,
            submissions: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return {
      success: true,
      data: forms,
    };
  } catch (error) {
    console.error("Error fetching forms:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch forms",
    };
  }
}

// Get a specific form with full configuration
export async function getFormById(formId: string) {
  try {
    await checkViewPermissions();

    if (!formId) {
      throw new Error("Form ID is required");
    }

    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
        sections: {
          include: {
            fields: {
              orderBy: {
                order: "asc",
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });

    if (!form) {
      throw new Error("Form not found");
    }

    return {
      success: true,
      data: form,
    };
  } catch (error) {
    console.error("Error fetching form:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch form",
    };
  }
}

// Update form metadata
export async function updateForm(formData: z.infer<typeof updateFormSchema>) {
  try {
    await checkAdminPermissions();

    const validatedData = updateFormSchema.parse(formData);
    const { id, ...updateData } = validatedData;

    const form = await prisma.form.update({
      where: { id },
      data: {
        ...updateData,
        imageUrl: updateData.imageUrl || null,
      },
      include: {
        sections: {
          include: {
            fields: true,
          },
        },
      },
    });

    revalidatePath("/admin/forms");
    revalidatePath(`/admin/forms/${id}`);

    return {
      success: true,
      data: form,
    };
  } catch (error) {
    console.error("Error updating form:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update form",
    };
  }
}

// Delete a form
export async function deleteForm(formId: string) {
  try {
    await checkAdminPermissions();

    if (!formId) {
      throw new Error("Form ID is required");
    }

    // Check if form exists
    const form = await prisma.form.findUnique({
      where: { id: formId },
      select: { id: true, name: true },
    });

    if (!form) {
      throw new Error("Form not found");
    }

    // Delete form (cascade will handle sections, fields, submissions)
    await prisma.form.delete({
      where: { id: formId },
    });

    revalidatePath("/admin/forms");

    return {
      success: true,
      message: `Form "${form.name}" deleted successfully`,
    };
  } catch (error) {
    console.error("Error deleting form:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete form",
    };
  }
}

// Duplicate a form
export async function duplicateForm(formId: string) {
  try {
    const currentUser = await checkAdminPermissions();

    if (!formId) {
      throw new Error("Form ID is required");
    }

    // Get original form with all sections and fields
    const originalForm = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        sections: {
          include: {
            fields: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!originalForm) {
      throw new Error("Original form not found");
    }

    // Create new form with copied data
    const duplicatedForm = await prisma.form.create({
      data: {
        name: `${originalForm.name} (Copy)`,
        description: originalForm.description,
        imageUrl: originalForm.imageUrl,
        createdBy: currentUser.id,
        sections: {
          create: originalForm.sections.map((section) => ({
            title: section.title,
            order: section.order,
            fields: {
              create: section.fields.map((field) => ({
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
              })),
            },
          })),
        },
      },
      include: {
        sections: {
          include: {
            fields: true,
          },
        },
      },
    });

    revalidatePath("/admin/forms");

    return {
      success: true,
      data: duplicatedForm,
    };
  } catch (error) {
    console.error("Error duplicating form:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to duplicate form",
    };
  }
}

// Get form statistics
export async function getFormStats(formId?: string) {
  try {
    await checkViewPermissions();

    if (formId) {
      // Get stats for specific form
      const form = await prisma.form.findUnique({
        where: { id: formId },
        include: {
          _count: {
            select: {
              sections: true,
              submissions: true,
            },
          },
          submissions: {
            select: {
              submittedAt: true,
            },
            orderBy: {
              submittedAt: "desc",
            },
            take: 1,
          },
        },
      });

      if (!form) {
        throw new Error("Form not found");
      }

      // Get submission count by day for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const submissionsByDay = await prisma.formSubmission.groupBy({
        by: ["submittedAt"],
        where: {
          formId: formId,
          submittedAt: {
            gte: thirtyDaysAgo,
          },
        },
        _count: {
          id: true,
        },
      });

      return {
        success: true,
        data: {
          totalSections: form._count.sections,
          totalSubmissions: form._count.submissions,
          lastSubmission: form.submissions[0]?.submittedAt || null,
          submissionsByDay,
        },
      };
    } else {
      // Get overall stats
      const [totalForms, totalSubmissions, recentSubmissions] =
        await Promise.all([
          prisma.form.count(),
          prisma.formSubmission.count(),
          prisma.formSubmission.findMany({
            take: 5,
            orderBy: { submittedAt: "desc" },
            include: {
              form: {
                select: { name: true },
              },
              submitter: {
                select: { name: true, email: true },
              },
            },
          }),
        ]);

      return {
        success: true,
        data: {
          totalForms,
          totalSubmissions,
          recentSubmissions,
        },
      };
    }
  } catch (error) {
    console.error("Error fetching form stats:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch form statistics",
    };
  }
}
