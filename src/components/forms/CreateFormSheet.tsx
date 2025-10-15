"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button3D as Button } from "@/components/ui/3d-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateForm } from "@/hooks/use-forms";
import { toastNotifications } from "@/components/toast";
import { Plus, Loader2 } from "lucide-react";

const createFormSchema = z.object({
  name: z
    .string()
    .min(1, "Form name is required")
    .max(255, "Form name too long"),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

type CreateFormData = z.infer<typeof createFormSchema>;

interface CreateFormSheetProps {
  children: React.ReactNode;
}

export function CreateFormSheet({ children }: CreateFormSheetProps) {
  const [open, setOpen] = useState(false);
  const createFormMutation = useCreateForm();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateFormData>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: CreateFormData) => {
    try {
      const result = await createFormMutation.mutateAsync(data);

      if (result.success) {
        toastNotifications.success.formCreated();
        reset();
        setOpen(false);
      } else {
        toastNotifications.error.submissionFailed(
          result.error || "Failed to create form"
        );
      }
    } catch (error) {
      toastNotifications.error.unexpectedError();
      console.error("Error creating form:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Create New Form</SheetTitle>
          <SheetDescription>
            Create a new form by providing the basic information below.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Form Name *</Label>
            <Input
              id="name"
              placeholder="Enter form name"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter form description (optional)"
              rows={3}
              {...register("description")}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Cover Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg (optional)"
              {...register("imageUrl")}
              className={errors.imageUrl ? "border-red-500" : ""}
            />
            {errors.imageUrl && (
              <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setOpen(false);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting || createFormMutation.isPending}
              disabled={isSubmitting || createFormMutation.isPending}
              className="flex-1"
            >
              <>
                <Plus className="w-4 h-4" />
                Create Form
              </>
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
