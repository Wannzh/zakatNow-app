// src/pages/LoginPage.jsx
import { useState } from "react";
import { login } from "../api/auth";
import { showSuccess, showError } from "../components/Toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11V7a4 4 0 00-8 0v4M6 11h12v9H6v-9z" />
    </svg>
);

const LoadingSpinner = () => (
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="h-6 w-6 border-2 border-t-transparent border-white rounded-full" />
);

export default function LoginPage() {
    const { t } = useTranslation();
    const [username, setUsername] = useState(""); // ganti email jadi username
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await login({ username, password });

            // Simpan seluruh response JWT di localStorage
            localStorage.setItem("auth", JSON.stringify(res.data));

            showSuccess(t("common.success"));

            // Redirect berdasarkan role
            if (res.data.roles.includes("ROLE_ADMIN")) {
                navigate("/admin-dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch {
            showError(t("common.error"));
        } finally {
            setLoading(false);
        }
    };


    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-500 via-emerald-600 to-green-700">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl shadow-black/20 p-8">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-center">
                    {/* Icon */}
                    <motion.div variants={itemVariants} className="p-3 bg-green-600 rounded-full mb-6 shadow-md">
                        <LockIcon />
                    </motion.div>

                    {/* Title */}
                    <motion.h1 variants={itemVariants} className="text-3xl font-bold text-center text-white mb-8">
                        {t("auth.loginTitle")}
                    </motion.h1>

                    {/* Form */}
                    <motion.form onSubmit={handleLogin} className="w-full space-y-5" variants={containerVariants}>
                        <motion.div variants={itemVariants}>
                            <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-1">
                                {t("auth.username")}
                            </label>
                            <input id="username" type="text" required disabled={loading}
                                value={username} onChange={(e) => setUsername(e.target.value)}
                                placeholder={t("auth.placeholder.username")}
                                className="w-full px-4 py-3 bg-white/20 border border-white/30 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
                                {t("auth.password")}
                            </label>
                            <input id="password" type="password" required disabled={loading}
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                placeholder={t("auth.placeholder.password")}
                                className="w-full px-4 py-3 bg-white/20 border border-white/30 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <motion.button type="submit" disabled={loading}
                                className="w-full py-3 mt-4 rounded-lg font-semibold bg-green-500 text-white shadow-lg hover:bg-green-400 transition disabled:opacity-50"
                                whileHover={{ scale: loading ? 1 : 1.05 }}
                                whileTap={{ scale: loading ? 1 : 0.95 }}>
                                <AnimatePresence mode="wait">
                                    {loading ? (
                                        <motion.div key="loader" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }} className="flex items-center justify-center">
                                            <LoadingSpinner />
                                        </motion.div>
                                    ) : (
                                        <motion.span key="text" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}>
                                            {t("auth.buttonLogin")}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </motion.div>
                    </motion.form>

                    {/* Link ke Register */}
                    <motion.p variants={itemVariants} className="mt-8 text-center text-white/80">
                        {t("auth.noAccount")}{" "}
                        <motion.button type="button" onClick={() => navigate("/register")}
                            className="font-semibold text-green-200 hover:text-green-100 underline"
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            {t("auth.registerHere")}
                        </motion.button>
                    </motion.p>

                    {/* Lupa password */}
                    <motion.p variants={itemVariants} className="mt-2 text-center text-white/70 text-sm">
                        <button type="button" onClick={() => navigate("/forgot-password")} className="underline hover:text-green-100">
                            {t("auth.forgotPassword")}
                        </button>
                    </motion.p>
                </motion.div>
            </motion.div>
        </div>
    );
}
