import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { getReports } from "../api/report";
import { showError } from "../components/Toast";
import CreateReportForm from "../components/CreateReportForm";
import ReportsList from "../components/ReportsList";

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

export default function AdminReports() {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getReports();
      setReports(response.data || []);
    } catch (error) {
      showError(t("reports.fetchError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div className="flex-1 min-h-screen p-8 bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 text-white">
      <motion.div className="max-w-7xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
        <h1 className="text-4xl font-bold mb-8">{t("reports.pageTitle")}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CreateReportForm onReportCreated={fetchReports} />
          {loading ? (
            <div className="bg-white/10 p-6 rounded-2xl flex justify-center items-center"><p>{t("common.loading")}</p></div>
          ) : (
            <ReportsList reports={reports} />
          )}
        </div>
      </motion.div>
    </div>
  );
}