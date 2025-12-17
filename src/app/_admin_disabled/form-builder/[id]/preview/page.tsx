"use client";

import React from "react";

export default function Page() {
  return null;
}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Value:</span>
              <span className="text-lg font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {sliderValue}
              </span>
            </div>
            <Slider
              value={[sliderValue]}
              onValueChange={(values) => onChange(values[0])}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded">0</span>
              <span className="bg-gray-100 px-2 py-1 rounded">100</span>
            </div>
          </div>
        );

      case "OTP":
        return (
          <div className="flex space-x-2">
            {[...Array(6)].map((_, index) => (
              <Input
                key={index}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md"
                value={(value || "")[index] || ""}
                onChange={(e) => {
                  const newValue = (value || "").split("");
                  newValue[index] = e.target.value;
                  onChange(newValue.join(""));
                }}
              />
            ))}
          </div>
        );

      case "TAGS":
        return (
          <div className="space-y-4">
            {/* Tags Display */}
            <div className="min-h-[3rem] p-3 border-2 border-gray-200 rounded-lg bg-gray-50">
              {(value || []).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {(value || []).map((tag: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-sm px-3 py-1 bg-white"
                    >
                      {tag}
                      <Button
                    
                        size="sm"
                        className="h-4 w-4 p-0 ml-2 hover:bg-transparent text-gray-500 hover:text-red-500"
                        onClick={() => {
                          onChange(
                            (value || []).filter((t: string) => t !== tag)
                          );
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500 text-sm">
                  {field.placeholder || "No tags added yet..."}
                </span>
              )}
            </div>

            {/* Tag Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Add new tag:
              </Label>
              <Input
                placeholder="Type and press Enter to add tag..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    const newTag = e.currentTarget.value.trim();
                    if (!(value || []).includes(newTag)) {
                      onChange([...(value || []), newTag]);
                    }
                    e.currentTarget.value = "";
                  }
                }}
                className="w-full border border-gray-300 rounded-md focus:border-blue-600 focus:ring-1 focus:ring-blue-600 px-3 py-2"
              />
              <p className="text-xs text-gray-500">Press Enter to add a tag</p>
            </div>
          </div>
        );

      default:
        return (
          <Input
            placeholder={field.placeholder || "Enter value..."}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border-0 border-b border-gray-300 rounded-none focus:border-blue-600 focus:ring-0 px-0 py-2 bg-transparent placeholder:text-gray-400"
          />
        );
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-base font-medium text-gray-900 block">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {field.placeholder &&
          field.type !== "INPUT" &&
          field.type !== "TEXTAREA" &&
          field.type !== "PASSWORD" &&
          field.type !== "PHONE" && (
            <p className="text-sm text-gray-600">{field.placeholder}</p>
          )}
      </div>
      <div className="mt-3">{renderField()}</div>
    </div>
  );
};

const FormPreviewPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const formId = id as string;

  const { data: formData, isLoading, error } = useForm(formId);
  const [formValues, setFormValues] = React.useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleFieldChange = (fieldId: string, value: unknown) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Debug: Log form data and values
      console.log("🔍 Form ID:", formData?.id);
      console.log("🔍 Form Values:", formValues);
      console.log("🔍 Form Data Structure:", formData);

      // Format the form values to match the backend schema
      const responses = Object.entries(formValues)
        .filter(
          ([fieldId, value]) =>
            value !== undefined && value !== null && value !== ""
        )
        .map(([fieldId, value]) => ({
          fieldId,
          value,
        }));

      console.log("🔍 Formatted Responses:", responses);

      if (responses.length === 0) {
        toastNotifications.warning.emptyForm();
        return;
      }

      // Submit to backend
      console.log("🚀 Calling createSubmission...");
      const result = await createSubmission({
        formId: formData!.id,
        responses,
        submittedBy: undefined, // Anonymous submission for now
      });

      console.log("🔍 Backend Result:", result);

      if (result.success) {
        toastNotifications.success.formSubmitted();
        handleClearForm();
        // Optional: redirect back to form builder or show success page
        // router.push(`/admin/forms/${formData!.id}/submissions`);
      } else {
        console.error("❌ Submission failed:", result.error);
        toastNotifications.error.submissionFailed(result.error);
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      toastNotifications.error.unexpectedError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    setFormValues({});
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen py-8"
        style={{
          backgroundColor: "white",
          backgroundImage: `
            linear-gradient(#f0f0f040 1px, transparent 1px),
            linear-gradient(90deg, #f0f0f040 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div
            className="rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            style={{ backgroundColor: "white" }}
          >
            <div className="px-8 py-8">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !formData) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Form Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The form youre looking for doesnt exist or has been removed.
          </p>
          <Button onClick={handleBack} >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "white",
        backgroundImage: `
          linear-gradient(#f0f0f040 1px, transparent 1px),
          linear-gradient(90deg, #f0f0f040 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
      }}
    >
      {/* Navigation Header */}
      <div
        className="border-b border-gray-200 sticky top-0 z-50"
        style={{ backgroundColor: "white" }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                
                size="sm"
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Editor
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-lg font-medium text-gray-900 truncate">
                Preview: {formData.name}
              </h1>
            </div>
            <Button
              
              size="sm"
              onClick={() => window.open(window.location.href, "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in New Tab
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-6">
          {/* Form Container */}
          <div className="space-y-6">
            {/* GDG Header Card */}
            <div
              className="rounded-xl shadow-sm border-2 border-blue-500 p-6 mb-10"
              style={{ backgroundColor: "white" }}
            >
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-4">
                  <img
                    src="https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/f4ab14c1-502d-5349-add4-a40535ee604e/a1ae5bb0-9c73-5189-9e36-292bdc04a608.jpg"
                    alt="GDG"
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-xl text-gray-700">
                      Google Developer Group
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      Vishnu Institute of Technology
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Title & Description Card */}
            <div
              className="rounded-xl shadow-sm border-2 border-red-500 p-8 mb-10"
              style={{ backgroundColor: "white" }}
            >
              <div className="text-center space-y-6">
                <h1 className="text-4xl font-semibold leading-tight bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                  {formData.name}
                </h1>

                <div className="space-y-4">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Welcome to the{" "}
                    <span className="font-semibold text-stone-900">
                      {formData.name}
                    </span>
                  </p>

                  {formData.description && (
                    <p className="text-gray-600 text-base leading-relaxed max-w-2xl mx-auto">
                      {formData.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Image Card (if exists) */}
            {formData.imageUrl && (
              <div
                className="rounded-xl shadow-sm border-2 border-green-500 p-6 mb-10"
                style={{ backgroundColor: "white" }}
              >
                <div className="text-center">
                  <Image
                    src={formData.imageUrl}
                    alt={formData.name}
                    width={800}
                    height={400}
                    className="w-full max-w-2xl mx-auto rounded-lg object-cover"
                  />
                </div>
              </div>
            )}

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="space-y-10">
              {formData.sections
                .sort((a, b) => a.order - b.order)
                .map((section: SectionData, sectionIndex: number) => (
                  <div key={section.id} className="space-y-8">
                    {section.title && (
                      <div
                        className="rounded-xl shadow-sm border-2 border-green-500 p-6"
                        style={{ backgroundColor: "white" }}
                      >
                        <h2 className="text-xl font-medium bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                          {section.title}
                        </h2>
                      </div>
                    )}
                    <div className="space-y-8">
                      {section.fields
                        .sort((a, b) => a.order - b.order)
                        .map((field: FieldData, fieldIndex: number) => {
                          // GDG brand colors rotation
                          const colors = [
                            "border-blue-500", // Google Blue
                            "border-red-500", // Google Red
                            "border-yellow-500", // Google Yellow
                            "border-green-500", // Google Green
                          ];
                          const borderColor =
                            colors[fieldIndex % colors.length];

                          return (
                            <div
                              key={field.id}
                              className={`rounded-xl shadow-sm border-2 ${borderColor} p-6 transition-all duration-200 hover:shadow-md`}
                              style={{ backgroundColor: "white" }}
                            >
                              <div className="flex items-start space-x-3">
                                <span className="font-medium text-sm mt-1 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                                  {sectionIndex === 0
                                    ? fieldIndex + 1
                                    : `${sectionIndex + 1}.${fieldIndex + 1}`}
                                  .
                                </span>
                                <div className="flex-1">
                                  <PreviewField
                                    field={field}
                                    value={formValues[field.id]}
                                    onChange={(value) =>
                                      handleFieldChange(field.id, value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}

              {/* Form Actions Card */}
              <div
                className="rounded-xl shadow-sm p-6"
                style={{ backgroundColor: "white" }}
              >
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleClearForm}
                    disabled={isSubmitting}
                    className="text-red-500 hover:text-red-600 font-medium text-sm underline hover:no-underline transition-all duration-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    Clear Form
                  </button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white rounded-full font-medium shadow-md transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPreviewPage;
