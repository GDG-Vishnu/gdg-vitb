import { Input } from "@/components/ui/input";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import React from "react";
import FormComponentWrapper, {
  LabelWithRequired,
} from "../FormComponentWrapper";
import { useFormBuilderIntegration } from "../FormBuilderIntegration";

interface CustomEmailProps {
  fieldId?: string;
  sectionId?: string;
  initialData?: {
    label?: string;
    placeholder?: string;
    required?: boolean;
  };
}

const CustomEmail: React.FC<CustomEmailProps> = ({
  fieldId,
  sectionId,
  initialData,
}) => {
  const defaultValues = defaultFieldConfig[FieldType.EMAIL];
  const [inputValue, setInputValue] = React.useState(
    initialData?.placeholder || defaultValues.placeholder
  );
  const [labelValue, setLabelValue] = React.useState(
    initialData?.label || defaultValues.label
  );
  const [isRequired, setIsRequired] = React.useState(
    initialData?.required || false
  );

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
        if (typeof foundField.placeholder === "string")
          setInputValue(foundField.placeholder);
        if (typeof foundField.required === "boolean")
          setIsRequired(foundField.required);
      }
    } catch (err) {
      console.warn("Error hydrating field from integration.formData:", err);
    }
  }, [integration, fieldId]);

  const handleSave = async (): Promise<void> => {
    const fieldData = {
      fieldId,
      sectionId,
      type: FieldType.EMAIL,
      label: labelValue,
      placeholder: inputValue,
      required: isRequired,
    };

    console.log("Saving email configuration:", fieldData);

    try {
      if (integration && fieldId) {
        await integration.saveField({
          id: fieldId,
          sectionId: sectionId || "",
          type: FieldType.EMAIL,
          label: labelValue,
          placeholder: inputValue,
          required: isRequired,
        } as any);
        return;
      }

      await new Promise<void>((resolve) => setTimeout(resolve, 300));
    } catch (err) {
      console.error("Error saving email field:", err);
      throw err;
    }
  };

  const isValidPreview = (value: string) => {
    // simple validation: contains '@'
    return value.includes("@");
  };

  const previewContent = ({ isRequired }: { isRequired: boolean }) => (
    <>
      <LabelWithRequired isRequired={isRequired}>
        {labelValue || defaultValues.label}
      </LabelWithRequired>
      <Input
        type="email"
        className="border p-2"
        placeholder={inputValue || defaultValues.placeholder}
      />
      <div className="text-sm mt-2">
        <span className="text-muted-foreground">
          Preview validation:{" "}
          {isValidPreview(inputValue || "") ? (
            <span className="text-green-600">Looks like an email</span>
          ) : (
            <span className="text-red-600">Requires an '@' character</span>
          )}
        </span>
      </div>
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
      fieldType={FieldType.EMAIL}
      onSave={handleSave}
      onRequiredChange={setIsRequired}
      isRequired={isRequired}
      configurationContent={configurationContent}
    >
      {previewContent}
    </FormComponentWrapper>
  );
};

export default CustomEmail;
