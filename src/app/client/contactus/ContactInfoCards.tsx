"use client";

import { motion, easeInOut } from "framer-motion";
import { Mail, MapPin, Clock, Phone } from "lucide-react";

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easeInOut,
    },
  },
};

export function EmailCard() {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -5,
        transition: { duration: 0.2, ease: "easeInOut" },
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 shadow-xl border border-gray-800 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <motion.div
          className="p-4 hover:bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg"
          whileHover={{
            scale: 1.1,
            rotate: 5,
            transition: { duration: 0.2 },
          }}
        >
          <Mail className="w-6 h-6 text-white " />
        </motion.div>
        <div className="flex-1">
          <h3 className="font-bold text-white mb-2 text-lg group-hover:text-blue-400 transition-colors font-productSans">
            Email Us
          </h3>
          <p className="text-gray-300 text-sm mb-3 leading-relaxed font-productSans">
            Send us an email anytime - we typically respond within 24 hours
          </p>
          <motion.a
            href="mailto:gdg@vishnu.edu.in"
            className="text-blue-400 hover:text-blue-300 font-medium text-sm flex items-center gap-2 group/link font-productSans"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <span>gdg@vishnu.edu.in</span>
            <motion.span
              className="opacity-0 group-hover/link:opacity-100 transition-opacity"
              initial={{ x: -5 }}
              whileHover={{ x: 0 }}
            >
              →
            </motion.span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

export function LocationCard() {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -5,
        transition: { duration: 0.2, ease: "easeInOut" },
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-900 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <motion.div
          className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg"
          whileHover={{
            scale: 1.1,
            rotate: -5,
            transition: { duration: 0.2 },
          }}
        >
          <MapPin className="w-6 h-6 text-white" />
        </motion.div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-red-600 transition-colors font-productSans">
            Visit Us
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed mb-3 font-productSans">
            <span className="font-semibold">
              Vishnu Institute of Technology
            </span>
            <br />
            Bhimavaram, Andhra Pradesh
            <br />
            India - 534202
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-productSans">
            <Clock className="w-4 h-4" />
            <span>Open to visitors during college hours</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function PhoneCard() {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -5,
        transition: { duration: 0.2, ease: "easeInOut" },
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <motion.div
          className="p-4 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg"
          whileHover={{
            scale: 1.1,
            rotate: 10,
            transition: { duration: 0.2 },
          }}
        >
          <Phone className="w-6 h-6 text-white" />
        </motion.div>
        <div className="flex-1">
          <h3 className="font-bold text-white mb-2 text-lg font-productSans">
            Call Us
          </h3>
          <p className="text-green-100 text-sm mb-3 leading-relaxed font-productSans">
            Reach us directly for urgent inquiries
          </p>
          <motion.a
            href="tel:+918867334455"
            className="text-white hover:text-green-200 font-medium text-sm flex items-center gap-2 group/link font-productSans"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <span>+91 88673 34455</span>
            <motion.span
              className="opacity-0 group-hover/link:opacity-100 transition-opacity"
              initial={{ x: -5 }}
              whileHover={{ x: 0 }}
            >
              📞
            </motion.span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
