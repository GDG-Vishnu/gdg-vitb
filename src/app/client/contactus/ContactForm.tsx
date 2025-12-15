"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, User, Mail, MessageSquare, Type } from "lucide-react";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Enforce character limit for message field
    if (name === "message" && value.length > 500) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Create form data for better compatibility with Google Apps Script
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("message", formData.message);

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyuwiXZV8fcoO8M2qdH3-Rt7ik9BgTjsix9LMEbjop0rFAhYX1MvukmrPMHapY7ry3geg/exec",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      // Check if the request was successful
      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-gray-900 relative overflow-hidden group"
    >
      {/* Animated background decoration */}
      <motion.div
        className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600"
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      />

      <motion.h2
        variants={itemVariants}
        className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3 font-productSans"
      >
        <MessageSquare className="w-8 h-8 text-blue-600" />
        Send us a Message
      </motion.h2>

      {submitStatus === "success" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl text-green-800 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold text-green-900 font-productSans">
                Message sent successfully!
              </p>
              <p className="text-sm text-green-700 font-productSans">
                We&apos;ll get back to you within 24 hours.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {submitStatus === "error" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="mb-6 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl text-red-800 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold text-red-900 font-productSans">
                Failed to send message
              </p>
              <p className="text-sm text-red-700 font-productSans">
                Please try again later or contact us directly.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-8"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.3,
            },
          },
        }}
      >
        <motion.div
          className="grid sm:grid-cols-2 gap-6"
          variants={itemVariants}
        >
          {/* Name Field */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="name"
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3 font-productSans"
            >
              <User className="w-4 h-4 text-blue-600" />
              Your Name <span className="text-red-500">*</span>
            </label>
            <motion.input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-4 border-2 rounded-xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${
                errors.name
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-200"
              }`}
              placeholder="Enter your full name"
              whileFocus={{ scale: 1.02 }}
            />
            {errors.name && (
              <motion.p
                className="mt-2 text-sm text-red-600 flex items-center gap-1 font-productSans"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.name}
              </motion.p>
            )}
          </motion.div>

          {/* Email Field */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3 font-productSans"
            >
              <Mail className="w-4 h-4 text-blue-600" />
              Email Address <span className="text-red-500">*</span>
            </label>
            <motion.input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-4 border-2 rounded-xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-200"
              }`}
              placeholder="your.email@example.com"
              whileFocus={{ scale: 1.02 }}
            />
            {errors.email && (
              <motion.p
                className="mt-2 text-sm text-red-600 flex items-center gap-1 font-productSans"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.email}
              </motion.p>
            )}
          </motion.div>
        </motion.div>

        {/* Subject Field */}
        <motion.div variants={itemVariants}>
          <label
            htmlFor="subject"
            className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3 font-productSans"
          >
            <Type className="w-4 h-4 text-blue-600" />
            Subject <span className="text-red-500">*</span>
          </label>
          <motion.input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full px-4 py-4 border-2 rounded-xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${
              errors.subject
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-200"
            }`}
            placeholder="What can we help you with today?"
            whileFocus={{ scale: 1.02 }}
          />
          {errors.subject && (
            <motion.p
              className="mt-2 text-sm text-red-600 flex items-center gap-1 font-productSans"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.subject}
            </motion.p>
          )}
        </motion.div>
          
        {/* Message Field */}
        <motion.div variants={itemVariants}>
          <label
            htmlFor="message"
            className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3 font-productSans"
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            Message <span className="text-red-500">*</span>
          </label>
          <motion.textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className={`w-full px-4 py-4 border-2 rounded-xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none ${
              errors.message
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-200"
            }`}
            placeholder="Tell us more about your inquiry, project, or how we can help you..."
            whileFocus={{ scale: 1.02 }}
          />
          <div className="mt-2 flex justify-between items-center">
            {errors.message && (
              <motion.p
                className="text-sm text-red-600 flex items-center gap-1 font-productSans"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.message}
              </motion.p>
            )}
            <span className="text-xs text-gray-500 ml-auto font-productSans">
              {formData.message.length}/500
            </span>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={itemVariants} className="pt-4">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-productSans"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Button background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                <span>Send Message</span>
              </>
            )}
          </motion.button>

          <p className="mt-4 text-sm text-gray-500 text-center font-productSans">
            We typically respond within 24 hours. Your information is kept
            confidential.
          </p>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
