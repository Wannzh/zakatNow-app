import { useState } from "react";
import { useTranslation } from "react-i18next";
import { downloadReport } from "../api/report";
import { showError } from "./Toast";
import { FaFilePdf, FaFileExcel, FaDownload } from "react-icons/fa";

export default function ReportsList({ reports }) {
  const { t } = useTranslation();
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownload = async (report) => {
    setDownloadingId(report.id);
    try {
      await downloadReport(report.id, report.format);
    } catch (error) {
      showError(t("reports.downloadError"));
    } finally {
      setDownloadingId(null);
    }
  };
  
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-lg h-full">
      <h2 className="text-2xl font-bold mb-6">{t("reports.listTitle")}</h2>
      <div className="space-y-3 max-h-[60vh] overflow-y-auto">
        {reports.length > 0 ? reports.map(report => (
          <div key={report.id} className="bg-white/5 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
              {report.format.toLowerCase() === 'pdf' ? <FaFilePdf className="text-red-400 text-2xl" /> : <FaFileExcel className="text-green-400 text-2xl" />}
              <div>
                <p className="font-semibold" title={report.description}>{report.campaignTitle}</p>
                <p className="text-xs text-white/60">{formatDate(report.createdAt)}</p>
              </div>
            </div>
            <button onClick={() => handleDownload(report)} disabled={downloadingId === report.id} className="p-2 bg-yellow-400 text-green-900 rounded-full hover:bg-yellow-300 transition disabled:opacity-50">
              {downloadingId === report.id ? <div className="w-5 h-5 border-2 border-t-transparent border-green-900 rounded-full animate-spin" /> : <FaDownload />}
            </button>
          </div>
        )) : (
          <p className="text-center text-white/70 py-16">{t("reports.noReports")}</p>
        )}
      </div>
    </div>
  );
}