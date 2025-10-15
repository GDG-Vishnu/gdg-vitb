import { toast } from "sonner";

export const toastNotifications = {
  // Success notifications
  success: {
    formSubmitted: () => {
      toast.success("Form submitted successfully!", {
        description: "Your response has been recorded.",
        duration: 4000,
      });
    },
    formCleared: () => {
      toast.success("Form cleared!", {
        description: "All fields have been reset.",
        duration: 2000,
      });
    },
    responseDeleted: () => {
      toast.success("Response deleted!", {
        description: "The form response has been removed.",
        duration: 3000,
      });
    },
    responseUpdated: () => {
      toast.success("Response updated!", {
        description: "The form response has been saved.",
        duration: 3000,
      });
    },
    formCreated: () => {
      toast.success("Form created!", {
        description: "Your new form is ready to use.",
        duration: 3000,
      });
    },
    formDeleted: () => {
      toast.success("Form deleted!", {
        description: "The form has been removed.",
        duration: 3000,
      });
    },
  },

  // Error notifications
  error: {
    submissionFailed: (errorMessage?: string) => {
      toast.error("Failed to submit form", {
        description: errorMessage || "Please try again later.",
        duration: 5000,
      });
    },
    networkError: () => {
      toast.error("Network error occurred", {
        description: "Please check your connection and try again.",
        duration: 5000,
      });
    },
    validationError: (message: string) => {
      toast.error("Validation Error", {
        description: message,
        duration: 4000,
      });
    },
    unexpectedError: () => {
      toast.error("An unexpected error occurred", {
        description:
          "Please try again or contact support if the issue persists.",
        duration: 5000,
      });
    },
  },

  // Warning notifications
  warning: {
    emptyForm: () => {
      toast.warning("Please fill at least one field", {
        description: "Complete some fields before submitting the form.",
        duration: 3000,
      });
    },
    requiredFields: (fieldNames: string[]) => {
      toast.warning("Required fields missing", {
        description: `Please fill in: ${fieldNames.join(", ")}`,
        duration: 4000,
      });
    },
  },

  // Info notifications
  info: {
    formLoading: () => {
      toast.loading("Processing your submission...", {
        description: "Please wait while we save your response.",
      });
    },
    formSaving: () => {
      toast.loading("Saving form...", {
        description: "Your changes are being saved.",
      });
    },
  },
};

// Utility functions for common patterns
export const dismissAllToasts = () => {
  toast.dismiss();
};

export const showCustomToast = (
  type: "success" | "error" | "warning" | "info",
  title: string,
  description?: string,
  duration?: number
) => {
  const toastFn = toast[type];
  toastFn(title, {
    description,
    duration: duration || 3000,
  });
};
