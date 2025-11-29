import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Lock, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err: any) {
            setError("ACESSO NEGADO: Credenciais Inválidas");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-carbon/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl relative overflow-hidden group"
            >
                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan/5 to-transparent h-full w-full animate-scanline pointer-events-none" />

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-void rounded-full border border-cyan/30 flex items-center justify-center mx-auto mb-4 shadow-glow-cyan">
                        <Lock className="w-6 h-6 text-cyan" />
                    </div>
                    <h1 className="font-heading text-3xl text-white mb-2">ÁREA RESTRITA</h1>
                    <p className="text-gray-500 font-mono text-sm">INSIRA CREDENCIAIS DE OPERADOR</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                    <Input
                        type="email"
                        placeholder="E-MAIL"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        type="password"
                        placeholder="SENHA"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-alert text-sm font-mono bg-alert/10 p-3 rounded border border-alert/20"
                        >
                            <ShieldAlert className="w-4 h-4" />
                            {error}
                        </motion.div>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "AUTENTICANDO..." : "INICIAR SESSÃO"}
                    </Button>
                </form>
            </motion.div>
        </div>
    );
};
