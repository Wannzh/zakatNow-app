import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { getAllDonations } from "../api/donation";
import { showError, showSuccess } from "../components/Toast";
import DonationsTable from "../components/DonationsTable";
import Pagination from "../components/Pagination";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function AdminDonations({ onDataChange }) {
  const { t } = useTranslation();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    totalPages: 1,
  });

  const fetchDonations = useCallback(async (page) => {
    setLoading(true);
    try {
      const response = await getAllDonations(page);
      setDonations(response.data.content || []);
      setPageInfo({
        currentPage: response.data.number || 0,
        totalPages: response.data.totalPages || 1,
      });
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      showError(t("adminDonations.fetchError"));
    } finally {
      setLoading(false);
    }
  }, [t, onDataChange]);

  useEffect(() => {
    fetchDonations(pageInfo.currentPage);
  }, [pageInfo.currentPage, fetchDonations]);

  const handlePageChange = (newPage) => {
    setPageInfo(prev => ({ ...prev, currentPage: newPage }));
  };

  return (
    <div className="flex-1 min-h-screen p-8 bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 text-white">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-8">
          {t("adminDonations.title")}
        </motion.h1>

        <motion.div variants={itemVariants} className="bg-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-lg">
          {loading ? (
            <p className="text-center py-16">{t("common.loading")}</p>
          ) : donations.length > 0 ? (
            <>
              <DonationsTable donations={donations} onDataChange={onDataChange} />
              <Pagination
                currentPage={pageInfo.currentPage}
                totalPages={pageInfo.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <p className="text-center py-16 text-white/70">{t("adminDonations.noDonations")}</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}