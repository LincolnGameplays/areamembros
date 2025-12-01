import { motion } from "framer-motion";
import { Sidebar } from "../components/layout/Sidebar";
import { MessageCircle, Users, Shield, ExternalLink } from "lucide-react";

export const Community = () => {
    const whatsappLink = "https://chat.whatsapp.com/ESG3dFPjJ5Y0CAjglAPyzJ";

    return (
        <div className="min-h-screen flex">
            <Sidebar />

            <div className="flex-1 w-full min-h-screen pb-20 relative overflow-hidden">
                {/* Intense Particle Background Effect */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,174,239,0.1),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,255,136,0.1),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,215,0,0.1),transparent_50%)]" />
                </div>

                {/* Header */}
                <header className="border-b border-white/5 bg-carbon/50 backdrop-blur-md sticky top-0 z-30 relative">
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

                <main className="max-w-5xl mx-auto px-4 md:px-6 pt-20 relative z-10">
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

                        {/* Main CTA Button - Massive Pulsing Green WhatsApp */}
                        <div className="relative inline-block">
                            <motion.a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative inline-flex items-center justify-center gap-4 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white font-heading text-2xl md:text-3xl px-16 py-7 rounded-2xl shadow-[0_0_40px_rgba(34,197,94,0.6)] hover:shadow-[0_0_60px_rgba(34,197,94,0.8)] transition-all duration-300 overflow-hidden group"
                            >
                                {/* Animated Background Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[#16a34a] to-[#22c55e] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                {/* WhatsApp Icon */}
                                <svg 
                                    className="w-10 h-10 md:w-12 md:h-12 relative z-10" 
                                    fill="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                                
                                <span className="relative z-10 tracking-wide">
                                    ACESSAR COMUNIDADE
                                </span>
                                
                                <ExternalLink className="w-6 h-6 md:w-7 md:h-7 relative z-10" />
                            </motion.a>

                            {/* Pulsing Glow Animation */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.15, 1],
                                    opacity: [0.4, 0.1, 0.4],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute inset-0 rounded-2xl bg-[#22c55e]/30 blur-2xl pointer-events-none"
                            />
                        </div>
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
