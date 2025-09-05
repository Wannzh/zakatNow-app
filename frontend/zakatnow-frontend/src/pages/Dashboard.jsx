// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { getCampaigns } from '../api/campaign';
import { showError } from '../components/Toast';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

export default function Dashboard() {
    const { t } = useTranslation();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('User'); // State baru untuk nama pengguna

    useEffect(() => {
        // Ambil nama pengguna dari localStorage
        const authData = localStorage.getItem('auth');
        if (authData) {
            try {
                const user = JSON.parse(authData);
                if (user && user.username) {
                    setUserName(user.username);
                }
            } catch (err) {
                console.error("Failed to parse auth data from localStorage:", err);
            }
        }

        async function fetchCampaigns() {
            try {
                const res = await getCampaigns('ACTIVE');

                const fetchedData = Array.isArray(res.data) ? res.data : (res.data?.content || []);

                setCampaigns(fetchedData);
            } catch (err) {
                console.error("Failed to fetch campaigns:", err);
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
                    {t('dashboard.welcome', { name: userName })} {/* Menggunakan state 'userName' yang diperbarui */}
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
                                className="p-4 bg-white/10 rounded-lg shadow hover:bg-white/20 transition text-white flex items-center"
                            >
                                <Link to={`/campaigns/${c.id}`} className="flex items-center w-full">
                                    {c.imageUrl && (
                                        <img
                                            src={c.imageUrl}
                                            alt={c.title}
                                            className="w-16 h-16 object-cover rounded-lg mr-4"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    )}
                                    <div>
                                        <h3 className="font-bold">{c.title}</h3>
                                        <p className="text-sm text-white/70">{c.description?.substring(0, 100)}...</p>
                                    </div>
                                </Link>
                            </motion.li>
                        ))
                    )}
                </motion.ul>
            </motion.div>
        </div>
    );
}