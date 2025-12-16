"use client";

import React from "react";
import { FormBuilderTopBar } from "@/components/form-builder/FormBuilderTopBar";
import { FormBuilderRightSidebar } from "@/components/form-builder/FormBuilderRightSidebar";
import { useParams, useRouter } from "next/navigation";
import { useForm, useCreateSection } from "@/hooks/use-form-data";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FieldType } from "@prisma/client";

interface FormBuilderLayoutProps {
  children: React.ReactNode;
}

const FormBuilderLayout: React.FC<FormBuilderLayoutProps> = ({ children }) => {
  const { id } = useParams();
  const router = useRouter();
  const formId = id as string;

  const { data: formData, isLoading } = useForm(formId);
  const createSectionMutation = useCreateSection();

  const [activeTab, setActiveTab] = React.useState("basic-details");
  const [isAddSectionOpen, setIsAddSectionOpen] = React.useState(false);
  const [newSectionName, setNewSectionName] = React.useState("");

  const handleSave = () => {
    console.log("Save form");
    // TODO: Implement save functionality
  };

  
  const handlePreview = () => {
    if (formData) {
      router.push(`/admin/form-builder/${formId}/preview`);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    console.log("Changed to tab:", tab);
    // TODO: Implement tab change functionality
  };

  const handleAddTab = () => {
    setIsAddSectionOpen(true);
  };

  const handleAddSection = async () => {
    if (newSectionName.trim()) {
      try {
        await createSectionMutation.mutateAsync({
          formId,
          title: newSectionName.trim(),
          order: (formData?.sections?.length || 0) + 1,
        });
        setNewSectionName("");
        setIsAddSectionOpen(false);
      } catch (error) {
        console.error("Error creating section:", error);
      }
    }
  };

  const handleFieldSelect = (fieldType: FieldType) => {
    console.log("Selected field:", fieldType);
    // This will be handled by the integration context
  };

  // Get sections from form data
  const sections = React.useMemo(() => {
    if (!formData?.sections) return [];
    return formData.sections.map((section) => ({
      id: section.id,
      title: section.title || "Untitled Section", // Handle null titles
    }));
  }, [formData]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <FormBuilderTopBar
        formId={formId}
        formTitle={formData?.name}
        activeTab={activeTab}
        sections={sections}
        onSave={handleSave}
        onPreview={handlePreview}
        onTabChange={handleTabChange}
        onAddTab={handleAddTab}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Form Builder Canvas */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="h-full bg-background">
              <div className="p-6 space-y-6">
                {/* Section skeleton */}
                {[...Array(2)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="space-y-4">
                      {/* Field skeletons */}
                      {[...Array(3)].map((_, fieldIndex) => (
                        <div
                          key={fieldIndex}
                          className="p-4 bg-muted rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <Skeleton className="h-5 w-24" />
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-40" />
                            </div>
                            <Skeleton className="h-4 w-12" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Right Sidebar */}
        {/* <FormBuilderRightSidebar onFieldSelect={handleFieldSelect} /> */}
      </div>

      {/* Add Section Sheet */}
      <Sheet open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add New Section</SheetTitle>
            <SheetDescription>
              Create a new section for your form. You can add fields to it
              later.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="section-name">Section Name</Label>
              <Input
                id="section-name"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="Enter section name..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddSectionOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSection}
              disabled={!newSectionName.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FormBuilderLayout;
