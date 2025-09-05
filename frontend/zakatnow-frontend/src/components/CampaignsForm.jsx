import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { createCampaign } from "../api/campaign";
import { showSuccess, showError } from "../components/Toast";
import { FaArrowLeft } from "react-icons/fa";

export default function CampaignForm() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [form, setForm] = useState({
        title: "",
        description: "",
        targetAmount: "",
        endDate: "",
        imageUrl: "",
        startDate: new Date().toISOString().split('T')[0],
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: name === 'targetAmount' ? Number(value) : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const authData = JSON.parse(localStorage.getItem("auth"));
            const userId = authData?.id;
            if (!userId) throw new Error("User ID not found");
            
            await createCampaign(form, userId);
            showSuccess(t("campaignForm.createSuccess"));
            navigate("/admin-campaigns");
        } catch (err) {
            const errorMessage = err.response?.data?.message || t("campaignForm.submitError");
            showError(errorMessage);
            console.error("Operasi kampanye gagal:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 min-h-screen p-8 bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto"
            >
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/admin-campaigns" className="text-2xl hover:text-yellow-300 transition-colors">
                        <FaArrowLeft />
                    </Link>
                    <h1 className="text-4xl font-bold">
                        {t("campaignForm.createTitle")}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white/10 p-8 rounded-2xl shadow-lg backdrop-blur-lg">
                    <div>
                        <label htmlFor="title" className="block mb-2 text-sm text-green-100">{t("table.title")}</label>
                        <input type="text" name="title" id="title" value={form.title} onChange={handleChange} className="w-full bg-white/20 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition" placeholder={t("campaignForm.titlePlaceholder")} required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block mb-2 text-sm text-green-100">{t("campaignForm.description")}</label>
                        <textarea name="description" id="description" value={form.description} onChange={handleChange} rows="6" className="w-full bg-white/20 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition" placeholder={t("campaignForm.descPlaceholder")} required></textarea>
                    </div>
                    <div>
                        <label htmlFor="targetAmount" className="block mb-2 text-sm text-green-100">{t("table.target")}</label>
                        <input type="number" name="targetAmount" id="targetAmount" value={form.targetAmount} onChange={handleChange} className="w-full bg-white/20 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition" placeholder="50000000" required />
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startDate" className="block mb-2 text-sm text-green-100">{t("reports.startDate")}</label>
                            <input type="date" name="startDate" id="startDate" value={form.startDate} onChange={handleChange} required className="w-full bg-white/20 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition" />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block mb-2 text-sm text-green-100">{t("campaignForm.endDate")}</label>
                            <input type="date" name="endDate" id="endDate" value={form.endDate} onChange={handleChange} className="w-full bg-white/20 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition" required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block mb-2 text-sm text-green-100">{t("campaignForm.imageUrl")}</label>
                        <input type="text" name="imageUrl" id="imageUrl" value={form.imageUrl} onChange={handleChange} className="w-full bg-white/20 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition" placeholder="https://contoh.com/gambar.jpg" />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-yellow-400 text-green-900 font-semibold py-3 rounded-lg shadow-lg hover:bg-yellow-300 transition disabled:opacity-50">
                        {loading ? t("campaignForm.saving") : t("campaignForm.createButton")}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}