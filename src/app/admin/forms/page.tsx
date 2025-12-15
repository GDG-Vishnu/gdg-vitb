"use client";

import React, { useState } from "react";
import { useForms } from "@/hooks/use-forms";
import GradientCard from "@/components/global/GradientCard";
import { CreateFormSheet } from "@/components/forms/CreateFormSheet";
import { Button3D } from "@/components/ui/3d-button";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, AlertCircle, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormLoading } from "@/components/form-builder/loading-pages";

const FormsPage = () => {
  const { data: forms, isLoading, error, isError } = useForms();
  const router = useRouter();
  const [formLoading, setFormLoading] = useState(false);
  const [loadingFormName, setLoadingFormName] = useState("");

  const handleFormClick = (formId: string, formName: string) => {
    setLoadingFormName(formName);
    setFormLoading(true);

    // Navigate to form builder
    router.push(`/admin/form-builder/${formId}`);

    // Note: Loading will be hidden when the new page loads
    // We could also hide it after a short delay as backup
    setTimeout(() => {
      setFormLoading(false);
    }, 3000); // Backup timeout
  };

  const getVariantForIndex = (index: number) => {
    const variants = [
      "blue",
      "green",
      "yellow",
      "red",
      "purple",
      "orange",
    ] as const;
    return variants[index % variants.length];
  };

  // Check if error is authentication related
  const isAuthError =
    error instanceof Error &&
    (error.message.includes("Unauthorized") ||
      error.message.includes("Participants cannot access"));

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 font-productSans">
            Form Builder
          </h1>
          <p className="font-productSans">
            Create, manage, and analyze your forms
          </p>
        </div>

        <CreateFormSheet>
          <Button variant="outline" size="default">
            <Plus className="w-5 h-5" />
            Add Form
          </Button>
        </CreateFormSheet>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600 font-productSans">Loading forms...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2 font-productSans">
              {isAuthError ? "Access Denied" : "Error Loading Forms"}
            </h3>
            <p className="text-gray-600 mb-6 font-productSans">
              {isAuthError
                ? "Participants cannot access the form builder. Please contact your administrator if you need access."
                : error instanceof Error
                ? error.message
                : "Failed to load forms. Please try again."}
            </p>
            <div className="space-y-3">
              <Button3D variant="outline" onClick={handleRetry}>
                Try Again
              </Button3D>
              {isAuthError && (
                <div className="pt-2">
                  <Button3D
                    variant="default"
                    onClick={() => router.push("/auth/login")}
                  >
                    Sign In Again
                  </Button3D>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Forms Grid */}
      {!isLoading && !isError && (
        <>
          {forms && forms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {forms.map((form, index) => (
                <GradientCard
                  key={form.id}
                  variant={getVariantForIndex(index)}
                  form={form}
                  onClick={() => handleFormClick(form.id, form.name)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mb-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center">
                  <Plus className="w-16 h-16 text-blue-500" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3 font-productSans">
                No forms yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto font-productSans">
                Start building beautiful forms to collect data, feedback,
                registrations, and more. Your first form is just a click away!
              </p>
              <CreateFormSheet>
                <Button3D variant="default" size="default">
                  <Plus className="w-5 h-5" />
                  Create Your First Form
                </Button3D>
              </CreateFormSheet>
            </div>
          )}
        </>
      )}

      {/* Form Loading Component */}
      {formLoading && <FormLoading formName={loadingFormName} />}
    </div>
  );
};

export default FormsPage;
