"use client";

import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Cinzel } from "next/font/google";
import { useSearchParams } from "next/navigation";
import { Clock, Star, CheckCircle, ChevronRight } from "lucide-react";
import RegistrationCard from "@/components/RegistrationCard";
// Harry Potter-esque display font (must be module-scoped for Next.js)
const hpFont = Cinzel({ subsets: ["latin"], weight: ["700", "900"] });

const HackATron3Content = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegCard, setShowRegCard] = useState(false);
  const [hoverStates, setHoverStates] = useState({
    brochure: false,
    share: false,
  });

  // Color theme constants
  const colors = {
    ogre: "#1c1f24",
    cornflower: "#6495ED",
    irishGreen: "#2E8B57",
    yellowOrange: "#FFB703",
    spaceStation: "#A0A4A8",
  };

  // Event Details
  const hackathonDetails = {
    title: "HACK-A-TRON 3.0",
    subtitle: "A Harry Potter-them  ed 24Hours Hackathon",
    date: "Jan 2-3, 2026",
    time: "24 Hours",
    venue: "C Block",
    registrationDeadline: "Dec 29, 2025",
    maxTeamSize: 4,

    totalPrizes: "₹6,000",
    expectedParticipants: 500,
  };

  // Registration close and event start dates
  const REGISTRATION_CLOSE = new Date("2025-12-29T22:00:00+05:30");
  const EVENT_START = new Date("2026-01-02T09:00:00+05:30");
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const targetOverride = dateParam
    ? new Date(dateParam)
    : Date.now() > REGISTRATION_CLOSE.getTime()
    ? EVENT_START
    : REGISTRATION_CLOSE;
  const timerLabel =
    targetOverride.getTime() === REGISTRATION_CLOSE.getTime()
      ? "Registration closes on Dec 29, 2025 at 10:00 PM (IST)"
      : "Event starts in";

  // Timeline data
  const timeline = [
    // Day 1
    {
      time: "Dec 26th • 12 PM",
      title: "Registrations start",
      description: "Launch of the hackathon event",
    },
    {
      time: "Dec 29th • 4 PM ",
      title: "Flash Mob ",
      description: "Flash Mob from VDD ",
    },
    {
      time: "Dec 29th • 10 PM ",
      title: "Registration Deadline ",
      description: "Registrations closes by 10 PM  ",
    },
    {
      time: "Dec 31st • 10 PM",
      title: "Selected Members List Out",
      description: "Teams explore themes and define solutions",
    },
    {
      time: "Jan 2nd • 9:00 AM",
      title: "Event Kick-off",
      description: "Refuel and prepare for development",
    },
    {
      time: "Jan 3rd  ",
      title: "Project Submission ",
      description: "Final project submissions due",
    },
    {
      time: "Jan 3rd &4th",
      title: "Judging & Awards Ceremony",
      description: "Winners announced and prizes awarded",
    },
  ];

  // Prize structure
  const prizes = [
    {
      position: "1st Prize",
      amount: "₹3,000",
      color: "bg-gradient-to-br from-yellow-400 to-yellow-600",
      icon: (
        <Image
          src="https://cdn-icons-png.flaticon.com/128/2583/2583417.png"
          alt="Gold Medal"
          width={40}
          height={40}
        />
      ),
    },
    {
      position: "2nd Prize",
      amount: "₹2,000",
      color: "bg-gradient-to-br from-gray-300 to-gray-500",
      icon: (
        <Image
          src="https://cdn-icons-png.flaticon.com/128/2583/2583419.png"
          alt="Silver Medal"
          width={40}
          height={40}
        />
      ),
    },
    {
      position: "3rd Prize",
      amount: "₹1,000",
      color: "bg-gradient-to-br from-orange-400 to-orange-600",
      icon: (
        <Image
          src="https://cdn-icons-png.flaticon.com/128/2583/2583421.png"
          alt="Bronze Medal"
          width={40}
          height={40}
        />
      ),
    },
  ];

  // Tracks/Themes
  const tracks = [
    {
      title: "AI & Machine Learning",
      description:
        "Innovative solutions using artificial intelligence and machine learning",
      icon: "https://cdn-icons-png.flaticon.com/128/16806/16806607.png",
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Web & Mobile Development",
      description: "Full-stack applications and mobile solutions",
      icon: "https://cdn-icons-png.flaticon.com/128/3178/3178162.png",
      color: "from-green-500 to-teal-600",
    },
    {
      title: "Blockchain & Web3",
      description: "Decentralized applications and blockchain solutions",
      icon: "https://cdn-icons-png.flaticon.com/128/919/919873.png",
      color: "from-purple-500 to-violet-600",
    },

    {
      title: "Social Impact",
      description: "Technology solutions for social good",
      icon: "https://cdn-icons-png.flaticon.com/128/771/771203.png",
      color: "from-emerald-500 to-green-600",
    },
    {
      title: "Open Innovation",
      description: "Creative solutions to any problem you're passionate about",
      icon: "https://cdn-icons-png.flaticon.com/128/3081/3081559.png",
      color: "from-yellow-500 to-orange-600",
    },
  ];

  const handleRegistration = () => {
    setIsRegistered(true);
  };

  const openRegistrationCard = () => {
    setShowRegCard(true);
  };

  // Countdown Timer component
  const CountdownTimer = ({
    target,
    label,
  }: {
    target: Date;
    label?: string;
  }) => {
    const [timeLeft, setTimeLeft] = React.useState(() => {
      const diff = target.getTime() - Date.now();
      return {
        total: diff,
        days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
        hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
        minutes: Math.max(0, Math.floor((diff / (1000 * 60)) % 60)),
        seconds: Math.max(0, Math.floor((diff / 1000) % 60)),
      };
    });

    React.useEffect(() => {
      const id = setInterval(() => {
        const diff = target.getTime() - Date.now();
        setTimeLeft({
          total: diff,
          days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
          hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
          minutes: Math.max(0, Math.floor((diff / (1000 * 60)) % 60)),
          seconds: Math.max(0, Math.floor((diff / 1000) % 60)),
        });
      }, 1000);
      return () => clearInterval(id);
    }, [target]);

    const Item = ({ label, value }: { label: string; value: number }) => (
      <div className="flex flex-col items-center justify-center px-2">
        <div className="text-4xl sm:text-5xl md:text-7xl font-black tracking-widest text-transparent bg-clip-text bg-linear-to-br from-yellow-300 via-amber-400 to-yellow-600 drop-shadow-[0_0_8px_rgba(255,184,3,0.6)]">
          {String(value).padStart(2, "0")}
        </div>
        <div
          className="mt-1 text-[10px] md:text-2xl sm:text-sm uppercase tracking-[0.25em]"
          style={{ color: colors.spaceStation }}
        >
          {label}
        </div>
      </div>
    );

    const isStarted = timeLeft.total <= 0;

    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-4xl"
        >
          <div className="relative overflow-hidden rounded-3xl border shadow-2xl">
            <div className="absolute inset-0 bg-linear-to-br from-[#0b1024] via-[#14122b] to-[#0b1024]" />
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                backgroundSize: "4px 4px",
              }}
            />
            <div className="relative z-10 p-6 sm:p-8">
              <div className="flex items-center justify-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <h2
                  className={`${hpFont.className} text-2xl sm:text-3xl md:text-4xl font-extrabold text-yellow-300 drop-shadow-[0_0_6px_rgba(255,184,3,0.5)]`}
                >
                  Registration closes by
                </h2>
                <Star className="h-5 w-5 text-yellow-400" />
              </div>

              {isStarted ? (
                <div className="mt-6 text-center">
                  <p
                    className={`${hpFont.className} text-xl sm:text-2xl text-emerald-300 drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]`}
                  >
                    The magic has begun!
                  </p>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-4 items-center justify-center">
                  <Item label="Days" value={timeLeft.days} />
                  <Item label="Hours" value={timeLeft.hours} />
                  <Item label="Minutes" value={timeLeft.minutes} />
                  <Item label="Seconds" value={timeLeft.seconds} />
                </div>
              )}

              <div
                className="mt-6 flex items-center justify-center text-xs sm:text-sm"
                style={{ color: colors.spaceStation }}
              >
                <Clock className="h-4 w-4 mr-2" />
                {label ?? "Event starts in"}
              </div>
            </div>

            {/* Gold glow ring */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-2 ring-yellow-500/30" />
          </div>
        </motion.div>
      </>
    );
  };

  // Reusable stat card component
  const StatCard = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }) => (
    <div
      className="backdrop-blur-sm rounded-2xl p-6 shadow-lg w-70 border flex justify-between items-center md:w-64 lg:w-72 "
      style={{
        backgroundColor: `${colors.ogre}E6`,
        borderColor: `${colors.spaceStation}40`,
      }}
    >
      <div className="mr-4">
        <p className="text-sm mb-1" style={{ color: colors.spaceStation }}>
          {label}
        </p>
        <p className="font-semibold" style={{ color: colors.yellowOrange }}>
          {value}
        </p>
      </div>
      {icon}
    </div>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen relative overflow-hidden"
        style={{
          backgroundColor: "white",
          backgroundImage: `linear-gradient(${colors.spaceStation}20 1px, transparent 1px), linear-gradient(90deg, ${colors.spaceStation}20 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
          color: colors.spaceStation,
        }}
      >
        {/* Floating background elements */}
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
          style={{
            background: `radial-gradient(circle, ${colors.cornflower}30, ${colors.irishGreen}20, ${colors.yellowOrange}15)`,
          }}
          animate={{
            x: [0, 60, -20, 40, 0],
            y: [0, -40, 20, -30, 0],
            scale: [1, 1.2, 0.8, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.div
          className="absolute top-96 -right-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
          style={{
            background: `radial-gradient(circle, ${colors.irishGreen}30, ${colors.yellowOrange}20, ${colors.cornflower}15)`,
          }}
          animate={{
            x: [0, -50, 30, -20, 0],
            y: [0, 30, -40, 10, 0],
            scale: [1, 0.9, 1.3, 0.7, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Magical Navbar */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="sticky top-0 left-0 right-0 z-50 flex justify-center"
        >
          <div
            className="mx-4 mt-4 rounded-2xl border shadow-2xl backdrop-blur-md max-w-4xl w-full"
            style={{
              backgroundColor: `${colors.ogre}E8`,
              borderColor: `${colors.yellowOrange}40`,
              boxShadow: `0 4px 30px ${colors.yellowOrange}20`,
            }}
          >
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <motion.div
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="hidden sm:block ">
                    <p
                      className={`${hpFont.className} text-lg font-bold tracking-wide`}
                      style={{ color: colors.yellowOrange }}
                    >
                      HACK-A-TRON
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: colors.spaceStation }}
                    >
                      3.0
                    </p>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.button
                  onClick={openRegistrationCard}
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center space-x-2"
                  style={{
                    backgroundColor: colors.yellowOrange,
                    color: colors.ogre,
                  }}
                >
                  <span>Register</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section className="relative pt-20 pb-20 px-4">
          <div className="max-w-7xl w-full mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="relative w-full aspect-3/1 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://res.cloudinary.com/dlupkibvq/image/upload/v1766500317/uxfyefedmcfubjedxanq.png"
                  alt={hackathonDetails.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
            <div className="h-4 "></div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12 place-items-center"
            >
              {[
                {
                  label: "Event Date",
                  value: hackathonDetails.date,
                  icon: (
                    <Image
                      src="https://cdn-icons-png.flaticon.com/128/747/747310.png"
                      alt="Calendar"
                      width={32}
                      height={32}
                      className="mx-auto mb-3"
                    />
                  ),
                },
                {
                  label: "Duration",
                  value: hackathonDetails.time,
                  icon: (
                    <Image
                      src="https://cdn-icons-png.flaticon.com/128/2088/2088617.png"
                      alt="Clock"
                      width={32}
                      height={32}
                      className="mx-auto mb-3"
                    />
                  ),
                },
                {
                  label: "Venue",
                  value: hackathonDetails.venue,
                  icon: (
                    <Image
                      src="https://cdn-icons-png.flaticon.com/128/684/684908.png"
                      alt="Location"
                      width={32}
                      height={32}
                      className="mx-auto mb-3"
                    />
                  ),
                },
                {
                  label: "Networking",
                  value: "In-Person",
                  icon: (
                    <Image
                      src="https://cdn-icons-png.flaticon.com/128/1239/1239608.png"
                      alt="Location"
                      width={32}
                      height={32}
                      className="mx-auto mb-3"
                    />
                  ),
                },
              ].map((s, i) => (
                <StatCard
                  key={i}
                  icon={s.icon}
                  label={s.label}
                  value={s.value}
                />
              ))}
            </motion.div>

            {/* Countdown Timer */}
            <div className="mt-6">
              <CountdownTimer target={targetOverride} label={timerLabel} />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mt-6 justify-center items-center"
            >
              <motion.button
                onClick={openRegistrationCard}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 flex items-center gap-3"
                style={{
                  backgroundColor: colors.yellowOrange,
                  color: colors.ogre,
                }}
              >
                <span>Register Now</span>
                {isRegistered ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex flex-wrap justify-center gap-3"
            >
              <div
                className="px-4 py-2 rounded-full border"
                style={{
                  backgroundColor: `${colors.yellowOrange}20`,
                  color: colors.yellowOrange,
                  borderColor: `${colors.yellowOrange}60`,
                }}
              >
                <Image
                  src="https://cdn-icons-png.flaticon.com/128/2088/2088617.png"
                  alt="Clock"
                  width={16}
                  height={16}
                  className="inline mr-2"
                />
                Register by {hackathonDetails.registrationDeadline}
              </div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="px-4 pb-20 scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2
                  className="text-3xl font-bold mb-6"
                  style={{ color: colors.cornflower }}
                >
                  What is the {hackathonDetails.title}?
                </h2>
                <p
                  className="text-lg mb-6 leading-relaxed"
                  style={{ color: colors.spaceStation }}
                >
                  Step into a world of magic and innovation with a 24-hour Harry
                  Potter-themed hackathon organized by Google Developer Group –
                  Vishnu Institute of Technology. This unique hackathon combines
                  technology and creativity with the magic of the wizarding
                  world.
                </p>
                <p
                  className="text-lg mb-8 leading-relaxed"
                  style={{ color: colors.spaceStation }}
                >
                  Participants will be sorted into Hogwarts-inspired houses and
                  work collaboratively to design and develop innovative
                  solutions to real-world problems. The focus is on hands-on
                  development, logical thinking, and practical
                  implementation—open to both beginners and experienced
                  developers.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Image
                      src="https://cdn-icons-png.flaticon.com/128/3705/3705301.png"
                      alt="Code"
                      width={24}
                      height={24}
                      className="mt-1"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Learn & Build
                      </h3>
                      <p className="text-gray-600">
                        Gain hands-on experience with cutting-edge technologies
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Image
                      src="https://cdn-icons-png.flaticon.com/128/847/847969.png"
                      alt="Users"
                      width={24}
                      height={24}
                      className="mt-1"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Network & Collaborate
                      </h3>
                      <p className="text-gray-600">
                        Connect with like-minded developers and industry
                        professionals
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Image
                      src="https://cdn-icons-png.flaticon.com/128/3081/3081559.png"
                      alt="Lightbulb"
                      width={24}
                      height={24}
                      className="mt-1"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Innovate & Win
                      </h3>
                      <p className="text-gray-600">
                        Turn your ideas into reality and compete for amazing
                        prizes
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-lg border border-gray-200 shadow-md">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 mr-2" />
                      Why Participate?
                    </h3>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <Image
                          src="https://cdn-icons-png.flaticon.com/128/845/845646.png"
                          alt="Check"
                          width={20}
                          height={20}
                          className="mr-3 shrink-0"
                        />
                        <span>
                          Unique Themed Experience: A Harry Potter-inspired,
                          immersive hackathon
                        </span>
                      </li>
                      <li className="flex items-center">
                        <Image
                          src="https://cdn-icons-png.flaticon.com/128/845/845646.png"
                          alt="Check"
                          width={20}
                          height={20}
                          className="mr-3 shrink-0"
                        />
                        <span>
                          Hands-on Learning: Build practical, real-world
                          solutions in 24 hours
                        </span>
                      </li>
                      <li className="flex items-center">
                        <Image
                          src="https://cdn-icons-png.flaticon.com/128/845/845646.png"
                          alt="Check"
                          width={20}
                          height={20}
                          className="mr-3 shrink-0"
                        />
                        <span>
                          Team Collaboration: Work in houses, communicate, and
                          solve under pressure
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-md">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold">Event Highlights</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          24
                        </div>
                        <div className="text-sm text-gray-600">
                          Hours of Hacking
                        </div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          Open
                        </div>
                        <div className="text-sm text-gray-600">Innovation</div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          Guided
                        </div>
                        <div className="text-sm text-gray-600">Mentorship</div>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          Collaboration
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Tracks Section */}
        <section id="tracks" className="px-4 pb-20 scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
                Choose Your Track
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tracks.map((track, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-lg border border-brown-200 shadow-sm
             hover:shadow-xl hover:-translate-y-1
             transition-all duration-300 ease-out
             border-l-4 border-l-brown-400 hover:border-l-brown-600"
                  >
                    <div className="p-6">
                      <div
                        className={`w-12 h-12 rounded-lg bg-linear-to-r from-brown-400 to-brown-600 
              flex items-center justify-center text-2xl mb-3 text-white`}
                      >
                        <img
                          src={track.icon}
                          alt={track.title}
                          className="w-10 h-10"
                        />
                      </div>

                      <h3 className="text-xl font-bold mb-2">{track.title}</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {track.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section id="timeline" className="px-4 pb-20 scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
                Event Timeline
              </h2>
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-linear-to-b from-blue-500 to-purple-500"></div>
                  {timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative flex items-start mb-8 ml-8"
                    >
                      <div className="absolute -left-10 mt-1.5 w-4 h-4 bg-linear-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white shadow"></div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-gray-200 flex-1">
                        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.title}
                          </h3>
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 border border-gray-300">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Prizes Section */}
        {/*  <section id="prizes" className="px-4 pb-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
              Prize Pool: {hackathonDetails.totalPrizes}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {prizes.map((prize, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 text-center">
                    <div className={`${prize.color} text-white p-6 relative`}>
                      <div className="text-4xl mb-2">{prize.icon}</div>
                      <h3 className="text-xl font-bold">{prize.position}</h3>
                      {index === 0 && (
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs font-bold">
                            🏆 Winner
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {prize.amount}
                      </div>
                      <p className="text-gray-600">Cash Prize</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
*/}
        {/* Google Tech Stack Section */}
        <section className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-center mb-8">
                <h2
                  className="text-3xl font-bold mb-4"
                  style={{ color: colors.cornflower }}
                >
                  Mandatory Tech Stack
                </h2>
                <p
                  className="text-lg max-w-3xl mx-auto"
                  style={{ color: colors.spaceStation }}
                >
                  All participating teams{" "}
                  <span
                    style={{ color: colors.yellowOrange, fontWeight: "bold" }}
                  >
                    MUST
                  </span>{" "}
                  use at least one{" "}
                  <span
                    style={{ color: colors.yellowOrange, fontWeight: "bold" }}
                  >
                    Google
                  </span>{" "}
                  technology from the list below in their project solution.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    name: "Firebase",
                    logo: "https://img.icons8.com/?size=96&id=62452&format=png",
                    desc: "Backend-as-a-Service platform for web and mobile apps",
                    badge: "Realtime DB • Auth • Hosting",
                  },
                  {
                    name: "Google Cloud",
                    logo: "https://img.icons8.com/?size=512&id=WHRLQdbEXQ16&format=png",
                    desc: "Scalable cloud computing services and infrastructure",
                    badge: "AI/ML • Storage • Compute",
                  },
                  {
                    name: "Gemini",
                    logo: "https://static.vecteezy.com/system/resources/previews/055/687/055/non_2x/rectangle-gemini-google-icon-symbol-logo-free-png.png",
                    desc: "Google's multimodal generative AI model suite",
                    badge: "Generative AI • Multimodal",
                  },
                  {
                    name: "Google AI Studio",
                    logo: "https://img.icons8.com/?size=512&id=WHRLQdbEXQ16&format=png",
                    desc: "Build, test, and deploy with Gemini APIs",
                    badge: "Prompting • API Keys • Testing",
                  },
                ].map((tech, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="group"
                  >
                    <div
                      className="h-full transition-all duration-300 hover:scale-105 border-2 rounded-lg p-6 bg-white shadow-md"
                      style={{ borderColor: `${colors.cornflower}40` }}
                    >
                      <div className="text-center pb-4">
                        <div
                          className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3"
                          style={{ backgroundColor: `${colors.cornflower}20` }}
                        >
                          <Image
                            src={tech.logo}
                            alt={`${tech.name} logo`}
                            width={32}
                            height={32}
                          />
                        </div>
                        <h3
                          className="text-xl font-bold mb-3"
                          style={{ color: colors.cornflower }}
                        >
                          {tech.name}
                        </h3>
                        <p
                          className="text-sm mb-3"
                          style={{ color: colors.spaceStation }}
                        >
                          {tech.desc}
                        </p>
                        <span
                          className="inline-block px-3 py-1 text-xs rounded-full border"
                          style={{
                            backgroundColor: `${colors.yellowOrange}20`,
                            color: colors.yellowOrange,
                            borderColor: `${colors.yellowOrange}60`,
                          }}
                        >
                          {tech.badge}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-center mt-8"
              >
                <div
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border"
                  style={{
                    backgroundColor: `${colors.yellowOrange}20`,
                    borderColor: `${colors.yellowOrange}60`,
                  }}
                >
                  <CheckCircle
                    className="w-5 h-5"
                    style={{ color: colors.yellowOrange }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: colors.yellowOrange }}
                  >
                    Required for all submissions
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">
                {hackathonDetails.title}
              </h3>
              <p className="text-gray-400">
                Organized by GDG | OnCampus VIT Bhimavaram
              </p>
            </div>
            <div className="flex justify-center space-x-6 mb-6">
              <a
                href="https://www.linkedin.com/company/gdg-vitb/posts/?feedView=all"
                className="text-gray-400 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://www.instagram.com/gdgvitb/"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Instagram
              </a>
            </div>
            <p className="text-gray-500 text-sm">
              © 2025 GDG VIT Bhimavaram. All rights reserved.
            </p>
          </div>
        </footer>
      </motion.div>

      <RegistrationCard
        visible={showRegCard}
        onClose={() => setShowRegCard(false)}
        onRegister={() => {
          setIsRegistered(true);
          setShowRegCard(false);
        }}
        hack2skillLink={"https://vision.hack2skill.com/event/gdgoc-25-gdgvitb"}
        formLink="https://forms.gle/1yhQcDpzFVR9jQkd8"
      />
    </>
  );
};

const HackATron3Page = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2  mx-auto mb-4"></div>
            <p className="text-gray-600">HACK-A-TRON 3.0</p>
          </div>
        </div>
      }
    >
      <HackATron3Content />
    </Suspense>
  );
};

export default HackATron3Page;
