import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getCampaigns } from "../api/campaign";
import { showError } from "../components/Toast";

const StatCard = ({ label, value, icon }) => (
  <motion.div variants={itemVariants} className="flex items-center gap-4 p-6 shadow-lg bg-white/10 rounded-2xl">
    <div className="p-3 rounded-full bg-white/10">{icon}</div>
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

  const currentAmount = typeof campaign.collectAmount === 'number'
    ? campaign.collectAmount
    : 0;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);

  return (
    <motion.div variants={itemVariants} className="flex flex-col justify-between p-5 shadow-lg bg-white/10 rounded-2xl">
      <div>
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold">{campaign.title}</h3>
          <StatusBadge status={campaign.status} />
        </div>

        <ProgressBar current={currentAmount} target={campaign.targetAmount} />

        <div className="flex justify-between mt-2 text-sm">
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
      <Link to="/admin-campaigns" className="w-full py-2 mt-4 font-semibold text-center transition-colors rounded-lg bg-white/20 hover:bg-white/30">
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
    const totalCollected = campaigns.reduce((acc, campaign) => acc + (campaign.collectAmount || 0), 0);
    const totalCampaigns = campaigns.length;
    return {
      totalCollected,
      totalCampaigns
    };
  }, [campaigns]);

  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="flex-1 min-h-screen p-8 text-white bg-gradient-to-br from-green-500 via-emerald-600 to-green-700">
      <motion.div
        className="mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className="mb-2 text-4xl font-bold">
          {t("adminDashboard.title")}
        </motion.h1>
        <motion.p variants={itemVariants} className="mb-8 text-lg text-white/80">
          {t("dashboard.welcome", { name: userName || 'Admin' })}
        </motion.p>

        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
          <StatCard label={t("adminDashboard.totalCollected")} value={formatCurrency(stats.totalCollected)} icon={"💰"} />
          <StatCard label={t("adminDashboard.activeCampaigns")} value={stats.totalCampaigns} icon={"🚀"} />
        </div>

        <motion.h2 variants={itemVariants} className="mb-6 text-2xl font-semibold text-white/90">
          {t("adminDashboard.activeCampaignsList")}
        </motion.h2>

        {loading ? (
          <motion.div variants={itemVariants} className="py-10 text-center text-white/80">
            {t("adminDashboard.loading")}
          </motion.div>
        ) : campaigns.length === 0 ? (
          <motion.div variants={itemVariants} className="p-10 text-center bg-white/10 rounded-2xl text-white/70">
            {t("adminDashboard.noCampaigns")}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}