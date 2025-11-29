import { motion } from "framer-motion";
import { Sidebar } from "../components/layout/Sidebar";
import { MessageCircle, Users, Shield, ExternalLink } from "lucide-react";

export const Community = () => {
    const whatsappLink = "https://chat.whatsapp.com/YOUR_GROUP_LINK"; // Replace with actual link

    return (
        <div className="min-h-screen flex">
            <Sidebar />

            <div className="flex-1 min-h-screen pb-20 relative overflow-hidden">
                {/* Intense Particle Background Effect */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,174,239,0.1),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,255,136,0.1),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,215,0,0.1),transparent_50%)]" />
                </div>

                {/* Header */}
                <header className="border-b border-white/5 bg-carbon/50 backdrop-blur-md sticky top-0 z-40 relative">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center gap-3">
                            <Users className="w-6 h-6 text-cyan" />
                            <h1 className="font-heading text-2xl text-white tracking-widest">THE SYNDICATE</h1>
                        </div>
                        <p className="text-gray-400 font-mono text-xs mt-1">
                            REDE CRIPTOGRAFADA // ACESSO EXCLUSIVO
                        </p>
                    </div>
                </header>

                <main className="max-w-5xl mx-auto px-6 pt-20 relative z-10">
                    {/* Central Access Terminal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        {/* Icon */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8 flex justify-center"
                        >
                            <div className="relative">
                                {/* Pulsing Rings */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 0.2, 0.5],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute inset-0 rounded-full bg-cyan/20 blur-xl"
                                />
                                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-cyan/20 to-gold/20 backdrop-blur-md border border-cyan/30 flex items-center justify-center">
                                    <Shield className="w-12 h-12 text-cyan" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Headline */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="font-heading text-5xl md:text-7xl text-white mb-4 tracking-tight"
                        >
                            REDE CRIPTOGRAFADA
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-gray-400 font-mono text-sm md:text-base max-w-2xl mx-auto mb-12"
                        >
                            Acesso exclusivo à comunidade de operadores de elite. Networking estratégico,
                            suporte técnico e atualizações em tempo real.
                        </motion.p>

                        {/* Main CTA Button */}
                        <motion.a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00FF88] to-[#00D9A3] text-black font-heading text-xl px-12 py-5 rounded-xl shadow-[0_0_30px_rgba(0,255,136,0.4)] hover:shadow-[0_0_50px_rgba(0,255,136,0.6)] transition-all duration-300"
                        >
                            <MessageCircle className="w-6 h-6" />
                            ACESSAR QG NO WHATSAPP
                            <ExternalLink className="w-5 h-5" />
                        </motion.a>

                        {/* Pulsing Animation on Button */}
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.1, 0.3],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute inset-0 rounded-xl bg-[#00FF88]/20 blur-2xl pointer-events-none"
                            style={{ zIndex: -1 }}
                        />
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
                    >
                        {/* Feature 1 */}
                        <div className="bg-carbon/50 backdrop-blur-md border border-white/5 rounded-xl p-6 hover:border-cyan/30 transition-all">
                            <div className="w-12 h-12 rounded-lg bg-cyan/10 border border-cyan/30 flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-cyan" />
                            </div>
                            <h3 className="text-white font-heading text-lg mb-2">NETWORKING</h3>
                            <p className="text-gray-400 font-mono text-sm">
                                Conecte-se com outros operadores e compartilhe estratégias
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-carbon/50 backdrop-blur-md border border-white/5 rounded-xl p-6 hover:border-gold/30 transition-all">
                            <div className="w-12 h-12 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center mb-4">
                                <MessageCircle className="w-6 h-6 text-gold" />
                            </div>
                            <h3 className="text-white font-heading text-lg mb-2">SUPORTE 24/7</h3>
                            <p className="text-gray-400 font-mono text-sm">
                                Tire dúvidas e receba ajuda da comunidade a qualquer momento
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-carbon/50 backdrop-blur-md border border-white/5 rounded-xl p-6 hover:border-[#00FF88]/30 transition-all">
                            <div className="w-12 h-12 rounded-lg bg-[#00FF88]/10 border border-[#00FF88]/30 flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6 text-[#00FF88]" />
                            </div>
                            <h3 className="text-white font-heading text-lg mb-2">ATUALIZAÇÕES</h3>
                            <p className="text-gray-400 font-mono text-sm">
                                Receba novidades, bônus e conteúdos exclusivos em primeira mão
                            </p>
                        </div>
                    </motion.div>

                    {/* Security Notice */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-12 text-center"
                    >
                        <p className="text-gray-500 font-mono text-xs">
                            <Shield className="w-3 h-3 inline mr-2" />
                            CONEXÃO SEGURA E CRIPTOGRAFADA
                        </p>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};
