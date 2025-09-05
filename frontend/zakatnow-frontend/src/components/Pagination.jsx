import { useTranslation } from "react-i18next";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const { t } = useTranslation();

  const handlePrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between mt-6 text-white/80">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 0}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition"
      >
        <FaChevronLeft />
        {t("pagination.previous")}
      </button>
      <span>
        {t("pagination.page")} <strong>{currentPage + 1}</strong> {t("pagination.of")} <strong>{totalPages}</strong>
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage >= totalPages - 1}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition"
      >
        {t("pagination.next")}
        <FaChevronRight />
      </button>
    </div>
  );
}