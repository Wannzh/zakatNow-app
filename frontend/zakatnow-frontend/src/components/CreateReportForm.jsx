import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getCampaignList } from "../api/campaign";
import { createReport } from "../api/report";
import { showSuccess, showError } from "./Toast";

export default function CreateReportForm({ onReportCreated }) {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    campaignId: '',
    description: '',
    startDate: '',
    endDate: '',
    format: 'excel',
  });

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await getCampaignList();
        setCampaigns(response.data || []);
      } catch (error) {
        console.error("Failed to fetch campaign list", error);
      }
    };
    fetchCampaigns();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createReport(form);
      showSuccess(t("reports.createSuccess"));
      onReportCreated();
      setForm({ campaignId: '', description: '', startDate: '', endDate: '', format: 'excel' });
    } catch (error) {
      showError(t("reports.createError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-lg h-full">
      <h2 className="text-2xl font-bold mb-6">{t("reports.createTitle")}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="campaignId" className="block mb-2 text-sm text-green-100">{t("reports.selectCampaign")}</label>
          <select name="campaignId" id="campaignId" value={form.campaignId} onChange={handleChange} required className="w-full bg-white/20 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition appearance-none">
            <option value="" disabled>{t("reports.pleaseSelect")}</option>
            {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="description" className="block mb-2 text-sm text-green-100">{t("reports.description")}</label>
          <textarea name="description" id="description" value={form.description} onChange={handleChange} rows="3" className="w-full bg-white/20 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition" required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block mb-2 text-sm text-green-100">{t("reports.startDate")}</label>
            <input type="date" name="startDate" id="startDate" value={form.startDate} onChange={handleChange} required className="w-full bg-white/20 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition" />
          </div>
          <div>
            <label htmlFor="endDate" className="block mb-2 text-sm text-green-100">{t("reports.endDate")}</label>
            <input type="date" name="endDate" id="endDate" value={form.endDate} onChange={handleChange} required className="w-full bg-white/20 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition" />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-sm text-green-100">{t("reports.format")}</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2"><input type="radio" name="format" value="excel" checked={form.format === 'excel'} onChange={handleChange} className="form-radio bg-white/20" /> Excel</label>
            <label className="flex items-center gap-2"><input type="radio" name="format" value="pdf" checked={form.format === 'pdf'} onChange={handleChange} className="form-radio bg-white/20" /> PDF</label>
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-yellow-400 text-green-900 font-semibold py-3 rounded-lg shadow-lg hover:bg-yellow-300 transition disabled:opacity-50">
          {loading ? t("common.loading") : t("reports.generateButton")}
        </button>
      </form>
    </div>
  );
}