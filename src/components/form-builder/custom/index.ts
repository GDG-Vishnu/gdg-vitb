import CustomCheckbox from "./CustomCheckbox";
import CustomTextArea from "./CustomTextArea";
import CustomInput from "./CustomInput";
import CustomPassword from "./CustomPassword";
import CustomPhone from "./CustomPhone";
import CustomRadio from "./CustomRadio";
import CustomSelect from "./CustomSelect";
import CustomCombobox from "./CustomCombobox";
import CustomMultiSelect from "./CustomMultiSelect";
import CustomSwitch from "./CustomSwitch";
import CustomDate from "./CustomDate";
import CustomDateTime from "./CustomDateTime";
import CustomSmartDateTime from "./CustomSmartDateTime";
import CustomFile from "./CustomFile";
import CustomLocation from "./CustomLocation";
import CustomSignature from "./CustomSignature";
import CustomSlider from "./CustomSlider";
import CustomTags from "./CustomTags";
import CustomOtp from "./CustomOtp";
import CustomEmail from "./CustomEmail";

interface CustomComponentProps {
  fieldId?: string;
  sectionId?: string;
}

const CustomComponents: Record<string, React.FC<CustomComponentProps>> = {
  Checkbox: CustomCheckbox,
  TextArea: CustomTextArea,
  Input: CustomInput,
  Email: CustomEmail,
  Password: CustomPassword,
  Phone: CustomPhone,
  Radio: CustomRadio,
  Select: CustomSelect,
  Combobox: CustomCombobox,
  MultiSelect: CustomMultiSelect,
  Switch: CustomSwitch,
  Date: CustomDate,
  DateTime: CustomDateTime,
  SmartDateTime: CustomSmartDateTime,
  File: CustomFile,
  Location: CustomLocation,
  Signature: CustomSignature,
  Slider: CustomSlider,
  Tags: CustomTags,
  Otp: CustomOtp,
};

export default CustomComponents;
