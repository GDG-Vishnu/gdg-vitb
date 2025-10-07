import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import React from "react";
import FormComponentWrapper, {
  LabelWithRequired,
} from "../FormComponentWrapper";
import { useFormBuilderIntegration } from "../FormBuilderIntegration";

interface CustomTextAreaProps {
  fieldId?: string;
  sectionId?: string;
}

const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  fieldId,
  sectionId,
}) => {
  const defaultValues = defaultFieldConfig[FieldType.TEXTAREA];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [placeholderValue, setPlaceholderValue] = React.useState(
    "Enter your text here..."
  );
  const [minCharacters, setMinCharacters] = React.useState(0);
  const [minWords, setMinWords] = React.useState(0);
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
        if (typeof foundField.minCharacters === "number")
          setMinCharacters(foundField.minCharacters);
        if (typeof foundField.minWords === "number")
          setMinWords(foundField.minWords);
        if (typeof foundField.required === "boolean")
          setIsRequired(foundField.required);
      }
    } catch (err) {
      console.warn("Error hydrating textarea field:", err);
    }
  }, [integration, fieldId]);

  const handleSave = async (): Promise<void> => {
    const fieldData = {
      fieldId,
      sectionId,
      type: FieldType.TEXTAREA,
      label: labelValue,
      placeholder: placeholderValue,
      minCharacters,
      minWords,
      required: isRequired,
    };

    try {
      if (integration && fieldId) {
        await integration.saveField({
          id: fieldId,
          sectionId: sectionId || "",
          type: FieldType.TEXTAREA,
          label: labelValue,
          placeholder: placeholderValue,
          minCharacters,
          minWords,
          required: isRequired,
        } as any);
        console.log("Textarea field saved via integration.saveField");
        return;
      }

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          console.log("Textarea field saved (simulated)!");
          resolve();
        }, 500);
      });
    } catch (err) {
      console.error("Error saving textarea field:", err);
      throw err;
    }
  };

  const previewContent = ({ isRequired }: { isRequired: boolean }) => (
    <>
      <LabelWithRequired isRequired={isRequired}>
        {labelValue || defaultValues.label}
      </LabelWithRequired>
      <Textarea
        className="border p-2 min-h-[100px]"
        placeholder={placeholderValue}
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
        <label className="block mb-1">Placeholder</label>
        <Input
          type="text"
          className="border p-2"
          value={placeholderValue}
          onChange={(e) => setPlaceholderValue(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1">Min Characters Required</label>
          <Input
            type="number"
            className="border p-2"
            value={minCharacters}
            min={0}
            onChange={(e) => setMinCharacters(parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <label className="block mb-1">Min Words Required</label>
          <Input
            type="number"
            className="border p-2"
            value={minWords}
            min={0}
            onChange={(e) => setMinWords(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
    </>
  );

  return (
    <FormComponentWrapper
      fieldId={fieldId}
      sectionId={sectionId}
      fieldType={FieldType.TEXTAREA}
      onSave={handleSave}
      onRequiredChange={setIsRequired}
      isRequired={isRequired}
      configurationContent={configurationContent}
    >
      {previewContent}
    </FormComponentWrapper>
  );
};

export default CustomTextArea;
