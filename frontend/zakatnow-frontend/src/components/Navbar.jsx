import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const auth = useMemo(() => {
    const authString = localStorage.getItem("auth");
    if (authString) {
      try {
        return JSON.parse(authString);
      } catch (error) {
        console.error("Gagal mem-parsing data auth dari localStorage:", error);
        return null;
      }
    }
    return null;
  }, []);

  const username = auth?.username;
  const roles = auth?.roles || [];

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex-shrink-0 font-bold text-xl">
            {t("common.appName")}
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/campaigns" className="hover:text-green-200 transition-colors hidden sm:block">{t("navbar.campaigns")}</Link>
            {roles.includes("ROLE_ADMIN") && (
              <Link to="/admin-dashboard" className="hover:text-green-200 transition-colors hidden sm:block">{t("navbar.admin")}</Link>
            )}

            <LanguageSwitcher className="flex items-center gap-2 p-2 rounded-full hover:bg-green-700 transition-colors" />

            <div className="hidden sm:block border-l border-white/20 h-8"></div>

            {username ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center gap-2">
                  <FaUserCircle />
                  <span className="font-semibold">{username}</span>
                </div>
                <button onClick={handleLogout} className="px-3 py-1 bg-green-500 rounded hover:bg-green-400 transition-colors">
                  {t("navbar.logout")}
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-green-500 rounded hover:bg-green-400 transition-colors font-semibold">
                {t("navbar.login")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}