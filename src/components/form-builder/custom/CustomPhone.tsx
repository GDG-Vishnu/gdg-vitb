import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/extension/phone-input";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import React from "react";
import FormComponentWrapper from "../FormComponentWrapper";
import { useFormBuilderIntegration } from "../FormBuilderIntegration";

interface CustomPhoneProps {
  fieldId?: string;
  sectionId?: string;
}

const CustomPhone: React.FC<CustomPhoneProps> = ({ fieldId, sectionId }) => {
  const defaultValues = defaultFieldConfig[FieldType.PHONE];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
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
        if (typeof foundField.required === "boolean")
          setIsRequired(foundField.required);
      }
    } catch (err) {
      console.warn("Error hydrating phone field:", err);
    }
  }, [integration, fieldId]);

  const handleSave = async (): Promise<void> => {
    const fieldData = {
      fieldId,
      sectionId,
      type: FieldType.PHONE,
      label: labelValue,
      required: isRequired,
    };

    try {
      if (integration && fieldId) {
        await integration.saveField({
          id: fieldId,
          sectionId: sectionId || "",
          type: FieldType.PHONE,
          label: labelValue,
          required: isRequired,
        } as any);
        console.log("Phone field saved via integration.saveField");
        return;
      }

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          console.log("Phone field saved (simulated)!");
          resolve();
        }, 500);
      });
    } catch (err) {
      console.error("Error saving phone field:", err);
      throw err;
    }
  };

  const previewContent = (
    <>
      <label className="block">{labelValue || defaultValues.label}</label>
      <PhoneInput placeholder="Enter phone number" className="w-full" />
    </>
  );

  const configurationContent = (
    <div>
      <label className="block mb-1">Label</label>
      <Input
        type="text"
        className="border p-2"
        value={labelValue}
        onChange={(e) => setLabelValue(e.target.value)}
      />
    </div>
  );

  return (
    <FormComponentWrapper
      fieldId={fieldId}
      sectionId={sectionId}
      fieldType={FieldType.PHONE}
      onSave={handleSave}
      onRequiredChange={setIsRequired}
      isRequired={isRequired}
      configurationContent={configurationContent}
    >
      {previewContent}
    </FormComponentWrapper>
  );
};

export default CustomPhone;
