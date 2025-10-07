import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SmartDatetimeInput } from "@/components/ui/extension/smart-date-time";
import { defaultFieldConfig, FormalNames } from "@/constants";
import { getFieldIcon } from "@/utils";
import { FieldType } from "@prisma/client";
import { Trash } from "lucide-react";
import React from "react";
import { useFormBuilderIntegration } from "../FormBuilderIntegration";

const CustomSmartDateTime = ({
  fieldId,
  sectionId,
}: {
  fieldId?: string;
  sectionId?: string;
}) => {
  const defaultValues = defaultFieldConfig[FieldType.SMART_DATETIME];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [startDateTime, setStartDateTime] = React.useState<Date>();
  const [endDateTime, setEndDateTime] = React.useState<Date>();
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
        if (typeof (foundField as any).startDateTime === "string")
          setStartDateTime(new Date((foundField as any).startDateTime));
        if (typeof (foundField as any).endDateTime === "string")
          setEndDateTime(new Date((foundField as any).endDateTime));
        if (typeof (foundField as any).required === "boolean")
          setIsRequired((foundField as any).required);
      }
    } catch (err) {
      console.warn("Error hydrating smart datetime field:", err);
    }
  }, [integration, fieldId]);

  return (
    <div className="flex flex-col items-center w-full bg-transparent">
      <div className="w-full flex flex-col gap-2 bg-muted/50 p-4 rounded-2xl border border-border">
        <label className="block">{labelValue || defaultValues.label}</label>
        <SmartDatetimeInput
          value={startDateTime}
          onValueChange={setStartDateTime}
          className="w-full"
        />
      </div>
      <div className="w-0.5 bg-muted h-2" />
      <div className="flex flex-col gap-5 w-full bg-muted/50 p-6 rounded-2xl border border-border">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center bg-accent p-1 rounded">
              {React.createElement(getFieldIcon(FieldType.SMART_DATETIME), {
                className: "h-5 w-5",
              })}
            </div>
            <span className="font-medium">
              {FormalNames[FieldType.SMART_DATETIME]}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h3 className="font-medium">Required</h3>
            <Switch
              checked={isRequired}
              onCheckedChange={(v) => setIsRequired(Boolean(v))}
            />
          </div>
        </div>
        <div className="flex flex-col bg-muted/100 border gap-3 p-4 rounded-2xl">
          <div>
            <label className="block mb-1">Label</label>
            <Input
              type="text"
              className="border p-2"
              value={labelValue}
              onChange={(e) => setLabelValue(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block mb-1">Start Date & Time</label>
              <SmartDatetimeInput
                value={startDateTime}
                onValueChange={setStartDateTime}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-1">End Date & Time</label>
              <SmartDatetimeInput
                value={endDateTime}
                onValueChange={setEndDateTime}
                className="w-full"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 bg-destructive/15 hover:bg-destructive/25 transition-all rounded-md p-2 cursor-pointer">
            <Trash className="text-destructive h-5 w-5" />
          </div>
          <div>
            <Button
              size="sm"
              onClick={async () => {
                try {
                  if (integration && fieldId) {
                    await integration.saveField({
                      id: fieldId,
                      sectionId: sectionId || "",
                      type: FieldType.SMART_DATETIME,
                      label: labelValue,
                      startDateTime: startDateTime?.toISOString(),
                      endDateTime: endDateTime?.toISOString(),
                      required: isRequired,
                    } as any);
                    return;
                  }
                  console.log("Save smart datetime (simulated)", {
                    label: labelValue,
                  });
                } catch (err) {
                  console.error("Error saving smart datetime field:", err);
                  throw err;
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomSmartDateTime;
