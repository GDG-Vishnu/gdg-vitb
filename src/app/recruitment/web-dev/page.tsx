"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import Image from "next/image";
import { FormInput } from "@/components/recruitment/FormInput";

// Google Apps Script URL
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx8T4nEBt3vcO9Ae2qS31E2r0ZQGqiRiDY9_O2gmKqcEsxTjdtto3DEYe4FUAOhZ7O59g/exec";

// Theme colors hashmap
const themeColors = {
  red: "#E6452D",
  green: "#33A854",
  yellow: "#F1AE08",
  blue: "#4584F4",
};

// Get random color from theme
const getRandomColor = () => {
  const colors = Object.values(themeColors);
  return colors[Math.floor(Math.random() * colors.length)];
};

const formSchema = z.object({
  // Section 1: Introduction & Links
  fullName: z.string().min(1, "Full name is required"),
  email: z
    .string()
    .email("Invalid email address")
    .refine(
      (email) => email.endsWith("@vishnu.edu.in"),
      "Email must end with @vishnu.edu.in",
    ),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  yearOfStudy: z.string().min(1, "Year of study is required"),
  branch: z.string().min(1, "Branch is required"),
  linkedinUrl: z.string().optional(),
  githubUrl: z
    .string()
    .min(1, "GitHub profile URL is required")
    .url("Please enter a valid URL"),
  portfolioUrl: z.string().optional(),
  resume: z
    .any()
    .refine((files) => files?.length > 0, "Resume is required")
    .refine(
      (files) => files?.[0]?.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB",
    ),

  // Section 2: Task & Declaration
  taskSubmission: z
    .any()
    .refine((files) => files?.length > 0, "Task submission is required")
    .refine(
      (files) => files?.[0]?.size <= 10 * 1024 * 1024,
      "File size must be less than 10MB",
    )
    .refine(
      (files) =>
        files?.[0]?.name.endsWith(".docx") || files?.[0]?.name.endsWith(".doc"),
      "Only .docx or .doc files are allowed",
    ),

  gitRepoLink: z
    .string()
    .min(1, "Git repository link is required")
    .url("Please enter a valid URL"),

  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  confirmInfo: z.boolean().refine((val) => val === true, {
    message: "You must confirm the accuracy of information",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function WebDevRecruitmentPage() {
  const [resumeFileName, setResumeFileName] = useState<string>("");
  const [taskFileName, setTaskFileName] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState<string>("");
  const [inputColors] = useState({
    fullName: getRandomColor(),
    email: getRandomColor(),
    phone: getRandomColor(),
    yearOfStudy: getRandomColor(),
    branch: getRandomColor(),
    linkedinUrl: getRandomColor(),
    githubUrl: getRandomColor(),
    portfolioUrl: getRandomColor(),
    resume: getRandomColor(),
    taskSubmission: getRandomColor(),
    gitRepoLink: getRandomColor(),
    declaration: getRandomColor(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const fileToBase64 = (file: File): Promise<string> => {
    console.log(
      "[FileToBase64] Starting conversion for file:",
      file.name,
      "Size:",
      file.size,
    );
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        console.log(
          "[FileToBase64] Conversion complete for:",
          file.name,
          "Base64 length:",
          base64.length,
        );
        resolve(base64);
      };
      reader.onerror = (error) => {
        console.error(
          "[FileToBase64] Error converting file:",
          file.name,
          error,
        );
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data: FormData) => {
    console.log("[OnSubmit] Form submission started");
    console.log("[OnSubmit] Form data received:", {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      yearOfStudy: data.yearOfStudy,
      branch: data.branch,
      hasResume: !!data.resume?.[0],
      hasTask: !!data.taskSubmission?.[0],
    });
    try {
      setIsSubmitting(true);
      setSubmitError("");
      setSubmitSuccess("");

      // Convert files to base64
      console.log("[OnSubmit] Extracting files from form data");
      const resumeFile = data.resume[0];
      const taskFile = data.taskSubmission[0];
      console.log(
        "[OnSubmit] Resume file:",
        resumeFile?.name,
        resumeFile?.size,
      );
      console.log("[OnSubmit] Task file:", taskFile?.name, taskFile?.size);

      console.log("[OnSubmit] Starting file conversion to base64");
      const resumeBase64 = await fileToBase64(resumeFile);
      console.log("[OnSubmit] Resume converted successfully");
      const taskBase64 = await fileToBase64(taskFile);
      console.log("[OnSubmit] Task converted successfully");

      console.log("[OnSubmit] Building payload object");
      const payload = {
        // Step 1 - Personal Information
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        yearOfStudy: data.yearOfStudy,
        branch: data.branch,

        // Step 1 - Optional URLs
        linkedinUrl: data.linkedinUrl || "",
        githubUrl: data.githubUrl || "",
        portfolioUrl: data.portfolioUrl || "",

        // Step 1 - Resume Upload
        resume: {
          data: resumeBase64,
          mimeType: resumeFile.type,
        },

        // Step 2 - Task Submission
        taskSubmission: {
          data: taskBase64,
          mimeType: taskFile.type,
        },
        gitRepoLink: data.gitRepoLink || "",

        // Step 2 - Confirmations
        agreeToTerms: data.agreeToTerms,
        confirmInfo: data.confirmInfo,
      };
      console.log("[OnSubmit] Payload created (files truncated for logging):", {
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        yearOfStudy: payload.yearOfStudy,
        branch: payload.branch,
        linkedinUrl: payload.linkedinUrl,
        githubUrl: payload.githubUrl,
        portfolioUrl: payload.portfolioUrl,
        resume: {
          mimeType: payload.resume.mimeType,
          dataLength: payload.resume.data.length,
        },
        taskSubmission: {
          mimeType: payload.taskSubmission.mimeType,
          dataLength: payload.taskSubmission.data.length,
        },
        gitRepoLink: payload.gitRepoLink,
        agreeToTerms: payload.agreeToTerms,
        confirmInfo: payload.confirmInfo,
      });

      console.log("[OnSubmit] Sending request to Apps Script");
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // With no-cors mode, we can't read the response
      // So we assume success if no error was thrown
      console.log("[OnSubmit] Request sent successfully (no-cors mode)");
      setSubmitSuccess("Form submitted successfully!");
      setTimeout(() => {
        setShowSuccessDialog(true);
        setSubmitSuccess("");
      }, 1500);
    } catch (error) {
      console.error("[OnSubmit] Submission error:", error);
      console.error(
        "[OnSubmit] Error stack:",
        error instanceof Error ? error.stack : "No stack trace",
      );
      setSubmitError(
        "An error occurred while submitting the form. Please try again.",
      );
    } finally {
      console.log("[OnSubmit] Submission complete, resetting state");
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    reset();
    setResumeFileName("");
    setTaskFileName("");
    setCurrentStep(1);
  };

  const handleCloseDialog = () => {
    setShowSuccessDialog(false);
    reset();
    setResumeFileName("");
    setTaskFileName("");
    setCurrentStep(1);
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = [
        "fullName",
        "email",
        "phone",
        "yearOfStudy",
        "branch",
        "githubUrl",
        "resume",
      ];
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 2));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Wavy Top Border */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-blue-500 overflow-hidden">
              <svg
                viewBox="0 0 400 30"
                className="w-full h-8"
                preserveAspectRatio="none"
              >
                <defs>
                  <pattern
                    id="wave-pattern"
                    x="0"
                    y="0"
                    width="20"
                    height="30"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="10" cy="0" r="10" fill="#EF4444" />
                  </pattern>
                </defs>
                <rect width="400" height="30" fill="url(#wave-pattern)" />
              </svg>
            </div>

            {/* Blue Background Section */}
            <div className="bg-blue-500 pt-12 pb-8 px-8 relative">
              {/* Registration Confirmed Badge */}
              <div className="absolute top-8 right-6 bg-yellow-400 rounded-full w-32 h-32 flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <p className="text-black font-bold text-sm leading-tight">
                    Application
                    <br />
                    Submitted
                  </p>
                </div>
              </div>

              {/* Main Text */}
              <div className="pr-20">
                <h3 className="text-2xl font-bold text-black mb-4">
                  APPLICATION
                  <br />
                  SUBMITTED!
                </h3>
                <h2 className="text-4xl font-black text-white leading-tight">
                  WE WILL
                  <br />
                  GET BACK
                  <br />
                  TO YOU!
                </h2>
              </div>
            </div>

            {/* White Bottom Section */}
            <div className="bg-white px-8 py-10">
              <button
                onClick={handleCloseDialog}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl">
        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
            <Image
              src="/favicon.ico"
              alt="GDG Logo"
              width={128}
              height={128}
              className="w-32 h-32 rounded-full"
            />
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Google Developer Group
              </h2>
              <p className="text-xs text-gray-500">
                Vishnu Institute of Technology
              </p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-blue-600">Full Stack Web Development</span>
            <span className="text-gray-400"> - </span>
            <span className="text-red-500">Hiring</span>
          </h1>

          <p className="text-sm text-gray-600 mb-8">
            Welcome to{" "}
            <strong>GDG VITB Full Stack Web Development Recruitment</strong>
            <br />
            This form will help us evaluate your application for the Full Stack
            Developer position. Please fill in your details carefully and ensure
            all information is accurate.
          </p>

          {/* Task Download Section */}
          <div className="mb-8">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">
                    Download Assignment Task
                  </h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Before proceeding with the form, please download the assignment task template. Complete the assignment and you'll upload it in Section 2.
                  </p>
                  <a
                    href="/assignment-task.docx"
                    download="GDG-Assignment-Task.docx"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <svg
                      className="w-4 h-4"
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
                    Download Task Template (.docx)
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      currentStep >= step
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 2 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStep > step ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* SECTION 1: Introduction & Links */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2">
                  Section 1: Introduction & Links
                </h2>

                <FormInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  required
                  register={register("fullName")}
                  error={errors.fullName?.message}
                  borderColor={inputColors.fullName}
                />

                <FormInput
                  label="College Email"
                  placeholder="regdnumber@vishnu.edu.in"
                  type="email"
                  required
                  register={register("email")}
                  error={errors.email?.message}
                  borderColor={inputColors.email}
                />

                <FormInput
                  label="Phone Number"
                  placeholder="+91 XXXXX XXXXX"
                  type="tel"
                  required
                  register={register("phone")}
                  error={errors.phone?.message}
                  borderColor={inputColors.phone}
                />

                {/* Year of Study Dropdown */}
                <div
                  className="border-2 rounded-3xl p-6"
                  style={{ borderColor: inputColors.yearOfStudy }}
                >
                  <label className="block text-base font-semibold text-gray-900 mb-3">
                    Year of Study <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("yearOfStudy")}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">Select Year of Study</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                  </select>
                  {errors.yearOfStudy && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.yearOfStudy.message}
                    </p>
                  )}
                </div>

                {/* Branch Dropdown */}
                <div
                  className="border-2 rounded-3xl p-6"
                  style={{ borderColor: inputColors.branch }}
                >
                  <label className="block text-base font-semibold text-gray-900 mb-3">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("branch")}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">Select Branch</option>
                    <option value="CSE">CSE</option>
                    <option value="AI&ML">AI&ML</option>
                    <option value="AI&DS">AI&DS</option>
                    <option value="CSBS">CSBS</option>
                    <option value="IT">IT</option>
                  </select>
                  {errors.branch && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.branch.message}
                    </p>
                  )}
                </div>

                <FormInput
                  label="LinkedIn Profile URL"
                  placeholder="https://linkedin.com/in/yourprofile"
                  register={register("linkedinUrl")}
                  error={errors.linkedinUrl?.message}
                  borderColor={inputColors.linkedinUrl}
                />

                <FormInput
                  label="GitHub Profile URL"
                  placeholder="https://github.com/yourusername"
                  required
                  register={register("githubUrl")}
                  error={errors.githubUrl?.message}
                  borderColor={inputColors.githubUrl}
                />

                <FormInput
                  label="Portfolio Website"
                  placeholder="https://yourportfolio.com"
                  register={register("portfolioUrl")}
                  error={errors.portfolioUrl?.message}
                  borderColor={inputColors.portfolioUrl}
                />

                {/* Resume Upload */}
                <div
                  className="border-2 rounded-3xl p-6"
                  style={{ borderColor: inputColors.resume }}
                >
                  <label className="block text-base font-semibold text-gray-900 mb-3">
                    Upload Resume <span className="text-red-500">*</span>{" "}
                    <span className="text-xs text-gray-500 font-normal">
                      ( PDF format, up to 5MB )
                    </span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf,.doc,.docx"
                      {...register("resume", {
                        onChange: (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setResumeFileName(file.name);
                          }
                        },
                      })}
                      className="hidden"
                    />
                    <label
                      htmlFor="resume"
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
                        {resumeFileName || "Upload Resume"}
                      </span>
                    </label>
                  </div>
                  {errors.resume && (
                    <p className="mt-2 text-xs text-red-500">
                      {String(errors.resume.message)}
                    </p>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-8 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 2: Task Submission & Declaration */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 border-b-2 border-yellow-600 pb-2">
                  Section 2: Task Submission & Declaration
                </h2>

                {/* Task Submission */}
                <div
                  className="border-2 rounded-3xl p-6 bg-blue-50"
                  style={{ borderColor: inputColors.taskSubmission }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Assignment Task
                    <span className="text-red-500 ml-1">*</span>
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Please download the task template, complete the assignment,
                    and upload your completed document below in
                    NAME_REGDNUMBER.docx. format
                  </p>

                  {/* Download Template Link */}
                  <div className="mb-4">
                    <a
                      href="/assignment-task.docx"
                      download="GDG-Assignment-Task.docx"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Download Task Template
                    </a>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Upload Completed Task (NAME_REGDNUMBER.docx )
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <label
                        className="flex-1 cursor-pointer"
                        style={{
                          borderColor: inputColors.taskSubmission,
                          borderWidth: "2px",
                          borderStyle: "solid",
                          borderRadius: "1.5rem",
                        }}
                      >
                        <div className="flex items-center gap-3 px-4 py-3">
                          <svg
                            className="w-6 h-6 text-gray-400"
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
                          <span className="text-sm text-gray-600">
                            {taskFileName || "Choose file..."}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept=".doc,.docx,.pdf"
                          {...register("taskSubmission", {
                            onChange: (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setTaskFileName(file.name);
                              }
                            },
                          })}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {errors.taskSubmission && (
                      <p className="mt-2 text-xs text-red-500">
                        {String(errors.taskSubmission.message)}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      Maximum file size: 10MB. Allowed formats: .docx, .doc
                    </p>
                  </div>
                </div>

                {/* Git Repository Link */}
                <FormInput
                  label="Git Repository Link (Assignment)"
                  placeholder="https://github.com/yourusername/assignment-repo"
                  type="text"
                  required
                  register={register("gitRepoLink")}
                  error={errors.gitRepoLink?.message}
                  borderColor={inputColors.gitRepoLink}
                />

                {/* Declaration */}
                <div
                  className="border-2 rounded-3xl p-6"
                  style={{ borderColor: inputColors.declaration }}
                >
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        {...register("agreeToTerms")}
                        className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        I agree to the terms and conditions of the recruitment
                        process and understand that any false information may
                        lead to disqualification.
                        <span className="text-red-500 ml-1">*</span>
                      </span>
                    </label>
                    {errors.agreeToTerms && (
                      <p className="text-xs text-red-500 ml-8">
                        {errors.agreeToTerms.message}
                      </p>
                    )}

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        {...register("confirmInfo")}
                        className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        I confirm that all the information provided in this form
                        is accurate and complete to the best of my knowledge.
                        <span className="text-red-500 ml-1">*</span>
                      </span>
                    </label>
                    {errors.confirmInfo && (
                      <p className="text-xs text-red-500 ml-8">
                        {errors.confirmInfo.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Success Message */}
                {submitSuccess && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {submitSuccess}
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {submitError && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-600 font-medium flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {submitError}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-8 py-3 bg-gray-200 text-gray-700 text-base font-semibold rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    ← Previous
                  </button>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleClearForm}
                      className="text-base text-red-600 hover:text-red-700 font-semibold hover:underline"
                    >
                      Clear Form
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
