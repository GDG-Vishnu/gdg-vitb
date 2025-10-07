import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import React from "react";
import FormComponentWrapper from "../FormComponentWrapper";
import { useFormBuilderIntegration } from "../FormBuilderIntegration";

interface CustomSliderProps {
  fieldId?: string;
  sectionId?: string;
}

const CustomSlider: React.FC<CustomSliderProps> = ({ fieldId, sectionId }) => {
  const defaultValues = defaultFieldConfig[FieldType.SLIDER];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [value, setValue] = React.useState([50]);
  const [minValue, setMinValue] = React.useState(0);
  const [maxValue, setMaxValue] = React.useState(100);
  const [step, setStep] = React.useState(1);
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
        if (Array.isArray((foundField as any).value))
          setValue((foundField as any).value);
        if (typeof (foundField as any).min === "number")
          setMinValue((foundField as any).min);
        if (typeof (foundField as any).max === "number")
          setMaxValue((foundField as any).max);
        if (typeof (foundField as any).step === "number")
          setStep((foundField as any).step);
        if (typeof (foundField as any).required === "boolean")
          setIsRequired((foundField as any).required);
      }
    } catch (err) {
      console.warn("Error hydrating slider field:", err);
    }
  }, [integration, fieldId]);

  const handleSave = async (): Promise<void> => {
    const fieldData = {
      fieldId,
      sectionId,
      type: FieldType.SLIDER,
      label: labelValue,
      value,
      min: minValue,
      max: maxValue,
      step,
      required: isRequired,
    };

    console.log("Saving slider configuration:", fieldData);

    try {
      if (integration && fieldId) {
        await integration.saveField({
          id: fieldId,
          sectionId: sectionId || "",
          type: FieldType.SLIDER,
          label: labelValue,
          value,
          min: minValue,
          max: maxValue,
          step,
          required: isRequired,
        } as any);
        return;
      }

      // Fallback simulated save
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          console.log("Slider field saved successfully!");
          resolve();
        }, 500);
      });
    } catch (err) {
      console.error("Error saving slider field:", err);
      throw err;
    }
  };

  const previewContent = (
    <>
      <label className="block mb-3">{labelValue || defaultValues.label}</label>
      <div className="space-y-2">
        <Slider
          value={value}
          onValueChange={setValue}
          min={minValue}
          max={maxValue}
          step={step}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{minValue}</span>
          <span className="font-medium">{value[0]}</span>
          <span>{maxValue}</span>
        </div>
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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1">Min Value</label>
          <Input
            type="number"
            className="border p-2"
            value={minValue}
            onChange={(e) => setMinValue(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block mb-1">Max Value</label>
          <Input
            type="number"
            className="border p-2"
            value={maxValue}
            onChange={(e) => setMaxValue(Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <label className="block mb-1">Step Size</label>
        <Input
          type="number"
          className="border p-2"
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
          min={1}
        />
      </div>

      <div>
        <label className="block mb-1">Default Value</label>
        <Input
          type="number"
          className="border p-2"
          value={value[0]}
          onChange={(e) => setValue([Number(e.target.value)])}
          min={minValue}
          max={maxValue}
        />
      </div>
    </>
  );

  return (
    <FormComponentWrapper
      fieldId={fieldId}
      sectionId={sectionId}
      fieldType={FieldType.SLIDER}
      onSave={handleSave}
      onRequiredChange={setIsRequired}
      isRequired={isRequired}
      configurationContent={configurationContent}
    >
      {previewContent}
    </FormComponentWrapper>
  );
};

export default CustomSlider;
