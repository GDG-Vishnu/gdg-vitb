/**
 * Real-time Loading Synchronization Example
 *
 * This component demonstrates how to synchronize loading states with actual
 * operations using React Query mutations, eliminating fixed delays.
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateField, useDeleteField } from "@/hooks/use-form-data";
import {
  FormLoading,
  DeleteComponentLoading,
  AddComponentLoading,
} from "@/components/form-builder/loading-pages";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface SynchronizedLoadingDemoProps {
  sectionId?: string;
}

export default function SynchronizedLoadingDemo({
  sectionId = "demo-section",
}: SynchronizedLoadingDemoProps) {
  const [lastCreatedFieldId, setLastCreatedFieldId] = React.useState<
    string | null
  >(null);

  // Use actual React Query mutations - these provide real loading states
  const createFieldMutation = useCreateField();
  const deleteFieldMutation = useDeleteField();

  const handleRealAddField = () => {
    createFieldMutation.mutate(
      {
        sectionId,
        label: `Demo Field ${Date.now()}`,
        type: "INPUT",
        placeholder: "This is a real field creation",
        required: false,
        order: 0,
      },
      {
        onSuccess: (data) => {
          if (data.data?.id) {
            setLastCreatedFieldId(data.data.id);
          }
        },
      }
    );
  };

  const handleRealDeleteField = () => {
    if (lastCreatedFieldId) {
      deleteFieldMutation.mutate(lastCreatedFieldId, {
        onSuccess: () => {
          setLastCreatedFieldId(null);
        },
      });
    }
  };

  const getOperationStatus = (mutation: any) => {
    if (mutation.isPending)
      return {
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        text: "Processing...",
        color: "text-blue-600",
      };
    if (mutation.isError)
      return {
        icon: <XCircle className="w-4 h-4" />,
        text: "Failed",
        color: "text-red-600",
      };
    if (mutation.isSuccess)
      return {
        icon: <CheckCircle2 className="w-4 h-4" />,
        text: "Success",
        color: "text-green-600",
      };
    return { icon: null, text: "Ready", color: "text-gray-600" };
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Synchronized Loading Demo
          </h1>
          <p className="text-gray-600">
            Loading states synchronized with actual database operations
          </p>
        </div>

        {/* Real-time Operation Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Add Field Operation */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Add Field Operation
                <div
                  className={`flex items-center gap-2 text-sm ${
                    getOperationStatus(createFieldMutation).color
                  }`}
                >
                  {getOperationStatus(createFieldMutation).icon}
                  {getOperationStatus(createFieldMutation).text}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                This operation creates a real field in the database. Loading
                state matches actual operation time.
              </p>

              <Button
                onClick={handleRealAddField}
                disabled={createFieldMutation.isPending}
                className="w-full"
              >
                {createFieldMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Field...
                  </>
                ) : (
                  "Create Real Field"
                )}
              </Button>

              {createFieldMutation.isError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">
                    Error: {createFieldMutation.error?.message}
                  </p>
                </div>
              )}

              {createFieldMutation.isSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-600">
                    ✅ Field created successfully!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delete Field Operation */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Delete Field Operation
                <div
                  className={`flex items-center gap-2 text-sm ${
                    getOperationStatus(deleteFieldMutation).color
                  }`}
                >
                  {getOperationStatus(deleteFieldMutation).icon}
                  {getOperationStatus(deleteFieldMutation).text}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                This deletes the last created field. Only enabled if a field
                exists.
              </p>

              <Button
                onClick={handleRealDeleteField}
                disabled={deleteFieldMutation.isPending || !lastCreatedFieldId}
                variant="destructive"
                className="w-full"
              >
                {deleteFieldMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting Field...
                  </>
                ) : (
                  `Delete Field ${lastCreatedFieldId ? "✓" : "(None)"}`
                )}
              </Button>

              {deleteFieldMutation.isError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">
                    Error: {deleteFieldMutation.error?.message}
                  </p>
                </div>
              )}

              {deleteFieldMutation.isSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-600">
                    ✅ Field deleted successfully!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Loading Components Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Loading Component Overlays</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Loading overlays appear automatically during operations:
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <div>
                • <strong>Add Field</strong>: Shows AddComponentLoading during
                field creation
              </div>
              <div>
                • <strong>Delete Field</strong>: Shows DeleteComponentLoading
                during field deletion
              </div>
              <div>• Duration matches actual database operation time</div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Info */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Performance Benefits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <div>
              ✅ <strong>No artificial delays</strong> - loading ends when
              operation completes
            </div>
            <div>
              ✅ <strong>Real error handling</strong> - shows actual API errors
            </div>
            <div>
              ✅ <strong>Optimistic UI updates</strong> - instant feedback with
              React Query
            </div>
            <div>
              ✅ <strong>Automatic retry logic</strong> - built into React Query
              mutations
            </div>
            <div>
              ✅ <strong>Cache invalidation</strong> - UI updates automatically
              after operations
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading Overlays - Shown automatically during operations */}
      {createFieldMutation.isPending && (
        <AddComponentLoading componentName="Input Field" />
      )}
      {deleteFieldMutation.isPending && (
        <DeleteComponentLoading componentName="Field" />
      )}
    </div>
  );
}
