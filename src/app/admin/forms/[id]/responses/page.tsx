"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  AlertCircle,
  Download,
  BarChart3,
  Grid3X3,
  Trash2,
} from "lucide-react";
import { getFormSubmissions, deleteSubmission } from "@/actions/submissions";
import { getFormById } from "@/actions/forms";

interface FormResponsesPageProps {}

const FormResponsesPage: React.FC<FormResponsesPageProps> = () => {
  const { id: formId } = useParams();
  const router = useRouter();

  // State for delete dialog
  const [submissionToDelete, setSubmissionToDelete] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch form data to get schema
  const {
    data: formData,
    isLoading: isFormLoading,
    error: formError,
  } = useQuery({
    queryKey: ["form", formId],
    queryFn: async () => {
      const result = await getFormById(formId as string);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch form");
      }
      return result.data;
    },
    enabled: !!formId,
  });

  // Fetch form submissions
  const {
    data: submissionsData,
    isLoading: isSubmissionsLoading,
    error: submissionsError,
  } = useQuery({
    queryKey: ["form-submissions", formId],
    queryFn: async () => {
      const result = await getFormSubmissions({
        formId: formId as string,
        page: 1,
        limit: 100,
        sortBy: "submittedAt",
        sortOrder: "desc",
      });
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch submissions");
      }
      return result.data;
    },
    enabled: !!formId,
  });

  const submissions = submissionsData?.submissions || [];
  const queryClient = useQueryClient();

  // Delete submission mutation
  const deleteSubmissionMutation = useMutation({
    mutationFn: async (submissionId: string) => {
      const result = await deleteSubmission(submissionId);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete submission");
      }
      return result;
    },
    onSuccess: () => {
      // Refetch submissions after successful deletion
      queryClient.invalidateQueries({ queryKey: ["form-submissions", formId] });
      setIsDeleteDialogOpen(false);
      setSubmissionToDelete(null);
    },
    onError: (error) => {
      console.error("Failed to delete submission:", error);
      // You could add a toast notification here
    },
  });

  const handleDeleteSubmission = () => {
    if (submissionToDelete) {
      deleteSubmissionMutation.mutate(submissionToDelete.id);
    }
  };

  const handleBack = () => {
    router.push(`/admin/form-builder/${formId}`);
  };

  const handleExportResponses = () => {
    if (!submissions || submissions.length === 0) return;

    // Convert submissions to CSV
    const headers = ["Submission ID", "Submitted At", "Submitter"];

    // Get all unique field labels
    const fieldLabels = new Set<string>();
    submissions.forEach((submission) => {
      submission.responses.forEach((response) => {
        if (response.field?.label) {
          fieldLabels.add(response.field.label);
        }
      });
    });

    headers.push(...Array.from(fieldLabels));

    const csvContent = [
      headers.join(","),
      ...submissions.map((submission) => {
        const row = [
          submission.id,
          new Date(submission.submittedAt).toLocaleString(),
          submission.submittedBy || "Anonymous",
        ];

        // Add field responses
        fieldLabels.forEach((fieldLabel) => {
          const response = submission.responses.find(
            (r) => r.field?.label === fieldLabel
          );
          row.push(
            response ? JSON.stringify(response.value).replace(/"/g, '""') : ""
          );
        });

        return row.join(",");
      }),
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData?.name || "form"}-responses.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const isLoading = isFormLoading || isSubmissionsLoading;
  const error = formError || submissionsError;

  if (error) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center font-red-hat-display">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-black mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-black mb-2">
            Error Loading Responses
          </h1>
          <p className="text-black mb-4">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
          <Button onClick={handleBack} variant="outline" className="text-black">
            <ArrowLeft className="w-4 h-4 mr-2 text-black" />
            Back to Form Builder
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-red-hat-display">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-black hover:text-black"
              >
                <ArrowLeft className="w-4 h-4 mr-2 text-black" />
                Back to Form Builder
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              {isLoading ? (
                <Skeleton className="h-8 w-64" />
              ) : (
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-semibold text-black">
                    {formData?.name} - Responses
                  </h1>
                  <Badge variant="secondary" className="text-sm text-black">
                    {submissions?.length || 0} response(s)
                  </Badge>
                </div>
              )}
            </div>

            {submissions && submissions.length > 0 && (
              <Button
                onClick={handleExportResponses}
                variant="outline"
                size="sm"
                className="gap-2 text-black"
              >
                <Download className="w-4 h-4 text-black" />
                Export CSV
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="individual" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="individual"
              className="flex items-center gap-2 text-black"
            >
              <FileText className="w-4 h-4 text-black" />
              Individual Responses
            </TabsTrigger>
            <TabsTrigger
              value="fieldwise"
              className="flex items-center gap-2 text-black"
            >
              <Grid3X3 className="w-4 h-4 text-black" />
              Field-wise Responses
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 text-black"
            >
              <BarChart3 className="w-4 h-4 text-black" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Individual Responses Tab */}
          <TabsContent value="individual" className="space-y-6">
            {isLoading ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="bg-white/80">
                      <CardHeader>
                        <Skeleton className="h-6 w-32" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : submissions && submissions.length > 0 ? (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card
                    className="border-2 bg-white/80"
                    style={{ borderColor: "#33A854" }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Responses
                      </CardTitle>
                      <FileText className="h-4 w-4 text-black" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {submissions.length}
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className="border-2 bg-white/80"
                    style={{ borderColor: "#F1AE08" }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Latest Response
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-black" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm font-medium">
                        {submissions.length > 0
                          ? new Date(
                              submissions[0].submittedAt
                            ).toLocaleDateString()
                          : "No responses"}
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className="border-2 bg-white/80"
                    style={{ borderColor: "#E6452D" }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Form Fields
                      </CardTitle>
                      <User className="h-4 w-4 text-black" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formData?.sections.reduce(
                          (total, section) => total + section.fields.length,
                          0
                        ) || 0}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Submissions List */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-black">
                    All Responses
                  </h2>
                  <div className="space-y-4">
                    {submissions.map((submission, index) => {
                      const borderColors = [
                        "#33A854",
                        "#F1AE08",
                        "#E6452D",
                        "#4584F4",
                      ];
                      const borderColor =
                        borderColors[index % borderColors.length];

                      return (
                        <Card
                          key={submission.id}
                          className="overflow-hidden border-2 bg-white/80"
                          style={{ borderColor }}
                        >
                          <CardHeader className="bg-white/60 border-b">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-black">
                                    Response #{submissions.length - index}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    ID: {submission.id.slice(-8)}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-black">
                                <div className="flex items-center space-x-1">
                                  <User className="w-4 h-4 text-black" />
                                  <span className="text-black">
                                    {submission.submittedBy || "Anonymous"}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4 text-black" />
                                  <span className="text-black">
                                    {new Date(
                                      submission.submittedAt
                                    ).toLocaleString()}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSubmissionToDelete(submission);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {submission.responses.map((response) => (
                                <div key={response.id} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-black">
                                      {response.field?.label || "Unknown Field"}
                                    </label>
                                    <Badge
                                      variant="secondary"
                                      className="text-xs text-black"
                                    >
                                      {response.field?.type || "UNKNOWN"}
                                    </Badge>
                                  </div>
                                  <div className="p-3 bg-white/90 border rounded-md">
                                    <p className="text-sm text-black break-words">
                                      {typeof response.value === "string"
                                        ? response.value
                                        : JSON.stringify(response.value)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-black mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-black mb-2">
                  No Responses Yet
                </h2>
                <p className="text-black mb-6">
                  This form hasn't received any responses yet. Share your form
                  to start collecting responses!
                </p>
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="text-black"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 text-black" />
                  Back to Form Builder
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Field-wise Responses Tab */}
          <TabsContent value="fieldwise" className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="bg-white/80">
                    <CardHeader>
                      <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : submissions && submissions.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-black">
                  Responses by Field
                </h2>
                {formData?.sections.map((section, sectionIndex) => {
                  const borderColors = [
                    "#33A854",
                    "#F1AE08",
                    "#E6452D",
                    "#4584F4",
                  ];
                  const borderColor =
                    borderColors[sectionIndex % borderColors.length];

                  return (
                    <Card
                      key={section.id}
                      className="border-2 bg-white/80"
                      style={{ borderColor }}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-black">
                          {section.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {section.fields.map((field) => {
                          const fieldResponses = submissions.flatMap(
                            (submission) =>
                              submission.responses.filter(
                                (response) => response.fieldId === field.id
                              )
                          );

                          return (
                            <div
                              key={field.id}
                              className="border-l-4 pl-4"
                              style={{ borderLeftColor: "#4584F4" }}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-medium text-black">
                                    {field.label}
                                  </h3>
                                  <Badge
                                    variant="outline"
                                    className="text-xs text-black"
                                  >
                                    {field.type}
                                  </Badge>
                                </div>
                                <Badge
                                  variant="secondary"
                                  className="text-black"
                                >
                                  {fieldResponses.length} response(s)
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                {fieldResponses.length > 0 ? (
                                  fieldResponses.map((response, idx) => (
                                    <div
                                      key={idx}
                                      className="p-2 bg-white border rounded text-sm text-black"
                                    >
                                      {typeof response.value === "string"
                                        ? response.value
                                        : JSON.stringify(response.value)}
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-black text-sm italic">
                                    No responses for this field
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Grid3X3 className="w-16 h-16 text-black mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-black mb-2">
                  No Field Data Available
                </h2>
                <p className="text-black mb-6">
                  Once responses are submitted, you'll see field-wise analysis
                  here.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-black mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-black mb-2">
                Analytics
              </h2>
              <p className="text-black">
                Advanced analytics and insights coming soon.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-black">Delete Response</DialogTitle>
            <DialogDescription className="text-black">
              Are you sure you want to delete this response from{" "}
              <span className="font-semibold">
                {submissionToDelete?.submittedBy || "Anonymous"}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSubmissionToDelete(null);
              }}
              className="text-black"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSubmission}
              disabled={deleteSubmissionMutation.isPending}
            >
              {deleteSubmissionMutation.isPending
                ? "Deleting..."
                : "Delete Response"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormResponsesPage;
