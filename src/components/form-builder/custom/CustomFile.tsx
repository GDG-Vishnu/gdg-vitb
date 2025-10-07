import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileUploader,
  FileInput,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/extension/file-input";
import { defaultFieldConfig } from "@/constants";
import { FieldType } from "@prisma/client";
import { CloudUpload, Paperclip } from "lucide-react";
import React from "react";
import FormComponentWrapper from "../FormComponentWrapper";
import { useFormBuilderIntegration } from "../FormBuilderIntegration";

interface CustomFileProps {
  fieldId?: string;
  sectionId?: string;
}

const CustomFile: React.FC<CustomFileProps> = ({ fieldId, sectionId }) => {
  const defaultValues = defaultFieldConfig[FieldType.FILE];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [files, setFiles] = React.useState<File[] | null>(null);
  const [acceptedFormats, setAcceptedFormats] = React.useState<string[]>([]);
  const [maxFileSize, setMaxFileSize] = React.useState(10);
  const [maxFiles, setMaxFiles] = React.useState(1);
  const [isRequired, setIsRequired] = React.useState(false);

  const fileFormats = [
    {
      id: "image",
      label: "Images (jpg, png, gif)",
      value: ".jpg,.jpeg,.png,.gif",
    },
    {
      id: "document",
      label: "Documents (pdf, doc, docx)",
      value: ".pdf,.doc,.docx",
    },
    { id: "video", label: "Videos (mp4, avi, mov)", value: ".mp4,.avi,.mov" },
    { id: "audio", label: "Audio (mp3, wav, m4a)", value: ".mp3,.wav,.m4a" },
  ];

  const handleFormatChange = (formatId: string, checked: boolean) => {
    const format = fileFormats.find((f) => f.id === formatId);
    if (!format) return;

    if (checked) {
      setAcceptedFormats([...acceptedFormats, format.value]);
    } else {
      setAcceptedFormats(acceptedFormats.filter((f) => f !== format.value));
    }
  };

  // Attempt to get integration context at top-level
  let integration = null as ReturnType<typeof useFormBuilderIntegration> | null;
  try {
    integration = useFormBuilderIntegration();
  } catch {
    integration = null;
  }

  // hydrate from integration.formData when available
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
        if (Array.isArray(foundField.acceptedFormats))
          setAcceptedFormats(foundField.acceptedFormats);
        if (typeof foundField.maxFileSize === "number")
          setMaxFileSize(foundField.maxFileSize);
        if (typeof foundField.maxFiles === "number")
          setMaxFiles(foundField.maxFiles);
        if (typeof foundField.required === "boolean")
          setIsRequired(foundField.required);
      }
    } catch (err) {
      console.warn("Error hydrating file field:", err);
    }
  }, [integration, fieldId]);

  const handleSave = async (): Promise<void> => {
    const fieldData = {
      fieldId,
      sectionId,
      type: FieldType.FILE,
      label: labelValue,
      acceptedFormats,
      maxFileSize,
      maxFiles,
      required: isRequired,
    };

    console.log("Saving file configuration:", fieldData);

    try {
      if (integration && fieldId) {
        await integration.saveField({
          id: fieldId,
          sectionId: sectionId || "",
          type: FieldType.FILE,
          label: labelValue,
          acceptedFormats,
          maxFileSize,
          maxFiles,
          required: isRequired,
        } as any);
        console.log("File field saved via integration.saveField");
        return;
      }

      // Fallback simulated save
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          console.log("File field saved (simulated)!");
          resolve();
        }, 500);
      });
    } catch (err) {
      console.error("Error saving file field:", err);
      throw err;
    }
  };

  const dropZoneConfig = {
    multiple: maxFiles > 1,
    maxFiles: maxFiles,
    maxSize: maxFileSize * 1024 * 1024, // Convert MB to bytes
  };

  const previewContent = (
    <>
      <label className="block mb-1">{labelValue || defaultValues.label}</label>
      <FileUploader
        value={files}
        onValueChange={setFiles}
        dropzoneOptions={dropZoneConfig}
        className="relative bg-background rounded-lg p-2"
      >
        <FileInput className="outline-dashed outline-1 outline-slate-500">
          <div className="flex items-center justify-center flex-col p-8 w-full ">
            <CloudUpload className="text-gray-500 w-10 h-10" />
            <p className="mb-1 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span>
              &nbsp; or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              {acceptedFormats.length > 0
                ? `Accepted formats: ${acceptedFormats.join(", ")}`
                : "All file types accepted"}
            </p>
            <p className="text-xs text-gray-500">
              Max {maxFileSize}MB, {maxFiles} file{maxFiles > 1 ? "s" : ""}
            </p>
          </div>
        </FileInput>
        <FileUploaderContent>
          {files &&
            files.length > 0 &&
            files.map((file, i) => (
              <FileUploaderItem key={i} index={i}>
                <Paperclip className="h-4 w-4 stroke-current" />
                <span>{file.name}</span>
              </FileUploaderItem>
            ))}
        </FileUploaderContent>
      </FileUploader>
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
        <label className="block mb-2">Accepted File Formats</label>
        <div className="space-y-2">
          {fileFormats.map((format) => (
            <div key={format.id} className="flex items-center space-x-2">
              <Checkbox
                id={format.id}
                checked={acceptedFormats.includes(format.value)}
                onCheckedChange={(checked) =>
                  handleFormatChange(format.id, checked as boolean)
                }
              />
              <label htmlFor={format.id} className="text-sm">
                {format.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1">Max File Size (MB)</label>
          <Input
            type="number"
            className="border p-2"
            value={maxFileSize}
            onChange={(e) => setMaxFileSize(Number(e.target.value))}
            min={1}
          />
        </div>
        <div>
          <label className="block mb-1">Max Files</label>
          <Input
            type="number"
            className="border p-2"
            value={maxFiles}
            onChange={(e) => setMaxFiles(Number(e.target.value))}
            min={1}
          />
        </div>
      </div>
    </>
  );

  return (
    <FormComponentWrapper
      fieldId={fieldId}
      sectionId={sectionId}
      fieldType={FieldType.FILE}
      onSave={handleSave}
      onRequiredChange={setIsRequired}
      isRequired={isRequired}
      configurationContent={configurationContent}
    >
      {previewContent}
    </FormComponentWrapper>
  );
};

export default CustomFile;
