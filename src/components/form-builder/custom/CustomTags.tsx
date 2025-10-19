import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TagsInput } from "@/components/ui/extension/tags-input";
import { defaultFieldConfig, FormalNames } from "@/constants";
import { getFieldIcon } from "@/utils";
import { FieldType } from "@prisma/client";
import { Trash } from "lucide-react";
import React from "react";
import { useFormBuilderIntegration } from "../FormBuilderIntegration";
import FormComponentWrapper, {
  LabelWithRequired,
} from "../FormComponentWrapper";

const CustomTags = ({
  fieldId,
  sectionId,
}: {
  fieldId?: string;
  sectionId?: string;
}) => {
  const defaultValues = defaultFieldConfig[FieldType.TAGS];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [minTags, setMinTags] = React.useState(0);
  const [maxTags, setMaxTags] = React.useState(10);
  const [tags, setTags] = React.useState<string[]>([]);
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
        if (typeof (foundField as any).minTags === "number")
          setMinTags((foundField as any).minTags);
        if (typeof (foundField as any).maxTags === "number")
          setMaxTags((foundField as any).maxTags);
        if (Array.isArray((foundField as any).tags))
          setTags((foundField as any).tags);
        if (typeof (foundField as any).required === "boolean")
          setIsRequired((foundField as any).required);
      }
    } catch (err) {
      console.warn("Error hydrating tags field:", err);
    }
  }, [integration, fieldId]);

  const handleSave = async () => {
    try {
      if (integration && fieldId) {
        await integration.saveField({
          id: fieldId,
          sectionId: sectionId || "",
          type: FieldType.TAGS,
          label: labelValue,
          minTags,
          maxTags,
          tags,
          required: isRequired,
        } as any);
        return;
      }

      console.log("Save tags (simulated)", { label: labelValue, tags });
    } catch (err) {
      console.error("Error saving tags field:", err);
      throw err;
    }
  };

  const previewContent = ({ isRequired }: { isRequired: boolean }) => (
    <>
      <LabelWithRequired isRequired={isRequired}>
        {labelValue || defaultValues.label}
      </LabelWithRequired>
      <TagsInput
        value={tags}
        onValueChange={setTags}
        placeholder="Enter tags..."
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
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1">Min Tags</label>
          <Input
            type="number"
            className="border p-2"
            value={minTags}
            min={0}
            onChange={(e) => setMinTags(parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <label className="block mb-1">Max Tags</label>
          <Input
            type="number"
            className="border p-2"
            value={maxTags}
            min={1}
            onChange={(e) => setMaxTags(parseInt(e.target.value) || 10)}
          />
        </div>
      </div>
    </>
  );

  return (
    <FormComponentWrapper
      fieldId={fieldId}
      sectionId={sectionId}
      fieldType={FieldType.TAGS}
      onSave={handleSave}
      onRequiredChange={setIsRequired}
      isRequired={isRequired}
      configurationContent={configurationContent}
    >
      {previewContent}
    </FormComponentWrapper>
  );
};

export default CustomTags;
