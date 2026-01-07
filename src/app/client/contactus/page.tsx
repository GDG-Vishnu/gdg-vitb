"use client";

import { motion } from "framer-motion";
import Navbar from "@/app/client/Home/navbar";
import Footer from "@/components/footer/Footer";
import { MapPin, Mail, Linkedin, Instagram, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function ContactUsPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
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

      if (response.ok) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  function renderDesktop() {
    return (
      <section
        className="relative w-full px-4 py-10 bg-white"
        style={{
          backgroundColor: "white",
          backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      >
        <div className="max-w-7xl mx-auto rounded-[32px] overflow-hidden bg-[#111111] px-6 md:px-12 lg:px-20 py-8 md:py-14">
          <div className="relative rounded-[32px]">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)`,
                backgroundSize: "20px 20px, 40px 40px",
                backgroundPosition: "0 0, 10px 10px",
                opacity: 1,
                pointerEvents: "none",
                borderRadius: 28,
              }}
            />

            <div className="relative z-10">
              {/* Header Section */}
              <div className="text-center mb-12">
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl md:text-5xl lg:text-6xl font-semibold font-productSans text-white mb-6"
                >
                  Contact Us
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="text-base md:text-lg text-stone-300 max-w-3xl mx-auto font-productSans"
                >
                  Get in touch with GDG On Campus – Vishnu Institute Of
                  Technology, Bhimavaram. We&apos;d love to hear from you and
                  answer any questions you may have.
                </motion.p>
              </div>

              {/* Contact Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Contact Information */}
                <motion.div variants={itemVariants} className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-semibold text-white font-productSans mb-6">
                      Get In Touch
                    </h3>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-productSans font-medium">
                            Location
                          </p>
                          <p className="text-stone-300 font-productSans text-sm">
                            Vishnu Institute of Technology
                            <br />
                            Bhimavaram, Andhra Pradesh
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-productSans font-medium">
                            Email
                          </p>
                          <a
                            href="mailto:gdg@vishnu.edu.in"
                            className="text-stone-300 font-productSans text-sm"
                          >
                            gdg@vishnu.edu.in
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h4 className="text-xl font-semibold text-white font-productSans mb-4">
                      Follow Us
                    </h4>
                    <div className="flex gap-4">
                      <a
                        href="#"
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                      >
                        <Linkedin className="w-5 h-5 text-white" />
                      </a>
                      <a
                        href="#"
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                      >
                        <Instagram className="w-5 h-5 text-white" />
                      </a>
                    </div>
                  </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <h3 className="text-2xl font-semibold text-white font-productSans">
                    Send us a message
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-stone-400 font-productSans"
                        required
                      />
                    </div>
                    <div>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-stone-400 font-productSans"
                        required
                      />
                    </div>
                    <div>
                      <Input
                        name="subject"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-stone-400 font-productSans"
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        name="message"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-stone-400 font-productSans min-h-[120px]"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-white text-black hover:bg-stone-200 font-productSans font-medium flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function renderMobile() {
    return (
      <section
        className="relative w-full px-4 py-10"
        style={{
          backgroundColor: "white",
          backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      >
        <div className="max-w-3xl mx-auto rounded-[20px] overflow-hidden bg-[#111111] px-4 py-6">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px), radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px)`,
              backgroundSize: "20px 20px, 40px 40px",
              backgroundPosition: "0 0, 10px 10px",
              opacity: 1,
              pointerEvents: "none",
              borderRadius: 20,
            }}
          />

          <div className="relative z-10 space-y-8">
            {/* Header Section */}
            <div className="text-center">
              <motion.h1
                variants={itemVariants}
                className="text-3xl font-semibold text-white font-productSans mb-4"
              >
                Contact Us
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-sm text-stone-300 font-productSans"
              >
                Get in touch with GDG On Campus – Vishnu Institute Of
                Technology, Bhimavaram. We&apos;d love to hear from you.
              </motion.p>
            </div>

            {/* Contact Information */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-productSans font-medium text-sm">
                      Location
                    </p>
                    <p className="text-stone-300 font-productSans text-xs">
                      Vishnu Institute of Technology, Bhimavaram
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-productSans font-medium text-sm">
                      Email
                    </p>
                    <p className="text-stone-300 font-productSans text-xs">
                      gdg@vishnu.edu.in
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="text-lg font-semibold text-white font-productSans mb-3">
                  Follow Us
                </h4>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-white" />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-white" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-xl font-semibold text-white font-productSans">
                Send us a message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <Input
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-stone-400 font-productSans text-sm"
                    required
                  />
                </div>
                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-stone-400 font-productSans text-sm"
                    required
                  />
                </div>
                <div>
                  <Input
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-stone-400 font-productSans text-sm"
                    required
                  />
                </div>
                <div>
                  <Textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-stone-400 font-productSans min-h-[100px] text-sm"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black hover:bg-stone-200 font-productSans font-medium text-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div
      className="relative min-h-screen bg-white"
      style={{
        backgroundColor: "white",
        backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      <Navbar />

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pt-20"
      >
        {isMobile ? renderMobile() : renderDesktop()}
      </motion.main>

      <Footer />
    </div>
  );
}
