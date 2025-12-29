"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { UserRole, FieldType } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schemas
const createFieldSchema = z.object({
  sectionId: z.string().cuid("Invalid section ID"),
  label: z.string().min(1, "Label is required"),
  placeholder: z.string().optional(),
  type: z.nativeEnum(FieldType),
  required: z.boolean().default(false),
  options: z.any().optional(), // JSON field
  defaultValue: z.any().optional(), // JSON field
  order: z
    .number()
    .int()
    .min(0, "Order must be a non-negative integer")
    .optional(),
  validation: z.any().optional(), // JSON field
  styling: z.any().optional(), // JSON field
  logic: z.any().optional(), // JSON field
});

const updateFieldSchema = z.object({
  id: z.string().cuid("Invalid field ID"),
  label: z.string().min(1, "Label is required").optional(),
  placeholder: z.string().optional(),
  type: z.nativeEnum(FieldType).optional(),
  required: z.boolean().optional(),
  options: z.any().optional(), // JSON field
  defaultValue: z.any().optional(), // JSON field
  order: z
    .number()
    .int()
    .min(0, "Order must be a non-negative integer")
    .optional(),
  validation: z.any().optional(), // JSON field
  styling: z.any().optional(), // JSON field
  logic: z.any().optional(), // JSON field
});

const reorderFieldsSchema = z.object({
  sectionId: z.string().cuid("Invalid section ID"),
  fields: z.array(
    z.object({
      id: z.string().cuid("Invalid field ID"),
      order: z.number().int().min(0, "Order must be a non-negative integer"),
    })
  ),
});

const moveFieldSchema = z.object({
  fieldId: z.string().cuid("Invalid field ID"),
  newSectionId: z.string().cuid("Invalid section ID"),
  newOrder: z
    .number()
    .int()
    .min(0, "Order must be a non-negative integer")
    .optional(),
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
async function checkFormPermissionByField(fieldId: string) {
  const currentUser = await checkAdminPermissions();

  const field = await prisma.field.findUnique({
    where: { id: fieldId },
    include: {
      section: {
        include: {
          form: {
            select: { id: true, createdBy: true },
          },
        },
      },
    },
  });

  if (!field) {
    throw new Error("Field not found");
  }

  const form = field.section.form;

  // Allow admin and organizers, or the form creator
  if (
    currentUser.role === UserRole.ADMIN ||
    currentUser.role === UserRole.ORGANIZER ||
    form.createdBy === currentUser.id
  ) {
    return { currentUser, field, form };
  }

  throw new Error(
    "Unauthorized: You don't have permission to modify this form"
  );
}

async function checkFormPermissionBySection(sectionId: string) {
  const currentUser = await checkAdminPermissions();

  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    include: {
      form: {
        select: { id: true, createdBy: true },
      },
    },
  });

  if (!section) {
    throw new Error("Section not found");
  }

  const form = section.form;

  // Allow admin and organizers, or the form creator
  if (
    currentUser.role === UserRole.ADMIN ||
    currentUser.role === UserRole.ORGANIZER ||
    form.createdBy === currentUser.id
  ) {
    return { currentUser, section, form };
  }

  throw new Error(
    "Unauthorized: You don't have permission to modify this form"
  );
}

// Create a new field
export async function createField(
  fieldData: z.infer<typeof createFieldSchema>
) {
  try {
    const validatedData = createFieldSchema.parse(fieldData);
    const { form } = await checkFormPermissionBySection(
      validatedData.sectionId
    );

    // Get the next order if not provided
    const nextOrder =
      validatedData.order ?? (await getNextFieldOrder(validatedData.sectionId));

    const field = await prisma.field.create({
      data: {
        sectionId: validatedData.sectionId,
        label: validatedData.label,
        placeholder: validatedData.placeholder,
        type: validatedData.type,
        required: validatedData.required,
        options: validatedData.options as Prisma.InputJsonValue,
        defaultValue: validatedData.defaultValue,
        order: nextOrder,
        validation: validatedData.validation as Prisma.InputJsonValue,
        styling: validatedData.styling as Prisma.InputJsonValue,
        logic: validatedData.logic as Prisma.InputJsonValue,
      },
    });

    revalidatePath(`/admin/forms/${form.id}`);

    return {
      success: true,
      data: field,
    };
  } catch (error) {
    console.error("Error creating field:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create field",
    };
  }
}

