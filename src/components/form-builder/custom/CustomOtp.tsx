import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { defaultFieldConfig, FormalNames } from "@/constants";
import { getFieldIcon } from "@/utils";
import { FieldType } from "@prisma/client";
import { Trash } from "lucide-react";
import React from "react";
import { useFormBuilderIntegration } from "../FormBuilderIntegration";
import FormComponentWrapper, {
  LabelWithRequired,
} from "../FormComponentWrapper";

const CustomOtp = ({
  fieldId,
  sectionId,
}: {
  fieldId?: string;
  sectionId?: string;
}) => {
  const defaultValues = defaultFieldConfig[FieldType.OTP];
  const [labelValue, setLabelValue] = React.useState(defaultValues.label);
  const [otpLength, setOtpLength] = React.useState(6);
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
        if (typeof (foundField as any).otpLength === "number")
          setOtpLength((foundField as any).otpLength);
        if (typeof (foundField as any).required === "boolean")
          setIsRequired((foundField as any).required);
      }
    } catch (err) {
      console.warn("Error hydrating otp field:", err);
    }
  }, [integration, fieldId]);

  const handleSave = async () => {
    try {
      if (integration && fieldId) {
        await integration.saveField({
          id: fieldId,
          sectionId: sectionId || "",
          type: FieldType.OTP,
          label: labelValue,
          otpLength,
          required: isRequired,
        } as any);
        return;
      }

      // Fallback simulated save
      console.log("Save OTP (simulated)", {
        label: labelValue,
        otpLength,
        required: isRequired,
      });
    } catch (err) {
      console.error("Error saving OTP field:", err);
      throw err;
    }
  };

  const previewContent = ({ isRequired }: { isRequired: boolean }) => (
    <>
      <LabelWithRequired isRequired={isRequired}>
        {labelValue || defaultValues.label}
      </LabelWithRequired>
      <InputOTP maxLength={otpLength}>
        <InputOTPGroup>
          {Array.from({ length: otpLength }, (_, i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>
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
        <label className="block mb-1">OTP Length</label>
        <Input
          type="number"
          className="border p-2"
          value={otpLength}
          min={4}
          max={8}
          onChange={(e) => setOtpLength(parseInt(e.target.value) || 6)}
        />
      </div>
    </>
  );

  return (
    <FormComponentWrapper
      fieldId={fieldId}
      sectionId={sectionId}
      fieldType={FieldType.OTP}
      onSave={handleSave}
      onRequiredChange={setIsRequired}
      isRequired={isRequired}
      configurationContent={configurationContent}
    >
      {previewContent}
    </FormComponentWrapper>
  );
};

export default CustomOtp;
