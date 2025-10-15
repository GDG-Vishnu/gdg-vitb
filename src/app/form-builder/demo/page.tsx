"use client";

import React from "react";
import { FormBuilder } from "@/components/form-builder";

export default function FormBuilderDemo() {
  const handleSave = (formId: string) => {
    console.log("Form saved:", formId);
  };

  const handlePreview = (formId: string) => {
    console.log("Form preview:", formId);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Form Builder</h1>
          <p className="text-gray-600 mt-2">
            Create dynamic forms with drag-and-drop interface
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <FormBuilder
            initialForm={{
              formId: "demo-form",
              formName: "Demo Form",
              sections: [],
            }}
            onSave={handleSave}
            onPreview={handlePreview}
          />
        </div>
      </div>
    </div>
  );
}
