import { useState } from "react";
import { useTranslation } from "react-i18next";
import { approveWithdrawal, rejectWithdrawal } from "../api/withdrawal";
import { showSuccess, showError } from "./Toast";

const StatusBadge = ({ status }) => {
  const statusStyles = {
    APPROVED: "bg-green-400 text-green-900",
    REJECTED: "bg-red-400 text-red-900",
    PENDING: "bg-yellow-400 text-yellow-900",
  };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-400 text-gray-900'}`}>{status || 'UNKNOWN'}</span>;
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, withdrawal }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;
  const isApprove = withdrawal.action === 'approve';
  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-green-800 p-6 rounded-lg shadow-xl text-white w-full max-w-sm border border-white/10">
        <h2 className="text-xl font-bold mb-4">{t(isApprove ? "modal.approveWithdrawalTitle" : "modal.rejectWithdrawalTitle")}</h2>
        <p className="mb-6">{t("modal.confirmWithdrawalMessage", { action: isApprove ? t('actions.approve') : t('actions.reject'), amount: formatCurrency(withdrawal.amount) })}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-white/20 rounded hover:bg-white/30 transition">{t("common.cancel")}</button>
          <button onClick={onConfirm} className={`px-4 py-2 font-semibold rounded transition ${isApprove ? 'bg-green-500 hover:bg-green-400 text-white' : 'bg-red-500 hover:bg-red-400 text-white'}`}>
            {t(isApprove ? "actions.approve" : "actions.reject")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function WithdrawalsTable({ withdrawals, onDataChange }) {
  const { t } = useTranslation();
  const [modalState, setModalState] = useState({ isOpen: false, withdrawal: null });
  const [loadingId, setLoadingId] = useState(null);

  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  const openConfirmation = (withdrawal, action) => {
    setModalState({ isOpen: true, withdrawal: { ...withdrawal, action } });
  };

  const handleAction = async () => {
    if (loadingId) return;
    const { id, action } = modalState.withdrawal;
    setLoadingId(id);
    try {
      if (action === 'approve') {
        await approveWithdrawal(id);
        showSuccess(t("withdrawals.approveSuccess"));
      } else {
        await rejectWithdrawal(id);
        showSuccess(t("withdrawals.rejectSuccess"));
      }
      onDataChange();
    } catch (err) {
      showError(t("withdrawals.actionError"));
    } finally {
      setLoadingId(null);
      setModalState({ isOpen: false, withdrawal: null });
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left whitespace-nowrap">
        <thead className="border-b border-white/20">
          <tr>
            <th className="p-4 text-sm font-semibold text-white/70">{t("table.campaignTitle")}</th>
            <th className="p-4 text-sm font-semibold text-white/70">{t("table.campaigner")}</th>
            <th className="p-4 text-sm font-semibold text-white/70">{t("table.amount")}</th>
            <th className="p-4 text-sm font-semibold text-white/70">{t("table.status")}</th>
            <th className="p-4 text-sm font-semibold text-white/70">{t("table.date")}</th>
            <th className="p-4 text-sm font-semibold text-white/70 text-center">{t("table.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((w) => (
            <tr key={w.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
              <td className="p-4 font-medium max-w-xs truncate">{w.campaignTitle}</td>
              <td className="p-4">{w.campaignerName}</td>
              <td className="p-4 font-mono text-yellow-300">{formatCurrency(w.amount)}</td>
              <td className="p-4"><StatusBadge status={w.status} /></td>
              <td className="p-4">{formatDate(w.requestedAt)}</td>
              <td className="p-4 text-center">
                {w.status === 'PENDING' ? (
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openConfirmation(w, 'approve')} disabled={loadingId === w.id} className="px-3 py-1 text-sm font-semibold bg-green-500 text-white rounded hover:bg-green-400 transition disabled:opacity-50">{t("actions.approve")}</button>
                    <button onClick={() => openConfirmation(w, 'reject')} disabled={loadingId === w.id} className="px-3 py-1 text-sm font-semibold bg-red-500 text-white rounded hover:bg-red-400 transition disabled:opacity-50">{t("actions.reject")}</button>
                  </div>
                ) : (
                  <span className="text-xs text-white/50 italic">{t("table.noActions")}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, withdrawal: null })}
        onConfirm={handleAction}
        withdrawal={modalState.withdrawal}
      />
    </div>
  );
}