// src/pages/Home.jsx
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center
                     bg-gradient-to-br from-green-600 via-emerald-500 to-green-700
                     text-white px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl"
      >
        {/* Branding */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide mb-4">
          {t("home.welcome", { appName: t("common.appName") })}
        </h1>

        {/* Tagline */}
        <p className="text-lg md:text-xl leading-relaxed mb-8 opacity-90">
          {t("home.tagline")}
        </p>

        {/* Call To Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Main CTA */}
          <Link
            to="/login"
            className="w-full sm:w-auto bg-yellow-400 text-green-900 font-semibold py-3 px-8 rounded-full
                       shadow-lg hover:bg-yellow-300 transition-transform transform hover:-translate-y-0.5"
          >
            {t("home.cta")}
          </Link>

          {/* Secondary "About" Button */}
          <Link
            to="/about"
            className="w-full sm:w-auto border-2 border-white text-white font-semibold py-3 px-8 rounded-full
                       hover:bg-white/10 transition-transform transform hover:-translate-y-0.5"
          >
            {t("home.aboutButton")}
          </Link>
        </div>

        {/* Footer tagline */}
        <p className="mt-10 text-sm opacity-75">{t("home.footer")}</p>
      </motion.div>
    </main>
  );
}