// src/pages/About.jsx
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaBullseye, FaHandsHelping, FaRegLightbulb } from 'react-icons/fa';

// Komponen Kartu Nilai (Value Card) - (tidak ada perubahan)
const ValueCard = ({ icon, title, text }) => (
  <motion.div
    variants={itemVariants}
    className="bg-white/10 p-6 rounded-lg text-center flex flex-col items-center"
  >
    <div className="text-4xl text-yellow-400 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-green-100 text-sm">{text}</p>
  </motion.div>
);

// Varian Animasi - (tidak ada perubahan)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function About() {
  const { t } = useTranslation();

  // --- LOGIKA DINAMIS UNTUK TOMBOL (DIPERBARUI) ---
  const authString = localStorage.getItem('auth');
  const isLoggedIn = !!authString;
  let userRole = null;

  if (isLoggedIn) {
    try {
      const authData = JSON.parse(authString);
      // Cek apakah authData.roles ada dan merupakan array yang berisi 'ROLE_ADMIN'
      if (authData && Array.isArray(authData.roles) && authData.roles.includes('ROLE_ADMIN')) {
        userRole = 'ROLE_ADMIN';
      } else {
        userRole = 'ROLE_USER'; // Default role jika login tapi bukan admin
      }
    } catch (error) {
      console.error("Gagal mem-parsing data auth dari localStorage:", error);
      // Jika terjadi error, anggap sebagai user biasa
      userRole = 'ROLE_USER';
    }
  }

  // Tentukan tujuan link dan teks tombol berdasarkan kondisi
  let destinationPath = '/login'; // Default untuk pengguna yang belum login
  let buttonTextKey = 'about.ctaButton'; // Teks default "Lihat Kampanye"

  if (isLoggedIn) {
    if (userRole === 'ROLE_ADMIN') {
      destinationPath = '/admin-dashboard';
    } else {
      destinationPath = '/dashboard';
    }
    buttonTextKey = 'about.backToDashboard'; // Teks untuk pengguna yang sudah login
  }
  // --- AKHIR LOGIKA DINAMIS ---


  const values = [
    {
      icon: <FaBullseye />,
      title: t("about.value1Title"),
      text: t("about.value1Text"),
    },
    {
      icon: <FaHandsHelping />,
      title: t("about.value2Title"),
      text: t("about.value2Text"),
    },
    {
      icon: <FaRegLightbulb />,
      title: t("about.value3Title"),
      text: t("about.value3Text"),
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-500 to-green-700 text-white">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto p-6 sm:p-12"
      >
        {/* Header, Misi, Nilai-Nilai (tidak ada perubahan di sini) */}
        <motion.section variants={itemVariants} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide mb-4">{t("about.title")}</h1>
          <p className="text-lg md:text-xl leading-relaxed text-green-100">{t("about.subtitle")}</p>
        </motion.section>
        <motion.section variants={itemVariants} className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-6">{t("about.missionTitle")}</h2>
          <p className="text-lg leading-relaxed text-center max-w-3xl mx-auto text-green-100">{t("about.missionText")}</p>
        </motion.section>
        <motion.section variants={itemVariants} className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">{t("about.valuesTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => <ValueCard key={value.title} {...value} />)}
          </div>
        </motion.section>

        {/* Ajakan Bergabung */}
        <motion.section variants={itemVariants} className="text-center bg-white/10 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">{t("about.ctaTitle")}</h2>
          <p className="text-lg leading-relaxed max-w-3xl mx-auto mb-6 text-green-100">
            {t("about.ctaText")}
          </p>

          {/* Gunakan variabel dinamis pada komponen Link */}
          <Link
            to={destinationPath}
            className="inline-block bg-yellow-400 text-green-900 font-semibold py-3 px-8 rounded-full
                       shadow-lg hover:bg-yellow-300 transition-transform transform hover:-translate-y-0.5"
          >
            {t(buttonTextKey)}
          </Link>
        </motion.section>
      </motion.div>
    </main>
  );
}