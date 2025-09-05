import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      login: "Login",
      register: "Register",
      dashboard: "Dashboard",
      logout: "Logout",
      donate: "Donate",
      success: "Success",
      error: "Error",
    },
  },
  id: {
    translation: {
      login: "Masuk",
      register: "Daftar",
      dashboard: "Dasbor",
      logout: "Keluar",
      donate: "Donasi",
      success: "Berhasil",
      error: "Gagal",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "id",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