// Get all fields for a section
export async function getSectionFields(sectionId: string) {
  try {
    await checkFormPermissionBySection(sectionId);

    const fields = await prisma.field.findMany({
      where: { sectionId },
      orderBy: { order: "asc" },
    });

    return {
      success: true,
      data: fields,
    };
  } catch (error) {
    console.error("Error fetching fields:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch fields",
    };
  }
}

// Update a field
export async function updateField(
  fieldData: z.infer<typeof updateFieldSchema>
) {
  try {
    const validatedData = updateFieldSchema.parse(fieldData);
    const { form } = await checkFormPermissionByField(validatedData.id);

    const field = await prisma.field.update({
      where: { id: validatedData.id },
      data: {
        label: validatedData.label,
        placeholder: validatedData.placeholder,
        type: validatedData.type,
        required: validatedData.required,
        options: validatedData.options as Prisma.InputJsonValue,
        defaultValue: validatedData.defaultValue,
        order: validatedData.order,
        validation: validatedData.validation as Prisma.InputJsonValue,
        styling: validatedData.styling as Prisma.InputJsonValue,
        logic: validatedData.logic as Prisma.InputJsonValue,
      },
    });

    revalidatePath(`/admin/forms/${form.id}`);

    return {
      success: true,
      data: field,
    };
  } catch (error) {
    console.error("Error updating field:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update field",
    };
  }
}

// Delete a field
export async function deleteField(fieldId: string) {
  try {
    if (!fieldId) {
      throw new Error("Field ID is required");
    }

    const { field, form } = await checkFormPermissionByField(fieldId);

    // Delete field (cascade will handle field responses)
    await prisma.field.delete({
      where: { id: fieldId },
    });

    revalidatePath(`/admin/forms/${form.id}`);

    return {
      success: true,
      message: `Field "${field.label}" deleted successfully`,
    };
  } catch (error) {
    console.error("Error deleting field:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete field",
    };
  }
}

// Reorder fields within a section
export async function reorderFields(
  reorderData: z.infer<typeof reorderFieldsSchema>
) {
  try {
    const validatedData = reorderFieldsSchema.parse(reorderData);
    const { form } = await checkFormPermissionBySection(
      validatedData.sectionId
    );

    // Verify all fields belong to the section
    const existingFields = await prisma.field.findMany({
      where: {
        sectionId: validatedData.sectionId,
        id: { in: validatedData.fields.map((f) => f.id) },
      },
      select: { id: true },
    });

    if (existingFields.length !== validatedData.fields.length) {
      throw new Error("Some fields don't belong to this section");
    }

    // Update fields in a transaction
    await prisma.$transaction(
      validatedData.fields.map((field) =>
        prisma.field.update({
          where: { id: field.id },
          data: { order: field.order },
        })
      )
    );

    revalidatePath(`/admin/forms/${form.id}`);

    return {
      success: true,
      message: "Fields reordered successfully",
    };
  } catch (error) {
    console.error("Error reordering fields:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to reorder fields",
    };
  }
}

// Move field to different section
export async function moveField(moveData: z.infer<typeof moveFieldSchema>) {
  try {
    const validatedData = moveFieldSchema.parse(moveData);

    // Check permissions for both current and target sections
    const { form: originalForm } = await checkFormPermissionByField(
      validatedData.fieldId
    );
    const { form: targetForm } = await checkFormPermissionBySection(
      validatedData.newSectionId
    );

    // Ensure both sections belong to the same form
    if (originalForm.id !== targetForm.id) {
      throw new Error("Cannot move field to a section in a different form");
    }

    // Get the next order if not provided
    const newOrder =
      validatedData.newOrder ??
      (await getNextFieldOrder(validatedData.newSectionId));

    const updatedField = await prisma.field.update({
      where: { id: validatedData.fieldId },
      data: {
        sectionId: validatedData.newSectionId,
        order: newOrder,
      },
    });

    revalidatePath(`/admin/forms/${originalForm.id}`);

    return {
      success: true,
      data: updatedField,
    };
  } catch (error) {
    console.error("Error moving field:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to move field",
    };
  }
}

