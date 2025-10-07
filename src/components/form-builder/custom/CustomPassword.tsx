import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/extension/password";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import React from "react";
import FormComponentWrapper from "../FormComponentWrapper";
import { useFormBuilderIntegration } from "../FormBuilderIntegration";

interface CustomPasswordProps {
  fieldId?: string;
  sectionId?: string;
}

const CustomPassword: React.FC<CustomPasswordProps> = ({
  fieldId,
  sectionId,
}) => {
  const defaultValues = defaultFieldConfig[FieldType.PASSWORD];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [placeholderValue, setPlaceholderValue] =
    React.useState("Enter password...");
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
        if (typeof foundField.placeholder === "string")
          setPlaceholderValue(foundField.placeholder);
        if (typeof foundField.required === "boolean")
          setIsRequired(foundField.required);
      }
    } catch (err) {
      console.warn("Error hydrating password field:", err);
    }
  }, [integration, fieldId]);

  const handleSave = async (): Promise<void> => {
    const fieldData = {
      fieldId,
      sectionId,
      type: FieldType.PASSWORD,
      label: labelValue,
      placeholder: placeholderValue,
      required: isRequired,
    };

    try {
      if (integration && fieldId) {
        await integration.saveField({
          id: fieldId,
          sectionId: sectionId || "",
          type: FieldType.PASSWORD,
          label: labelValue,
          placeholder: placeholderValue,
          required: isRequired,
        } as any);
        console.log("Password field saved via integration.saveField");
        return;
      }

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          console.log("Password field saved (simulated)!");
          resolve();
        }, 500);
      });
    } catch (err) {
      console.error("Error saving password field:", err);
      throw err;
    }
  };

  const previewContent = (
    <>
      <label className="block">{labelValue || defaultValues.label}</label>
      <PasswordInput className="w-full" placeholder={placeholderValue} />
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
          value={placeholderValue}
          onChange={(e) => setPlaceholderValue(e.target.value)}
        />
      </div>
    </>
  );

  return (
    <FormComponentWrapper
      fieldId={fieldId}
      sectionId={sectionId}
      fieldType={FieldType.PASSWORD}
      onSave={handleSave}
      onRequiredChange={setIsRequired}
      isRequired={isRequired}
      configurationContent={configurationContent}
    >
      {previewContent}
    </FormComponentWrapper>
  );
};

export default CustomPassword;
