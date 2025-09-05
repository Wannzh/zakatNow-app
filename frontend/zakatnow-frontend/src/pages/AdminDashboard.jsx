import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getCampaigns } from "../api/campaign";
import { showError } from "../components/Toast";

const StatCard = ({ label, value, icon }) => (
  <motion.div variants={itemVariants} className="bg-white/10 p-6 rounded-2xl shadow-lg flex items-center gap-4">
    <div className="bg-white/10 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm text-white/70">{label}</p>
    </div>
  </motion.div>
);

const StatusBadge = ({ status }) => {
  const statusStyles = {
    ACTIVE: "bg-green-400 text-green-900",
    COMPLETED: "bg-blue-400 text-blue-900",
    CANCELLED: "bg-red-400 text-red-900",
    PENDING: "bg-yellow-400 text-yellow-900",
    CLOSED: "bg-gray-500 text-gray-100",
  };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-400 text-gray-900'}`}>{status || 'UNKNOWN'}</span>;
};

const ProgressBar = ({ current, target }) => {
  const percentage = target > 0 ? (current / target) * 100 : 0;
  return (
    <div className="w-full bg-white/20 rounded-full h-2.5 my-2">
      <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${percentage > 100 ? 100 : percentage}%` }} />
    </div>
  );
};

const CampaignCard = ({ campaign }) => {
  const { t } = useTranslation();

  const currentAmount = typeof campaign.currentAmount === 'number'
    ? campaign.currentAmount
    : 0;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);

  return (
    <motion.div variants={itemVariants} className="bg-white/10 p-5 rounded-2xl shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{campaign.title}</h3>
          <StatusBadge status={campaign.status} />
        </div>

        <ProgressBar current={currentAmount} target={campaign.targetAmount} />

        <div className="flex justify-between text-sm mt-2">
          <div>
            <p className="text-white/70">{t("table.collected")}</p>
            <p className="font-semibold text-yellow-300">{formatCurrency(currentAmount)}</p>
          </div>
          <div className="text-right">
            <p className="text-white/70">{t("table.target")}</p>
            <p className="font-semibold">{formatCurrency(campaign.targetAmount)}</p>
          </div>
        </div>
      </div>
      <Link to="/admin-campaigns" className="mt-4 text-center w-full bg-white/20 hover:bg-white/30 font-semibold py-2 rounded-lg transition-colors">
        {t("adminDashboard.manageButton")}
      </Link>
    </motion.div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

export default function AdminDashboard({ userName, onRefresh }) {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await getCampaigns('ACTIVE');
        const data = Array.isArray(res.data) ? res.data : (res.data?.content || []);
        setCampaigns(data);
      } catch (error) {
        showError(t("adminDashboard.loadError"));
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, [t, onRefresh]);

  const stats = useMemo(() => {
    const totalCollected = campaigns.reduce((acc, campaign) => acc + (campaign.currentAmount || 0), 0);
    const totalCampaigns = campaigns.length;
    return {
      totalCollected,
      totalCampaigns
    };
  }, [campaigns]);

  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="flex-1 min-h-screen p-8 bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 text-white">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-2">
          {t("adminDashboard.title")}
        </motion.h1>
        <motion.p variants={itemVariants} className="text-white/80 mb-8 text-lg">
          {t("dashboard.welcome", { name: userName || 'Admin' })}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard label={t("adminDashboard.totalCollected")} value={formatCurrency(stats.totalCollected)} icon={"💰"} />
          <StatCard label={t("adminDashboard.activeCampaigns")} value={stats.totalCampaigns} icon={"🚀"} />
        </div>

        <motion.h2 variants={itemVariants} className="text-2xl font-semibold text-white/90 mb-6">
          {t("adminDashboard.activeCampaignsList")}
        </motion.h2>

        {loading ? (
          <motion.div variants={itemVariants} className="text-center text-white/80 py-10">
            {t("adminDashboard.loading")}
          </motion.div>
        ) : campaigns.length === 0 ? (
          <motion.div variants={itemVariants} className="text-center bg-white/10 p-10 rounded-2xl text-white/70">
            {t("adminDashboard.noCampaigns")}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}