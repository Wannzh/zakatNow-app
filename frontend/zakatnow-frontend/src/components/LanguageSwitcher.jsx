import { useTranslation } from "react-i18next";
import { FaGlobe } from "react-icons/fa";

export default function LanguageSwitcher({ className }) {
  const { i18n } = useTranslation();

  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLang === 'id' ? 'en' : 'id';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={className}
      aria-label="Change language"
    >
      <FaGlobe />
      <span className="font-semibold">{currentLang.toUpperCase()}</span>
    </button>
  );
}