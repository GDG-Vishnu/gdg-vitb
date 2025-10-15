"use client";

import React from "react";
import {
  FormBuilderIntegrationProvider,
  useFormBuilderIntegration,
} from "@/components/form-builder/FormBuilderIntegration";
import { FormBuilderRightSidebar } from "@/components/form-builder/FormBuilderRightSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Settings } from "lucide-react";
import { FieldData, SectionData } from "@/types/form-builder";

import CustomComponents from "@/components/form-builder/custom";
import { FieldType } from "@prisma/client";

// Custom component renderer - renders custom components with inline configuration
function renderCustomComponent(field: FieldData) {
  // Map field types to component names
  const componentMap: Record<string, string> = {
    INPUT: "Input",
    EMAIL: "Email",
    TEXTAREA: "TextArea",
    PASSWORD: "Password",
    PHONE: "Phone",
    CHECKBOX: "Checkbox",
    RADIO: "Radio",
    SELECT: "Select",
    COMBOBOX: "Combobox",
    MULTISELECT: "MultiSelect",
    SWITCH: "Switch",
    DATE: "Date",
    DATETIME: "DateTime",
    SMART_DATETIME: "SmartDateTime",
    FILE: "File",
    OTP: "Otp",
    LOCATION: "Location",
    SIGNATURE: "Signature",
    SLIDER: "Slider",
    TAGS: "Tags",
  };

  const componentName = componentMap[field.type] || "Input";
  const Component = CustomComponents[componentName];

  if (!Component) {
    // Fallback to Input component
    const FallbackComponent = CustomComponents["Input"];
    return (
      <FallbackComponent
        key={field.id}
        fieldId={field.id}
        sectionId={field.sectionId}
      />
    );
  }

  // Render the custom component which includes FormComponentWrapper with inline configuration
  // Pass fieldId and sectionId so the component can access database operations
  return (
    <Component key={field.id} fieldId={field.id} sectionId={field.sectionId} />
  );
}

// Component to render individual fields with inline configuration

function FieldItem({ field }: { field: FieldData }) {
  // Render the custom component directly with inline configuration
  return renderCustomComponent(field);
}

// Component to render sections with their fields
interface SectionProps {
  section: SectionData;
}

function Section({ section }: SectionProps) {
  const fields = section.fields || [];

  return (
    <div className="w-full">
      <div></div>
      <div className="space-y-4">
        {fields.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <div className="text-muted-foreground mb-2">
              <Plus className="h-8 w-8 mx-auto mb-2" />
            </div>
            <p className="text-sm text-muted-foreground">
              No fields in this section yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Click on components from the right sidebar to add fields
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {fields
              .sort((a: FieldData, b: FieldData) => a.order - b.order)
              .map((field: FieldData) => (
                <FieldItem key={field.id} field={field} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Main content component
function FormBuilderContent() {
  const { formData, isLoading, addFieldToSection } =
    useFormBuilderIntegration();

  // Handle field selection from right sidebar
  const handleFieldSelect = (fieldTypeFromConstants: FieldType) => {
    // The FieldType from constants already uses PrismaFieldType in its type property
    const prismaFieldType = fieldTypeFromConstants.type;

    // Add to the first section (or create logic to select section)
    const sections = formData?.sections || [];
    if (sections.length > 0) {
      addFieldToSection(sections[0].id, prismaFieldType);
    } else {
      console.warn("No sections available to add field to");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-16" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, fieldIndex) => (
                <div key={fieldIndex} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <div className="flex gap-1">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-muted-foreground">
            Form not found
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            The requested form could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  const sections = formData.sections || [];

  return (
    <div className="flex h-full">
      {/* Main content area */}
      <div className="flex-1 p-6 overflow-auto">
        {sections.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Plus className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No sections found
            </h3>
            <p className="text-sm text-muted-foreground">
              Add a section using the + button in the tabs above.
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl">
            {sections.map((section: SectionData) => (
              <Section key={section.id} section={section} />
            ))}
          </div>
        )}
      </div>

      {/* Right sidebar with component palette */}
      <div className="border-l border-border bg-card/50 overflow-y-auto">
        <FormBuilderRightSidebar
          onFieldSelect={handleFieldSelect}
          className="h-full"
        />
      </div>
    </div>
  );
}

// Main page component with provider
export default function IntegratedFormBuilderPage() {
  return (
    <FormBuilderIntegrationProvider>
      <FormBuilderContent />
    </FormBuilderIntegrationProvider>
  );
}
