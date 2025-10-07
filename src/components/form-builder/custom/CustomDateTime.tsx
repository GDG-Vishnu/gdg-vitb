import { Input } from "@/components/ui/input";
import { DatetimePicker } from "@/components/ui/extension/date-time-picker";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import React from "react";
import FormComponentWrapper from "../FormComponentWrapper";
import { useFormBuilderIntegration } from "../FormBuilderIntegration";

interface CustomDateTimeProps {
  fieldId?: string;
  sectionId?: string;
}

const CustomDateTime: React.FC<CustomDateTimeProps> = ({
  fieldId,
  sectionId,
}) => {
  const defaultValues = defaultFieldConfig[FieldType.DATETIME];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [dateTime, setDateTime] = React.useState<Date>();
  const [minDateTime, setMinDateTime] = React.useState("");
  const [maxDateTime, setMaxDateTime] = React.useState("");
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
        if (typeof (foundField as any).minDateTime === "string")
          setMinDateTime((foundField as any).minDateTime);
        if (typeof (foundField as any).maxDateTime === "string")
          setMaxDateTime((foundField as any).maxDateTime);
        if (typeof (foundField as any).required === "boolean")
          setIsRequired((foundField as any).required);
      }
    } catch (err) {
      console.warn("Error hydrating datetime field:", err);
    }
  }, [integration, fieldId]);

  const handleSave = async () => {
    try {
      if (integration && fieldId) {
        await integration.saveField({
          id: fieldId,
          sectionId: sectionId || "",
          type: FieldType.DATETIME,
          label: labelValue,
          minDateTime,
          maxDateTime,
          required: isRequired,
        } as any);
        return;
      }
      console.log("Saving datetime configuration:", {
        label: labelValue,
        dateTime,
        minDateTime,
        maxDateTime,
        required: isRequired,
      });
    } catch (err) {
      console.error("Error saving datetime field:", err);
      throw err;
    }
  };

  const previewContent = (
    <>
      <label className="block mb-1">{labelValue || defaultValues.label}</label>
      <DatetimePicker
        value={dateTime}
        onChange={setDateTime}
        format={[
          ["months", "days", "years"],
          ["hours", "minutes", "am/pm"],
        ]}
        className="w-full"
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
        <label className="block mb-1">Min Date & Time</label>
        <Input
          type="datetime-local"
          className="border p-2"
          value={minDateTime}
          onChange={(e) => setMinDateTime(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1">Max Date & Time</label>
        <Input
          type="datetime-local"
          className="border p-2"
          value={maxDateTime}
          onChange={(e) => setMaxDateTime(e.target.value)}
        />
      </div>
    </>
  );

  return (
    <FormComponentWrapper
      fieldId={fieldId}
      sectionId={sectionId}
      fieldType={FieldType.DATETIME}
      onSave={handleSave}
      onRequiredChange={setIsRequired}
      isRequired={isRequired}
      configurationContent={configurationContent}
    >
      {previewContent}
    </FormComponentWrapper>
  );
};

export default CustomDateTime;
