import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "../components/layout/Sidebar";
import { useAuth } from "../context/AuthContext";
import { updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { Settings as SettingsIcon, User, Lock, AlertTriangle, CheckCircle, X } from "lucide-react";

export const Settings = () => {
    const { user, userData } = useAuth();
    const [displayName, setDisplayName] = useState(userData?.displayName || "");
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const showNotification = (type: "success" | "error", message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !displayName.trim()) return;

        setIsLoading(true);
        try {
            // Update Firebase Auth profile
            await updateProfile(user, { displayName: displayName.trim() });

            // Update Firestore user document
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                displayName: displayName.trim(),
                lastUpdated: new Date(),
            });

            showNotification("success", "CODENAME ATUALIZADO COM SUCESSO");
        } catch (error) {
            console.error("Error updating profile:", error);
            showNotification("error", "ERRO AO ATUALIZAR PERFIL");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!user?.email) return;

        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, user.email);
            showNotification("success", "EMAIL DE REDEFINIÇÃO ENVIADO");
        } catch (error) {
            console.error("Error sending password reset:", error);
            showNotification("error", "ERRO AO ENVIAR EMAIL");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <Sidebar />

            <div className="flex-1 min-h-screen pb-20">
                {/* Notification Toast */}
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`
                            fixed top-6 right-6 z-50 px-6 py-4 rounded-lg border backdrop-blur-md
                            flex items-center gap-3 shadow-lg
                            ${notification.type === "success"
                                ? "bg-cyan/10 border-cyan/30 text-cyan"
                                : "bg-alert/10 border-alert/30 text-alert"
                            }
                        `}
                    >
                        {notification.type === "success" ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <X className="w-5 h-5" />
                        )}
                        <span className="font-mono text-sm">{notification.message}</span>
                    </motion.div>
                )}

                {/* Header */}
                <header className="border-b border-white/5 bg-carbon/50 backdrop-blur-md sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center gap-3">
                            <SettingsIcon className="w-6 h-6 text-cyan" />
                            <h1 className="font-heading text-2xl text-white tracking-widest">PROFILE OPS</h1>
                        </div>
                        <p className="text-gray-400 font-mono text-xs mt-1">
                            CONFIGURAÇÕES DO SISTEMA // OPERADOR: {userData?.displayName?.toUpperCase() || "DESCONHECIDO"}
                        </p>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-6 pt-12">
                    {/* Profile Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="bg-carbon/50 backdrop-blur-md border border-white/5 rounded-xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-cyan/10 border border-cyan/30 flex items-center justify-center">
                                    <User className="w-5 h-5 text-cyan" />
                                </div>
                                <h2 className="text-white font-heading text-xl">IDENTIDADE</h2>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                {/* Display Name */}
                                <div>
                                    <label className="block text-gray-400 font-mono text-xs mb-2 tracking-widest">
                                        CODENAME
                                    </label>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="w-full bg-void/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:border-cyan/50 focus:outline-none transition-colors"
                                        placeholder="Digite seu nome de operador"
                                    />
                                </div>

                                {/* Email (Read-only) */}
                                <div>
                                    <label className="block text-gray-400 font-mono text-xs mb-2 tracking-widest">
                                        EMAIL
                                    </label>
                                    <input
                                        type="email"
                                        value={user?.email || ""}
                                        disabled
                                        className="w-full bg-void/30 border border-white/5 rounded-lg px-4 py-3 text-gray-500 font-mono cursor-not-allowed"
                                    />
                                </div>

                                {/* Access Level (Read-only) */}
                                <div>
                                    <label className="block text-gray-400 font-mono text-xs mb-2 tracking-widest">
                                        NÍVEL DE ACESSO
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <div className="px-4 py-2 bg-gold/10 border border-gold/30 rounded-lg">
                                            <span className="text-gold font-mono text-sm tracking-widest">
                                                {userData?.accessLevel?.toUpperCase() || "PADRÃO"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading || !displayName.trim()}
                                    className="w-full bg-cyan/10 border border-cyan/30 hover:bg-cyan/20 hover:border-cyan/50 text-cyan font-mono text-sm tracking-widest py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "ATUALIZANDO..." : "SALVAR ALTERAÇÕES"}
                                </button>
                            </form>
                        </div>
                    </motion.section>

                    {/* Security Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="bg-carbon/50 backdrop-blur-md border border-white/5 rounded-xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-cyan/10 border border-cyan/30 flex items-center justify-center">
                                    <Lock className="w-5 h-5 text-cyan" />
                                </div>
                                <h2 className="text-white font-heading text-xl">SEGURANÇA</h2>
                            </div>

                            <div>
                                <p className="text-gray-400 font-mono text-sm mb-4">
                                    Redefinir senha de acesso ao sistema
                                </p>
                                <button
                                    onClick={handlePasswordReset}
                                    disabled={isLoading}
                                    className="bg-void/50 border border-white/10 hover:border-cyan/30 text-white font-mono text-sm tracking-widest px-6 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "ENVIANDO..." : "ENVIAR EMAIL DE REDEFINIÇÃO"}
                                </button>
                            </div>
                        </div>
                    </motion.section>

                    {/* Danger Zone */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="bg-carbon/50 backdrop-blur-md border border-alert/30 rounded-xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-alert/10 border border-alert/30 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-alert" />
                                </div>
                                <h2 className="text-alert font-heading text-xl">ZONA DE PERIGO</h2>
                            </div>

                            <div>
                                <p className="text-gray-400 font-mono text-sm mb-4">
                                    Esta ação é irreversível. Todos os seus dados serão permanentemente deletados.
                                </p>
                                <button
                                    disabled
                                    className="bg-alert/10 border border-alert/30 text-alert font-mono text-sm tracking-widest px-6 py-3 rounded-lg opacity-50 cursor-not-allowed"
                                >
                                    DELETAR CONTA (EM BREVE)
                                </button>
                            </div>
                        </div>
                    </motion.section>
                </main>
            </div>
        </div>
    );
};