// Duplicate a field within the same section
export async function duplicateField(fieldId: string) {
  try {
    if (!fieldId) {
      throw new Error("Field ID is required");
    }

    const { field, form } = await checkFormPermissionByField(fieldId);

    // Get the next order in the section
    const nextOrder = await getNextFieldOrder(field.sectionId);

    // Create new field with copied data
    const duplicatedField = await prisma.field.create({
      data: {
        sectionId: field.sectionId,
        label: `${field.label} (Copy)`,
        placeholder: field.placeholder,
        type: field.type,
        required: field.required,
        options: field.options as Prisma.InputJsonValue,
        defaultValue: field.defaultValue,
        order: nextOrder,
        validation: field.validation as Prisma.InputJsonValue,
        styling: field.styling as Prisma.InputJsonValue,
        logic: field.logic as Prisma.InputJsonValue,
      },
    });

    revalidatePath(`/admin/forms/${form.id}`);

    return {
      success: true,
      data: duplicatedField,
    };
  } catch (error) {
    console.error("Error duplicating field:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to duplicate field",
    };
  }
}

// Helper function to get the next order for a field in a section
async function getNextFieldOrder(sectionId: string): Promise<number> {
  const lastField = await prisma.field.findFirst({
    where: { sectionId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  return (lastField?.order || -1) + 1;
}

// Get field types and their configurations
export async function getFieldTypes() {
  return {
    success: true,
    data: Object.values(FieldType).map((type) => ({
      value: type,
      label: formatFieldTypeName(type),
      description: getFieldTypeDescription(type),
      hasOptions: fieldTypeHasOptions(type),
      supportedValidation: getFieldTypeValidation(type),
    })),
  };
}

// Helper functions for field type metadata
function formatFieldTypeName(type: FieldType): string {
  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l: string) => l.toUpperCase());
}

function getFieldTypeDescription(type: FieldType): string {
  const descriptions: Record<FieldType, string> = {
    [FieldType.INPUT]: "Single line text input",
    [FieldType.TEXTAREA]: "Multi-line text input",
    [FieldType.PASSWORD]: "Password input",
    [FieldType.PHONE]: "Phone number input",
    [FieldType.CHECKBOX]: "Multiple choice checkboxes",
    [FieldType.RADIO]: "Single choice from options",
    [FieldType.SELECT]: "Dropdown selection",
    [FieldType.COMBOBOX]: "Combobox selection",
    [FieldType.MULTISELECT]: "Multiple choice selection",
    [FieldType.SWITCH]: "On/off switch",
    [FieldType.DATE]: "Date picker",
    [FieldType.DATETIME]: "Date and time picker",
    [FieldType.SMART_DATETIME]: "Smart date and time picker",
    [FieldType.FILE]: "File upload",
    [FieldType.OTP]: "One-time password input",
    [FieldType.LOCATION]: "Location picker",
    [FieldType.SIGNATURE]: "Digital signature",
    [FieldType.SLIDER]: "Range slider input",
    [FieldType.TAGS]: "Tag input",
    EMAIL: "",
  };

  return descriptions[type] || "Unknown field type";
}

function fieldTypeHasOptions(type: FieldType): boolean {
  const optionTypes: FieldType[] = [
    FieldType.SELECT,
    FieldType.MULTISELECT,
    FieldType.RADIO,
    FieldType.CHECKBOX,
    FieldType.COMBOBOX,
  ];
  return optionTypes.includes(type);
}

function getFieldTypeValidation(type: FieldType): string[] {
  const validationMap: Record<FieldType, string[]> = {
    [FieldType.INPUT]: ["required", "minLength", "maxLength", "pattern"],
    [FieldType.TEXTAREA]: ["required", "minLength", "maxLength"],
    [FieldType.PASSWORD]: ["required", "minLength", "maxLength", "pattern"],
    [FieldType.PHONE]: ["required", "phone"],
    [FieldType.CHECKBOX]: ["required", "minItems", "maxItems"],
    [FieldType.RADIO]: ["required"],
    [FieldType.SELECT]: ["required"],
    [FieldType.COMBOBOX]: ["required"],
    [FieldType.MULTISELECT]: ["required", "minItems", "maxItems"],
    [FieldType.SWITCH]: ["required"],
    [FieldType.DATE]: ["required", "minDate", "maxDate"],
    [FieldType.DATETIME]: ["required", "minDate", "maxDate"],
    [FieldType.SMART_DATETIME]: ["required", "minDate", "maxDate"],
    [FieldType.FILE]: ["required", "fileTypes", "maxSize", "maxFiles"],
    [FieldType.OTP]: ["required", "length"],
    [FieldType.LOCATION]: ["required"],
    [FieldType.SIGNATURE]: ["required"],
    [FieldType.SLIDER]: ["required", "min", "max", "step"],
    [FieldType.TAGS]: ["required", "minItems", "maxItems"],
    EMAIL: [],
  };

  return validationMap[type] || ["required"];
}
