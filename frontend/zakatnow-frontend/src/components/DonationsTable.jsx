import { useTranslation } from "react-i18next";

const StatusBadge = ({ status }) => {
  const statusStyles = {
    PAID: "bg-green-400 text-green-900",
    PENDING: "bg-yellow-400 text-yellow-900",
    FAILED: "bg-red-400 text-red-900",
  };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-400 text-gray-900'}`}>{status || 'UNKNOWN'}</span>;
};

export default function DonationsTable({ donations }) {
  const { t } = useTranslation();
  
  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left whitespace-nowrap">
        <thead className="border-b border-white/20">
          <tr>
            <th className="p-4 text-sm font-semibold text-white/70">{t("table.donationId")}</th>
            <th className="p-4 text-sm font-semibold text-white/70">{t("table.campaignTitle")}</th>
            <th className="p-4 text-sm font-semibold text-white/70">{t("table.donorName")}</th>
            <th className="p-4 text-sm font-semibold text-white/70">{t("table.amount")}</th>
            <th className="p-4 text-sm font-semibold text-white/70">{t("table.status")}</th>
            <th className="p-4 text-sm font-semibold text-white/70">{t("table.date")}</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
              <td className="p-4 font-mono text-xs text-white/60 truncate" title={donation.id}>{donation.id.substring(0, 8)}...</td>
              <td className="p-4 font-medium max-w-xs truncate">{donation.campaignTitle}</td>
              <td className="p-4">{donation.donatorName}</td>
              <td className="p-4 font-mono text-yellow-300">{formatCurrency(donation.amount)}</td>
              <td className="p-4"><StatusBadge status={donation.status} /></td>
              <td className="p-4">{formatDate(donation.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}