"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { DynamicField } from "@/components/recruitment/FormInput";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase-client";
import { useRole, useSettings } from "@/lib/recruitment/hooks";
import { uploadFile } from "@/lib/recruitment/upload";
import { submitApplication, hasAlreadyApplied } from "@/lib/recruitment/submit";
import { sendConfirmationEmail } from "@/lib/recruitment/email";
import { buildFormSchema, ALL_RESERVED_FIELDS } from "@/types/recruitment";
import type { RecruitmentRoleField } from "@/types/recruitment";

const themeColors = ["#E6452D", "#33A854", "#F1AE08", "#4584F4"];
const getRandomColor = () =>
  themeColors[Math.floor(Math.random() * themeColors.length)];

export default function RecruitmentRolePage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params.roleId as string;
  const { firebaseUser, userProfile } = useAuth();
  const { role, loading: loadingRole } = useRole(roleId);
  const { settings, ready: settingsReady } = useSettings();

  console.log("[RecruitmentRolePage] Render", { roleId, hasUser: !!firebaseUser, hasRole: !!role, loadingRole, settingsReady });

  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [checkingDuplicate, setCheckingDuplicate] = useState(true);

  const formSchema = useMemo(() => {
    if (!role) return z.object({});
    return buildFormSchema(role.fields);
  }, [role]);

  type FormData = z.infer<typeof formSchema>;

  const [inputColors, setInputColors] = useState<Record<string, string>>({});
  const [lockedFields, setLockedFields] = useState<Set<string>>(new Set());

  useMemo(() => {
    if (role) {
      const colors: Record<string, string> = {};
      for (const f of role.fields) colors[f.name] = getRandomColor();
      setInputColors(colors);
    }
  }, [role]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const maxSection = role ? Math.max(...role.sections.map((s) => s.number)) : 1;
  const fieldsForStep = (step: number): RecruitmentRoleField[] =>
    role?.fields.filter((f) => f.section === step) ?? [];

  useEffect(() => {
    console.log("[Prefill] Running prefill effect");
    console.log("[Prefill] firebaseUser:", firebaseUser ? { uid: firebaseUser.uid, email: firebaseUser.email, displayName: firebaseUser.displayName } : null);
    console.log("[Prefill] userProfile:", userProfile ? { name: userProfile.name, phoneNumber: userProfile.phoneNumber } : null);
    console.log("[Prefill] role.fields:", role?.fields?.map(f => f.name));

    if (!firebaseUser || !role) {
      console.log("[Prefill] Skipped — missing", !firebaseUser ? "firebaseUser" : "role");
      return;
    }

    const prefill: Record<string, string> = {};
    const locked = new Set<string>();
    const skipped: string[] = [];

    const name = userProfile?.name || firebaseUser.displayName;
    console.log("[Prefill] Resolved name:", name ?? "(empty)");

    role.fields.forEach((field) => {
      const nameLower = field.name.toLowerCase();

      if (nameLower === "fullname" || nameLower === "full_name" || nameLower === "name") {
        if (name) {
          prefill[field.name] = name;
          locked.add(field.name);
          console.log(`[Prefill] Matched name field "${field.name}" → "${name}"`);
        } else {
          skipped.push(`${field.name} (no name value available)`);
          console.log(`[Prefill] Skipped name field "${field.name}" — no name value`);
        }
      }

      if (nameLower === "email") {
        if (firebaseUser.email) {
          prefill[field.name] = firebaseUser.email;
          locked.add(field.name);
          console.log(`[Prefill] Matched email field "${field.name}" → "${firebaseUser.email}"`);
        } else {
          skipped.push(`${field.name} (no email on auth user)`);
          console.log(`[Prefill] Skipped email field "${field.name}" — no email`);
        }
      }
    });

    if (Object.keys(prefill).length === 0) {
      console.log("[Prefill] No fields matched. Skipped:", skipped.length ? skipped.join(", ") : "none — field names don't match");
      return;
    }

    console.log("[Prefill] Setting locked fields:", Array.from(locked));
    setLockedFields(locked);

    // Delay setValue to ensure react-hook-form has registered all fields from the schema
    const timer = setTimeout(() => {
      for (const [fieldName, value] of Object.entries(prefill)) {
        try {
          (setValue as any)(fieldName, value, { shouldValidate: false, shouldDirty: false });
          console.log(`[Prefill] setValue("${fieldName}") → OK`);
        } catch (err) {
          console.error(`[Prefill] setValue("${fieldName}") → FAILED:`, err);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [role, setValue, firebaseUser, userProfile]);

  // ── Auto-redirect after success dialog ───────────────────
  useEffect(() => {
    if (showSuccessDialog) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessDialog, router]);

  // ── Check if user already applied ────────────────────────
  useEffect(() => {
    if (!firebaseUser || !roleId) {
      setCheckingDuplicate(false);
      return;
    }
    hasAlreadyApplied(roleId).then((applied) => {
      setAlreadyApplied(applied);
      setCheckingDuplicate(false);
    });
  }, [firebaseUser, roleId]);

  const onSubmit = async (data: FormData) => {
    if (!role || !settings) return;

    // Auth check only at submit time
    if (!firebaseUser) {
      setSubmitError("Please sign in with your @vishnu.edu.in account to submit your application.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      if (!settings.isRecruitmentActive) {
        setSubmitError(settings.globalMessage || "Recruitment is not currently active.");
        return;
      }

      const email = firebaseUser.email ?? "";
      if (!email.endsWith(settings.allowedEmailDomain)) {
        setSubmitError(`Only ${settings.allowedEmailDomain} email addresses are allowed.`);
        return;
      }

      if (role.applicationEnd && new Date() > new Date(role.applicationEnd)) {
        setSubmitError("Application deadline has passed.");
        return;
      }

      const dataRecord = data as Record<string, unknown>;
      const filesData: Record<string, unknown> = {};

      // Handle all dynamic file fields
      for (const field of role.fields) {
        if (field.type === "file") {
          const fileList = dataRecord[field.name] as FileList | undefined;
          console.log(`[Upload Debug] Field ${field.name} value:`, dataRecord[field.name]);
          console.log(`[Upload Debug] Is FileList?`, fileList instanceof FileList, "Length:", fileList?.length);
          
          if (fileList && fileList.length > 0) {
            const result = await uploadFile(fileList[0], role.scriptUrl, role.driveFolderId);
            filesData[field.name] = {
              url: result.url,
              driveFileId: result.driveFileId,
              originalName: result.originalName,
              mimeType: result.mimeType,
              sizeBytes: result.sizeBytes,
            };
          } else {
            console.log(`[Upload Debug] Skipping upload for ${field.name} - fileList empty or undefined`);
          }
        }
      }

      const applicant: Record<string, string> = {
        fullName: (dataRecord.fullName as string) ?? userProfile?.name ?? "",
        email,
        phone: (dataRecord.phone as string) ?? userProfile?.phoneNumber ?? "",
        branch: (dataRecord.branch as string) ?? userProfile?.branch ?? "",
        yearOfStudy: (dataRecord.yearOfStudy as string) ?? "",
      };

      const socialLinks: Record<string, string> = {};
      if (dataRecord.linkedinUrl) socialLinks.linkedin = dataRecord.linkedinUrl as string;
      if (dataRecord.githubUrl) socialLinks.github = dataRecord.githubUrl as string;
      if (dataRecord.portfolioUrl) socialLinks.portfolio = dataRecord.portfolioUrl as string;
      if (dataRecord.gitRepoLink) socialLinks.gitRepoLink = dataRecord.gitRepoLink as string;

      const answers: Record<string, unknown> = {};
      for (const field of role.fields) {
        if ((ALL_RESERVED_FIELDS as readonly string[]).includes(field.name)) continue;
        if (field.type === "file") continue;
        const val = dataRecord[field.name];
        if (val !== undefined && val !== null && val !== "") {
          answers[field.name] = val;
        }
      }

      const appId = await submitApplication({
        roleId: role.id,
        applicant,
        socialLinks,
        files: filesData,
        answers,
        agreeToTerms: (dataRecord.agreeToTerms as boolean) ?? false,
        confirmInfo: (dataRecord.confirmInfo as boolean) ?? false,
      });

      console.log("[Recruitment] Application submitted:", appId);

      // Send confirmation email (non-blocking)
      if (settings.emailScriptUrl) {
        const fullName = (dataRecord.fullName as string) ?? userProfile?.name ?? "";
        sendConfirmationEmail({
          scriptUrl: settings.emailScriptUrl,
          to: email,
          fullName,
          roleTitle: role.title,
          applicationId: appId,
          ccEmails: settings.notifyOnApplication ? settings.notificationEmails : [],
        });
      }

      setSubmitSuccess("Form submitted successfully!");
      setTimeout(() => {
        setShowSuccessDialog(true);
        setSubmitSuccess("");
      }, 1500);
    } catch (err: any) {
      console.error("[Recruitment] Submission error:", err);
      
      let errorMessage = "An error occurred while submitting the form. Please try again.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      // If Firebase Security Rules block the write (because the deterministic document already exists), it throws permission-denied
      if (err?.code === "permission-denied" || errorMessage.includes("permission-denied") || errorMessage.includes("Missing or insufficient permissions")) {
        errorMessage = "You have already submitted an application. You can only apply to one department.";
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    reset();
    setFileNames({});
    setCurrentStep(1);
  };

  const handleCloseDialog = () => {
    setShowSuccessDialog(false);
    reset();
    setFileNames({});
    setCurrentStep(1);
    router.push("/");
  };

  const handleNext = async () => {
    const fieldsToValidate = fieldsForStep(currentStep)
      .filter((f) => f.required)
      .map((f) => f.name) as (keyof FormData)[];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setCurrentStep((s) => Math.min(s + 1, maxSection));
  };

  const handlePrevious = () => setCurrentStep((s) => Math.max(s - 1, 1));

  // ── Loading state ────────────────────────────────────────
  if (loadingRole || !settingsReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">Loading recruitment form...</p>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Role Not Found</h2>
          <p className="text-gray-500">This recruitment role doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Image src="/favicon.ico" alt="GDG Logo" width={96} height={96} className="w-24 h-24 rounded-full mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            <span className="text-blue-600">{role.title}</span>
            <span className="text-gray-400"> - </span>
            <span className="text-red-500">Hiring</span>
          </h1>
          <p className="text-gray-500 mb-8">Sign in with your college email to apply for this position.</p>
          <a href="/auth/login" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md">
            Sign In to Apply
          </a>
        </div>
      </div>
    );
  }

  if (firebaseUser && checkingDuplicate) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">Checking your application status...</p>
        </div>
      </div>
    );
  }

  if (settings && !settings.isRecruitmentActive) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Recruitment Closed</h2>
          <p className="text-gray-500">{settings.globalMessage || "Recruitment is not currently active."}</p>
        </div>
      </div>
    );
  }

  if (role.status !== "open" && role.status !== "closing-soon") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Not Accepting Applications</h2>
          <p className="text-gray-500">This role is not currently accepting applications.</p>
        </div>
      </div>
    );
  }

  if (role.applicationEnd && new Date() > new Date(role.applicationEnd)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">⏰</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Deadline Passed</h2>
          <p className="text-gray-500">The application deadline for this role has passed.</p>
        </div>
      </div>
    );
  }

  // ── Already applied ──────────────────────────────────────
  if (!checkingDuplicate && alreadyApplied) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Already Applied</h2>
          <p className="text-gray-500">You have already submitted an application. You can only apply to one department.</p>
        </div>
      </div>
    );
  }

  // ── Render form ──────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="absolute top-0 left-0 right-0 h-8 bg-blue-500 overflow-hidden">
              <svg viewBox="0 0 400 30" className="w-full h-8" preserveAspectRatio="none">
                <defs>
                  <pattern id="wave-pattern" x="0" y="0" width="20" height="30" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="0" r="10" fill="#EF4444" />
                  </pattern>
                </defs>
                <rect width="400" height="30" fill="url(#wave-pattern)" />
              </svg>
            </div>
            <div className="bg-blue-500 pt-12 pb-8 px-8 relative">
              <div className="absolute top-8 right-6 bg-yellow-400 rounded-full w-32 h-32 flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <p className="text-black font-bold text-sm leading-tight">Application<br />Submitted</p>
                </div>
              </div>
              <div className="pr-20">
                <h3 className="text-2xl font-bold text-black mb-4">APPLICATION<br />SUBMITTED!</h3>
                <h2 className="text-4xl font-black text-white leading-tight">WE WILL<br />GET BACK<br />TO YOU!</h2>
              </div>
            </div>
            <div className="bg-white px-8 py-10">
              <button onClick={handleCloseDialog} className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
            <Image src="/favicon.ico" alt="GDG Logo" width={128} height={128} className="w-32 h-32 rounded-full" />
            <div>
              <h2 className="text-lg font-medium text-gray-900">Google Developer Group</h2>
              <p className="text-xs text-gray-500">Vishnu Institute of Technology</p>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2">
            <span className="text-blue-600">{role.title}</span>
            <span className="text-gray-400"> - </span>
            <span className="text-red-500">Hiring</span>
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            Welcome to <strong>GDG VITB {role.title} Recruitment</strong>
            <br />
            This form will help us evaluate your application. Please fill in your details carefully.
          </p>

          {settings?.globalMessage && (
            <div className="mb-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800">{settings.globalMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center justify-between mb-8">
              {role.sections.map((section, i) => (
                <div key={section.number} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= section.number ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                    {section.number}
                  </div>
                  {i < role.sections.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 ${currentStep > section.number ? "bg-blue-600" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>

            {role.sections.map((section) =>
              currentStep === section.number ? (
                <div key={section.number} className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 border-b-2 pb-2" style={{ borderColor: section.borderColor }}>
                    {section.title}
                  </h2>

                  {fieldsForStep(section.number).map((field) => (
                    <DynamicField
                      key={field.name}
                      field={field}
                      register={(register as any)(field.name)}
                      error={(errors as Record<string, { message?: string }>)[field.name]?.message}
                      borderColor={inputColors[field.name] ?? "#E6452D"}
                      fileName={fileNames[field.name]}
                      onFileChange={(name) => setFileNames((prev) => ({ ...prev, [field.name]: name }))}
                      disabled={lockedFields.has(field.name)}
                    />
                  ))}

                  <div className="flex justify-between pt-4">
                    {currentStep > 1 && (
                      <button type="button" onClick={handlePrevious} className="px-8 py-3 bg-gray-200 text-gray-700 text-base font-semibold rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
                        ← Previous
                      </button>
                    )}
                    <div className="flex gap-4 ml-auto">
                      <button type="button" onClick={handleClearForm} className="text-base text-red-600 hover:text-red-700 font-semibold hover:underline">
                        Clear Form
                      </button>
                      {currentStep < maxSection ? (
                        <button type="button" onClick={handleNext} className="px-8 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md">
                          Next →
                        </button>
                      ) : (
                        <>
                          <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Submitting...
                            </>
                          ) : (
                            "Submit Application"
                          )}
                        </button>
                        </>
                      )}
                    </div>
                  </div>

                  {submitSuccess && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {submitSuccess}
                      </p>
                    </div>
                  )}
                  {submitError && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-600 font-medium flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {submitError}
                      </p>
                    </div>
                  )}
                </div>
              ) : null
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
