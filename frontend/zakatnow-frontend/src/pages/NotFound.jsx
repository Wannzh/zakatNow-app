// src/components/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  const navigate = useNavigate();

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { ease: "easeOut" } },
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-6 py-12 overflow-hidden bg-gradient-to-tr from-indigo-50 via-purple-100 to-pink-50">
      {/* Subtle animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 opacity-20 animate-gradient-x"
        aria-hidden="true"
        initial={{ x: 0 }}
        animate={{ x: ["0%", "100%", "0%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="relative flex flex-col items-center w-full max-w-5xl gap-12 md:flex-row md:items-start"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left side: Text content */}
        <motion.div className="flex flex-col items-center text-center md:items-start md:text-left" variants={itemVariants}>
          {/* Large 404 with creative styling */}
          <h1
            aria-label="404"
            className="text-[10rem] font-extrabold leading-none select-none flex space-x-4"
          >
            <span className="text-indigo-600 transition-colors cursor-default drop-shadow-lg hover:text-indigo-700">
              4
            </span>
            <span className="relative text-pink-600 transition-colors cursor-default drop-shadow-lg hover:text-pink-700">
              0
              {/* Subtle texture pattern inside zero */}
              <svg
                aria-hidden="true"
                className="absolute inset-0 w-full h-full opacity-20"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="dots"
                    x="0"
                    y="0"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="1" cy="1" r="1" fill="currentColor" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dots)" />
              </svg>
            </span>
            <span className="text-indigo-600 transition-colors cursor-default drop-shadow-lg hover:text-indigo-700">
              4
            </span>
          </h1>

          {/* Catchy phrase */}
          <h2 className="mb-4 text-3xl font-semibold text-gray-800 select-none md:text-4xl">
            Lost in the Digital Wilderness?
          </h2>

          {/* Description */}
          <p className="max-w-md mb-8 leading-relaxed text-gray-700">
            It looks like the page you were looking for decided to go on an
            adventure without us. Let&apos;s get you back on track!
          </p>

          {/* Call to action button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-block px-8 py-3 font-semibold text-white transition transform bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 hover:-translate-y-1 active:translate-y-0 active:scale-95"
            aria-label="Take me back home"
            type="button"
          >
            Take Me Back
          </button>
        </motion.div>

        {/* Right side: Animated SVG illustration */}
        <motion.div
          className="w-full max-w-md select-none md:max-w-lg"
          variants={itemVariants}
          aria-hidden="true"
        >
          {/* SVG astronaut floating */}
          <svg
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <motion.g
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Helmet */}
              <circle cx="200" cy="150" r="60" fill="#6366F1" />
              <circle cx="200" cy="150" r="50" fill="#A5B4FC" />
              <circle cx="200" cy="150" r="40" fill="#EEF2FF" />
              {/* Visor reflection */}
              <motion.path
                d="M160 130 Q200 110 240 130"
                stroke="#C7D2FE"
                strokeWidth="6"
                strokeLinecap="round"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Body */}
              <rect
                x="140"
                y="210"
                width="120"
                height="140"
                rx="40"
                ry="40"
                fill="#818CF8"
                stroke="#4F46E5"
                strokeWidth="6"
              />
              {/* Backpack */}
              <rect
                x="110"
                y="230"
                width="40"
                height="80"
                rx="15"
                ry="15"
                fill="#A5B4FC"
                stroke="#4F46E5"
                strokeWidth="4"
              />
              {/* Arms */}
              <motion.path
                d="M140 250 Q100 280 140 310"
                stroke="#818CF8"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
                animate={{ rotate: [0, 10, 0] }}
                transformOrigin="140 280"
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.path
                d="M260 250 Q300 280 260 310"
                stroke="#818CF8"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
                animate={{ rotate: [0, -10, 0] }}
                transformOrigin="260 280"
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Legs */}
              <rect
                x="160"
                y="350"
                width="30"
                height="40"
                rx="15"
                ry="15"
                fill="#6366F1"
              />
              <rect
                x="210"
                y="350"
                width="30"
                height="40"
                rx="15"
                ry="15"
                fill="#6366F1"
              />
              {/* Stars around */}
              <motion.circle
                cx="80"
                cy="80"
                r="5"
                fill="#FBBF24"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0 }}
              />
              <motion.circle
                cx="320"
                cy="60"
                r="3"
                fill="#FBBF24"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              />
              <motion.circle
                cx="350"
                cy="150"
                r="4"
                fill="#FBBF24"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 5, repeat: Infinity, delay: 2 }}
              />
              <motion.circle
                cx="60"
                cy="200"
                r="3"
                fill="#FBBF24"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, delay: 3 }}
              />
            </motion.g>
          </svg>
        </motion.div>
      </motion.div>

      {/* Tailwind custom animation for background gradient */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 30s ease infinite;
        }
      `}</style>
    </div>
  );
}