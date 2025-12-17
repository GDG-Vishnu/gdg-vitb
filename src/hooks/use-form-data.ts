import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFormById } from "@/actions/forms";
import { updateSection, createSection } from "@/actions/sections";
import { createField, deleteField } from "@/actions/fields";
// Minimal local types to avoid depending on the form-builder UI types
type CreateSectionInput = { formId: string; title: string; order?: number };
type FormData = any;
type FieldType = string;

// Query keys for React Query
export const FORM_QUERY_KEYS = {
  form: (id: string) => ["form", id],
  forms: () => ["forms"],
} as const;

// Hook to fetch form by ID
export function useForm(formId: string | null) {
  return useQuery({
    queryKey: FORM_QUERY_KEYS.form(formId || ""),
    queryFn: async () => {
      if (!formId) throw new Error("Form ID is required");
      const result = await getFormById(formId);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch form");
      }
      return result.data;
    },
    enabled: !!formId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

// Hook to create a new section
export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSectionInput) => {
      const result = await createSection({
        formId: input.formId,
        title: input.title,
        order: input.order || 0,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to create section");
      }

      return result;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch form data
      queryClient.invalidateQueries({
        queryKey: FORM_QUERY_KEYS.form(variables.formId),
      });
    },
    onError: (error) => {
      console.error("Error creating section:", error);
    },
  });
}

// Hook to update section
export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      sectionId: string;
      title: string;
      description?: string | null;
    }) => {
      const result = await updateSection({
        id: input.sectionId,
        title: input.title,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to update section");
      }

      return result;
    },
    onSuccess: (data) => {
      // Update all forms that might contain this section
      queryClient.invalidateQueries({
        queryKey: ["form", data.data?.formId],
      });
    },
    onError: (error) => {
      console.error("Error updating section:", error);
    },
  });
}

// Hook to update form
export function useUpdateForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: Partial<FormData> & { id: string }) => {
      // TODO: Implement actual API call to update form
      console.log("Updating form:", formData);

      // Return immediately - no artificial delay
      return {
        success: true,
        data: formData,
      };
    },
    onSuccess: (data, variables) => {
      // Update the specific form in cache
      queryClient.setQueryData(
        FORM_QUERY_KEYS.form(variables.id),
        (oldData: any | undefined) => {
          if (!oldData) return oldData;
          return { ...oldData, ...variables };
        }
      );
    },
    onError: (error) => {
      console.error("Error updating form:", error);
    },
  });
}

// Hook to delete form
export function useDeleteForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formId: string) => {
      // TODO: Implement actual API call to delete form
      console.log("Deleting form:", formId);

      // Return immediately - no artificial delay
      return { success: true };
    },
    onSuccess: (data, formId) => {
      // Remove form from cache
      queryClient.removeQueries({
        queryKey: FORM_QUERY_KEYS.form(formId),
      });

      // Invalidate forms list
      queryClient.invalidateQueries({
        queryKey: FORM_QUERY_KEYS.forms(),
      });
    },
    onError: (error) => {
      console.error("Error deleting form:", error);
    },
  });
}

// Hook to create a new field
export function useCreateField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fieldData: {
      sectionId: string;
      label: string;
      type: FieldType;
      placeholder?: string;
      required?: boolean;
      order?: number;
      options?: string[] | Record<string, unknown>;
    }) => {
      const response = await createField(fieldData);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidate form queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["form"] });
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
    onError: (error) => {
      console.error("Create field error:", error);
    },
  });
}

// Hook to delete a field
export function useDeleteField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fieldId: string) => {
      const response = await deleteField(fieldId);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["form"] });
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
    onError: (error) => {
      console.error("Delete field error:", error);
    },
  });
}
