// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { register as registerUser } from "../api/auth";
import { showSuccess, showError } from "../components/Toast";

// --- HELPER COMPONENTS MOVED OUTSIDE ---

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none"
       viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M16 14a4 4 0 00-8 0m8 0v6H8v-6m8 0a4 4 0 01-8 0m8 0h-8m4-8a4 4 0 110 8 4 4 0 010-8z" />
  </svg>
);

const LoadingSpinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className="h-6 w-6 border-2 border-t-transparent border-white rounded-full"
  />
);

// The Input component is now defined once, outside of the Register component.
// It needs access to props like loading, form, handleChange, and errors.
const Input = ({ label, name, type = "text", placeholder, value, onChange, error, disabled }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-white/80 mb-1">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        disabled={disabled}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white/20 border border-white/30 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      {error && <p className="mt-1 text-sm text-red-300">{error}</p>}
    </div>
);


// --- MAIN REGISTER COMPONENT ---

export default function Register() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    username: "", fullName: "", email: "", password: "", phoneNumber: "", address: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = t("validation.username");
    if (!form.fullName.trim()) newErrors.fullName = t("validation.fullName");
    if (!form.email) newErrors.email = t("validation.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = t("validation.emailInvalid");
    if (!form.password) newErrors.password = t("validation.passwordRequired");
    else if (form.password.length < 8) newErrors.password = t("validation.passwordMin");
    if (!form.phoneNumber) newErrors.phoneNumber = t("validation.phoneRequired");
    else if (!/^(\+62|0)[0-9]{9,13}$/.test(form.phoneNumber)) newErrors.phoneNumber = t("validation.phoneInvalid");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await registerUser(form);
      showSuccess(t("common.success"));
      navigate("/login");
    } catch (err) {
      console.error(err);
      showError(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-500 via-emerald-600 to-green-700">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl shadow-black/20 p-8">
        <div className="flex justify-center">
          <div className="p-3 bg-green-600 rounded-full mb-6 shadow-md">
            <UserIcon />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-white mb-8">{t("auth.registerTitle")}</h1>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Now we pass the required state and functions as props to the Input component */}
          <Input label={t("auth.username")} name="username" placeholder={t("auth.placeholder.username")} value={form.username} onChange={handleChange} error={errors.username} disabled={loading} />
          <Input label={t("auth.fullName")} name="fullName" placeholder={t("auth.placeholder.fullName")} value={form.fullName} onChange={handleChange} error={errors.fullName} disabled={loading} />
          <Input label={t("auth.email")} name="email" type="email" placeholder={t("auth.placeholder.email")} value={form.email} onChange={handleChange} error={errors.email} disabled={loading} />
          <Input label={t("auth.password")} name="password" type="password" placeholder={t("auth.placeholder.password")} value={form.password} onChange={handleChange} error={errors.password} disabled={loading} />
          <Input label={t("auth.phoneNumber")} name="phoneNumber" placeholder={t("auth.placeholder.phoneNumber")} value={form.phoneNumber} onChange={handleChange} error={errors.phoneNumber} disabled={loading} />
          <Input label={t("auth.address")} name="address" placeholder={t("auth.placeholder.address")} value={form.address} onChange={handleChange} error={errors.address} disabled={loading} />

          <button type="submit" disabled={loading}
                  className="w-full flex justify-center items-center py-3 mt-4 rounded-lg font-semibold bg-green-500 text-white shadow-lg hover:bg-green-400 disabled:opacity-50">
            <AnimatePresence mode="wait">
              {loading ? <LoadingSpinner key="spinner" /> : <motion.span key="text">{t("auth.buttonRegister")}</motion.span>}
            </AnimatePresence>
          </button>
        </form>

        <p className="mt-8 text-center text-white/80">
          {t("auth.haveAccount")}{" "}
          <button type="button" onClick={() => navigate("/login")}
                  className="font-semibold text-green-200 hover:text-green-100 underline">
            {t("auth.loginHere")}
          </button>
        </p>
      </motion.div>
    </div>
  );
}