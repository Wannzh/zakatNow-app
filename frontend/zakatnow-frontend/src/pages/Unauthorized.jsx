// src/pages/Unauthorized.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Unauthorized() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-500 via-rose-600 to-red-700 text-white px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Judul */}
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">403</h1>
        <p className="text-lg md:text-xl mb-8 opacity-90">
          {t("errors.unauthorized")}
        </p>

        {/* Tombol kembali ke login */}
        <Link
          to="/login"
          className="inline-block bg-white text-red-700 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-red-100 transition-transform transform hover:-translate-y-0.5"
        >
          {t("auth.login")}
        </Link>

        {/* Footer */}
        <p className="mt-8 text-sm opacity-70">
          {t("common.appName")} &copy; {new Date().getFullYear()}
        </p>
      </motion.div>
    </main>
  );
}
