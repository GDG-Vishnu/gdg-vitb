import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createField,
  updateField,
  deleteField,
  getSectionFields,
  duplicateField,
  reorderFields,
  moveField,
} from "@/actions/fields";
import { FieldType } from "@prisma/client";

// Minimal field configuration type to replace form-builder UI types
type FieldConfiguration = {
  id: string;
  label?: string | null;
  placeholder?: string | null;
  type: FieldType;
  required?: boolean | null;
  options?: any;
  defaultValue?: any;
  order?: number | null;
  minLength?: number | null;
  maxLength?: number | null;
  pattern?: string | null;
  min?: number | null;
  max?: number | null;
  step?: number | null;
  minDate?: string | null;
  maxDate?: string | null;
  maxFileSize?: number | null;
  acceptedFormats?: string[] | null;
  maxFiles?: number | null;
};

// Query keys for field operations
export const FIELD_QUERY_KEYS = {
  sectionFields: (sectionId: string) => ["fields", "section", sectionId],
  field: (fieldId: string) => ["field", fieldId],
} as const;

// Hook to fetch fields for a section
export function useSectionFields(sectionId: string | null) {
  return useQuery({
    queryKey: FIELD_QUERY_KEYS.sectionFields(sectionId || ""),
    queryFn: async () => {
      if (!sectionId) throw new Error("Section ID is required");
      const result = await getSectionFields(sectionId);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch fields");
      }
      return result.data;
    },
    enabled: !!sectionId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Hook to create a new field
export function useCreateField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      sectionId: string;
      fieldType: FieldType;
      label?: string;
      placeholder?: string;
      required?: boolean;
      order?: number;
    }) => {
      const result = await createField({
        sectionId: input.sectionId,
        label: input.label || `${input.fieldType} Field`,
        placeholder: input.placeholder,
        type: input.fieldType,
        required: input.required || false,
        order: input.order,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to create field");
      }

      return result.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate section fields
      queryClient.invalidateQueries({
        queryKey: FIELD_QUERY_KEYS.sectionFields(variables.sectionId),
      });

      // Invalidate form data to refresh the UI
      queryClient.invalidateQueries({
        queryKey: ["form"],
      });
    },
    onError: (error) => {
      console.error("Error creating field:", error);
    },
  });
}

// Hook to update a field
export function useUpdateField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (field: FieldConfiguration & { sectionId: string }) => {
      const result = await updateField({
        id: field.id,
        label: field.label,
        placeholder: field.placeholder,
        type: field.type,
        required: field.required,
        options: field.options,
        defaultValue: field.defaultValue,
        order: field.order,
        validation: {
          minLength: field.minLength,
          maxLength: field.maxLength,
          pattern: field.pattern,
          min: field.min,
          max: field.max,
          step: field.step,
          minDate: field.minDate,
          maxDate: field.maxDate,
          maxFileSize: field.maxFileSize,
          acceptedFormats: field.acceptedFormats,
          maxFiles: field.maxFiles,
        },
        styling: {
          // Add any styling options if needed
        },
        logic: {
          // Add any logic options if needed
        },
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to update field");
      }

      return result.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate section fields
      queryClient.invalidateQueries({
        queryKey: FIELD_QUERY_KEYS.sectionFields(variables.sectionId),
      });

      // Invalidate form data
      queryClient.invalidateQueries({
        queryKey: ["form"],
      });
    },
    onError: (error) => {
      console.error("Error updating field:", error);
    },
  });
}

// Hook to delete a field
export function useDeleteField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { fieldId: string; sectionId: string }) => {
      const result = await deleteField(input.fieldId);

      if (!result.success) {
        throw new Error(result.error || "Failed to delete field");
      }

      return result;
    },
    onSuccess: (data, variables) => {
      // Invalidate section fields
      queryClient.invalidateQueries({
        queryKey: FIELD_QUERY_KEYS.sectionFields(variables.sectionId),
      });

      // Invalidate form data
      queryClient.invalidateQueries({
        queryKey: ["form"],
      });
    },
    onError: (error) => {
      console.error("Error deleting field:", error);
    },
  });
}

// Hook to duplicate a field
export function useDuplicateField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { fieldId: string; sectionId: string }) => {
      const result = await duplicateField(input.fieldId);

      if (!result.success) {
        throw new Error(result.error || "Failed to duplicate field");
      }

      return result;
    },
    onSuccess: (data, variables) => {
      // Invalidate section fields
      queryClient.invalidateQueries({
        queryKey: FIELD_QUERY_KEYS.sectionFields(variables.sectionId),
      });

      // Invalidate form data
      queryClient.invalidateQueries({
        queryKey: ["form"],
      });
    },
    onError: (error) => {
      console.error("Error duplicating field:", error);
    },
  });
}

// Hook to reorder fields within a section
export function useReorderFields() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      sectionId: string;
      fields: Array<{ id: string; order: number }>;
    }) => {
      const result = await reorderFields({
        sectionId: input.sectionId,
        fields: input.fields,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to reorder fields");
      }

      return result;
    },
    onSuccess: (data, variables) => {
      // Invalidate section fields
      queryClient.invalidateQueries({
        queryKey: FIELD_QUERY_KEYS.sectionFields(variables.sectionId),
      });

      // Invalidate form data
      queryClient.invalidateQueries({
        queryKey: ["form"],
      });
    },
    onError: (error) => {
      console.error("Error reordering fields:", error);
    },
  });
}

// Hook to move field to different section
export function useMoveField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      fieldId: string;
      currentSectionId: string;
      newSectionId: string;
      newOrder?: number;
    }) => {
      const result = await moveField({
        fieldId: input.fieldId,
        newSectionId: input.newSectionId,
        newOrder: input.newOrder,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to move field");
      }

      return result;
    },
    onSuccess: (data, variables) => {
      // Invalidate both sections
      queryClient.invalidateQueries({
        queryKey: FIELD_QUERY_KEYS.sectionFields(variables.currentSectionId),
      });
      queryClient.invalidateQueries({
        queryKey: FIELD_QUERY_KEYS.sectionFields(variables.newSectionId),
      });

      // Invalidate form data
      queryClient.invalidateQueries({
        queryKey: ["form"],
      });
    },
    onError: (error) => {
      console.error("Error moving field:", error);
    },
  });
}
