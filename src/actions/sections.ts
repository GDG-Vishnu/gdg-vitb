"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { UserRole, Field } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schemas
const createSectionSchema = z.object({
  formId: z.string().cuid("Invalid form ID"),
  title: z.string().optional(),
  order: z.number().int().min(0, "Order must be a non-negative integer"),
});

const updateSectionSchema = z.object({
  id: z.string().cuid("Invalid section ID"),
  title: z.string().optional(),
  order: z
    .number()
    .int()
    .min(0, "Order must be a non-negative integer")
    .optional(),
});

const reorderSectionsSchema = z.object({
  formId: z.string().cuid("Invalid form ID"),
  sections: z.array(
    z.object({
      id: z.string().cuid("Invalid section ID"),
      order: z.number().int().min(0, "Order must be a non-negative integer"),
    })
  ),
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
    "Unauthorized: You don't have permission to modify this form"
  );
}

// Create a new section
export async function createSection(
  sectionData: z.infer<typeof createSectionSchema>
) {
  try {
    const validatedData = createSectionSchema.parse(sectionData);
    await checkFormPermission(validatedData.formId);

    // Check if the form exists and get the next order
    const formWithSections = await prisma.form.findUnique({
      where: { id: validatedData.formId },
      include: {
        sections: {
          select: { order: true },
          orderBy: { order: "desc" },
          take: 1,
        },
      },
    });

    if (!formWithSections) {
      throw new Error("Form not found");
    }

    const nextOrder =
      validatedData.order ?? (formWithSections.sections[0]?.order + 1 || 0);

    const section = await prisma.section.create({
      data: {
        formId: validatedData.formId,
        title: validatedData.title || `Section ${nextOrder + 1}`,
        order: nextOrder,
      },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
      },
    });

    revalidatePath(`/admin/forms/${validatedData.formId}`);

    return {
      success: true,
      data: section,
    };
  } catch (error) {
    console.error("Error creating section:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create section",
    };
  }
}

// Get all sections for a form
export async function getFormSections(formId: string) {
  try {
    await checkFormPermission(formId);

    const sections = await prisma.section.findMany({
      where: { formId },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: { fields: true },
        },
      },
      orderBy: { order: "asc" },
    });

    return {
      success: true,
      data: sections,
    };
  } catch (error) {
    console.error("Error fetching sections:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch sections",
    };
  }
}

// Update a section
export async function updateSection(
  sectionData: z.infer<typeof updateSectionSchema>
) {
  try {
    const validatedData = updateSectionSchema.parse(sectionData);

    // Get the section to check form permission
    const existingSection = await prisma.section.findUnique({
      where: { id: validatedData.id },
      select: { formId: true },
    });

    if (!existingSection) {
      throw new Error("Section not found");
    }

    await checkFormPermission(existingSection.formId);

    const section = await prisma.section.update({
      where: { id: validatedData.id },
      data: {
        title: validatedData.title,
        order: validatedData.order,
      },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
      },
    });

    revalidatePath(`/admin/forms/${existingSection.formId}`);

    return {
      success: true,
      data: section,
    };
  } catch (error) {
    console.error("Error updating section:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update section",
    };
  }
}

// Delete a section
export async function deleteSection(sectionId: string) {
  try {
    if (!sectionId) {
      throw new Error("Section ID is required");
    }

    // Get the section to check form permission
    const existingSection = await prisma.section.findUnique({
      where: { id: sectionId },
      select: {
        formId: true,
        title: true,
        _count: { select: { fields: true } },
      },
    });

    if (!existingSection) {
      throw new Error("Section not found");
    }

    await checkFormPermission(existingSection.formId);

    // Check if this is the last section
    const sectionsCount = await prisma.section.count({
      where: { formId: existingSection.formId },
    });

    if (sectionsCount <= 1) {
      throw new Error(
        "Cannot delete the last section. A form must have at least one section."
      );
    }

    // Delete section (cascade will handle fields)
    await prisma.section.delete({
      where: { id: sectionId },
    });

    revalidatePath(`/admin/forms/${existingSection.formId}`);

    return {
      success: true,
      message: `Section "${
        existingSection.title || "Untitled"
      }" deleted successfully`,
    };
  } catch (error) {
    console.error("Error deleting section:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete section",
    };
  }
}

// Reorder sections within a form
export async function reorderSections(
  reorderData: z.infer<typeof reorderSectionsSchema>
) {
  try {
    const validatedData = reorderSectionsSchema.parse(reorderData);
    await checkFormPermission(validatedData.formId);

    // Verify all sections belong to the form
    const existingSections = await prisma.section.findMany({
      where: {
        formId: validatedData.formId,
        id: { in: validatedData.sections.map((s) => s.id) },
      },
      select: { id: true },
    });

    if (existingSections.length !== validatedData.sections.length) {
      throw new Error("Some sections don't belong to this form");
    }

    // Update sections in a transaction
    await prisma.$transaction(
      validatedData.sections.map((section) =>
        prisma.section.update({
          where: { id: section.id },
          data: { order: section.order },
        })
      )
    );

    revalidatePath(`/admin/forms/${validatedData.formId}`);

    return {
      success: true,
      message: "Sections reordered successfully",
    };
  } catch (error) {
    console.error("Error reordering sections:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to reorder sections",
    };
  }
}

// Duplicate a section within the same form
export async function duplicateSection(sectionId: string) {
  try {
    if (!sectionId) {
      throw new Error("Section ID is required");
    }

    // Get the section with all fields
    const originalSection = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!originalSection) {
      throw new Error("Section not found");
    }

    await checkFormPermission(originalSection.formId);

    // Get the highest order in the form
    const lastSection = await prisma.section.findFirst({
      where: { formId: originalSection.formId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = (lastSection?.order || 0) + 1;

    // Create new section with copied fields
    const duplicatedSection = await prisma.section.create({
      data: {
        formId: originalSection.formId,
        title: `${originalSection.title || "Untitled"} (Copy)`,
        order: newOrder,
        fields: {
          create: originalSection.fields.map((field: Field) => ({
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
      },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
      },
    });

    revalidatePath(`/admin/forms/${originalSection.formId}`);

    return {
      success: true,
      data: duplicatedSection,
    };
  } catch (error) {
    console.error("Error duplicating section:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to duplicate section",
    };
  }
}
