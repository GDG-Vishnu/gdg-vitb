import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React from "react";
import FormComponentWrapper from "../FormComponentWrapper";
import { useFormBuilderIntegration } from "../FormBuilderIntegration";

interface CustomDateProps {
  fieldId?: string;
  sectionId?: string;
}

const CustomDate: React.FC<CustomDateProps> = ({ fieldId, sectionId }) => {
  const defaultValues = defaultFieldConfig[FieldType.DATE];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [date, setDate] = React.useState<Date>();
  const [minDate, setMinDate] = React.useState("");
  const [maxDate, setMaxDate] = React.useState("");
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
        if (typeof (foundField as any).minDate === "string")
          setMinDate((foundField as any).minDate);
        if (typeof (foundField as any).maxDate === "string")
          setMaxDate((foundField as any).maxDate);
        if (typeof (foundField as any).required === "boolean")
          setIsRequired((foundField as any).required);
      }
    } catch (err) {
      console.warn("Error hydrating date field:", err);
    }
  }, [integration, fieldId]);

  const handleSave = async () => {
    try {
      if (integration && fieldId) {
        await integration.saveField({
          id: fieldId,
          sectionId: sectionId || "",
          type: FieldType.DATE,
          label: labelValue,
          minDate,
          maxDate,
          required: isRequired,
        } as any);
        return;
      }
      console.log("Saving date configuration:", {
        label: labelValue,
        date,
        minDate,
        maxDate,
        required: isRequired,
      });
    } catch (err) {
      console.error("Error saving date field:", err);
      throw err;
    }
  };

  const previewContent = (
    <>
      <label className="block mb-1">{labelValue || defaultValues.label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
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
        <label className="block mb-1">Min Date</label>
        <Input
          type="date"
          className="border p-2"
          value={minDate}
          onChange={(e) => setMinDate(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1">Max Date</label>
        <Input
          type="date"
          className="border p-2"
          value={maxDate}
          onChange={(e) => setMaxDate(e.target.value)}
        />
      </div>
    </>
  );

  return (
    <FormComponentWrapper
      fieldId={fieldId}
      sectionId={sectionId}
      fieldType={FieldType.DATE}
      onSave={handleSave}
      onRequiredChange={setIsRequired}
      isRequired={isRequired}
      configurationContent={configurationContent}
    >
      {previewContent}
    </FormComponentWrapper>
  );
};

export default CustomDate;
