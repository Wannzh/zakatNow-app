import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { getWithdrawals } from "../api/withdrawal";
import { showError } from "../components/Toast";
import WithdrawalsTable from "../components/WithdrawalsTable";
import Pagination from "../components/Pagination";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function AdminWithdrawals() {
  const { t } = useTranslation();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState({ currentPage: 0, totalPages: 1 });

  const fetchWithdrawals = useCallback(async (pageToFetch) => {
    setLoading(true);
    try {
      const response = await getWithdrawals(pageToFetch);
      const data = response.data;
      setWithdrawals(data.content || []);
      
      const newTotalPages = data.totalPages || 1;
      // Mencegah error jika halaman saat ini lebih besar dari total halaman (misal setelah item terakhir dihapus)
      if (pageToFetch >= newTotalPages && newTotalPages > 0) {
        setPageInfo({ currentPage: newTotalPages - 1, totalPages: newTotalPages });
      } else {
        setPageInfo({ currentPage: data.number || 0, totalPages: newTotalPages });
      }
    } catch (error) {
      showError(t("withdrawals.fetchError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchWithdrawals(pageInfo.currentPage);
  }, [pageInfo.currentPage, fetchWithdrawals]);

  const handlePageChange = (newPage) => {
    setPageInfo(prev => ({ ...prev, currentPage: newPage }));
  };
  
  const handleDataChange = useCallback(() => {
    fetchWithdrawals(pageInfo.currentPage);
  }, [fetchWithdrawals, pageInfo.currentPage]);

  return (
    <div className="flex-1 min-h-screen p-8 bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 text-white">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-8">
          {t("withdrawals.title")}
        </motion.h1>
        <motion.div variants={itemVariants} className="bg-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-lg">
          {loading ? (
            <p className="text-center py-16">{t("common.loading")}</p>
          ) : withdrawals.length > 0 ? (
            <>
              <WithdrawalsTable withdrawals={withdrawals} onDataChange={handleDataChange} />
              <Pagination currentPage={pageInfo.currentPage} totalPages={pageInfo.totalPages} onPageChange={handlePageChange} />
            </>
          ) : (
            <p className="text-center py-16 text-white/70">{t("withdrawals.noWithdrawals")}</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}