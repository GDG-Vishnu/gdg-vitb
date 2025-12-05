"use client";

import { motion } from "framer-motion";
import Navbar from "@/app/client/Home/navbar";
import Footer from "@/components/footer/Footer";
import { PageHeader } from "./PageHeader";
import { EmailCard, LocationCard, PhoneCard } from "./ContactInfoCards";
import { SocialLinks } from "./SocialLinks";
import { ContactForm } from "./ContactForm";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function ContactUsPage() {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundColor: "white",
        backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 -left-20 w-72 h-72 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 -right-20 w-72 h-72 bg-gradient-to-l from-yellow-200 to-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-20 left-1/3 w-64 h-64 bg-gradient-to-r from-green-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <Navbar />

      <motion.main
        className="py-12 px-4 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <motion.div variants={itemVariants}>
            <PageHeader />
          </motion.div>

          <motion.div
            className="grid lg:grid-cols-3 gap-8"
            variants={itemVariants}
          >
            {/* Contact Info Cards */}
            <motion.div
              className="lg:col-span-1 space-y-6"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
            >
              <motion.div variants={itemVariants}>
                <EmailCard />
              </motion.div>
              
            
              <motion.div variants={itemVariants}>
                <SocialLinks />
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div className="lg:col-span-2" variants={itemVariants}>
              <ContactForm />
            </motion.div>
          </motion.div>
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}
