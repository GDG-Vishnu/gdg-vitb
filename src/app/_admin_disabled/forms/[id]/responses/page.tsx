"use client";

import React, { useState } from "react";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toastNotifications } from "@/components/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Edit,
} from "lucide-react";
import {
  getFormSubmissions,
  deleteSubmission,
  updateSubmission,
} from "@/actions/submissions";
import { getFormById } from "@/actions/forms";
import BarChart from "@/components/analytics/BarChart";
import PieChart from "@/components/analytics/PieChart";

interface FormResponsesPageProps {}

const FormResponsesPage: React.FC<FormResponsesPageProps> = () => {
  const { id: formId } = useParams();
  const router = useRouter();

  // State for delete dialog
  const [submissionToDelete, setSubmissionToDelete] = useState<unknown>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // State for edit dialog
  const [submissionToEdit, setSubmissionToEdit] = useState<unknown>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Record<string, unknown>>({});

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
      toastNotifications.success.responseDeleted();
    },
    onError: (error) => {
      console.error("Failed to delete submission:", error);
      toastNotifications.error.submissionFailed("Failed to delete response");
    },
  });

  // Update submission mutation
  const updateSubmissionMutation = useMutation({
    mutationFn: async (submissionData: {
      id: string;
      responses: Array<{ fieldId: string; value: unknown }>;
    }) => {
      const result = await updateSubmission(submissionData);
      if (!result.success) {
        throw new Error(result.error || "Failed to update submission");
      }
      return result;
    },
    onSuccess: () => {
      // Refetch submissions after successful update
      queryClient.invalidateQueries({ queryKey: ["form-submissions", formId] });
      setIsEditDialogOpen(false);
      setSubmissionToEdit(null);
      setEditFormData({});
      toastNotifications.success.responseUpdated();
    },
    onError: (error) => {
      console.error("Failed to update submission:", error);
      toastNotifications.error.submissionFailed("Failed to update response");
    },
  });

  const handleDeleteSubmission = () => {
    if (submissionToDelete) {
      deleteSubmissionMutation.mutate((submissionToDelete as { id: string }).id);
    }
  };

  const handleEditSubmission = (submission: unknown) => {
    setSubmissionToEdit(submission);
    // Initialize form data with current values
    const initialData: Record<string, unknown> = {};
    const s = submission as unknown as {
      responses?: Array<{ fieldId?: string; value?: unknown }>;
    };
    s.responses?.forEach((response) => {
      initialData[(response as { fieldId?: string }).fieldId || ""] = (
        response as { value?: unknown }
      ).value;
    });
    setEditFormData(initialData);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSubmission = () => {
    if (!submissionToEdit) return;

    const responses = Object.entries(editFormData).map(([fieldId, value]) => ({
      fieldId,
      value,
    }));

    updateSubmissionMutation.mutate({
      id: (submissionToEdit as { id: string }).id,
      responses,
    });
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

  // Analytics state: selected field and computed chart data
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const chartData = useMemo(() => {
    if (!selectedFieldId) return [] as Array<{ label: string; value: number }>;

    // collect all responses for the selected field
    const fieldResponses = submissions.flatMap((submission: unknown) => {
      const s = submission as unknown as {
        responses?: Array<{ fieldId?: string; value?: unknown }>;
      };
      return (
        s.responses?.filter((r) => (r as { fieldId?: string }).fieldId === selectedFieldId) ||
        []
      );
    });

    // aggregate counts for each distinct value (support array values too)
    const counts: Record<string, number> = {};
    fieldResponses.forEach((r: unknown) => {
      const val = (r as { value?: unknown }).value;
      if (Array.isArray(val)) {
        val.forEach((v) => {
          const key = String(v ?? "");
          counts[key] = (counts[key] || 0) + 1;
        });
      } else {
        const key = String(val ?? "");
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }, [selectedFieldId, submissions]);

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
                <span className="font-productSans">Back to Form Builder</span>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              {isLoading ? (
                <Skeleton className="h-8 w-64" />
              ) : (
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-semibold text-black font-productSans">
                    {formData?.name} - Responses
                  </h1>
                  <Badge
                    variant="secondary"
                    className="text-sm text-black bg-blue-100 border-blue-200"
                  >
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
                <span className="font-productSans">Export CSV</span>
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
              <span className="font-productSans">Individual Responses</span>
            </TabsTrigger>
            <TabsTrigger
              value="fieldwise"
              className="flex items-center gap-2 text-black"
            >
              <Grid3X3 className="w-4 h-4 text-black" />
              <span className="font-productSans">Field-wise Responses</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 text-black"
            >
              <BarChart3 className="w-4 h-4 text-black" />
              <span className="font-productSans">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Individual Responses Tab */}
          <TabsContent value="individual" className="space-y-6">
            {isLoading ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="bg-white shadow-sm">
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
                    className="border-2 bg-white shadow-sm"
                    style={{ borderColor: "#33A854" }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-black">
                        Total Responses
                      </CardTitle>
                      <FileText className="h-4 w-4 text-black" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-black">
                        {submissions.length}
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className="border-2 bg-white shadow-sm"
                    style={{ borderColor: "#F1AE08" }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-black">
                        Latest Response
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-black" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm font-medium text-black">
                        {submissions.length > 0
                          ? new Date(
                              submissions[0].submittedAt
                            ).toLocaleDateString()
                          : "No responses"}
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className="border-2 bg-white shadow-sm"
                    style={{ borderColor: "#E6452D" }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-black">
                        Form Fields
                      </CardTitle>
                      <User className="h-4 w-4 text-black" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-black">
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
                          className="overflow-hidden border-2 bg-white shadow-sm"
                          style={{ borderColor }}
                        >
                          <CardHeader className="bg-white border-b">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-black">
                                    Response #{submissions.length - index}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className="text-xs text-black bg-gray-50 border-gray-300"
                                  >
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
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleEditSubmission(submission)
                                    }
                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
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
                                      className="text-xs text-black bg-blue-100 border-blue-200"
                                    >
                                      {response.field?.type || "UNKNOWN"}
                                    </Badge>
                                  </div>
                                  <div className="p-3 bg-white border border-gray-200 rounded-md shadow-sm">
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
                  This form hasnt received any responses ye Share your form
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
                  <Card key={i} className="bg-white shadow-sm">
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
                      className="border-2 bg-white shadow-sm"
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
                                    className="text-xs text-black bg-gray-50 border-gray-300"
                                  >
                                    {field.type}
                                  </Badge>
                                </div>
                                <Badge
                                  variant="secondary"
                                  className="text-black bg-green-100 border-green-200"
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
                  Once responses are submitted, you ll see field-wise analysis
                  here.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics UI: select a field and show charts */}
            <div>
              <h2 className="text-lg font-semibold text-black mb-2">
                Analytics
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Select a field to visualize responses (bar chart and pie chart).
              </p>

              {/* Field selector */}
              <div className="mb-6">
                <label className="text-sm font-medium text-black block mb-2">
                  Field
                </label>
                <select
                  className="px-3 py-2 border rounded-md w-full max-w-sm"
                  onChange={(e) => setSelectedFieldId(e.target.value)}
                  value={selectedFieldId || ""}
                >
                  <option value="">-- Select a field --</option>
                    {formData?.sections
                      .flatMap((s) => s.fields)
                      .map((f: unknown) => {
                        const ff = f as { id: string; label?: string; type?: string };
                        return (
                          <option key={ff.id} value={ff.id}>
                            {ff.label} ({ff.type})
                          </option>
                        );
                      })}
                </select>
              </div>

              {/* Show charts when field selected */}
              {selectedFieldId ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-white border rounded">
                    <h3 className="text-sm font-medium mb-2">Bar Chart</h3>
                    <BarChart data={chartData} />
                  </div>
                  <div className="p-4 bg-white border rounded">
                    <h3 className="text-sm font-medium mb-2">Pie Chart</h3>
                    <PieChart data={chartData} />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Choose a field to view analytics.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white border border-gray-200 text-black">
          <DialogHeader className="bg-white">
            <DialogTitle className="text-black">Delete Response</DialogTitle>
            <DialogDescription className="text-black">
              Are you sure you want to delete this response from{" "}
              <span className="font-semibold text-black">
                {submissionToDelete?.submittedBy || "Anonymous"}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-white">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSubmissionToDelete(null);
              }}
              className="text-black bg-white border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSubmission}
              disabled={deleteSubmissionMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteSubmissionMutation.isPending
                ? "Deleting..."
                : "Delete Response"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Response Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white border border-gray-200 text-black max-h-[80vh] overflow-y-auto">
          <DialogHeader className="bg-white">
            <DialogTitle className="text-black">Edit Response</DialogTitle>
            <DialogDescription className="text-black">
              Edit the response from{" "}
              <span className="font-semibold text-black">
                {submissionToEdit?.submittedBy || "Anonymous"}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {submissionToEdit?.responses.map((response: unknown) => (
              <div key={(response as { id: string }).id} className="space-y-2">
                <Label
                  htmlFor={`field-${(response as unknown  ) .fieldId}`}
                  className="text-sm font-medium text-black"
                >
                  {response.field?.label || "Unknown Field"}
                  <Badge
                    variant="outline"
                    className="ml-2 text-xs text-black bg-gray-50 border-gray-300"
                  >
                    {response.field?.type || "UNKNOWN"}
                  </Badge>
                </Label>
                {response.field?.type === "TEXTAREA" ? (
                  <Textarea
                    id={`field-${response.fieldId}`}
                    value={editFormData[response.fieldId] || ""}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        [response.fieldId]: e.target.value,
                      }))
                    }
                    className="w-full bg-white border border-gray-300 text-black"
                    rows={3}
                  />
                ) : (
                  <Input
                    id={`field-${response.fieldId}`}
                    type={
                      response.field?.type === "EMAIL"
                        ? "email"
                        : response.field?.type === "NUMBER"
                        ? "number"
                        : "text"
                    }
                    value={editFormData[response.fieldId] || ""}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        [response.fieldId]: e.target.value,
                      }))
                    }
                    className="w-full bg-white border border-gray-300 text-black"
                  />
                )}
              </div>
            ))}
          </div>

          <DialogFooter className="bg-white">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSubmissionToEdit(null);
                setEditFormData({});
              }}
              className="text-black bg-white border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSubmission}
              disabled={updateSubmissionMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {updateSubmissionMutation.isPending
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormResponsesPage;
