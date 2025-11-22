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
    <div className="w-full h-4 my-2 rounded-full bg-white/20">
      <motion.div
        className="h-4 bg-yellow-400 rounded-full"
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
    
    const interval = setInterval(fetchCampaign, 5000);

    return () => clearInterval(interval);

  }, [id, t]);

  if (loading) return <div className="min-h-screen p-12 text-center text-white bg-green-700">{t("common.loading")}</div>;
  if (error || !campaign) {
      return <div className="min-h-screen p-12 text-center text-white bg-green-700">{t("errors.notFound")}</div>;
  }
  
  const formatCurrency = (amount) => {
    const numericAmount = typeof amount === 'number' ? amount : 0;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(numericAmount);
  };

  return (
    <main className="min-h-screen p-4 text-white sm:p-8 bg-gradient-to-br from-green-600 via-emerald-500 to-green-700">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl p-6 mx-auto shadow-lg bg-white/10 sm:p-8 rounded-2xl backdrop-blur-md"
      >
        <img 
            src={campaign.imageUrl || 'https://placehold.co/1200x600/10B981/FFFFFF?text=ZakatNow'} 
            alt={campaign.title}
            className="object-cover w-full mb-6 rounded-lg h-60" 
        />
        
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{campaign.title}</h1>

        <div className="flex items-center gap-3 mb-6 text-sm text-green-200">
            <FaUserCircle size={24} />
            <span dangerouslySetInnerHTML={{ __html: t("campaignDetail.createdBy", { name: campaign.createdBy || t("common.anonymous") }) }}></span>
        </div>

        <p className="mb-8 leading-relaxed text-green-100">{campaign.description}</p>

        <div className="p-6 rounded-lg bg-white/10">
          <ProgressBar current={campaign.collectAmount} target={campaign.targetAmount} />
          <div className="flex items-center justify-between mt-2 text-sm">
            <p><span className="font-bold text-yellow-300">{formatCurrency(campaign.collectAmount)}</span> {t("table.collected")}</p>
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