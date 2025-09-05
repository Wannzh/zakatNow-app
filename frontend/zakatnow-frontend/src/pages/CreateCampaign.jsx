// src/pages/CreateCampaign.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { createCampaign } from "../api/campaign";
import { showSuccess, showError } from "../components/Toast";

export default function CreateCampaign() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    title: "",
    description: "",
    targetAmount: "",
    // Tambahkan field lain jika ada, misal: imageUrl, deadline
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const userId = authData?.id;
      if (!userId) {
        showError("Sesi Anda telah berakhir, silakan login kembali.");
        navigate('/login');
        return;
      }
      
      await createCampaign(form, userId);
      showSuccess(t("campaignForm.createSuccess"));
      navigate("/dashboard"); // Arahkan ke dashboard pengguna setelah berhasil
    } catch (err) {
      console.error("Gagal membuat kampanye:", err);
      showError(t("campaignForm.submitError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-green-600 via-emerald-500 to-green-700 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-center">{t("createCampaign.title")}</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white/10 p-8 rounded-2xl shadow-lg backdrop-blur-md">
          {/* Input Judul */}
          <div>
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-green-100">{t("table.title")}</label>
            <input type="text" name="title" id="title" value={form.title} onChange={handleChange} className="w-full bg-white/20 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition" placeholder={t("createCampaign.titlePlaceholder")} required />
          </div>

          {/* Input Deskripsi */}
          <div>
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-green-100">{t("campaignForm.description")}</label>
            <textarea name="description" id="description" value={form.description} onChange={handleChange} rows="5" className="w-full bg-white/20 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition" placeholder={t("createCampaign.descPlaceholder")} required></textarea>
          </div>

          {/* Input Target Donasi */}
          <div>
            <label htmlFor="targetAmount" className="block mb-2 text-sm font-medium text-green-100">{t("table.target")}</label>
            <input type="number" name="targetAmount" id="targetAmount" value={form.targetAmount} onChange={handleChange} className="w-full bg-white/20 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition" placeholder="Contoh: 50000000" required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-yellow-400 text-green-900 font-semibold py-3 rounded-lg shadow-lg hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? t("common.loading") : t("createCampaign.submitButton")}
          </button>
        </form>
      </motion.div>
    </main>
  );
}