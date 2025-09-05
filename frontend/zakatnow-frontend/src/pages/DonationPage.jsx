// src/pages/DonationPage.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { getCampaignById } from "../api/campaign";
import { createDonation, getDonationStatusById } from "../api/donation"; // Import fungsi baru
import { showError, showSuccess } from "../components/Toast";
import { FaHeart, FaArrowLeft, FaCheckCircle, FaClipboard } from "react-icons/fa";

export default function DonationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState(null);
  const [campaignLoading, setCampaignLoading] = useState(true);
  const [campaignError, setCampaignError] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await getCampaignById(id);
        setCampaign(response.data);
      } catch (err) {
        setCampaignError(true);
        showError(t("donation.campaignLoadError"));
      } finally {
        setCampaignLoading(false);
      }
    };
    fetchCampaign();
  }, [id, t]);

  // Logika polling untuk memeriksa status donasi
  useEffect(() => {
    let intervalId;
    if (invoiceDetails && invoiceDetails.status === 'PENDING') {
      intervalId = setInterval(async () => {
        try {
          const response = await getDonationStatusById(invoiceDetails.externalId);
          setInvoiceDetails(response.data);
          
          if (response.data.status !== 'PENDING') {
            clearInterval(intervalId); // Hentikan polling jika status sudah berubah
            showSuccess(t("donation.paymentSuccess"));
          }
        } catch (err) {
          console.error("Failed to poll donation status:", err);
        }
      }, 5000); // Poll setiap 5 detik
    }

    // Fungsi cleanup untuk menghentikan interval saat komponen di-unmount atau kondisi berubah
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [invoiceDetails, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!amount || amount <= 0 || !paymentMethod) {
        showError(t("donation.invalidInput"));
        setLoading(false);
        return;
      }
      const donationData = {
        campaignId: id,
        amount: parseFloat(amount),
        paymentMethod,
      };
      const response = await createDonation(donationData);
      showSuccess(t("donation.success"));
      setInvoiceDetails(response.data);
    } catch (err) {
      showError(t("donation.error"));
    } finally {
      setLoading(false);
    }
  };

  const predefinedAmounts = [25000, 50000, 100000, 250000];
  const paymentOptions = ['BANK_TRANSFER', 'EWALLET', 'QRIS'];

  const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  if (campaignLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center bg-green-700 text-white">
        <p>{t("common.loading")}</p>
      </div>
    );
  }

  if (campaignError || !campaign) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center bg-red-700 text-white">
        <p>{t("donation.campaignNotFound")}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-green-600 via-emerald-500 to-green-700 text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-xl mx-auto bg-white/10 p-6 sm:p-8 rounded-2xl shadow-lg backdrop-blur-md"
      >
        <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white mb-6 flex items-center gap-2">
            <FaArrowLeft /> {t("donation.backToCampaign")}
        </button>
        
        {invoiceDetails ? (
          // Tampilan Invoice setelah donasi berhasil
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <div className="flex justify-center mb-4 text-yellow-400">
              <FaCheckCircle size={60} />
            </div>
            <h1 className="text-3xl font-bold text-center mb-2">{t("donation.invoiceTitle")}</h1>
            <p className="text-center text-green-200 mb-6">{t("donation.invoiceSuccess")}</p>

            <div className="bg-white/10 p-6 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">{t("donation.invoiceAmount")}</p>
                <p className="text-2xl font-bold text-yellow-300">{formatCurrency(invoiceDetails.amount)}</p>
              </div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">{t("donation.invoiceStatus")}</p>
                <p className={`font-semibold ${invoiceDetails.status === 'PENDING' ? 'text-yellow-400' : 'text-green-400'}`}>{invoiceDetails.status}</p>
              </div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">{t("donation.invoiceId")}</p>
                <p className="text-sm font-mono flex items-center gap-2">{invoiceDetails.externalId}
                  <button onClick={() => navigator.clipboard.writeText(invoiceDetails.externalId)} className="text-white/50 hover:text-white transition">
                    <FaClipboard />
                  </button>
                </p>
              </div>
            </div>

            <p className="text-center text-sm text-green-200 mb-4">{t("donation.invoiceMessage")}</p>

            {/* Tombol aksi */}
            <a href={invoiceDetails.invoiceUrl} target="_blank" rel="noopener noreferrer" 
              className="w-full block text-center bg-yellow-400 text-green-900 font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-yellow-300 transition-transform transform hover:-translate-y-0.5">
              {t("donation.viewInvoice")}
            </a>
          </motion.div>
        ) : (
          // Tampilan Formulir Donasi
          <motion.div initial={{ y: 0, opacity: 1 }} animate={{ y: 0, opacity: 1 }}>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t("donation.title")}</h1>
            <p className="text-green-200 mb-6">{t("donation.forCampaign", { title: campaign.title })}</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2" htmlFor="amount">{t("donation.amount")}</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {predefinedAmounts.map(val => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setAmount(val)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${amount === val ? 'bg-yellow-400 text-green-900' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                      {formatCurrency(val)}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={t("donation.amountPlaceholder")}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">{t("donation.paymentMethod")}</label>
                <div className="flex flex-wrap gap-2">
                  {paymentOptions.map(method => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${paymentMethod === method ? 'bg-yellow-400 text-green-900' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                      {t(`donation.paymentMethods.${method}`)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-sm font-bold">{t("donation.finalAmount")}:</p>
                <p className="text-3xl font-bold text-yellow-300">
                    {formatCurrency(amount || 0)}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full mt-6 py-4 px-8 rounded-lg shadow-lg font-bold text-green-900 bg-yellow-400 hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
                disabled={loading || !paymentMethod}
              >
                {loading ? t("donation.processing") : <><FaHeart /> {t("donation.submit")}</>}
              </motion.button>
            </form>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}