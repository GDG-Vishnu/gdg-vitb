import React from "react";
import type { RecruitmentRoleField } from "@/types/recruitment";

interface DynamicFieldProps {
  field: RecruitmentRoleField;
  register: any;
  error?: string;
  borderColor: string;
  fileName?: string;
  onFileChange?: (name: string) => void;
  disabled?: boolean;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
  field,
  register,
  error,
  borderColor,
  fileName,
  onFileChange,
  disabled = false,
}) => {
  const requiredMark = field.required ? (
    <span className="text-red-500 ml-1">*</span>
  ) : null;

  const helpText = field.helpText ? (
    <span className="text-xs text-gray-500 font-normal">({field.helpText})</span>
  ) : null;

  // ── Checkbox ────────────────────────────────────────────
  if (field.type === "checkbox") {
    return (
      <div
        className="border-2 rounded-3xl p-6"
        style={{ borderColor }}
      >
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            {...register}
            className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900">
            {field.checkboxLabel}
            {requiredMark}
          </span>
        </label>
        {error && <p className="mt-2 text-xs text-red-500 ml-8">{error}</p>}
      </div>
    );
  }

  // ── Select ──────────────────────────────────────────────
  if (field.type === "select") {
    return (
      <div
        className="border-2 rounded-3xl p-6"
        style={{ borderColor }}
      >
        <label className="block text-base font-semibold text-gray-900 mb-3">
          {field.label} {requiredMark}
        </label>
        <select
          {...register}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
        >
          {field.options?.map((opt: { label: string; value: string }) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  // ── File ────────────────────────────────────────────────
  if (field.type === "file") {
    const inputId = `file-${field.name}`;
    return (
      <div
        className="border-2 rounded-3xl p-6"
        style={{ borderColor }}
      >
        <label className="block text-base font-semibold text-gray-900 mb-3">
          {field.label} {requiredMark} {helpText}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            id={inputId}
            accept={field.accept}
            {...register}
            onChange={(e) => {
              register.onChange(e);
              const file = e.target.files?.[0];
              if (file) onFileChange?.(file.name);
            }}
            className="hidden"
          />
          <label
            htmlFor={inputId}
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="text-sm text-blue-600 font-medium">
              {fileName || "Choose file..."}
            </span>
          </label>
        </div>
        {error && <p className="mt-2 text-xs text-red-500">{String(error)}</p>}
      </div>
    );
  }

  // ── Text / Email / Tel / URL / Number ───────────────────
  return (
    <div
      className="border-2 rounded-3xl p-6"
      style={{ borderColor }}
    >
      <label className="block text-base font-semibold text-gray-900 mb-3">
        {field.label} {requiredMark}
      </label>
      <input
        type={field.type === "url" ? "url" : field.type}
        placeholder={field.placeholder}
        disabled={disabled}
        {...register}
        className={`w-full px-0 py-0 border-0 border-b focus:outline-none text-sm bg-transparent ${
          disabled
            ? "border-gray-200 text-gray-500 cursor-not-allowed bg-gray-50"
            : "border-gray-300 focus:border-gray-400 text-gray-600 placeholder:text-gray-400"
        }`}
      />
      {disabled && <p className="mt-1 text-xs text-gray-400">Auto-filled from your account</p>}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
};
