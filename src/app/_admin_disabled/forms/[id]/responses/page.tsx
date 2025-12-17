"use client";

import React from "react";

export default function Page() {
  return null;
}
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
