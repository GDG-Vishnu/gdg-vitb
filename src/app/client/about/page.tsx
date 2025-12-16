"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/app/client/Home/navbar";
import Footer from "@/components/footer/Footer";
import {
  Users,
  Calendar,
  Award,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Code,
  Lightbulb,
  Target,
} from "lucide-react";

// Custom hook for scroll animations
const useScrollAnimation = (): [
  React.RefObject<HTMLDivElement | null>,
  boolean
] => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

 useEffect(() => {
  const element = ref.current; // capture once

  if (!element) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(element);

  return () => {
    observer.unobserve(element); // cleanup uses same element
  };
}, []);


  return [ref, isVisible];
};

// Counter animation hook
const useCountAnimation = (endValue: number, isVisible: boolean): number => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 50;
    const increment = endValue / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= endValue) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [endValue, isVisible]);

  return count;
};

// Enhanced Typing Animation Component
const TypingAnimation = () => {
  const phrases = [
    "Building Tomorrow's Developers at VIT Bhimavaram",
    "Creating Tech Leaders in Andhra Pradesh",
    "Fostering Innovation with Google Technologies",
    "Connecting Minds Across Engineering Disciplines",
    "Empowering Students with Real-World Skills",
    "Bridging Academia and Industry",
  ];

  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const phrase = phrases[currentPhrase];

    if (isTyping) {
      if (currentText.length < phrase.length) {
        const timeout = setTimeout(() => {
          setCurrentText(phrase.substring(0, currentText.length + 1));
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.substring(0, currentText.length - 1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        setCurrentPhrase((prev) => (prev + 1) % phrases.length);
        setIsTyping(true);
      }
    }
  }, [currentText, isTyping, currentPhrase, phrases, isVisible]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="h-24 sm:h-32 flex items-center justify-center px-4">
      <div
        className={`transform transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <h3
          className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-medium text-gray-600 font-productSans text-center leading-tight"
          style={{
            fontFamily:
              '"Product Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
            minHeight: "1.2em",
          }}
        >
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            {currentText}
          </span>
          <span
            className={`${
              showCursor ? "opacity-100" : "opacity-0"
            } transition-opacity duration-100 text-blue-600`}
          >
            |
          </span>
        </h3>
        <div className="mt-4 flex justify-center">
          <div className="flex space-x-2">
            {phrases.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentPhrase
                    ? "bg-blue-600 scale-125"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Animated Counter Component
interface AnimatedCounterProps {
  endValue: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  isVisible: boolean;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  endValue,
  label,
  icon: Icon,
  color,
  isVisible,
}) => {
  const count = useCountAnimation(parseInt(endValue), isVisible);
  const suffix = endValue.includes("+") ? "+" : "";

  return (
    <div
      className={`transform transition-all duration-700 delay-300 ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-10 opacity-0 scale-95"
      }`}
    >
      <div className="bg-white rounded-2xl border-4 border-black p-4 sm:p-6 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-300 group">
        <div
          className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 ${color} bg-gray-50 rounded-full mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 font-productSans">
          {count}
          {suffix}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 font-productSans">
          {label}
        </p>
      </div>
    </div>
  );
};

// Mission Card Component
const MissionCard = () => {
  const [missionRef, missionVisible] = useScrollAnimation();

  return (
    <div
      ref={missionRef}
      className={`transform transition-all duration-1000 ${
        missionVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-20 opacity-0"
      }`}
    >
      <div className="bg-[#111111] rounded-2xl sm:rounded-[32px] border-4 border-white overflow-hidden px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12 md:py-16 relative group hover:translate-x-[-4px] hover:translate-y-[-4px] shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] transition-all duration-500">
        {/* Enhanced Background Pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)`,
            backgroundPosition: "0 0, 20px 20px",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 opacity-50"></div>

        <div className="relative z-10">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <div
              className={`transform transition-all duration-700 delay-200 ${
                missionVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-10 opacity-0"
              }`}
            >
              <h3
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 font-productSans leading-tight"
                style={{
                  fontFamily:
                    '"Product Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                }}
              >
                Our Mission
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed font-productSans">
                To empower students at VIT Bhimavaram with cutting-edge Google
                technologies, bridge the gap between academic learning and
                industry demands, and foster a thriving community of innovative
                developers ready to tackle real-world challenges in the tech
                industry.
              </p>
            </div>
            <div
              className={`transform transition-all duration-700 delay-400 ${
                missionVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-10 opacity-0"
              }`}
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <h4 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 font-productSans">
                  What We Do
                </h4>
                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-300 font-productSans">
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Organize technical workshops and seminars</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Host hackathons and coding competitions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Provide mentorship and career guidance</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Build innovative projects and solutions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Statistics Section Component
const StatisticsSection = () => {
  const [statsRef, statsVisible] = useScrollAnimation();

  const statistics = [
    {
      value: "1979+",
      label: "Active Members",
      icon: Users,
      color: "text-blue-600",
    },
    {
      value: "10+",
      label: "Events Conducted",
      icon: Calendar,
      color: "text-red-600",
    },
    {
      value: "50+",
      label: "Projects Completed",
      icon: Award,
      color: "text-green-600",
    },
    {
      value: "10+",
      label: "Workshops Held",
      icon: BookOpen,
      color: "text-yellow-600",
    },
  ];

  return (
    <div ref={statsRef}>
      <div
        className={`text-center mb-8 sm:mb-12 transform transition-all duration-700 ${
          statsVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 font-productSans">
          Our Impact
        </h3>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-productSans px-4">
          Numbers that reflect our commitment to fostering technological
          excellence and community growth
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statistics.map((stat, index) => (
          <div key={index} style={{ animationDelay: `${index * 150}ms` }}>
            <AnimatedCounter
              endValue={stat.value}
              label={stat.label}
              icon={stat.icon}
              color={stat.color}
              isVisible={statsVisible}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Values Section Component
const ValuesSection = () => {
  const [valuesRef, valuesVisible] = useScrollAnimation();

  const values = [
    {
      title: "Innovation",
      description:
        "We encourage creative thinking and the development of innovative solutions to real-world problems.",
      icon: Award,
      color: "blue",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-600",
      border: "border-blue-100",
      delay: "delay-100",
    },
    {
      title: "Collaboration",
      description:
        "We believe in the power of teamwork and building strong connections within our community.",
      icon: Users,
      color: "green",
      bgColor: "bg-green-50",
      iconBg: "bg-green-600",
      border: "border-green-100",
      delay: "delay-300",
    },
    {
      title: "Learning",
      description:
        "We are committed to continuous learning and knowledge sharing among our members.",
      icon: BookOpen,
      color: "yellow",
      bgColor: "bg-yellow-50",
      iconBg: "bg-yellow-600",
      border: "border-yellow-100",
      delay: "delay-500",
    },
  ];

  return (
    <div ref={valuesRef}>
      <div
        className={`text-center mb-8 sm:mb-12 transform transition-all duration-700 ${
          valuesVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 font-productSans">
          Our Values
        </h3>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-productSans px-4">
          The principles that guide everything we do at GDG VITB
        </p>
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {values.map((value, index) => {
          const IconComponent = value.icon;
          return (
            <div
              key={index}
              className={`transform transition-all duration-700 ${
                valuesVisible
                  ? "translate-y-0 opacity-100 scale-100"
                  : "translate-y-10 opacity-0 scale-95"
              } ${value.delay} hover:scale-105 hover:-translate-y-2`}
            >
              <div
                className={`${value.bgColor} rounded-2xl p-4 sm:p-6 text-center border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-300 group h-full`}
              >
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 ${value.iconBg} rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                >
                  <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 font-productSans">
                  {value.title}
                </h4>
                <p className="text-sm sm:text-base text-gray-600 font-productSans leading-relaxed">
                  {value.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Activities Section Component
const ActivitiesSection = () => {
  const [activitiesRef, activitiesVisible] = useScrollAnimation();

  const activities = [
    {
      title: "Google Technology Workshops",
      description:
        "Hands-on workshops featuring Firebase, Google Cloud Platform, Android development, Flutter, and Google AI/ML technologies tailored for VIT Bhimavaram students.",
      icon: Code,
      color: "bg-blue-500",
      delay: "delay-100",
    },
    {
      title: "Solution Challenge & Hackathons",
      description:
        "Participate in Google's Solution Challenge and organize hackathons focusing on solving real-world problems using Google technologies.",
      icon: Target,
      color: "bg-red-500",
      delay: "delay-200",
    },
    {
      title: "GDE Sessions & Industry Connect",
      description:
        "Interactive sessions with Google Developer Experts and industry professionals sharing insights on latest tech trends and career guidance.",
      icon: Lightbulb,
      color: "bg-yellow-500",
      delay: "delay-300",
    },
    {
      title: "Developer Community Hub",
      description:
        "Building a strong network of developers across VIT Bhimavaram, fostering collaboration, mentorship, and peer-to-peer learning.",
      icon: Users,
      color: "bg-green-500",
      delay: "delay-400",
    },
  ];

  return (
    <div
      ref={activitiesRef}
      className="bg-gray-50 py-12 sm:py-16 px-4"
      style={{
        backgroundImage: `linear-gradient(45deg, #f9fafb 25%, transparent 25%), linear-gradient(-45deg, #f9fafb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f9fafb 75%), linear-gradient(-45deg, transparent 75%, #f9fafb 75%)`,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center mb-8 sm:mb-12 transform transition-all duration-700 ${
            activitiesVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 font-productSans">
            What We Do
          </h3>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-productSans px-4">
            Empowering students through diverse technological initiatives and
            community-driven programs
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {activities.map((activity, index) => {
            const IconComponent = activity.icon;
            return (
              <div
                key={index}
                className={`transform transition-all duration-700 ${
                  activitiesVisible
                    ? "translate-y-0 opacity-100 scale-100"
                    : "translate-y-10 opacity-0 scale-95"
                } ${activity.delay} hover:scale-105 hover:-translate-y-2`}
              >
                <div className="bg-white rounded-2xl border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-300 group h-full">
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 ${activity.color} border-4 border-black rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  >
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 font-productSans">
                    {activity.title}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600 font-productSans leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Call to Action Section
const CTASection = () => {
  const [ctaRef, ctaVisible] = useScrollAnimation();

  return (
    <div
      ref={ctaRef}
      className="w-4xl py-12 sm:py-16 px-4 bg-blue-500 border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    >
      <div className="max-w-4xl mx-auto text-center ">
        <div
          className={`transform transition-all duration-1000 ${
            ctaVisible
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-20 opacity-0 scale-95"
          }`}
        >
          <h3 className="text-3xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 font-productSans">
            Ready to Join GDG VIT Bhimavaram?
          </h3>
          <p className="text-base sm:text-lg text-gray-200 mb-6 sm:mb-8 font-productSans leading-relaxed px-4">
            Be part of Bhimavaram most active tech community! Connect with
            fellow developers, learn Google technologies, and build amazing
            projects together.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-4 text-sm sm:text-base text-black bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300 font-productSans font-bold">
              <Calendar className="w-4 h-4" />
              Explore Events
            </button>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-4 text-sm sm:text-base text-white bg-black border-4 border-white rounded-2xl shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300 font-productSans font-bold">
              <Users className="w-4 h-4" />
              Join Our Community
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add custom animations styles
const CustomStyles = () => (
  <style jsx>{`
    @keyframes fade-in-up {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in-up {
      animation: fade-in-up 1s ease-out forwards;
      opacity: 0;
    }

    @media (max-width: 640px) {
      .grid-cols-2 > * {
        min-height: 200px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .transform,
      .transition-all,
      .animate-pulse,
      .animate-bounce,
      .animate-spin {
        animation: none !important;
        transition: none !important;
      }
    }
  `}</style>
);

export default function AboutPage() {
  return (
    <div
      className="min-h-screen bg-white relative overflow-hidden flex flex-col"
      style={{
        backgroundColor: "white",
        backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      <CustomStyles />

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 pt-16 sm:pt-20 pb-20 sm:pb-24 px-4 min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto text-center w-full">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Large focal elements */}
            <div className="absolute top-10 left-5 w-24 h-24 border-6 border-blue-600 bg-blue-100 rounded-2xl rotate-12 animate-pulse opacity-30 shadow-[8px_8px_0px_0px_rgba(37,99,235,0.4)]"></div>
            <div
              className="absolute top-20 right-8 w-20 h-20 bg-red-500 border-6 border-black rounded-2xl animate-bounce opacity-20 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.4)]"
              style={{ animationDelay: "1s" }}
            ></div>

            {/* Medium elements */}
            <div
              className="absolute bottom-32 left-16 w-16 h-16 bg-yellow-400 border-4 border-black transform rotate-45 animate-spin opacity-25 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]"
              style={{ animationDuration: "6s" }}
            ></div>
            <div
              className="absolute bottom-16 right-20 w-18 h-18 border-4 border-green-500 bg-green-200 rounded-xl transform rotate-45 animate-pulse opacity-30 shadow-[6px_6px_0px_0px_rgba(34,197,94,0.4)]"
              style={{ animationDelay: "2s" }}
            ></div>

            {/* Small accent elements */}
            <div
              className="absolute top-1/3 left-1/3 w-10 h-10 bg-purple-500 border-4 border-black rounded-full animate-bounce opacity-15 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
              style={{ animationDelay: "3s", animationDuration: "2s" }}
            ></div>
            <div
              className="absolute top-2/3 right-1/4 w-12 h-12 border-4 border-pink-500 bg-pink-200 rounded-lg rotate-12 animate-pulse opacity-20 shadow-[4px_4px_0px_0px_rgba(236,72,153,0.3)]"
              style={{ animationDelay: "4s" }}
            ></div>
            <div
              className="absolute bottom-1/3 left-1/4 w-8 h-8 bg-indigo-500 border-3 border-black rounded-full animate-bounce opacity-15 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
              style={{ animationDelay: "5s", animationDuration: "3s" }}
            ></div>
          </div>

          {/* Main Title */}
          <div className="mb-8 sm:mb-12 relative z-10">
            <div className="transform transition-all duration-1000 translate-y-0 opacity-100">
              {/* Enhanced Title with Background */}
              <div className="relative inline-block mb-6">
                <div className="absolute -inset-4 bg-yellow-300 border-4 border-black rounded-3xl transform rotate-1 opacity-80 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"></div>
                <h1
                  className="relative text-3xl sm:text-4xl md:text-7xl font-bold font-productSans leading-tight px-6 py-4"
                  style={{
                    fontFamily:
                      '"Product Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                    fontWeight: 700,
                    fontSize: "clamp(32px, 8vw, 80px)",
                    lineHeight: "1.1",
                    letterSpacing: "-0.02em",
                  }}
                >
                  <span
                    className="inline-block animate-fade-in-up text-black"
                    style={{ animationDelay: "0.2s" }}
                  >
                    About
                  </span>{" "}
                  <span
                    className="inline-block animate-fade-in-up text-blue-600"
                    style={{ animationDelay: "0.4s" }}
                  >
                    GDG
                  </span>
                </h1>
              </div>

              {/* Enhanced Subtitle */}
              <div className="relative inline-block">
                <div className="absolute -inset-2 bg-blue-200 border-4 border-black rounded-2xl transform -rotate-1 opacity-70 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"></div>
                <h2
                  className="relative text-lg sm:text-2xl md:text-4xl text-black font-productSans animate-fade-in-up px-4 py-2 font-semibold"
                  style={{
                    fontFamily:
                      '"Product Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                    fontWeight: 500,
                    fontSize: "clamp(18px, 4vw, 40px)",
                    animationDelay: "0.6s",
                  }}
                >
                  Vishnu Institute of Technology, Bhimavaram
                </h2>
              </div>
            </div>
          </div>

          {/* Typing Animation */}
          <div className="mb-8 sm:mb-12">
            <TypingAnimation />
          </div>

          {/* Enhanced Description Card */}
          <div className="mb-12 sm:mb-16 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white border-4 border-black rounded-3xl p-6 sm:p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                <p className="text-lg sm:text-xl md:text-2xl text-gray-800 font-productSans leading-relaxed mb-6">
                  <span className="text-blue-600 font-bold">
                    Google Developer Groups (GDG)
                  </span>{" "}
                  at VIT Bhimavaram is a vibrant community of tech enthusiasts,
                  developers, and innovators passionate about building the
                  future with cutting-edge Google technologies.
                </p>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  {[
                    "Firebase",
                    "Android",
                    "Flutter",
                    "Cloud",
                    "AI/ML",
                    "Web Dev",
                  ].map((tech, index) => (
                    <span
                      key={tech}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-sm sm:text-base transform hover:scale-105 transition-all duration-200"
                      style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Hero CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-10">
            <a
              href="https://gdg.community.dev/gdg-on-campus-vishnu-institute-of-technology-bhimavaram-india/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 px-8 py-4 text-lg font-bold text-black bg-yellow-400 border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-300 transform hover:scale-105"
            >
              <Users className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              Join Our Community
              <ExternalLink className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </a>
            <Link
              href="/client/events"
              className="group flex items-center justify-center gap-3 px-8 py-4 text-lg font-bold text-white bg-blue-600 border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-300 transform hover:scale-105"
            >
              <Calendar className="w-6 h-6 group-hover:bounce transition-transform duration-300" />
              Explore Events
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <MissionCard />
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <StatisticsSection />
        </div>
      </section>
      {/* Values Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <ValuesSection />
        </div>
      </section>

      {/* Activities Section */}
      <ActivitiesSection />

      {/* Call to Action Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto flex justify-center">
          <CTASection />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
