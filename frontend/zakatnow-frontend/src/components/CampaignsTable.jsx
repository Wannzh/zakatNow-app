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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm p-6 text-white bg-green-800 border rounded-lg shadow-xl border-white/10">
        <h2 className="mb-4 text-xl font-bold">{t("modal.confirmTitle")}</h2>
        <p className="mb-6">{t("modal.confirmMessage", { status })}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 transition rounded bg-white/20 hover:bg-white/30">{t("common.cancel")}</button>
          <button onClick={onConfirm} className="px-4 py-2 font-semibold text-green-900 transition bg-yellow-400 rounded hover:bg-yellow-300">{t("modal.confirmButton")}</button>
        </div>
      </div>
    </div>
  );
};

const ReviewCancelModal = ({ isOpen, onClose, onAction, campaign }) => {
    const { t } = useTranslation();
    if (!isOpen || !campaign) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="w-full max-w-md p-6 text-white bg-green-800 border rounded-lg shadow-xl border-white/10">
          <h2 className="mb-4 text-xl font-bold">{t("modal.reviewTitle")}</h2>
          <p className="mb-2 text-sm text-white/70">{t("modal.campaignTitle")}: <span className="font-semibold text-white">{campaign.title}</span></p>
          <div className="p-4 mb-6 border rounded-md bg-yellow-900/30 border-yellow-500/50">
            <p className="mb-1 text-sm font-semibold">{t("modal.cancelReason")}:</p>
            <p className="text-sm italic text-white/90">"{campaign.cancelReason || 'No reason provided.'}"</p>
          </div>
          <div className="flex justify-end gap-4">
            <button onClick={() => onAction('approve')} className="px-4 py-2 font-semibold text-white transition bg-red-500 rounded hover:bg-red-400">{t("modal.approveButton")}</button>
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
    <div className="overflow-x-auto pb-36">
      <table className="w-full text-left whitespace-nowrap">
        <thead className="border-b border-white/20">
            <tr>
              <th className="p-4 text-sm font-semibold text-white/70">No.</th>
              <th className="p-4 text-sm font-semibold text-white/70">{t("table.title")}</th>
              <th className="p-4 text-sm font-semibold text-white/70">{t("table.campaigner")}</th>
              <th className="p-4 text-sm font-semibold text-white/70">{t("table.collected")}</th>
              <th className="p-4 text-sm font-semibold text-white/70">{t("table.target")}</th>
              <th className="p-4 text-sm font-semibold text-white/70">{t("table.status")}</th>
              <th className="p-4 text-sm font-semibold text-center text-white/70">{t("table.actions")}</th>
            </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign, index) => (
            <tr key={campaign.id} className={`border-b border-white/10 transition-colors ${campaign.cancelRequested ? 'bg-yellow-900/20 hover:bg-yellow-900/30' : 'hover:bg-white/5'}`}>
              <td className="p-4">{index + 1}</td>
              <td className="max-w-xs p-4 font-medium truncate">{campaign.title}</td>
              <td className="p-4"><div className="flex items-center gap-2"><FaUserCircle className="text-green-200"/><span>{campaign.createdBy || 'N/A'}</span></div></td>
              <td className="p-4 font-mono text-yellow-300">{formatCurrency(campaign.collectAmount)}</td>
              <td className="p-4 font-mono">{formatCurrency(campaign.targetAmount)}</td>
              <td className="p-4"><StatusBadge status={campaign.status} /></td>
              <td className="p-4 text-center">
                {campaign.cancelRequested ? (
                  <button onClick={() => setReviewModal({ isOpen: true, campaign })} className="flex items-center gap-2 px-3 py-1 mx-auto text-sm font-semibold text-yellow-900 bg-yellow-400 rounded hover:bg-yellow-300">
                    <FaExclamationTriangle />
                    <span>{t("table.review")}</span>
                  </button>
                ) : finalStatuses.includes(campaign.status) ? (
                  <button className="p-2 rounded-full cursor-not-allowed text-white/30" disabled><BsThreeDotsVertical /></button>
                ) : (
                  <div className="relative inline-block">
                    <button onClick={() => setOpenMenuId(openMenuId === campaign.id ? null : campaign.id)} className="p-2 transition rounded-full hover:bg-white/20"><BsThreeDotsVertical /></button>
                    {openMenuId === campaign.id && (
                      <div className="absolute right-0 z-10 w-48 mt-2 text-left bg-green-800 border rounded-md shadow-lg border-white/10">
                        <div className="py-1">
                          {availableStatuses.filter(s => s !== campaign.status).map(s => (<button key={s} onClick={() => openConfirmation(campaign.id, s)} className="block w-full px-4 py-2 text-sm text-left transition-colors hover:bg-green-700">{t(`statuses.${s}`)}</button>))}
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