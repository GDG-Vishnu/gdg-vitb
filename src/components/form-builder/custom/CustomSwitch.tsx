import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import React from "react";
import FormComponentWrapper from "../FormComponentWrapper";
import { useFormBuilderIntegration } from "../FormBuilderIntegration";

interface CustomSwitchProps {
  fieldId?: string;
  sectionId?: string;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ fieldId, sectionId }) => {
  const defaultValues = defaultFieldConfig[FieldType.SWITCH];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [checkedByDefault, setCheckedByDefault] = React.useState(false);
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
        if (typeof (foundField as any).label === "string")
          setLabelValue((foundField as any).label);
        if (typeof (foundField as any).checkedByDefault === "boolean")
          setCheckedByDefault((foundField as any).checkedByDefault);
        if (typeof (foundField as any).required === "boolean")
          setIsRequired((foundField as any).required);
      }
    } catch (err) {
      console.warn("Error hydrating switch field:", err);
    }
  }, [integration, fieldId]);

  const handleSave = async () => {
    try {
      if (integration && fieldId) {
        await integration.saveField({
          id: fieldId,
          sectionId: sectionId || "",
          type: FieldType.SWITCH,
          label: labelValue,
          checkedByDefault,
          required: isRequired,
        } as any);
        return;
      }
      console.log("Saving switch configuration:", {
        label: labelValue,
        checkedByDefault,
        required: isRequired,
      });
    } catch (err) {
      console.error("Error saving switch field:", err);
      throw err;
    }
  };

  const previewContent = (
    <>
      <div className="flex items-center space-x-2">
        <Switch id="preview-switch" defaultChecked={checkedByDefault} />
        <Label htmlFor="preview-switch">
          {labelValue || defaultValues.label}
        </Label>
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

      <div className="flex items-center justify-between">
        <label>Checked by Default</label>
        <Switch
          checked={checkedByDefault}
          onCheckedChange={setCheckedByDefault}
        />
      </div>
    </>
  );

  return (
    <FormComponentWrapper
      fieldId={fieldId}
      sectionId={sectionId}
      fieldType={FieldType.SWITCH}
      onSave={handleSave}
      onRequiredChange={setIsRequired}
      isRequired={isRequired}
      configurationContent={configurationContent}
    >
      {previewContent}
    </FormComponentWrapper>
  );
};

export default CustomSwitch;
