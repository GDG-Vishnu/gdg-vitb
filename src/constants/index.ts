import { FieldType } from "@/types/form-builder";

export interface FieldTypeInfo {
  name: string;
  isNew: boolean;
  section: string;
  type: FormalFieldTypes;
}
import { FieldType as FormalFieldTypes } from "@prisma/client";

export const fieldTypes: FieldTypeInfo[] = [
  // Basic Input Components
  {
    name: "Input",
    isNew: false,
    section: "Basic Inputs",
    type: FormalFieldTypes.INPUT,
  },
  {
    name: "Email",
    isNew: false,
    section: "Basic Inputs",
    type: FormalFieldTypes.EMAIL,
  },
  {
    name: "Textarea",
    isNew: false,
    section: "Basic Inputs",
    type: FormalFieldTypes.TEXTAREA,
  },
  {
    name: "Password",
    isNew: false,
    section: "Basic Inputs",
    type: FormalFieldTypes.PASSWORD,
  },
  {
    name: "Phone",
    isNew: false,
    section: "Basic Inputs",
    type: FormalFieldTypes.PHONE,
  },

  // Selection Components
  {
    name: "Checkbox",
    isNew: false,
    section: "Selection",
    type: FormalFieldTypes.CHECKBOX,
  },
  {
    name: "Radio",
    isNew: false,
    section: "Selection",
    type: FormalFieldTypes.RADIO,
  },
  // { name: "RadioGroup", isNew: false, section: "Selection", type: FormalFieldTypes.RADIO_GROUP },
  {
    name: "Select",
    isNew: false,
    section: "Selection",
    type: FormalFieldTypes.SELECT,
  },
  {
    name: "Combobox",
    isNew: false,
    section: "Selection",
    type: FormalFieldTypes.COMBOBOX,
  },
  {
    name: "Multi Select",
    isNew: false,
    section: "Selection",
    type: FormalFieldTypes.MULTISELECT,
  },
  {
    name: "Switch",
    isNew: false,
    section: "Selection",
    type: FormalFieldTypes.SWITCH,
  },

  // Date & Time Components
  {
    name: "Date Picker",
    isNew: false,
    section: "Date & Time",
    type: FormalFieldTypes.DATE,
  },
  {
    name: "Datetime Picker",
    isNew: false,
    section: "Date & Time",
    type: FormalFieldTypes.DATETIME,
  },
  {
    name: "Smart Datetime Input",
    isNew: false,
    section: "Date & Time",
    type: FormalFieldTypes.SMART_DATETIME,
  },

  // Advanced Components
  {
    name: "File Input",
    isNew: false,
    section: "Advanced",
    type: FormalFieldTypes.FILE,
  },
  {
    name: "Input OTP",
    isNew: false,
    section: "Advanced",
    type: FormalFieldTypes.OTP,
  },
  {
    name: "Location Input",
    isNew: false,
    section: "Advanced",
    type: FormalFieldTypes.LOCATION,
  },
  {
    name: "Signature Input",
    isNew: false,
    section: "Advanced",
    type: FormalFieldTypes.SIGNATURE,
  },
  {
    name: "Slider",
    isNew: false,
    section: "Advanced",
    type: FormalFieldTypes.SLIDER,
  },
  {
    name: "Tags Input",
    isNew: false,
    section: "Advanced",
    type: FormalFieldTypes.TAGS,
  },
  // { name: "Rating", isNew: false, section: "Advanced", type: FormalFieldTypes.RATING },
  // { name: "Credit Card", isNew: false, section: "Advanced", type: FormalFieldTypes.CREDIT_CARD },
];

