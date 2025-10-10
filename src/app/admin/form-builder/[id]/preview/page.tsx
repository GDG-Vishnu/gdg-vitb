"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "@/hooks/use-form-data";
import { FormData, SectionData, FieldData } from "@/types/form-builder";
import { createSubmission } from "@/actions/submissions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  CalendarIcon,
  Upload,
  MapPin,
  PenTool,
  Eye,
  EyeOff,
  X,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface PreviewFieldProps {
  field: FieldData;
  value: any;
  onChange: (value: any) => void;
}

const PreviewField: React.FC<PreviewFieldProps> = ({
  field,
  value,
  onChange,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const renderField = () => {
    switch (field.type) {
      case "INPUT":
        return (
          <Input
            placeholder={field.placeholder || "Your answer"}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border-0 border-b border-gray-300 rounded-none focus:border-blue-600 focus:ring-0 px-0 py-2 bg-transparent placeholder:text-gray-400"
          />
        );

      case "TEXTAREA":
        return (
          <Textarea
            placeholder={field.placeholder || "Your answer"}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full resize-none border-0 border-b border-gray-300 rounded-none focus:border-blue-600 focus:ring-0 px-0 py-2 bg-transparent placeholder:text-gray-400"
          />
        );

      case "PASSWORD":
        return (
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={field.placeholder || "Your password"}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className="w-full border-0 border-b border-gray-300 rounded-none focus:border-blue-600 focus:ring-0 px-0 py-2 pr-10 bg-transparent placeholder:text-gray-400"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        );

      case "PHONE":
        return (
          <Input
            type="tel"
            placeholder={field.placeholder || "Your phone number"}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border-0 border-b border-gray-300 rounded-none focus:border-blue-600 focus:ring-0 px-0 py-2 bg-transparent placeholder:text-gray-400"
          />
        );

      case "CHECKBOX":
        const checkboxOptions = Array.isArray(field.options)
          ? field.options
          : [];
        if (checkboxOptions.length === 0) {
          return (
            <div className="text-sm text-gray-500 italic">
              No options configured for this checkbox field
            </div>
          );
        }
        return (
          <div className="space-y-4">
            {checkboxOptions.map((option: any, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <Checkbox
                  id={`${field.id}-${index}`}
                  checked={(value || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValue = value || [];
                    if (checked) {
                      onChange([...currentValue, option]);
                    } else {
                      onChange(currentValue.filter((v: any) => v !== option));
                    }
                  }}
                  className="mt-1"
                />
                <Label
                  htmlFor={`${field.id}-${index}`}
                  className="text-sm font-normal text-gray-700 leading-relaxed cursor-pointer"
                >
                  {typeof option === "string"
                    ? option
                    : option.label || option.value}
                </Label>
              </div>
            ))}
          </div>
        );

      case "RADIO":
        const radioOptions = Array.isArray(field.options) ? field.options : [];
        if (radioOptions.length === 0) {
          return (
            <div className="text-sm text-gray-500 italic">
              No options configured for this radio field
            </div>
          );
        }
        return (
          <RadioGroup
            value={value || ""}
            onValueChange={onChange}
            className="space-y-4"
          >
            {radioOptions.map((option: any, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <RadioGroupItem
                  value={typeof option === "string" ? option : option.value}
                  id={`${field.id}-${index}`}
                  className="mt-1"
                />
                <Label
                  htmlFor={`${field.id}-${index}`}
                  className="text-sm font-normal text-gray-700 leading-relaxed cursor-pointer"
                >
                  {typeof option === "string"
                    ? option
                    : option.label || option.value}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "SELECT":
        const selectOptions = Array.isArray(field.options) ? field.options : [];
        if (selectOptions.length === 0) {
          return (
            <div className="text-sm text-gray-500 italic p-3 border border-gray-200 rounded-md">
              No options configured for this select field
            </div>
          );
        }
        return (
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger className="w-full h-12 text-left">
              <SelectValue
                placeholder={field.placeholder || "Select an option..."}
                className="text-gray-500"
              />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map((option: any, index: number) => (
                <SelectItem
                  key={index}
                  value={typeof option === "string" ? option : option.value}
                  className="py-2"
                >
                  {typeof option === "string"
                    ? option
                    : option.label || option.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "MULTISELECT":
        const multiSelectOptions = Array.isArray(field.options)
          ? field.options
          : [];
        if (multiSelectOptions.length === 0) {
          return (
            <div className="text-sm text-gray-500 italic p-3 border border-gray-200 rounded-md">
              No options configured for this multi-select field
            </div>
          );
        }
        return (
          <div className="space-y-4">
            {/* Selected Items Display */}
            <div className="min-h-[3rem] p-3 border-2 border-gray-200 rounded-lg bg-gray-50">
              {(value || []).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {(value || []).map((selectedValue: any, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-sm px-3 py-1"
                    >
                      {selectedValue}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-2 hover:bg-transparent text-gray-500 hover:text-red-500"
                        onClick={() => {
                          onChange(
                            (value || []).filter(
                              (v: any) => v !== selectedValue
                            )
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
                  {field.placeholder || "Select options..."}
                </span>
              )}
            </div>

            {/* Options List */}
            <div className="space-y-3 max-h-48 overflow-y-auto">
              <p className="text-sm font-medium text-gray-700">
                Available Options:
              </p>
              {multiSelectOptions.map((option: any, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <Checkbox
                    id={`${field.id}-multi-${index}`}
                    checked={(value || []).includes(
                      typeof option === "string" ? option : option.value
                    )}
                    onCheckedChange={(checked) => {
                      const optionValue =
                        typeof option === "string" ? option : option.value;
                      const currentValue = value || [];
                      if (checked) {
                        onChange([...currentValue, optionValue]);
                      } else {
                        onChange(
                          currentValue.filter((v: any) => v !== optionValue)
                        );
                      }
                    }}
                    className="mt-1"
                  />
                  <Label
                    htmlFor={`${field.id}-multi-${index}`}
                    className="text-sm font-normal text-gray-700 leading-relaxed cursor-pointer"
                  >
                    {typeof option === "string"
                      ? option
                      : option.label || option.value}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case "SWITCH":
        return (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <Label className="text-sm font-medium text-gray-700">
                {field.placeholder || "Toggle this option"}
              </Label>
            </div>
            <Switch checked={value || false} onCheckedChange={onChange} />
          </div>
        );

      case "DATE":
        return (
          <div className="relative">
            <Input
              type="date"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className="w-full border-0 border-b border-gray-300 rounded-none focus:border-blue-600 focus:ring-0 px-0 py-2 bg-transparent"
            />
          </div>
        );

      case "DATETIME":
        return (
          <Input
            type="datetime-local"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border-0 border-b border-gray-300 rounded-none focus:border-blue-600 focus:ring-0 px-0 py-2 bg-transparent"
          />
        );

      case "FILE":
        return (
          <div className="relative">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-gray-50 hover:bg-gray-100">
              <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-base font-medium text-gray-700">
                  {field.placeholder || "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-gray-500">
                  Upload file (up to 10MB)
                </p>
                {value && (
                  <p className="text-sm text-green-600 font-medium">
                    Selected: {value}
                  </p>
                )}
              </div>
            </div>
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onChange(file.name);
                }
              }}
            />
          </div>
        );

      case "LOCATION":
        return (
          <div className="relative">
            <Input
              placeholder={field.placeholder || "Enter location..."}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className="w-full border-0 border-b border-gray-300 rounded-none focus:border-blue-600 focus:ring-0 px-0 py-2 pl-8 bg-transparent placeholder:text-gray-400"
            />
            <MapPin className="absolute left-0 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        );

      case "SIGNATURE":
        return (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
            <PenTool className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {field.placeholder || "Click to sign"}
            </p>
          </div>
        );

      case "SLIDER":
        const sliderValue = value || 0;
        return (
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
                        variant="ghost"
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
  const [formValues, setFormValues] = React.useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleFieldChange = (fieldId: string, value: any) => {
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
        alert("Please fill at least one field before submitting.");
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
        alert(
          `🎉 Form submitted successfully! Submission ID: ${result.data?.id}`
        );
        handleClearForm();
        // Optional: redirect back to form builder or show success page
        // router.push(`/admin/forms/${formData!.id}/submissions`);
      } else {
        console.error("❌ Submission failed:", result.error);
        alert(`❌ Failed to submit form: ${result.error}`);
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert(
        "💥 An error occurred while submitting the form. Please try again."
      );
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Form Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The form you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
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
              variant="outline"
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
            <div className="bg-white rounded-xl shadow-sm border-2 border-blue-500 p-6 mb-10">
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
            <div className="bg-white rounded-xl shadow-sm border-2 border-red-500 p-8 mb-10">
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
              <div className="bg-white rounded-xl shadow-sm border-2 border-green-500 p-6 mb-10">
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
                      <div className="bg-white rounded-xl shadow-sm border-2 border-green-500 p-6">
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
                              className={`bg-white rounded-xl shadow-sm border-2 ${borderColor} p-6 transition-all duration-200 hover:shadow-md`}
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
              <div className="bg-white rounded-xl shadow-sm p-6">
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
