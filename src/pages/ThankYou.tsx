import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Unlock, ArrowRight, Mail, Key, AlertTriangle, Copy, Check, Loader2 } from "lucide-react";
import { httpsCallable } from "firebase/functions";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, functions } from "../lib/firebase";
import { Button } from "../components/ui/Button";

export const ThankYou = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") || "";

    // State management
    const [isUnlocking, setIsUnlocking] = useState(true);
    const [loading, setLoading] = useState(true);
    const [password, setPassword] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [resetEmailSent, setResetEmailSent] = useState(false);

    // Animation sequence: Lock unlocking effect
    useEffect(() => {
        const timer1 = setTimeout(() => setIsUnlocking(false), 1500);
        return () => clearTimeout(timer1);
    }, []);

    // Fetch password from Firebase Function on mount
    useEffect(() => {
        const revealPassword = async () => {
            if (!email) {
                setError("Email não encontrado na URL. Verifique o link de acesso.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log("🔓 Calling revealSecret function for:", email);

                // Call the Firebase callable function
                const revealSecret = httpsCallable(functions, "revealSecret");
                const result = await revealSecret({ email });

                const data = result.data as { success: boolean; password: string };

                if (data.success && data.password) {
                    console.log("✅ Password retrieved successfully");
                    setPassword(data.password);
                    setError("");
                } else {
                    throw new Error("Resposta inválida do servidor");
                }
            } catch (err: any) {
                console.error("❌ Error revealing secret:", err);

                // Handle specific Firebase errors
                if (err.code === "functions/not-found") {
                    setError("Credencial expirada ou já visualizada. Entre em contato com o suporte.");
                } else if (err.code === "functions/deadline-exceeded") {
                    setError("Credencial expirada (10 minutos). Entre em contato com o suporte.");
                } else if (err.code === "functions/invalid-argument") {
                    setError("Email inválido. Verifique o link de acesso.");
                } else {
                    setError(err.message || "Erro ao recuperar credencial. Tente novamente.");
                }
            } finally {
                setLoading(false);
            }
        };

        revealPassword();
    }, [email]);

    // Copy password to clipboard
    const handleCopy = async () => {
        if (!password) return;

        try {
            await navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    // Handle password reset email
    const handlePasswordReset = async () => {
        if (!email) {
            setError("Email não encontrado. Por favor, entre em contato com o suporte.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setResetEmailSent(true);
            setError("");
        } catch (err) {
            console.error("Password reset error:", err);
            setError("Erro ao enviar email. Tente novamente.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Matrix Rain Effect Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-b from-green-500/20 via-transparent to-transparent" />
            </div>

            {/* Main Content Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 max-w-2xl w-full"
            >
                {/* Unlocking Shield Animation */}
                <div className="flex justify-center mb-8">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative"
                    >
                        {/* Glow Effect */}
                        <motion.div
                            animate={{
                                opacity: [0.3, 0.6, 0.3],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-green-500/30 blur-3xl rounded-full"
                        />

                        {/* Shield Icon */}
                        <motion.div
                            animate={isUnlocking ? { rotate: [0, -10, 10, -10, 0] } : {}}
                            transition={{ duration: 0.5, repeat: isUnlocking ? Infinity : 0 }}
                            className="relative"
                        >
                            {isUnlocking ? (
                                <Lock className="w-32 h-32 text-yellow-400" strokeWidth={1.5} />
                            ) : (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                >
                                    <Shield className="w-32 h-32 text-green-400" strokeWidth={1.5} fill="currentColor" fillOpacity={0.2} />
                                    <Unlock className="w-16 h-16 text-green-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" strokeWidth={2} />
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Headline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="font-heading text-5xl md:text-6xl text-green-400 mb-4 tracking-wider">
                        ACESSO CONFIRMADO
                    </h1>
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan/50" />
                        <p className="font-mono text-cyan text-sm tracking-[0.3em]">SINDICATO</p>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan/50" />
                    </div>
                    <p className="text-white/70 text-lg">
                        Sua vaga na elite foi garantida.
                    </p>
                </motion.div>

                {/* Credentials Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="relative mb-8"
                >
                    {/* Top Secret Header */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                        <div className="bg-alert px-6 py-1 font-mono text-xs tracking-widest text-black font-bold">
                            TOP SECRET
                        </div>
                    </div>

                    {/* Glassmorphism Card */}
                    <div className="relative bg-black/60 backdrop-blur-xl border border-green-500/30 rounded-lg p-8 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                        {/* Scanline Effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-transparent pointer-events-none rounded-lg" />

                        <div className="relative space-y-6">
                            {/* Loading State */}
                            {loading && (
                                <div className="text-center py-12">
                                    <Loader2 className="w-12 h-12 text-cyan animate-spin mx-auto mb-4" />
                                    <motion.p
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="font-mono text-cyan text-lg tracking-widest"
                                    >
                                        DESCRIPTOGRAFANDO CREDENCIAIS...
                                    </motion.p>
                                </div>
                            )}

                            {/* Error State */}
                            {!loading && error && (
                                <div className="flex items-start gap-3 bg-alert/10 border border-alert/30 rounded p-6">
                                    <AlertTriangle className="w-6 h-6 text-alert flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-alert font-semibold mb-2">Erro ao Recuperar Credencial</p>
                                        <p className="text-white/70 text-sm">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Success State - Show Credentials */}
                            {!loading && password && !error && (
                                <>
                                    {/* Email Display */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Mail className="w-4 h-4 text-cyan" />
                                            <label className="font-mono text-xs text-cyan tracking-wider">LOGIN</label>
                                        </div>
                                        <div className="bg-void/50 border border-white/10 rounded px-4 py-3 font-mono text-white">
                                            {email}
                                        </div>
                                    </div>

                                    {/* Password Display */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Key className="w-4 h-4 text-green-400" />
                                            <label className="font-mono text-xs text-green-400 tracking-wider">SENHA GERADA</label>
                                        </div>
                                        <div className="bg-void/50 border border-green-500/30 rounded px-4 py-3 relative overflow-hidden">
                                            {/* Neon Glow Background */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-green-400/5 to-green-500/10" />
                                            <motion.div
                                                animate={{ x: ["-100%", "200%"] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent"
                                            />
                                            <div className="relative flex items-center justify-between">
                                                <p className="font-mono text-2xl text-green-400 font-bold tracking-widest">
                                                    {password}
                                                </p>
                                                <button
                                                    onClick={handleCopy}
                                                    className="ml-4 p-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded transition-colors"
                                                    title="Copiar senha"
                                                >
                                                    {copied ? (
                                                        <Check className="w-5 h-5 text-green-400" />
                                                    ) : (
                                                        <Copy className="w-5 h-5 text-green-400" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Burn After Reading Warning */}
                                    <div className="flex items-start gap-3 bg-alert/10 border border-alert/30 rounded p-4">
                                        <AlertTriangle className="w-5 h-5 text-alert flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-alert font-semibold mb-1">⚠️ ATENÇÃO: SENHA ÚNICA</p>
                                            <p className="text-white/70 text-sm leading-relaxed">
                                                Esta senha desaparecerá ao sair desta página e <strong>não pode ser recuperada</strong>.
                                                Salve agora ou copie para um local seguro.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Security Notice */}
                                    <div className="flex items-start gap-3 bg-cyan/5 border border-cyan/20 rounded p-4">
                                        <Key className="w-5 h-5 text-cyan flex-shrink-0 mt-0.5" />
                                        <p className="text-white/70 text-sm leading-relaxed">
                                            <span className="text-cyan font-semibold">Recomendação de Segurança:</span> Altere sua senha no primeiro acesso através das configurações da plataforma.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="space-y-4"
                >
                    {/* Primary CTA - Only show if password is available */}
                    {password && !error && (
                        <Button
                            variant="cyan"
                            onClick={() => navigate("/login")}
                            className="w-full group"
                        >
                            <span>ENTRAR NA ÁREA DE MEMBROS</span>
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    )}

                    {/* Secondary: Password Reset */}
                    {!resetEmailSent ? (
                        <button
                            onClick={handlePasswordReset}
                            className="w-full py-3 px-6 bg-transparent border border-white/20 rounded text-white/70 hover:text-white hover:border-white/40 transition-all font-mono text-sm tracking-wider"
                        >
                            NÃO RECEBI A SENHA / PERDEU A SENHA
                        </button>
                    ) : (
                        <div className="text-center py-3 px-6 bg-green-500/10 border border-green-500/30 rounded text-green-400 font-mono text-sm">
                            ✓ Email de recuperação enviado
                        </div>
                    )}
                </motion.div>

                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="text-center text-white/40 text-xs font-mono mt-8"
                >
                    SISTEMA DE ACESSO PROTOCOLO DARK v2.0 // BURN AFTER READING
                </motion.p>
            </motion.div>
        </div>
    );
};
