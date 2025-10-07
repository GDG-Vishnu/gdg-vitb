import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import { Plus, X } from "lucide-react";
import React from "react";
import FormComponentWrapper from "../FormComponentWrapper";
import { useFormBuilderIntegration } from "../FormBuilderIntegration";

interface CustomSelectProps {
  fieldId?: string;
  sectionId?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ fieldId, sectionId }) => {
  const defaultValues = defaultFieldConfig[FieldType.SELECT];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [options, setOptions] = React.useState([
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ]);
  const [isRequired, setIsRequired] = React.useState(false);

  let integration = null as ReturnType<typeof useFormBuilderIntegration> | null;
  try {
    integration = useFormBuilderIntegration();
  } catch {
    integration = null;
  }

  React.useEffect(() => {
    try {
      if (!integration || !fieldId) return;
      const formData = integration.formData;
      if (!formData) return;
      const foundField = formData.sections
        ?.flatMap((s) => s.fields || [])
        .find((f: any) => f.id === fieldId);
      if (foundField) {
        if (typeof foundField.label === "string")
          setLabelValue(foundField.label);
        if (Array.isArray(foundField.options)) setOptions(foundField.options);
        if (typeof foundField.required === "boolean")
          setIsRequired(foundField.required);
      }
    } catch (err) {
      console.warn("Error hydrating select field:", err);
    }
  }, [integration, fieldId]);

  const addOption = () => {
    const newOption = {
      value: `option${options.length + 1}`,
      label: `Option ${options.length + 1}`,
    };
    setOptions([...options, newOption]);
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, label: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      label,
      value: label.toLowerCase().replace(/\s+/g, "_"),
    };
    setOptions(updatedOptions);
  };

  const handleSave = async (): Promise<void> => {
    const fieldData = {
      fieldId,
      sectionId,
      type: FieldType.SELECT,
      label: labelValue,
      options,
      required: isRequired,
    };

    console.log("Saving select configuration:", fieldData);
    try {
      if (integration && fieldId) {
        await integration.saveField({
          id: fieldId,
          sectionId: sectionId || "",
          type: FieldType.SELECT,
          label: labelValue,
          options,
          required: isRequired,
        } as any);
        console.log("Select field saved via integration.saveField");
        return;
      }
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          console.log("Select field saved (simulated)!");
          resolve();
        }, 500);
      });
    } catch (err) {
      console.error("Error saving select field:", err);
      throw err;
    }
  };

  const previewContent = (
    <>
      <label className="block mb-1">{labelValue || defaultValues.label}</label>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );

  const configurationContent = (
    <>
      <div>
        <label className="block mb-1">Label</label>
        <Input
          type="text"
          className="border p-2"
          value={labelValue}
          onChange={(e) => setLabelValue(e.target.value)}
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block">Options</label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addOption}
            className="flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Choice
          </Button>
        </div>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="text"
                className="border p-2 flex-1"
                value={option.label}
                onChange={(e) => updateOption(index, e.target.value)}
              />
              {options.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeOption(index)}
                  className="p-1 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <FormComponentWrapper
      fieldId={fieldId}
      sectionId={sectionId}
      fieldType={FieldType.SELECT}
      onSave={handleSave}
      onRequiredChange={setIsRequired}
      isRequired={isRequired}
      configurationContent={configurationContent}
    >
      {previewContent}
    </FormComponentWrapper>
  );
};

export default CustomSelect;
