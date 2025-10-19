import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import LocationInput from "@/components/ui/extension/localtion-input";
import { defaultFieldConfig, FormalNames } from "@/constants";
import { getFieldIcon } from "@/utils";
import { FieldType } from "@prisma/client";
import { Trash } from "lucide-react";
import React from "react";
import { useFormBuilderIntegration } from "../FormBuilderIntegration";
import FormComponentWrapper, {
  LabelWithRequired,
} from "../FormComponentWrapper";

const CustomLocation = ({
  fieldId,
  sectionId,
}: {
  fieldId?: string;
  sectionId?: string;
}) => {
  const defaultValues = defaultFieldConfig[FieldType.LOCATION];
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
        if (typeof (foundField as any).label === "string")
          setLabelValue((foundField as any).label);
        if (typeof (foundField as any).required === "boolean")
          setIsRequired((foundField as any).required);
      }
    } catch (err) {
      console.warn("Error hydrating location field:", err);
    }
  }, [integration, fieldId]);

  const handleSave = async () => {
    try {
      if (integration && fieldId) {
        await integration.saveField({
          id: fieldId,
          sectionId: sectionId || "",
          type: FieldType.LOCATION,
          label: labelValue,
          required: isRequired,
        } as any);
        return;
      }

      console.log("Save location (simulated)", {
        label: labelValue,
        required: isRequired,
      });
    } catch (err) {
      console.error("Error saving location field:", err);
      throw err;
    }
  };

  const previewContent = ({ isRequired }: { isRequired: boolean }) => (
    <>
      <LabelWithRequired isRequired={isRequired}>
        {labelValue || defaultValues.label}
      </LabelWithRequired>
      <LocationInput
        onCountryChange={(country) => console.log("Country selected:", country)}
        onStateChange={(s) => console.log("State selected:", s)}
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
    </>
  );

  return (
    <FormComponentWrapper
      fieldId={fieldId}
      sectionId={sectionId}
      fieldType={FieldType.LOCATION}
      onSave={handleSave}
      onRequiredChange={setIsRequired}
      isRequired={isRequired}
      configurationContent={configurationContent}
    >
      {previewContent}
    </FormComponentWrapper>
  );
};

export default CustomLocation;
