import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { getCampaignById } from "../api/campaign";
import { FaUserCircle } from "react-icons/fa";

const ProgressBar = ({ current, target }) => {
  const numericCurrent = typeof current === 'number' ? current : 0;
  const numericTarget = typeof target === 'number' ? target : 0;
  const percentage = numericTarget > 0 ? (numericCurrent / numericTarget) * 100 : 0;
  
  return (
    <div className="w-full bg-white/20 rounded-full h-4 my-2">
      <motion.div
        className="bg-yellow-400 h-4 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${percentage > 100 ? 100 : percentage}%` }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </div>
  );
};

export default function CampaignDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await getCampaignById(id);
        setCampaign(response.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaign();
    
    const interval = setInterval(fetchCampaign, 10000);

    return () => clearInterval(interval);

  }, [id, t]);

  if (loading) return <div className="text-white text-center p-12 min-h-screen bg-green-700">{t("common.loading")}</div>;
  if (error || !campaign) {
      return <div className="text-white text-center p-12 min-h-screen bg-green-700">{t("errors.notFound")}</div>;
  }
  
  const formatCurrency = (amount) => {
    const numericAmount = typeof amount === 'number' ? amount : 0;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(numericAmount);
  };

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-green-600 via-emerald-500 to-green-700 text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto bg-white/10 p-6 sm:p-8 rounded-2xl shadow-lg backdrop-blur-md"
      >
        <img 
            src={campaign.imageUrl || 'https://placehold.co/1200x600/10B981/FFFFFF?text=ZakatNow'} 
            alt={campaign.title}
            className="w-full h-60 object-cover rounded-lg mb-6" 
        />
        
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{campaign.title}</h1>

        <div className="flex items-center gap-3 text-green-200 text-sm mb-6">
            <FaUserCircle size={24} />
            <span dangerouslySetInnerHTML={{ __html: t("campaignDetail.initiatedBy", { name: campaign.campaignerName || t("common.anonymous") }) }}></span>
        </div>

        <p className="text-green-100 leading-relaxed mb-8">{campaign.description}</p>

        <div className="bg-white/10 p-6 rounded-lg">
          <ProgressBar current={campaign.currentAmount} target={campaign.targetAmount} />
          <div className="flex justify-between items-center mt-2 text-sm">
            <p><span className="font-bold text-yellow-300">{formatCurrency(campaign.currentAmount)}</span> {t("table.collected")}</p>
            <p>{t("table.target")}: {formatCurrency(campaign.targetAmount)}</p>
          </div>
        </div>

        <div className="mt-8">
            <Link 
                to={`/campaigns/${id}/donate`}
                className="w-full block text-center bg-yellow-400 text-green-900 font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-yellow-300 transition-transform transform hover:-translate-y-0.5"
            >
                {t("campaign.donateNow")}
            </Link>
        </div>
      </motion.div>
    </main>
  );
}