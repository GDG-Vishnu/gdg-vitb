"use client";

import React from "react";
import { FormData, SectionData, FieldData } from "@/types/form-builder";
import { createSubmission } from "@/actions/submissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface FormPreviewProps {
  formData: FormData;
  isOpen: boolean;
  onClose: () => void;
}

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
            className="w-full border-0 border-b border-gray-300 rounded-none focus:border-blue-600 focus:ring-0 px-0 py-2 text-gray-900 placeholder:text-gray-500"
            style={{ fontFamily: "Red Hat Display" }}
          />
        );

      case "TEXTAREA":
        return (
          <Textarea
            placeholder={field.placeholder || "Your answer"}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full resize-none border-0 border-b border-gray-300 rounded-none focus:border-blue-600 focus:ring-0 px-0 py-2 text-gray-900 placeholder:text-gray-500"
            style={{ fontFamily: "Red Hat Display" }}
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
              className="w-full border-0 border-b border-gray-300 rounded-none focus:border-blue-600 focus:ring-0 px-0 py-2 pr-10 text-gray-900 placeholder:text-gray-500"
              style={{ fontFamily: "Red Hat Display" }}
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
            className="w-full border-0 border-b border-gray-300 rounded-none focus:border-blue-600 focus:ring-0 px-0 py-2 text-gray-900 placeholder:text-gray-500"
            style={{ fontFamily: "Red Hat Display" }}
          />
        );

      case "CHECKBOX":
        const checkboxOptions = Array.isArray(field.options)
          ? field.options
          : [];
        return (
          <div className="space-y-3">
            {checkboxOptions.map((option: any, index: number) => (
              <div key={index} className="flex items-center space-x-2">
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
                />
                <Label
                  htmlFor={`${field.id}-${index}`}
                  className="text-sm font-normal"
                  style={{ fontFamily: "Red Hat Display" }}
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
        return (
          <RadioGroup
            value={value || ""}
            onValueChange={onChange}
            className="space-y-3"
          >
            {radioOptions.map((option: any, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={typeof option === "string" ? option : option.value}
                  id={`${field.id}-${index}`}
                />
                <Label
                  htmlFor={`${field.id}-${index}`}
                  className="text-sm font-normal"
                  style={{ fontFamily: "Red Hat Display" }}
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
        return (
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={field.placeholder || "Select an option..."}
              />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map((option: any, index: number) => (
                <SelectItem
                  key={index}
                  value={typeof option === "string" ? option : option.value}
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
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-md">
              {(value || []).map((selectedValue: any, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {selectedValue}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    onClick={() => {
                      onChange(
                        (value || []).filter((v: any) => v !== selectedValue)
                      );
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {!(value || []).length && (
                <span
                  className="text-muted-foreground text-sm"
                  style={{ fontFamily: "Red Hat Display" }}
                >
                  {field.placeholder || "Select options..."}
                </span>
              )}
            </div>
            <div className="space-y-1">
              {multiSelectOptions.map((option: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
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
                  />
                  <Label
                    htmlFor={`${field.id}-multi-${index}`}
                    className="text-sm font-normal"
                    style={{ fontFamily: "Red Hat Display" }}
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
          <div className="flex items-center space-x-2">
            <Switch checked={value || false} onCheckedChange={onChange} />
            <Label
              className="text-sm font-normal"
              style={{ fontFamily: "Red Hat Display" }}
            >
              {field.placeholder || "Toggle option"}
            </Label>
          </div>
        );

      case "DATE":
        return (
          <div className="relative">
            <Input
              type="date"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className="w-full text-stone-950"
            />
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        );

      case "DATETIME":
        return (
          <Input
            type="datetime-local"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-gray-900"
          />
        );

      case "FILE":
        return (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p
              className="text-sm text-muted-foreground mb-2"
              style={{ fontFamily: "Red Hat Display" }}
            >
              {field.placeholder || "Click to upload or drag and drop"}
            </p>
            <p
              className="text-xs text-muted-foreground"
              style={{ fontFamily: "Red Hat Display" }}
            >
              Upload file (up to 10MB)
            </p>
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
              className="w-full pl-10 text-gray-900 placeholder:text-gray-500"
              style={{ fontFamily: "Red Hat Display" }}
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        );

      case "SIGNATURE":
        return (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
            <PenTool className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p
              className="text-sm text-muted-foreground"
              style={{ fontFamily: "Red Hat Display" }}
            >
              {field.placeholder || "Click to sign"}
            </p>
          </div>
        );

      case "SLIDER":
        return (
          <div className="space-y-2">
            <Slider
              value={[value || 0]}
              onValueChange={(values) => onChange(values[0])}
              max={100}
              step={1}
              className="w-full"
            />
            <div
              className="flex justify-between text-xs text-muted-foreground"
              style={{ fontFamily: "Red Hat Display" }}
            >
              <span>0</span>
              <span className="font-medium">{value || 0}</span>
              <span>100</span>
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
                className="w-12 h-12 text-center text-lg font-semibold text-gray-900"
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
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-md">
              {(value || []).map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    onClick={() => {
                      onChange((value || []).filter((t: string) => t !== tag));
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {!(value || []).length && (
                <span
                  className="text-muted-foreground text-sm"
                  style={{ fontFamily: "Red Hat Display" }}
                >
                  {field.placeholder || "Add tags..."}
                </span>
              )}
            </div>
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
              className="w-full text-gray-900 placeholder:text-gray-500"
              style={{ fontFamily: "Red Hat Display" }}
            />
          </div>
        );

      default:
        return (
          <Input
            placeholder={field.placeholder || "Enter value..."}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-gray-900 placeholder:text-gray-500"
            style={{ fontFamily: "Red Hat Display" }}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label
        className="text-sm font-normal text-gray-900"
        style={{ fontFamily: "Red Hat Display" }}
      >
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="mt-2">{renderField()}</div>
    </div>
  );
};

export const FormPreview: React.FC<FormPreviewProps> = ({
  formData,
  isOpen,
  onClose,
}) => {
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
      console.log("🔍 Form ID:", formData.id);
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
        setIsSubmitting(false);
        return;
      }

      // Submit to backend
      console.log("🚀 Calling createSubmission...");
      const result = await createSubmission({
        formId: formData.id,
        responses,
        submittedBy: undefined, // Anonymous submission for now
      });

      console.log("🔍 Backend Result:", result);

      if (result.success) {
        alert("Form submitted successfully!");
        handleClearForm();
        onClose();
      } else {
        console.error("❌ Submission failed:", result.error);
        alert(`Failed to submit form: ${result.error}`);
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("An error occurred while submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    setFormValues({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-gray-50">
        <DialogHeader className="px-6 py-4 border-b bg-white">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Form Preview - {formData.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div
            className="min-h-full bg-gray-50 py-8"
            style={{ fontFamily: "Red Hat Display" }}
          >
            <div className="max-w-2xl mx-auto px-6">
              {/* Form Container */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Form Header */}
                <div className="px-8 py-8 border-b border-gray-200">
                  <div className="flex flex-start items-center justify-start mb-6">
                    <div className="flex items-center space-x-2">
                      <img
                        src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1760077622/GDG_Logo_ngjrwr.png"
                        alt="GDG"
                        className="w-20 h-20 rounded-full "
                      />
                      <div className="flex items-start space-x-2 flex-col">
                        <span
                          className=" font-[500] text-2xl text-gray-600 ml-3 pb-2"
                          style={{ fontFamily: "Red Hat Display" }}
                        >
                          Google Developer Group
                        </span>
                        <span
                          className="text-sm font-medium text-blue-600 ml-3"
                          style={{ fontFamily: "Red Hat Display" }}
                        >
                          Vishnu Institute of Technology
                        </span>
                      </div>
                    </div>
                  </div>
                  <h1
                    className="text-left mb-3 bg-clip-text text-transparent"
                    style={{
                      fontFamily: "Red Hat Display",
                      fontWeight: 700,
                      fontSize: "36px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      background:
                        "linear-gradient(87.28deg, #33A854 0.8%, #F1AE08 50%, #E6452D 74.6%, #4584F4 86.9%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      textAlign: "start",
                    }}
                  >
                    {formData.name}
                  </h1>
                  <p
                    className="text-gray-700 text-sm leading-relaxed mb-4 text-left"
                    style={{ fontFamily: "Red Hat Display" }}
                  >
                    Welcome to the{" "}
                    <span className="font-semibold text-stone-950">
                      {formData.name}
                    </span>
                  </p>
                  {formData.description && (
                    <p
                      className="text-gray-700 text-sm leading-relaxed mb-4 text-left"
                      style={{ fontFamily: "Red Hat Display" }}
                    >
                      {formData.description}
                    </p>
                  )}

                  {formData.imageUrl && (
                    <div className="mb-6">
                      <Image
                        src={formData.imageUrl}
                        alt={formData.name}
                        width={600}
                        height={300}
                        className="w-full rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="px-8 py-6">
                  <div className="space-y-8">
                    {formData.sections
                      .sort((a, b) => a.order - b.order)
                      .map((section: SectionData, sectionIndex: number) => (
                        <div key={section.id} className="space-y-6">
                          {section.title && (
                            <div className="pb-2">
                              <h2
                                className="text-lg font-medium text-red-500"
                                style={{ fontFamily: "Red Hat Display" }}
                              >
                                {section.title}
                              </h2>
                            </div>
                          )}
                          <div className="space-y-6">
                            {section.fields
                              .sort((a, b) => a.order - b.order)
                              .map((field: FieldData, fieldIndex: number) => (
                                <div key={field.id} className="space-y-2">
                                  <div className="flex items-start space-x-1">
                                    <span
                                      className="text-gray-900 font-medium text-sm mt-1"
                                      style={{ fontFamily: "Red Hat Display" }}
                                    >
                                      {sectionIndex === 0
                                        ? fieldIndex + 1
                                        : `${sectionIndex + 1}.${
                                            fieldIndex + 1
                                          }`}
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
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClearForm}
                      disabled={isSubmitting}
                      className="px-6 text-blue-600 border-blue-600 hover:bg-blue-50 disabled:text-gray-400 disabled:border-gray-300"
                      style={{ fontFamily: "Red Hat Display" }}
                    >
                      Clear Form
                    </Button>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md font-medium"
                      style={{ fontFamily: "Red Hat Display" }}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FormPreview;
