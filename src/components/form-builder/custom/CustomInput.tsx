import { Input } from "@/components/ui/input";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import React from "react";
import FormComponentWrapper, {
  LabelWithRequired,
} from "../FormComponentWrapper";
import { useFormBuilderIntegration } from "../FormBuilderIntegration";

interface CustomInputProps {
  fieldId?: string;
  sectionId?: string;
  initialData?: {
    label?: string;
    placeholder?: string;
    required?: boolean;
  };
}

const CustomInput: React.FC<CustomInputProps> = ({
  fieldId,
  sectionId,
  initialData,
}) => {
  const defaultValues = defaultFieldConfig[FieldType.INPUT];
  const [inputValue, setInputValue] = React.useState(
    initialData?.placeholder || defaultValues.placeholder
  );
  const [labelValue, setLabelValue] = React.useState(
    initialData?.label || defaultValues.label
  );
  const [isRequired, setIsRequired] = React.useState(
    initialData?.required || false
  );

  // Attempt to get integration context at top-level (hooks must be called at top-level)
  let integration = null as ReturnType<typeof useFormBuilderIntegration> | null;
  try {
    integration = useFormBuilderIntegration();
  } catch {
    integration = null;
  }

  // If integrated, try to hydrate current saved values from integration.formData
  React.useEffect(() => {
    try {
      if (!integration || !fieldId) return;

      const formData = integration.formData;
      if (!formData) return;

      // Find the field in formData
      const foundField = formData.sections
        ?.flatMap((s) => s.fields || [])
        .find((f: any) => f.id === fieldId);

      if (foundField) {
        if (typeof foundField.label === "string")
          setLabelValue(foundField.label);
        if (typeof foundField.placeholder === "string")
          setInputValue(foundField.placeholder);
        if (typeof foundField.required === "boolean")
          setIsRequired(foundField.required);
      }
    } catch (err) {
      // ignore hydration errors
      console.warn("Error hydrating field from integration.formData:", err);
    }
  }, [integration, fieldId]);

  const handleSave = async (): Promise<void> => {
    const fieldData = {
      fieldId,
      sectionId,
      type: FieldType.INPUT,
      label: labelValue,
      placeholder: inputValue,
      required: isRequired,
    };

    console.log("Saving input configuration:", fieldData);

    // If integrated with the FormBuilderIntegration provider, call its save
    try {
      if (integration && fieldId) {
        await integration.saveField({
          id: fieldId,
          sectionId: sectionId || "",
          type: FieldType.INPUT,
          label: labelValue,
          placeholder: inputValue,
          required: isRequired,
        } as any);
        console.log("Input field saved via integration.saveField");
        return;
      }

      // Fallback to simulated save for demo / non-integrated usage
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          console.log("Input field saved (simulated)!");
          resolve();
        }, 500);
      });
    } catch (err) {
      console.error("Error saving input field:", err);
      throw err;
    }
  };

  const previewContent = ({ isRequired }: { isRequired: boolean }) => (
    <>
      <LabelWithRequired isRequired={isRequired}>
        {labelValue || defaultValues.label}
      </LabelWithRequired>
      <Input
        type="text"
        className="border p-2"
        placeholder={inputValue || defaultValues.placeholder}
      />
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
        <label className="block mb-1">Placeholder</label>
        <Input
          type="text"
          className="border p-2"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
    </>
  );

  return (
    <FormComponentWrapper
      fieldId={fieldId}
      sectionId={sectionId}
      fieldType={FieldType.INPUT}
      onSave={handleSave}
      onRequiredChange={setIsRequired}
      isRequired={isRequired}
      configurationContent={configurationContent}
    >
      {previewContent}
    </FormComponentWrapper>
  );
};

export default CustomInput;
