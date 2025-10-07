import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "@/components/ui/extension/multi-select";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import { Plus, X } from "lucide-react";
import React from "react";
import FormComponentWrapper from "../FormComponentWrapper";
import { useFormBuilderIntegration } from "../FormBuilderIntegration";

interface CustomMultiSelectProps {
  fieldId?: string;
  sectionId?: string;
}

const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  fieldId,
  sectionId,
}) => {
  const defaultValues = defaultFieldConfig[FieldType.MULTISELECT];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [options, setOptions] = React.useState([
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
    { value: "option4", label: "Option 4" },
  ]);
  const [selectedOptions, setSelectedOptions] = React.useState<
    { value: string; label: string }[]
  >([]);
  const [minSelections, setMinSelections] = React.useState(0);
  const [maxSelections, setMaxSelections] = React.useState(0);
  const [isRequired, setIsRequired] = React.useState(false);

  const addOption = () => {
    const newOption = {
      value: `option${options.length + 1}`,
      label: `Option ${options.length + 1}`,
    };
    setOptions([...options, newOption]);
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      const removedOption = options[index];
      setOptions(options.filter((_, i) => i !== index));
      setSelectedOptions(
        selectedOptions.filter((opt) => opt.value !== removedOption.value)
      );
    }
  };

  const updateOption = (index: number, label: string) => {
    const updatedOptions = [...options];
    const oldOption = updatedOptions[index];
    updatedOptions[index] = {
      ...oldOption,
      label,
      value: label.toLowerCase().replace(/\s+/g, "_"),
    };
    setOptions(updatedOptions);

    // Update selected options if the changed option was selected
    const selectedIndex = selectedOptions.findIndex(
      (opt) => opt.value === oldOption.value
    );
    if (selectedIndex !== -1) {
      const updatedSelected = [...selectedOptions];
      updatedSelected[selectedIndex] = updatedOptions[index];
      setSelectedOptions(updatedSelected);
    }
  };

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
        if (typeof (foundField as any).label === "string")
          setLabelValue((foundField as any).label);
        if (Array.isArray((foundField as any).options))
          setOptions((foundField as any).options);
        if (typeof (foundField as any).minSelections === "number")
          setMinSelections((foundField as any).minSelections);
        if (typeof (foundField as any).maxSelections === "number")
          setMaxSelections((foundField as any).maxSelections);
        if (typeof (foundField as any).required === "boolean")
          setIsRequired((foundField as any).required);
      }
    } catch (err) {
      console.warn("Error hydrating multiselect field:", err);
    }
  }, [integration, fieldId]);

  const handleSave = async () => {
    try {
      if (integration && fieldId) {
        await integration.saveField({
          id: fieldId,
          sectionId: sectionId || "",
          type: FieldType.MULTISELECT,
          label: labelValue,
          options,
          minSelections,
          maxSelections,
          required: isRequired,
        } as any);
        return;
      }
      console.log("Saving multi-select configuration:", {
        label: labelValue,
        options,
        minSelections,
        maxSelections,
        required: isRequired,
      });
    } catch (err) {
      console.error("Error saving multi-select field:", err);
      throw err;
    }
  };

  const previewContent = (
    <>
      <label className="block mb-1">{labelValue || defaultValues.label}</label>
      <MultiSelector
        values={selectedOptions}
        onValuesChange={setSelectedOptions}
      >
        <MultiSelectorTrigger>
          <MultiSelectorInput placeholder="Select options..." />
        </MultiSelectorTrigger>
        <MultiSelectorContent>
          <MultiSelectorList>
            {options.map((option) => (
              <MultiSelectorItem
                key={option.value}
                value={option.value}
                label={option.label}
              >
                {option.label}
              </MultiSelectorItem>
            ))}
          </MultiSelectorList>
        </MultiSelectorContent>
      </MultiSelector>
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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1">Min Selections</label>
          <Input
            type="number"
            className="border p-2"
            value={minSelections}
            onChange={(e) => setMinSelections(Number(e.target.value))}
            min={0}
          />
        </div>
        <div>
          <label className="block mb-1">Max Selections (0 = unlimited)</label>
          <Input
            type="number"
            className="border p-2"
            value={maxSelections}
            onChange={(e) => setMaxSelections(Number(e.target.value))}
            min={0}
          />
        </div>
      </div>
    </>
  );

  return (
    <FormComponentWrapper
      fieldId={fieldId}
      sectionId={sectionId}
      fieldType={FieldType.MULTISELECT}
      onSave={handleSave}
      onRequiredChange={setIsRequired}
      isRequired={isRequired}
      configurationContent={configurationContent}
    >
      {previewContent}
    </FormComponentWrapper>
  );
};

export default CustomMultiSelect;
