"use client";

import React from "react";
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
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  CalendarIcon,
  Upload,
  MapPin,
  PenTool,
  Eye,
  EyeOff,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { DatetimePicker } from "@/components/ui/extension/date-time-picker";

interface Field {
  id: string;
  label: string;
  type: string;
  placeholder?: string | null;
  required: boolean;
  options?: string[] | Record<string, unknown>;
  defaultValue?: string | number | boolean | null;
}

interface FormFieldRendererProps {
  field: Field;
  isPreview?: boolean;
  onEdit?: () => void;
}

export const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  field,
  isPreview = false,
  onEdit,
}) => {
  const [value, setValue] = React.useState<string>(
    String(field.defaultValue || "")
  );
  const [showPassword, setShowPassword] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [selectedDateTime, setSelectedDateTime] = React.useState<
    Date | undefined
  >();

  // Normalize incoming field.type values (many parts of the app use
  // enum-like keys such as "OTP", "TAGS", or slightly different labels).
  // Map common variants to the canonical case labels used below so the
  // preview renderer consistently finds the correct branch.
  const normalizedType = React.useMemo(() => {
    const raw = String(field.type || "");
    const key = raw.replace(/[\s_-]+/g, " ").toLowerCase();
    // Use alias lists to avoid duplicate keys in object literals
    const aliases: Array<[string[], string]> = [
      [["otp", "input otp", "input-otp", "input_otp", "otpinput"], "Input OTP"],
      [["tags", "tags input", "tags_input", "tagsinput"], "Tags Input"],
      [["location", "location input"], "Location Input"],
      [["signature", "signature input"], "Signature Input"],
      [["date", "date picker"], "Date Picker"],
      [["datetime", "datetime picker"], "Datetime Picker"],
      [["smart datetime input"], "Smart Datetime Input"],
      [["multi select", "multiselect"], "Multi Select"],
      [["combobox"], "Combobox"],
      [["file input"], "File Input"],
      [["email", "email input"], "Email"],
    ];

    for (const [keys, value] of aliases) {
      if (keys.includes(key)) return value;
    }

    return raw;
  }, [field.type]);

  const renderField = () => {
    switch (normalizedType) {
      case "Input":
        return (
          <Input
            placeholder={field.placeholder || "Enter text..."}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!isPreview}
          />
        );

      case "Email":
        return (
          <Input
            type="email"
            placeholder={field.placeholder || "Enter email..."}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!isPreview}
          />
        );

      case "Textarea":
        return (
          <Textarea
            placeholder={field.placeholder || "Enter text..."}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!isPreview}
            rows={3}
          />
        );

      case "Password":
        return (
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={field.placeholder || "Enter password..."}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={!isPreview}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={!isPreview}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        );

      case "Phone":
        return (
          <Input
            type="tel"
            placeholder={field.placeholder || "Enter phone number..."}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!isPreview}
          />
        );

      case "Checkbox":
        const checkboxOptions = Array.isArray(field.options)
          ? field.options
          : ["Option 1", "Option 2"];
        return (
          <div className="space-y-2">
            {checkboxOptions.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox id={`${field.id}-${index}`} disabled={!isPreview} />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case "RadioGroup":
        const radioOptions = Array.isArray(field.options)
          ? field.options
          : ["Option 1", "Option 2"];
        return (
          <RadioGroup disabled={!isPreview}>
            {radioOptions.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "Select":
        const selectOptions = Array.isArray(field.options)
          ? field.options
          : ["Option 1", "Option 2"];
        return (
          <Select disabled={!isPreview}>
            <SelectTrigger>
              <SelectValue
                placeholder={field.placeholder || "Select an option..."}
              />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map((option: string, index: number) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "Combobox":
        const comboboxOptions = Array.isArray(field.options)
          ? field.options
          : ["Option 1", "Option 2"];
        return (
          <Select disabled={!isPreview}>
            <SelectTrigger>
              <SelectValue
                placeholder={field.placeholder || "Type to search..."}
              />
            </SelectTrigger>
            <SelectContent>
              {comboboxOptions.map((option: string, index: number) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "Multi Select":
        const multiselectOptions = Array.isArray(field.options)
          ? field.options
          : ["Option 1", "Option 2"];
        return (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {field.placeholder || "Select multiple options..."}
            </div>
            {multiselectOptions.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-multi-${index}`}
                  disabled={!isPreview}
                />
                <Label htmlFor={`${field.id}-multi-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case "Switch":
        return (
          <div className="flex items-center space-x-2">
            <Switch disabled={!isPreview} />
            <Label>{field.placeholder || "Toggle option"}</Label>
          </div>
        );

      case "Date Picker":
        return (
          <div>
            <label className="sr-only">{field.label}</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate
                    ? format(selectedDate, "PPP")
                    : value || field.placeholder || "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => setSelectedDate(d as Date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      case "Datetime Picker":
      case "Smart Datetime Input":
        return (
          <div>
            <label className="sr-only">{field.label}</label>
            <DatetimePicker
              value={selectedDateTime}
              onChange={setSelectedDateTime}
              format={[
                ["months", "days", "years"],
                ["hours", "minutes", "am/pm"],
              ]}
              className="w-full"
            />
          </div>
        );

      case "File Input":
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2 text-sm text-gray-600">
              {field.placeholder || "Click to upload or drag and drop"}
            </div>
          </div>
        );

      case "Input OTP":
        return (
          <div className="flex space-x-2">
            {[...Array(6)].map((_, index) => (
              <Input
                key={index}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center"
                disabled={!isPreview}
              />
            ))}
          </div>
        );

      case "Location Input":
        return (
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
            disabled={!isPreview}
          >
            <MapPin className="mr-2 h-4 w-4" />
            {value || field.placeholder || "Select location"}
          </Button>
        );

      case "Signature Input":
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center h-32">
            <PenTool className="mx-auto h-8 w-8 text-gray-400" />
            <div className="mt-2 text-sm text-gray-600">
              {field.placeholder || "Click to sign"}
            </div>
          </div>
        );

      case "Slider":
        return (
          <div className="space-y-2">
            <Slider
              value={[parseInt(value) || 50]}
              onValueChange={(vals) => setValue(String(vals[0]))}
              max={100}
              step={1}
              disabled={!isPreview}
            />
            <div className="text-sm text-muted-foreground text-center">
              Value: {value || 50}
            </div>
          </div>
        );

      case "Tags Input":
        return (
          <div className="space-y-2">
            <Input
              placeholder={
                field.placeholder || "Type and press Enter to add tags"
              }
              disabled={!isPreview}
            />
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary">Sample Tag</Badge>
              <Badge variant="secondary">Another Tag</Badge>
            </div>
          </div>
        );

      case "Rating":
        return (
          <div className="flex space-x-1">
            {[...Array(5)].map((_, index) => (
              <button
                key={index}
                className="text-2xl text-gray-300 hover:text-yellow-400"
                disabled={!isPreview}
              >
                ⭐
              </button>
            ))}
          </div>
        );

      case "Credit Card":
        return (
          <div className="space-y-4">
            <Input placeholder="Card Number" disabled={!isPreview} />
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="MM/YY" disabled={!isPreview} />
              <Input placeholder="CVV" disabled={!isPreview} />
            </div>
            <Input placeholder="Cardholder Name" disabled={!isPreview} />
          </div>
        );

      default:
        return (
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
            Unknown field type: {field.type}
          </div>
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-auto p-1 text-xs"
          >
            Edit
          </Button>
        )}
      </div>
      {renderField()}
    </div>
  );
};
