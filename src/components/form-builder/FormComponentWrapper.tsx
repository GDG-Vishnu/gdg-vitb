import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FormalNames } from "@/constants";
import { getFieldIcon } from "@/utils";
import { FieldType } from "@prisma/client";
import { Trash, Settings, ChevronDown, Save, Loader2 } from "lucide-react";
import { useDeleteField } from "@/hooks/use-field-data";
import { toast } from "sonner";
import { useFormBuilderIntegration } from "./FormBuilderIntegration";
import { DeleteComponentLoading } from "./loading-pages";

// Helper component for labels with required indicator
interface LabelWithRequiredProps {
  children: React.ReactNode;
  isRequired?: boolean;
  className?: string;
}

export const LabelWithRequired: React.FC<LabelWithRequiredProps> = ({
  children,
  isRequired = false,
  className = "block mb-1",
}) => {
  return (
    <label className={className}>
      {children}
      {isRequired && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

interface FormComponentWrapperProps {
  fieldId?: string; // Field ID for database operations
  sectionId?: string; // Section ID for context
  fieldType: FieldType;
  children:
    | React.ReactNode
    | ((props: { isRequired: boolean }) => React.ReactNode); // Preview component
  configurationContent: React.ReactNode; // Configuration form content
  onSave?: (data?: any) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  onRequiredChange?: (required: boolean) => void;
  isRequired?: boolean;
  label?: string; // Field label for delete confirmation
}

const FormComponentWrapper: React.FC<FormComponentWrapperProps> = ({
  fieldId,
  sectionId,
  fieldType,
  children,
  configurationContent,
  onSave,
  onDelete,
  onRequiredChange,
  isRequired = false,
  label,
}) => {
  console.log("🔧 FormComponentWrapper initialized with props:", {
    fieldId,
    sectionId,
    fieldType,
    hasOnSave: !!onSave,
    hasOnDelete: !!onDelete,
    isRequired,
    label,
  });

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Try to use the integration context if available, fallback to direct hook
  let integrationContext = null;
  try {
    integrationContext = useFormBuilderIntegration();
  } catch {
    // Context not available, will use direct hook instead
  }

  const deleteFieldMutation = useDeleteField();

  // Enhanced save handler
  const handleSave = async () => {
    console.log("💾 Save button clicked - Starting save process");
    console.log("💾 Save handler state:", {
      hasOnSave: !!onSave,
      isSaving,
      fieldType,
      fieldId,
      sectionId,
    });

    setIsSaving(true);
    console.log(
      "💾 Setting saving state to true, attempting to persist field..."
    );

    try {
      // If integration context is available, prefer centralized save which updates DB
      if (integrationContext && fieldId) {
        // Build minimal FieldConfiguration object for save
        const fieldToSave: any = {
          id: fieldId,
          sectionId,
          type: fieldType,
          // Consumers should update label/placeholder/defaults via provided onSave
        };

        // If the consumer provided onSave, call it first to allow local mutation
        if (onSave) {
          await onSave();
        }

        // Then persist via integration context
        await integrationContext.saveField(fieldToSave as any);
      } else if (onSave) {
        // Fallback to the provided onSave handler
        await onSave();
      } else {
        console.log(
          "⚠️ No save handler or integration context available - skipping DB save"
        );
      }

      console.log("✅ Save completed successfully!");
      toast.success("Field saved successfully!");
      setIsConfigOpen(false); // Close configuration after successful save
      console.log("📋 Configuration panel closed after successful save");
    } catch (error) {
      console.error("❌ Error saving field:", error);
      toast.error("Failed to save field. Please try again.");
    } finally {
      setIsSaving(false);
      console.log("💾 Save process completed, saving state set to false");
    }
  };

  // Enhanced delete handler
  const handleDelete = async () => {
    console.log("🗑️ Delete confirmed - Starting delete process");
    console.log("🗑️ Delete handler state:", {
      hasFieldId: !!fieldId,
      hasSectionId: !!sectionId,
      hasOnDelete: !!onDelete,
      hasIntegrationContext: !!integrationContext,
      fieldType,
      fieldId,
      sectionId,
    });

    // Close the dialog immediately and show loading
    setIsDeleteDialogOpen(false);
    setIsDeleting(true);
    console.log("🗑️ Delete dialog closed, showing loading component");

    try {
      if (fieldId && sectionId) {
        // Prefer integration context if available, fallback to direct mutation
        if (integrationContext) {
          console.log("🗑️ Using integration context delete method");
          await integrationContext.deleteField(fieldId, sectionId);
          console.log("✅ Integration context delete completed successfully!");
          toast.success("Field deleted successfully!");
        } else {
          // Use database delete if IDs are provided
          console.log(
            "🗑️ Using direct database delete with fieldId and sectionId"
          );
          await deleteFieldMutation.mutateAsync({ fieldId, sectionId });
          console.log("✅ Database delete completed successfully!");
          toast.success("Field deleted successfully!");
        }
      } else if (onDelete) {
        // Use custom delete handler
        console.log("🗑️ Using custom onDelete handler");
        await onDelete();
        console.log("✅ Custom delete completed successfully!");
        toast.success("Field deleted successfully!");
      } else {
        console.log(
          "❌ No delete method available - neither fieldId/sectionId nor onDelete provided"
        );
      }
    } catch (error) {
      console.error("❌ Error deleting field:", error);
      toast.error("Failed to delete field. Please try again.");
    } finally {
      setIsDeleting(false);
      console.log("🗑️ Delete process completed, hiding loading component");
    }
  };

  const handleDeleteClick = () => {
    console.log("🗑️ Delete button clicked - Opening confirmation dialog");
    console.log("🗑️ Current delete state:", {
      hasFieldId: !!fieldId,
      hasSectionId: !!sectionId,
      hasOnDelete: !!onDelete,
      fieldType,
    });
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="flex flex-col items-center w-full bg-transparent">
      {/* Preview Section */}
      <div className="w-full flex flex-col gap-2 bg-muted/50 p-4 rounded-2xl border border-border relative text-black dark:text-white">
        {/* Settings Button - positioned in top-right corner */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0 opacity-100 hover:opacity-100 hover:bg-muted/30 transition-all rounded"
          aria-label="Open field settings"
          onClick={() => {
            console.log(
              "⚙️ Settings button clicked - Toggling configuration panel"
            );
            console.log("⚙️ Current config state:", {
              isConfigOpen,
              fieldType,
            });
            setIsConfigOpen(!isConfigOpen);
          }}
        >
          <Settings className="h-4 w-4" />
        </Button>

        {/* Preview Content */}
        {typeof children === "function" ? children({ isRequired }) : children}
      </div>

      {/* Connector Line */}

      {/* Configuration Section - Collapsible */}
      {/* <Collapsible
        open={isConfigOpen}
        onOpenChange={setIsConfigOpen}
        className="w-full"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center bg-accent p-1 rounded">
                {React.createElement(getFieldIcon(fieldType), {
                  className: "h-5 w-5",
                })}
              </div>
              <span className="font-medium">{FormalNames[fieldType]}</span>
              <span className="text-sm text-muted-foreground">
                Configuration
              </span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isConfigOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-2">
          
        </CollapsibleContent>
      </Collapsible> */}
      {isConfigOpen && (
        <>
          <div className="w-0.5 bg-muted h-2" />
          <div className="flex flex-col gap-5 w-full bg-muted/50 p-6 rounded-2xl border border-border">
            {/* Field Type and Required Toggle */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center bg-accent p-1 rounded">
                  {React.createElement(getFieldIcon(fieldType), {
                    className: "h-5 w-5",
                  })}
                </div>
                <span className="font-medium">{FormalNames[fieldType]}</span>
              </div>
              <div className="flex items-center gap-3">
                <h3 className="font-medium">Required</h3>
                <Switch
                  checked={isRequired}
                  onCheckedChange={onRequiredChange}
                />
              </div>
            </div>

            {/* Configuration Content */}
            <div className="flex flex-col bg-muted/100 border gap-3 p-4 rounded-2xl">
              {configurationContent}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteClick}
                disabled={deleteFieldMutation.isPending}
                className="flex items-center gap-2 bg-destructive/15 hover:bg-destructive/25 transition-all rounded-md p-2"
              >
                {deleteFieldMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                ) : (
                  <Trash className="text-destructive h-5 w-5" />
                )}
                {deleteFieldMutation.isPending && (
                  <span className="text-destructive text-sm">Deleting...</span>
                )}
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving || !onSave}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{isSaving ? "Saving..." : "Save"}</span>
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Field</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the "
              {label || FormalNames[fieldType]}" field? This action cannot be
              undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteFieldMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteFieldMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Field
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Loading Component */}
      {isDeleting && (
        <DeleteComponentLoading componentName={FormalNames[fieldType]} />
      )}
    </div>
  );
};

export default FormComponentWrapper;
