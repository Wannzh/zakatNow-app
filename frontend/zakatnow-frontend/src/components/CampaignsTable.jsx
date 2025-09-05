import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaUserCircle, FaExclamationTriangle } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { approveCancelRequest, updateCampaignStatus } from "../api/campaign";
import { showSuccess, showError } from "./Toast";

const StatusBadge = ({ status }) => {
  const statusStyles = {
    ACTIVE: "bg-green-400 text-green-900",
    COMPLETED: "bg-blue-400 text-blue-900",
    CANCELLED: "bg-red-400 text-red-900",
    PENDING: "bg-yellow-400 text-yellow-900",
    CLOSED: "bg-gray-500 text-gray-100",
  };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-400 text-gray-900'}`}>{status || 'UNKNOWN'}</span>;
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, status }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-green-800 p-6 rounded-lg shadow-xl text-white w-full max-w-sm border border-white/10">
        <h2 className="text-xl font-bold mb-4">{t("modal.confirmTitle")}</h2>
        <p className="mb-6">{t("modal.confirmMessage", { status })}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-white/20 rounded hover:bg-white/30 transition">{t("common.cancel")}</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-yellow-400 text-green-900 font-semibold rounded hover:bg-yellow-300 transition">{t("modal.confirmButton")}</button>
        </div>
      </div>
    </div>
  );
};

const ReviewCancelModal = ({ isOpen, onClose, onAction, campaign }) => {
    const { t } = useTranslation();
    if (!isOpen || !campaign) return null;
    return (
      <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm">
        <div className="bg-green-800 p-6 rounded-lg shadow-xl text-white w-full max-w-md border border-white/10">
          <h2 className="text-xl font-bold mb-4">{t("modal.reviewTitle")}</h2>
          <p className="text-sm text-white/70 mb-2">{t("modal.campaignTitle")}: <span className="font-semibold text-white">{campaign.title}</span></p>
          <div className="bg-yellow-900/30 p-4 rounded-md border border-yellow-500/50 mb-6">
            <p className="text-sm font-semibold mb-1">{t("modal.cancelReason")}:</p>
            <p className="text-sm text-white/90 italic">"{campaign.cancelReason || 'No reason provided.'}"</p>
          </div>
          <div className="flex justify-end gap-4">
            <button onClick={() => onAction('approve')} className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-400 transition">{t("modal.approveButton")}</button>
          </div>
        </div>
      </div>
    );
};

export default function CampaignsTable({ campaigns, onDataChange }) {
  const { t } = useTranslation();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [statusModal, setStatusModal] = useState({ isOpen: false, campaignId: null, newStatus: null });
  const [reviewModal, setReviewModal] = useState({ isOpen: false, campaign: null });
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const handleStatusChange = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await updateCampaignStatus(statusModal.campaignId, statusModal.newStatus);
      showSuccess(t("modal.updateSuccess"));
      onDataChange();
    } catch (err) {
      showError(t("modal.updateError"));
    } finally {
      setLoading(false);
      setStatusModal({ isOpen: false, campaignId: null, newStatus: null });
    }
  };
  
  const handleReviewAction = async (action) => {
    if (loading) return;
    setLoading(true);
    const { id } = reviewModal.campaign;
    try {
      if (action === 'approve') {
        await approveCancelRequest(id);
        showSuccess(t("modal.approveSuccess"));
      }
      onDataChange();
    } catch (err) {
      showError(t("modal.actionError"));
    } finally {
      setLoading(false);
      setReviewModal({ isOpen: false, campaign: null });
    }
  };

  const openConfirmation = (campaignId, newStatus) => {
    setStatusModal({ isOpen: true, campaignId, newStatus });
    setOpenMenuId(null);
  };

  const availableStatuses = ['ACTIVE', 'COMPLETED', 'CLOSED', 'CANCELLED'];
  const finalStatuses = ['COMPLETED', 'CLOSED', 'CANCELLED'];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left whitespace-nowrap">
        <thead className="border-b border-white/20">
            <tr>
              <th className="p-4 text-sm font-semibold text-white/70">No.</th>
              <th className="p-4 text-sm font-semibold text-white/70">{t("table.title")}</th>
              <th className="p-4 text-sm font-semibold text-white/70">{t("table.campaigner")}</th>
              <th className="p-4 text-sm font-semibold text-white/70">{t("table.collected")}</th>
              <th className="p-4 text-sm font-semibold text-white/70">{t("table.target")}</th>
              <th className="p-4 text-sm font-semibold text-white/70">{t("table.status")}</th>
              <th className="p-4 text-sm font-semibold text-white/70 text-center">{t("table.actions")}</th>
            </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign, index) => (
            <tr key={campaign.id} className={`border-b border-white/10 transition-colors ${campaign.cancelRequested ? 'bg-yellow-900/20 hover:bg-yellow-900/30' : 'hover:bg-white/5'}`}>
              <td className="p-4">{index + 1}</td>
              <td className="p-4 font-medium max-w-xs truncate">{campaign.title}</td>
              <td className="p-4"><div className="flex items-center gap-2"><FaUserCircle className="text-green-200"/><span>{campaign.createdBy || 'N/A'}</span></div></td>
              <td className="p-4 font-mono text-yellow-300">{formatCurrency(campaign.currentAmount)}</td>
              <td className="p-4 font-mono">{formatCurrency(campaign.targetAmount)}</td>
              <td className="p-4"><StatusBadge status={campaign.status} /></td>
              <td className="p-4 text-center">
                {campaign.cancelRequested ? (
                  <button onClick={() => setReviewModal({ isOpen: true, campaign })} className="flex items-center gap-2 mx-auto px-3 py-1 bg-yellow-400 text-yellow-900 text-sm font-semibold rounded hover:bg-yellow-300">
                    <FaExclamationTriangle />
                    <span>{t("table.review")}</span>
                  </button>
                ) : finalStatuses.includes(campaign.status) ? (
                  <button className="p-2 rounded-full text-white/30 cursor-not-allowed" disabled><BsThreeDotsVertical /></button>
                ) : (
                  <div className="relative inline-block">
                    <button onClick={() => setOpenMenuId(openMenuId === campaign.id ? null : campaign.id)} className="p-2 rounded-full hover:bg-white/20 transition"><BsThreeDotsVertical /></button>
                    {openMenuId === campaign.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-green-800 rounded-md shadow-lg z-10 text-left border border-white/10">
                        <div className="py-1">
                          {availableStatuses.filter(s => s !== campaign.status).map(s => (<button key={s} onClick={() => openConfirmation(campaign.id, s)} className="block px-4 py-2 text-sm hover:bg-green-700 w-full text-left transition-colors">{t(`statuses.${s}`)}</button>))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmationModal isOpen={statusModal.isOpen} onClose={() => setStatusModal({ isOpen: false, campaignId: null, newStatus: null })} onConfirm={handleStatusChange} status={statusModal.newStatus} />
      <ReviewCancelModal isOpen={reviewModal.isOpen} onClose={() => setReviewModal({ isOpen: false, campaign: null })} onAction={handleReviewAction} campaign={reviewModal.campaign}/>
    </div>
  );
}