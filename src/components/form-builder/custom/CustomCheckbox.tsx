import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import React from "react";
import FormComponentWrapper, {
  LabelWithRequired,
} from "../FormComponentWrapper";
import { useFormBuilderIntegration } from "../FormBuilderIntegration";

interface CustomCheckboxProps {
  fieldId?: string;
  sectionId?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  fieldId,
  sectionId,
}) => {
  const defaultValues = defaultFieldConfig[FieldType.CHECKBOX];
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
      console.warn("Error hydrating checkbox field:", err);
    }
  }, [integration, fieldId]);

  const handleSave = async (): Promise<void> => {
    const fieldData = {
      fieldId,
      sectionId,
      type: FieldType.CHECKBOX,
      label: labelValue,
      required: isRequired,
    };

    try {
      if (integration && fieldId) {
        await integration.saveField({
          id: fieldId,
          sectionId: sectionId || "",
          type: FieldType.CHECKBOX,
          label: labelValue,
          required: isRequired,
        } as any);
        console.log("Checkbox field saved via integration.saveField");
        return;
      }

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          console.log("Checkbox field saved (simulated)!");
          resolve();
        }, 500);
      });
    } catch (err) {
      console.error("Error saving checkbox field:", err);
      throw err;
    }
  };

  const previewContent = ({ isRequired }: { isRequired: boolean }) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="preview-checkbox" />
      <LabelWithRequired
        isRequired={isRequired}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {labelValue || defaultValues.label}
      </LabelWithRequired>
    </div>
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
      fieldType={FieldType.CHECKBOX}
      onSave={handleSave}
      onRequiredChange={setIsRequired}
      isRequired={isRequired}
      configurationContent={configurationContent}
    >
      {previewContent}
    </FormComponentWrapper>
  );
};

export default CustomCheckbox;
