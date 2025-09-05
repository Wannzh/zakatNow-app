import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getCampaigns } from "../api/campaign";
import { showError } from "../components/Toast";
import CampaignsTable from "../components/CampaignsTable";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

export default function AdminCampaigns() {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ACTIVE');

  const filterStatuses = ['ALL', 'ACTIVE', 'COMPLETED', 'CLOSED', 'CANCELLED'];

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      if (activeFilter === 'ALL') {
        const statusesToFetch = ['ACTIVE', 'COMPLETED', 'CLOSED', 'CANCELLED'];
        const promises = statusesToFetch.map(status => getCampaigns(status));
        const results = await Promise.allSettled(promises);
        const allCampaigns = results
          .filter(r => r.status === 'fulfilled' && r.value.data)
          .flatMap(r => r.value.data || []);
        setCampaigns(allCampaigns);
      } else {
        const response = await getCampaigns(activeFilter);
        setCampaigns(response.data || []);
      }
    } catch (error) {
      showError(t("adminCampaigns.fetchError"));
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [t, activeFilter]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return (
    <div className="flex-1 min-h-screen p-8 bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 text-white">
      <motion.div className="max-w-7xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold">{t("adminCampaigns.title")}</h1>
          <Link to="/admin-campaigns/create" className="bg-yellow-400 text-green-900 font-semibold py-2 px-5 rounded-lg shadow-lg hover:bg-yellow-300 transition-transform transform hover:scale-105">
            {t("adminCampaigns.createButton")}
          </Link>
        </motion.div>
        <motion.div variants={itemVariants} className="mb-6 flex flex-wrap gap-2">
          {filterStatuses.map(status => (
            <button key={status} onClick={() => setActiveFilter(status)} className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeFilter === status ? 'bg-yellow-400 text-green-900' : 'bg-white/10 hover:bg-white/20'}`}>
              {t(`statuses.${status}`)}
            </button>
          ))}
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-lg">
          {loading ? (<p className="text-center py-8">{t("common.loading")}</p>) : campaigns.length > 0 ? (<CampaignsTable campaigns={campaigns} onDataChange={fetchCampaigns} />) : (<p className="text-center py-8 text-white/70">{t("adminDashboard.noCampaigns")}</p>)}
        </motion.div>
      </motion.div>
    </div>
  );
}