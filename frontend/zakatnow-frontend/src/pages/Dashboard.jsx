// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { getCampaigns } from '../api/campaign';
import { showError } from '../components/Toast';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Dashboard({ userName }) {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await getCampaigns();
        setCampaigns(res.data?.content || []);
      } catch (err) {
        showError(t('dashboard.loadError', 'Gagal load campaign'));
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, [t]);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-green-500 via-emerald-600 to-green-700">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold text-white mb-2"
        >
          {t('dashboard.title')}
        </motion.h1>
        <motion.p variants={itemVariants} className="text-white/80 mb-8 text-lg">
          {t('dashboard.welcome', { name: userName || 'User' })}
        </motion.p>

        <motion.h2 variants={itemVariants} className="text-2xl font-semibold text-white mb-4">
          {t('dashboard.campaignList')}
        </motion.h2>

        <motion.ul className="space-y-4">
          {loading ? (
            <motion.li variants={itemVariants} className="text-white/80">
              {t('dashboard.loading', 'Loading campaigns...')}
            </motion.li>
          ) : !campaigns.length ? (
            <motion.li variants={itemVariants} className="text-white/70">
              {t('dashboard.noCampaigns', 'No campaigns available.')}
            </motion.li>
          ) : (
            campaigns.map((c) => (
              <motion.li
                key={c.id}
                variants={itemVariants}
                className="p-4 bg-white/10 rounded-lg shadow hover:bg-white/20 transition cursor-pointer text-white"
              >
                {c.title}
              </motion.li>
            ))
          )}
        </motion.ul>
      </motion.div>
    </div>
  );
}
