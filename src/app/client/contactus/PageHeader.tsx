"use client";

import { motion } from "framer-motion";

const titleVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const subtitleVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      delay: 0.2,
    },
  },
};

export function PageHeader() {
  return (
    <div className="text-center mb-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={titleVariants}
        className="relative"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 relative">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Contact Us
          </span>
          <motion.div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 96, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          />
        </h1>
      </motion.div>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={subtitleVariants}
        className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
      >
        Have questions or want to collaborate? We&apos;d love to hear from you.
        <br className="hidden sm:block" />
        Reach out to us and we&apos;ll get back to you as soon as possible.
      </motion.p>
    </div>
  );
}
