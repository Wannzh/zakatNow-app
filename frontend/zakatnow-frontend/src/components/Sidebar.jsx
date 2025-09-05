import { useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Sidebar() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const menu = useMemo(() => [
    { name: t("sidebar.dashboard"), path: "/admin-dashboard" },
    { name: t("sidebar.manageCampaigns"), path: "/admin-campaigns" },
    { name: t("sidebar.manageDonations"), path: "/admin-donations" },
    { name: t("sidebar.manageWithdrawals"), path: "/admin-withdrawals" },
    { name: t("sidebar.reports"), path: "/admin-reports" },
  ], [t]);

  return (
    <aside className="w-64 bg-green-700 text-white flex flex-col min-h-screen p-6 shadow-lg">
      <h1 className="text-2xl font-bold mb-8">{t("sidebar.title")}</h1>
      <nav className="flex-1 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex justify-between items-center px-4 py-2 rounded hover:bg-green-600 transition ${
                isActive ? "bg-green-600 font-semibold" : ""
              }`
            }
          >
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="space-y-2 pt-4 border-t border-white/20">
        <LanguageSwitcher className="w-full flex items-center gap-3 px-3 py-2 rounded bg-white/10 hover:bg-white/20 transition-colors" />
        <button
          onClick={handleLogout}
          className="w-full text-left bg-white/10 hover:bg-white/20 px-3 py-2 rounded transition"
        >
          {t("common.logout")}
        </button>
      </div>
    </aside>
  );
}