export const FormalNames: Record<string, string> = {
  [FormalFieldTypes.INPUT]: "Input",
  [FormalFieldTypes.EMAIL]: "Email",
  [FormalFieldTypes.TEXTAREA]: "Textarea",
  [FormalFieldTypes.PASSWORD]: "Password",
  [FormalFieldTypes.PHONE]: "Phone",
  [FormalFieldTypes.CHECKBOX]: "Checkbox",
  [FormalFieldTypes.RADIO]: "Radio",
  [FormalFieldTypes.SELECT]: "Select",
  [FormalFieldTypes.COMBOBOX]: "Combobox",
  [FormalFieldTypes.MULTISELECT]: "MultiSelect",
  [FormalFieldTypes.SWITCH]: "Switch",
  [FormalFieldTypes.DATE]: "Date",
  [FormalFieldTypes.DATETIME]: "Datetime",
  [FormalFieldTypes.SMART_DATETIME]: "Smart Datetime",
  [FormalFieldTypes.FILE]: "File",
  [FormalFieldTypes.OTP]: "OTP",
  [FormalFieldTypes.LOCATION]: "Location",
  [FormalFieldTypes.SIGNATURE]: "Signature",
  [FormalFieldTypes.SLIDER]: "Slider",
  [FormalFieldTypes.TAGS]: "Tags",
  // [FormalFieldTypes.s]: "Rating",
  // [FormalFieldTypes.CREDIT_CARD]: "CreditCard",
};

export const defaultFieldConfig: Record<
  string,
  { label: string; description: string; placeholder?: string }
> = {
  [FormalFieldTypes.CHECKBOX]: {
    label: "Use different settings for my mobile devices",
    description:
      "You can manage your mobile notifications in the mobile settings page.",
  },
  [FormalFieldTypes.COMBOBOX]: {
    label: "Language",
    description: "This is the language that will be used in the dashboard.",
  },
  [FormalFieldTypes.DATE]: {
    label: "Date of birth",
    description: "Your date of birth is used to calculate your age.",
  },
  [FormalFieldTypes.DATETIME]: {
    label: "Submission Date",
    description: "Add the date of submission with detailly.",
  },
  [FormalFieldTypes.FILE]: {
    label: "Select File",
    description: "Select a file to upload.",
  },
  [FormalFieldTypes.INPUT]: {
    label: "Username",
    description: "This is your public display name.",
    placeholder: "@username",
  },
  [FormalFieldTypes.EMAIL]: {
    label: "Email Address",
    description: "Enter a valid email address.",
    placeholder: "name@example.com",
  },
  [FormalFieldTypes.OTP]: {
    label: "One-Time Password",
    description: "Please enter the one-time password sent to your phone.",
  },
  [FormalFieldTypes.LOCATION]: {
    label: "Select Country",
    description:
      "If your country has states, it will be appear after selecting country",
  },
  [FormalFieldTypes.MULTISELECT]: {
    label: "Select your framework",
    description: "Select multiple options.",
  },
  [FormalFieldTypes.SELECT]: {
    label: "Email",
    description: "You can manage email addresses in your email settings.",
    placeholder: "Select a verified email to display",
  },
  [FormalFieldTypes.SLIDER]: {
    label: "Set Price Range",
    description: "Adjust the price by sliding.",
  },
  [FormalFieldTypes.SIGNATURE]: {
    label: "Sign here",
    description: "Please provide your signature above",
  },
  [FormalFieldTypes.SMART_DATETIME]: {
    label: "What's the best time for you?",
    description: "Please select the full time",
  },
  [FormalFieldTypes.SWITCH]: {
    label: "Marketing emails",
    description: "Receive emails about new products, features, and more.",
  },
  [FormalFieldTypes.TAGS]: {
    label: "Enter your tech stack.",
    description: "Add tags.",
  },
  [FormalFieldTypes.TEXTAREA]: {
    label: "Bio",
    description: "You can @mention other users and organizations.",
  },
  [FormalFieldTypes.PASSWORD]: {
    label: "Password",
    description: "Enter your password.",
  },
  [FormalFieldTypes.PHONE]: {
    label: "Phone number",
    description: "Enter your phone number.",
  },
  // [FormalFieldTypes.RATING]: {
  //   label: "Rating",
  //   description: "Please provide your rating.",
  // },
  [FormalFieldTypes.RADIO]: {
    label: "Gender",
    description: "Select your gender",
  },
  // [FormalFieldTypes.CREDIT_CARD]: {
  //   label: "Credit Card Information",
  //   description: "Enter your credit card details for payment.",
  // },
};
