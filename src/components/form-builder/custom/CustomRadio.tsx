import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import { Plus, X } from "lucide-react";
import React from "react";
import FormComponentWrapper, {
  LabelWithRequired,
} from "../FormComponentWrapper";
import { useFormBuilderIntegration } from "../FormBuilderIntegration";

interface CustomRadioProps {
  fieldId?: string;
  sectionId?: string;
}

const CustomRadio: React.FC<CustomRadioProps> = ({ fieldId, sectionId }) => {
  const defaultValues = defaultFieldConfig[FieldType.RADIO];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [options, setOptions] = React.useState([
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
  ]);
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
        if (typeof (foundField as any).required === "boolean")
          setIsRequired((foundField as any).required);
      }
    } catch (err) {
      console.warn("Error hydrating radio field:", err);
    }
  }, [integration, fieldId]);

  const handleSave = async () => {
    try {
      if (integration && fieldId) {
        await integration.saveField({
          id: fieldId,
          sectionId: sectionId || "",
          type: FieldType.RADIO,
          label: labelValue,
          options,
          required: isRequired,
        } as any);
        return;
      }
      console.log("Saving radio configuration:", {
        label: labelValue,
        options,
        required: isRequired,
      });
    } catch (err) {
      console.error("Error saving radio field:", err);
      throw err;
    }
  };

  const previewContent = ({ isRequired }: { isRequired: boolean }) => (
    <>
      <LabelWithRequired isRequired={isRequired} className="block mb-3">
        {labelValue || defaultValues.label}
      </LabelWithRequired>
      <RadioGroup className="flex flex-col space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
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
      fieldType={FieldType.RADIO}
      onSave={handleSave}
      onRequiredChange={setIsRequired}
      isRequired={isRequired}
      configurationContent={configurationContent}
    >
      {previewContent}
    </FormComponentWrapper>
  );
};

export default CustomRadio;
