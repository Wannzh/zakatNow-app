import { useState } from "react";
import { useTranslation } from "react-i18next";
import { requestWithdrawal } from "../api/withdrawal";
import { showSuccess, showError } from "./Toast";

export default function RequestWithdrawalModal({ isOpen, onClose, campaignId, onWithdrawalSuccess }) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const requestData = { campaignId, amount: Number(amount) };
      await requestWithdrawal(requestData);
      showSuccess(t("withdrawals.requestSuccess"));
      onWithdrawalSuccess(); 
      onClose();
    } catch (err) {
      showError(t("withdrawals.requestError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-green-800 p-6 rounded-lg shadow-xl text-white w-full max-w-sm border border-white/10">
        <h2 className="text-xl font-bold mb-4">{t("withdrawals.requestTitle")}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="amount" className="block mb-2 text-sm text-green-100">{t("withdrawals.amountToWithdraw")}</label>
            <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-white/20 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition" placeholder="0" required />
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white/20 rounded hover:bg-white/30 transition">{t("common.cancel")}</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-yellow-400 text-green-900 font-semibold rounded hover:bg-yellow-300 transition disabled:opacity-50">{t("withdrawals.submitRequest")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}