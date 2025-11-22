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

  let logoTarget = "/";
  if (username) {
    if (roles.includes("ROLE_ADMIN")) {
      logoTarget = "/admin-dashboard";
    } else {
      logoTarget = "/dashboard";
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="text-white bg-green-600 shadow-lg">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={logoTarget} className="flex-shrink-0 text-xl font-bold">
            {t("common.appName")}
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/campaigns" className="hidden transition-colors hover:text-green-200 sm:block">{t("navbar.campaigns")}</Link>
            {roles.includes("ROLE_ADMIN") && (
              <Link to="/admin-dashboard" className="hidden transition-colors hover:text-green-200 sm:block">{t("navbar.admin")}</Link>
            )}

            <LanguageSwitcher className="flex items-center gap-2 p-2 transition-colors rounded-full hover:bg-green-700" />

            <div className="hidden h-8 border-l sm:block border-white/20"></div>

            {username ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center gap-2">
                  <FaUserCircle />
                  <span className="font-semibold">{username}</span>
                </div>
                <button onClick={handleLogout} className="px-3 py-1 transition-colors bg-green-500 rounded hover:bg-green-400">
                  {t("navbar.logout")}
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 font-semibold transition-colors bg-green-500 rounded hover:bg-green-400">
                {t("navbar.login")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}