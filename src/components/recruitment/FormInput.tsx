import React from "react";

interface FormInputProps {
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  type?: "text" | "email" | "tel" | "number";
  register?: any;
  className?: string;
  borderColor?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  error,
  required = false,
  type = "text",
  register,
  className = "",
  borderColor = "#E6452D",
}) => {
  return (
    <div
      className={`border-2 rounded-3xl p-6 ${className}`}
      style={{ borderColor }}
    >
      <label className="block text-base font-semibold text-gray-900 mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...register}
        className="w-full px-0 py-0 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-400 text-sm text-gray-600 placeholder:text-gray-400 bg-transparent"
      />
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
};
