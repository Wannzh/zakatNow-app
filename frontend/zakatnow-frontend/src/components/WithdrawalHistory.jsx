import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getCampaignWithdrawalHistory } from "../api/withdrawal";

const StatusBadge = ({ status }) => { /* ... (sama seperti di WithdrawalsTable) ... */ };

export default function WithdrawalHistory({ campaignId, refreshTrigger }) {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await getCampaignWithdrawalHistory(campaignId);
        setHistory(response.data || []);
      } catch (error) {
        console.error("Failed to fetch withdrawal history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [campaignId, refreshTrigger]);
  
  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { timeZone: 'UTC', day: '2-digit', month: 'short', year: 'numeric' });

  if (loading) return <p className="text-center text-white/70 py-4">{t("common.loading")}</p>;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg text-white/90">{t("withdrawals.historyTitle")}</h3>
      {history.length > 0 ? (
        <ul className="bg-white/5 p-4 rounded-lg">
          {history.map(item => (
            <li key={item.id} className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0">
              <div>
                <p className="font-semibold">{formatCurrency(item.amount)}</p>
                <p className="text-xs text-white/60">{formatDate(item.requestedAt)}</p>
              </div>
              <StatusBadge status={item.status} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-white/60 py-4">{t("withdrawals.noHistory")}</p>
      )}
    </div>
  );
}